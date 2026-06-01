const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'appointments.sqlite');

let db = null;

function persist() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

async function initDb() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
    console.log('✅ Database loaded from', DB_PATH);
  } else {
    db = new SQL.Database();
    console.log('✅ New database created at', DB_PATH);
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      email       TEXT NOT NULL,
      phone       TEXT NOT NULL,
      service     TEXT NOT NULL,
      reason      TEXT NOT NULL,
      date        TEXT NOT NULL,
      time        TEXT NOT NULL,
      status      TEXT NOT NULL DEFAULT 'pending',
      admin_notes TEXT NOT NULL DEFAULT '',
      created_at  TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_appointments_date   ON appointments(date);
    CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
    CREATE INDEX IF NOT EXISTS idx_appointments_email  ON appointments(email);

    CREATE TABLE IF NOT EXISTS blocked_slots (
      id         TEXT PRIMARY KEY,
      date       TEXT NOT NULL,
      time       TEXT,
      reason     TEXT NOT NULL DEFAULT 'Unavailable',
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_blocked_date ON blocked_slots(date);
  `);

  persist();
  return db;
}

function run(sql, params = []) {
  try {
    db.run(sql, params);
    persist();
  } catch (err) {
    console.error('[DB run ERROR]', err.message, '| SQL:', sql.trim().slice(0, 80));
    throw err;
  }
}

function get(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    let row;
    if (stmt.step()) row = stmt.getAsObject();
    stmt.free();
    return row;
  } catch (err) {
    console.error('[DB get ERROR]', err.message);
    throw err;
  }
}

function all(sql, params = []) {
  try {
    const results = [];
    const stmt = db.prepare(sql);
    stmt.bind(params);
    while (stmt.step()) results.push(stmt.getAsObject());
    stmt.free();
    return results;
  } catch (err) {
    console.error('[DB all ERROR]', err.message);
    throw err;
  }
}

function transaction(fn) {
  return function (...args) {
    return fn(...args);
  };
}

module.exports = { initDb, run, get, all, transaction, persist };
