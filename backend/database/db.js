// ============================================================
// DATABASE SETUP
// Node 26 ships with a built-in SQLite module (node:sqlite).
// No external packages needed — zero native compilation issues.
//
// node:sqlite API is intentionally similar to better-sqlite3:
//   db.exec(sql)          — run DDL/multi-statement SQL
//   db.prepare(sql)       — create a prepared statement
//   stmt.all(...params)   — returns all rows as array of objects
//   stmt.get(...params)   — returns first row or undefined
//   stmt.run(...params)   — executes INSERT/UPDATE/DELETE
// ============================================================

const { DatabaseSync } = require("node:sqlite");
const path = require("path");

// Database file stored next to this script
const DB_PATH = path.join(__dirname, "tasks.db");

// Open (or create) the database file synchronously
const db = new DatabaseSync(DB_PATH);

// -------------------------------------------------------
// PRAGMA — WAL mode gives better concurrent-read performance
// -------------------------------------------------------
db.exec("PRAGMA journal_mode = WAL");

// -------------------------------------------------------
// CREATE TABLE IF NOT EXISTS
// Running this every startup is safe — the IF NOT EXISTS
// guard means it only creates the table the very first time.
// -------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    description TEXT    DEFAULT '',
    status      TEXT    NOT NULL DEFAULT 'pending',
    createdAt   DATETIME DEFAULT (datetime('now'))
  )
`);

console.log("✅ Database connected and tasks table ready.");

module.exports = db;
