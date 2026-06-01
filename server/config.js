require('dotenv').config();

// ================================================================
//  🦷  CLINIC CONFIGURATION — EDIT THIS FILE PER CLIENT
//  All business logic lives here. No code changes needed elsewhere.
// ================================================================

const config = {
  // ------ CLINIC IDENTITY (change per client) -------------------
  CLINIC_NAME: 'Bright Smile Dental',
  CLINIC_TAGLINE: 'Your Smile, Our Passion',
  CLINIC_PHONE: '+1 (555) 123-4567',
  CLINIC_EMAIL: 'hello@brightsmile.com',
  CLINIC_ADDRESS: '123 Main Street, Suite 101, New York, NY 10001',

  // ------ WORKING HOURS (24-hour format) ------------------------
  WORKING_HOURS: { start: 9, end: 18 }, // 9 AM – 6 PM

  // Duration of each appointment slot in minutes
  SLOT_DURATION_MINUTES: 30,

  // Buffer time between appointments (dentist prep/cleanup)
  // A 9:00 appointment (30 min) + 10 min buffer = next slot at 9:40
  // Slot at 9:30 would be blocked; next free slot = 10:00
  BUFFER_MINUTES: 10,

  // Working days: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  WORKING_DAYS: [1, 2, 3, 4, 5], // Mon – Fri

  // ------ CLOSED DATES (holidays, dentist leave, emergencies) ---
  // Format: 'YYYY-MM-DD' — add as many as needed
  CLOSED_DATES: [
    '2026-12-25', // Christmas Day
    '2026-12-26', // Boxing Day
    '2026-01-01', // New Year's Day
    '2026-11-26', // Thanksgiving (US)
    // '2026-08-15', // Example: dentist vacation
  ],

  // ------ AUTH (loaded from .env, never hard-code in production) -
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret-in-production',
  JWT_EXPIRES_IN: '8h',

  // ------ WHATSAPP (future upgrade — fill in when ready) --------
  // WHATSAPP_API_KEY: process.env.WHATSAPP_API_KEY || '',
  // WHATSAPP_PHONE_ID: process.env.WHATSAPP_PHONE_ID || '',
  // WHATSAPP_TEMPLATE_CONFIRMATION: 'appointment_confirmation',

  // ------ SERVER ---------------------------------------------------
  PORT: parseInt(process.env.PORT) || 3001,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};

module.exports = { config };
