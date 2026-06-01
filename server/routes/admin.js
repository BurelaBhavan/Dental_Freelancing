const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { config } = require('../config');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// ─── Helpers (duplicated from appointments.js) ────────────────────────────────
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

// ─── POST /api/admin/login ────────────────────────────────────────────────────
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password is required.' });
  if (password !== config.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password. Please try again.' });
  }
  const token = jwt.sign(
    { role: 'admin', clinic: config.CLINIC_NAME },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
  return res.json({ token, clinic: config.CLINIC_NAME, expiresIn: config.JWT_EXPIRES_IN });
});

// ─── GET /api/admin/appointments ──────────────────────────────────────────────
router.get('/appointments', requireAuth, (req, res) => {
  const { date, status, search } = req.query;
  let query = 'SELECT * FROM appointments WHERE 1=1';
  const params = [];
  if (date) { query += ' AND date = ?'; params.push(date); }
  if (status && status !== 'all') { query += ' AND status = ?'; params.push(status); }
  if (search) {
    query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR service LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s, s);
  }
  query += ' ORDER BY date ASC, time ASC';
  const appointments = db.all(query, params);

  const today = new Date().toISOString().slice(0, 10);
  const allRows = db.all('SELECT status, date FROM appointments');
  const stats = allRows.reduce(
    (acc, r) => {
      acc.total++;
      if (r.status === 'pending')   acc.pending++;
      if (r.status === 'confirmed') acc.confirmed++;
      if (r.status === 'cancelled') acc.cancelled++;
      if (r.date === today) acc.today++;
      return acc;
    },
    { total: 0, pending: 0, confirmed: 0, cancelled: 0, today: 0 }
  );
  return res.json({ appointments, stats });
});

