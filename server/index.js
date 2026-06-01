require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { config } = require('./config');
const { initDb } = require('./db');

const app = express();

// ── CORS ────────────────────────────────────────────────────────────────────
// Allow requests from the Vite dev server and any production Netlify URL
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (curl, Postman, mobile apps)
    if (!origin) return callback(null, true);

    // Extra origins from env (comma-separated), e.g. "https://my-clinic.netlify.app"
    const extraOrigins = (process.env.ALLOWED_ORIGINS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const allowed = [
      config.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:4173',
      'http://127.0.0.1:5173',
      ...extraOrigins,
    ];

    // Allow any Netlify preview/production URL
    const isNetlify = origin.endsWith('.netlify.app');

    if (allowed.includes(origin) || isNetlify) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked request from origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};


app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

// ── Body parser ──────────────────────────────────────────────────────────────
app.use(express.json());

// ── Request logger (dev) ────────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ── Start (DB init is async) ─────────────────────────────────────────────────
initDb()
  .then(() => {
    const appointmentRoutes = require('./routes/appointments');
    const adminRoutes = require('./routes/admin');

    app.use('/api/appointments', appointmentRoutes);
    app.use('/api/admin', adminRoutes);

    // Health check
    app.get('/api/health', (_req, res) => {
      res.json({
        status: 'ok',
        clinic: config.CLINIC_NAME,
        timestamp: new Date().toISOString(),
      });
    });

    // 404 catch-all
    app.use((_req, res) => {
      res.status(404).json({ error: 'Route not found.' });
    });

    // Global error handler
    app.use((err, _req, res, _next) => {
      console.error('Unhandled error:', err);
      res.status(500).json({ error: 'Internal server error.' });
    });

    const server = app.listen(config.PORT, () => {
      console.log(`\n🦷  ${config.CLINIC_NAME} — Backend Server`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`🚀  API:    http://localhost:${config.PORT}/api`);
      console.log(`❤️   Health: http://localhost:${config.PORT}/api/health`);
      console.log(`🔑  Admin:  http://localhost:5173/admin`);
      console.log(`🔐  Pass:   ${config.ADMIN_PASSWORD}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    });

    // ── Port-in-use handler ─────────────────────────────────────────────────
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌  Port ${config.PORT} is already in use!`);
        console.error(`    To fix, run one of these:`);
        console.error(`    1. Kill the old process: npx kill-port ${config.PORT}`);
        console.error(`    2. Or in PowerShell:     Stop-Process -Name node -Force`);
        console.error(`    Then start the server again.\n`);
        process.exit(1);
      } else {
        throw err;
      }
    });
  })
  .catch((err) => {
    console.error('❌  Failed to initialise database:', err);
    process.exit(1);
  });
