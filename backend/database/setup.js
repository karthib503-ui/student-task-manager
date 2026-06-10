// ============================================================
// DATABASE SETUP SCRIPT
// Run this once before starting the server for the first time,
// or any time you want to reset the database to a clean state.
//
// Usage:
//   node database/setup.js          ← from the /backend folder
//   npm run db:setup                 ← shortcut via package.json
//
// What it does:
//   1. Deletes the existing tasks.db file (if any)
//   2. Creates a brand-new tasks.db with the correct table
//   3. Seeds sample tasks so the client sees a working demo
// ============================================================

const { DatabaseSync } = require("node:sqlite");
const path = require("path");
const fs = require("fs");

const DB_PATH = path.join(__dirname, "tasks.db");

// -------------------------------------------------------
// STEP 1: Delete old database file AND its WAL journal files
// SQLite WAL mode creates two extra files: .db-wal and .db-shm
// All three must be removed for a clean slate.
// -------------------------------------------------------
[DB_PATH, DB_PATH + "-wal", DB_PATH + "-shm"].forEach((f) => {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    console.log(`🗑  Removed: ${path.basename(f)}`);
  }
});

// -------------------------------------------------------
// STEP 2: Create fresh database and table
// -------------------------------------------------------
const db = new DatabaseSync(DB_PATH);

db.exec("PRAGMA journal_mode = WAL");

db.exec(`
  CREATE TABLE tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    description TEXT    DEFAULT '',
    status      TEXT    NOT NULL DEFAULT 'pending',
    createdAt   DATETIME DEFAULT (datetime('now'))
  )
`);

console.log("✅ Fresh database created.");
console.log("✅ Tasks table created.");

// -------------------------------------------------------
// STEP 3: Seed sample data for the client demo
// -------------------------------------------------------
const seedTasks = [
  {
    title: "Complete Math Assignment",
    description: "Solve problems from Chapter 5 — Algebra and Equations.",
    status: "completed",
  },
  {
    title: "Read History Chapter 3",
    description: "Focus on the Industrial Revolution section (pages 45–78).",
    status: "completed",
  },
  {
    title: "Prepare Science Presentation",
    description: "Create slides on the Solar System for Friday's class.",
    status: "pending",
  },
  {
    title: "Submit English Essay",
    description: "1500-word essay on Shakespeare's Hamlet. Due this Friday.",
    status: "pending",
  },
  {
    title: "Study for Physics Quiz",
    description: "Review Newton's Laws of Motion and practice sample problems.",
    status: "pending",
  },
  {
    title: "Group Project Meeting",
    description: "Coordinate with team on the Biology group project outline.",
    status: "pending",
  },
];

const insert = db.prepare(
  "INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)"
);

for (const task of seedTasks) {
  insert.run(task.title, task.description, task.status);
}

console.log(`🌱 Seeded ${seedTasks.length} sample tasks.`);

// -------------------------------------------------------
// STEP 4: Verify — print a summary
// -------------------------------------------------------
const total     = db.prepare("SELECT COUNT(*) AS c FROM tasks").get().c;
const completed = db.prepare("SELECT COUNT(*) AS c FROM tasks WHERE status = 'completed'").get().c;
const pending   = db.prepare("SELECT COUNT(*) AS c FROM tasks WHERE status = 'pending'").get().c;

console.log("\n📊 Database Summary");
console.log("───────────────────");
console.log(`   Total tasks    : ${total}`);
console.log(`   Completed      : ${completed}`);
console.log(`   Pending        : ${pending}`);
console.log("\n🚀 Ready! Run 'npm start' to start the server.\n");

db.close();