// ─── PATCH /api/admin/appointments/:id ───────────────────────────────────────
router.patch('/appointments/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const { status, admin_notes } = req.body;
  const validStatuses = ['pending', 'confirmed', 'cancelled'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status.` });
  }
  const existing = db.get('SELECT id FROM appointments WHERE id = ?', [id]);
  if (!existing) return res.status(404).json({ error: 'Appointment not found.' });
  const updates = [];
  const params = [];
  if (status !== undefined) { updates.push('status = ?'); params.push(status); }
  if (admin_notes !== undefined) { updates.push('admin_notes = ?'); params.push(admin_notes); }
  if (updates.length === 0) return res.status(400).json({ error: 'Nothing to update.' });
  params.push(id);
  db.run(`UPDATE appointments SET ${updates.join(', ')} WHERE id = ?`, params);
  const updated = db.get('SELECT * FROM appointments WHERE id = ?', [id]);
  return res.json({ success: true, appointment: updated });
});

// ─── DELETE /api/admin/appointments/:id ──────────────────────────────────────
router.delete('/appointments/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const existing = db.get('SELECT id FROM appointments WHERE id = ?', [id]);
  if (!existing) return res.status(404).json({ error: 'Appointment not found.' });
  db.run('DELETE FROM appointments WHERE id = ?', [id]);
  return res.json({ success: true, message: 'Appointment deleted.' });
});

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────
router.get('/stats', requireAuth, (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const allRows = db.all('SELECT status, date FROM appointments');
  const stats = allRows.reduce(
    (acc, r) => {
      acc.total++;
      if (r.status === 'pending')   acc.pending++;
      if (r.status === 'confirmed') acc.confirmed++;
      if (r.status === 'cancelled') acc.cancelled++;
      if (r.date === today) acc.today++;
      return acc;
    },
    { total: 0, pending: 0, confirmed: 0, cancelled: 0, today: 0 }
  );
  const upcoming = db.all(
    `SELECT * FROM appointments WHERE date >= ? AND status != 'cancelled' ORDER BY date ASC, time ASC LIMIT 5`,
    [today]
  );
  return res.json({ stats, upcoming });
});

// ─── GET /api/admin/calendar?month=YYYY-MM ────────────────────────────────────
// Returns per-day summary: appointment count + blocked slot count
router.get('/calendar', requireAuth, (req, res) => {
  const { month } = req.query;
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ error: 'Provide month as YYYY-MM.' });
  }
  const appointments = db.all(
    `SELECT date, status FROM appointments WHERE date LIKE ? AND status != 'cancelled'`,
    [`${month}%`]
  );
  const blocked = db.all(
    `SELECT date, time FROM blocked_slots WHERE date LIKE ?`,
    [`${month}%`]
  );
  const days = {};
  appointments.forEach(({ date }) => {
    if (!days[date]) days[date] = { appointments: 0, blocked: 0 };
    days[date].appointments++;
  });
  blocked.forEach(({ date }) => {
    if (!days[date]) days[date] = { appointments: 0, blocked: 0 };
    days[date].blocked++;
  });
  return res.json({ month, days });
});

// ─── GET /api/admin/day-slots?date=YYYY-MM-DD ────────────────────────────────
// Returns every time slot for a day with its status (available/booked/blocked)
router.get('/day-slots', requireAuth, (req, res) => {
  const { date } = req.query;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Provide date as YYYY-MM-DD.' });
  }

  const appointments = db.all(
    `SELECT * FROM appointments WHERE date = ? AND status != 'cancelled' ORDER BY time`,
    [date]
  );
  const blockedRows = db.all(
    `SELECT * FROM blocked_slots WHERE date = ?`,
    [date]
  );

  // Check if whole day is blocked
  const dayBlock = blockedRows.find((b) => !b.time);
  const slotBlocks = blockedRows.filter((b) => b.time);

  const allSlots = generateAllSlots();
  const slots = allSlots.map((time) => {
    const appt = appointments.find((a) => a.time === time);
    if (appt) return { time, type: 'booked', appointment: appt };

    const blocked = dayBlock || slotBlocks.find((b) => b.time === time);
    if (blocked) return { time, type: 'blocked', blocked_id: blocked.id, reason: blocked.reason };

    return { time, type: 'available' };
  });

  return res.json({
    date,
    slots,
    isDayBlocked: !!dayBlock,
    dayBlockId: dayBlock ? dayBlock.id : null,
  });
});

// ─── POST /api/admin/blocked-slots ───────────────────────────────────────────
// Block a specific time slot or an entire day (omit `time` to block whole day)
router.post('/blocked-slots', requireAuth, (req, res) => {
  const { date, time, reason } = req.body;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Provide date as YYYY-MM-DD.' });
  }

  // If blocking a specific time, make sure it's valid
  if (time) {
    const validSlots = generateAllSlots();
    if (!validSlots.includes(time)) {
      return res.status(400).json({ error: `Invalid time slot "${time}".` });
    }
    // Don't block a slot that already has a patient appointment
    const hasAppt = db.get(
      `SELECT id FROM appointments WHERE date = ? AND time = ? AND status != 'cancelled'`,
      [date, time]
    );
    if (hasAppt) {
      return res.status(409).json({ error: 'Cannot block a slot that already has a patient booking. Cancel the appointment first.' });
    }
    // Check not already blocked
    const already = db.get(
      `SELECT id FROM blocked_slots WHERE date = ? AND time = ?`,
      [date, time]
    );
    if (already) return res.status(409).json({ error: 'This slot is already blocked.' });
  } else {
    // Blocking whole day — check for existing day block
    const already = db.get(
      `SELECT id FROM blocked_slots WHERE date = ? AND time IS NULL`,
      [date]
    );
    if (already) return res.status(409).json({ error: 'This day is already blocked.' });
  }

  const id = uuidv4();
  const created_at = new Date().toISOString();
  db.run(
    `INSERT INTO blocked_slots (id, date, time, reason, created_at) VALUES (?, ?, ?, ?, ?)`,
    [id, date, time || null, reason || (time ? 'Unavailable' : 'Clinic closed'), created_at]
  );

  return res.status(201).json({
    success: true,
    blockedSlot: { id, date, time: time || null, reason: reason || 'Unavailable', created_at },
  });
});

// ─── DELETE /api/admin/blocked-slots/:id ─────────────────────────────────────
router.delete('/blocked-slots/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const existing = db.get('SELECT id FROM blocked_slots WHERE id = ?', [id]);
  if (!existing) return res.status(404).json({ error: 'Blocked slot not found.' });
  db.run('DELETE FROM blocked_slots WHERE id = ?', [id]);
  return res.json({ success: true });
});

module.exports = router;
