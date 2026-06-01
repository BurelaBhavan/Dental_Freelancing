const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { config } = require('../config');

const router = express.Router();

// ─── Shared helpers ────────────────────────────────────────────────────────────

function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function generateAllSlots() {
  const { start, end } = config.WORKING_HOURS;
  const { SLOT_DURATION_MINUTES: duration, BUFFER_MINUTES: buffer } = config;
  const totalWorkMinutes = (end - start) * 60;
  const slots = [];
  for (let min = 0; min < totalWorkMinutes; min += duration) {
    if (min + duration + buffer > totalWorkMinutes) break;
    const hour = start + Math.floor(min / 60);
    const minute = min % 60;
    slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
  }
  return slots;
}

function slotsConflict(slotMin, bookedMin, duration, buffer) {
  return (
    bookedMin + duration + buffer > slotMin &&
    slotMin + duration + buffer > bookedMin
  );
}

// ─── GET /api/appointments/availability?date=YYYY-MM-DD ──────────────────────

router.get('/availability', (req, res) => {
  const { date } = req.query;
  console.log(`[availability] Request for date: ${date}`);

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Invalid date. Use YYYY-MM-DD format.' });
  }

  if (config.CLOSED_DATES.includes(date)) {
    return res.json({ slots: [], closed: true, reason: 'Clinic is closed on this date.' });
  }

  const dayOfWeek = new Date(date + 'T12:00:00').getDay();
  if (!config.WORKING_DAYS.includes(dayOfWeek)) {
    return res.json({ slots: [], closed: true, reason: 'Clinic is closed on this day.' });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(date + 'T12:00:00') < today) {
    return res.json({ slots: [], closed: true, reason: 'Cannot book past dates.' });
  }

  try {
    const { SLOT_DURATION_MINUTES: duration, BUFFER_MINUTES: buffer } = config;

    // Check if entire day is blocked by dentist
    const dayBlock = db.get(
      `SELECT id FROM blocked_slots WHERE date = ? AND time IS NULL`,
      [date]
    );
    if (dayBlock) {
      return res.json({ slots: [], closed: true, reason: 'Clinic is not available on this date.' });
    }

    // Get booked appointments
    const booked = db.all(
      `SELECT time FROM appointments WHERE date = ? AND status != 'cancelled'`,
      [date]
    );
    const bookedMinutes = booked.map((r) => timeToMinutes(r.time));

    // Get individually blocked time slots
    const blockedTimes = db.all(
      `SELECT time FROM blocked_slots WHERE date = ? AND time IS NOT NULL`,
      [date]
    );
    const blockedTimeSet = new Set(blockedTimes.map((r) => r.time));

    const allSlots = generateAllSlots();
    const slots = allSlots.map((time) => {
      if (blockedTimeSet.has(time)) return { time, available: false };
      const slotMin = timeToMinutes(time);
      const isBlocked = bookedMinutes.some((bMin) =>
        slotsConflict(slotMin, bMin, duration, buffer)
      );
      return { time, available: !isBlocked };
    });

    const availableCount = slots.filter((s) => s.available).length;
    console.log(`[availability] ${date}: ${availableCount}/${slots.length} slots available`);
    return res.json({ slots, closed: false, date });
  } catch (err) {
    console.error('[availability] Error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch availability.' });
  }
});

// ─── POST /api/appointments ────────────────────────────────────────────────────

router.post('/', (req, res) => {
  console.log('[booking] Received body:', JSON.stringify(req.body));
  const { name, email, phone, service, reason, date, time } = req.body;

  const missing = [];
  if (!name)    missing.push('name');
  if (!email)   missing.push('email');
  if (!phone)   missing.push('phone');
  if (!service) missing.push('service');
  if (!reason)  missing.push('reason');
  if (!date)    missing.push('date');
  if (!time)    missing.push('time');

  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}.` });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Invalid date format.' });
  }
  if (!/^\d{2}:\d{2}$/.test(time)) {
    return res.status(400).json({ error: 'Invalid time format.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const apptDate = new Date(date + 'T12:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (apptDate < today)
    return res.status(400).json({ error: 'Cannot book appointments in the past.' });
  if (!config.WORKING_DAYS.includes(apptDate.getDay()))
    return res.status(400).json({ error: 'Clinic is closed on this day.' });
  if (config.CLOSED_DATES.includes(date))
    return res.status(400).json({ error: 'Clinic is closed on this date.' });
  if (!generateAllSlots().includes(time))
    return res.status(400).json({ error: `Invalid time slot "${time}".` });

  try {
    // Check dentist-blocked slots
    const dayBlock = db.get(
      `SELECT id FROM blocked_slots WHERE date = ? AND time IS NULL`,
      [date]
    );
    if (dayBlock) {
      return res.status(409).json({ error: 'This date is not available. Please choose another date.' });
    }
    const slotBlock = db.get(
      `SELECT id FROM blocked_slots WHERE date = ? AND time = ?`,
      [date, time]
    );
    if (slotBlock) {
      return res.status(409).json({ error: 'This time slot is not available. Please choose another.' });
    }

    // Check patient double-booking
    const { SLOT_DURATION_MINUTES: duration, BUFFER_MINUTES: buffer } = config;
    const slotMin = timeToMinutes(time);
    const existing = db.all(
      `SELECT time FROM appointments WHERE date = ? AND status != 'cancelled'`,
      [date]
    );
    const conflict = existing.some(({ time: bTime }) =>
      slotsConflict(slotMin, timeToMinutes(bTime), duration, buffer)
    );
    if (conflict) {
      return res.status(409).json({ error: 'This time slot is no longer available. Please choose another.' });
    }

    const id = uuidv4();
    const created_at = new Date().toISOString();
    db.run(
      `INSERT INTO appointments
         (id, name, email, phone, service, reason, date, time, status, admin_notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', '', ?)`,
      [id, name, email, phone, service, reason, date, time, created_at]
    );

    console.log(`[booking] ✅ id=${id} | ${name} | ${service} | ${date} ${time}`);
    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully! We will confirm shortly.',
      appointment: { id, name, service, date, time, status: 'pending' },
    });
  } catch (err) {
    console.error('[booking] ❌ Error:', err.message);
    return res.status(500).json({ error: 'Failed to book appointment. Please try again.' });
  }
});

module.exports = router;
