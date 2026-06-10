// ============================================================
// TASK MODEL
// All database interactions live here.
// Uses the built-in node:sqlite module via the db instance.
//
// Prepared statements:
//   - Created once, executed many times (efficient)
//   - Parameters use ? placeholders to prevent SQL injection
// ============================================================

const db = require("../database/db");

const Task = {
  // -------------------------------------------------------
  // GET ALL TASKS  →  SELECT * FROM tasks ORDER BY createdAt DESC
  // -------------------------------------------------------
  getAll() {
    return db.prepare("SELECT * FROM tasks ORDER BY createdAt DESC").all();
  },

  // -------------------------------------------------------
  // GET ONE TASK  →  SELECT * FROM tasks WHERE id = ?
  // -------------------------------------------------------
  getById(id) {
    return db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
  },

  // -------------------------------------------------------
  // CREATE TASK  →  INSERT INTO tasks ...
  // lastInsertRowid is the auto-generated id for the new row.
  // -------------------------------------------------------
  create({ title, description = "" }) {
    const result = db
      .prepare("INSERT INTO tasks (title, description) VALUES (?, ?)")
      .run(title, description);
    return this.getById(result.lastInsertRowid);
  },

  // -------------------------------------------------------
  // UPDATE TASK  →  UPDATE tasks SET title=?, description=? WHERE id=?
  // -------------------------------------------------------
  update(id, { title, description }) {
    db.prepare(
      "UPDATE tasks SET title = ?, description = ? WHERE id = ?"
    ).run(title, description, id);
    return this.getById(id);
  },

  // -------------------------------------------------------
  // MARK COMPLETE  →  UPDATE tasks SET status='completed' WHERE id=?
  // -------------------------------------------------------
  complete(id) {
    db.prepare("UPDATE tasks SET status = 'completed' WHERE id = ?").run(id);
    return this.getById(id);
  },

  // -------------------------------------------------------
  // DELETE TASK  →  DELETE FROM tasks WHERE id=?
  // result.changes = 1 if deleted, 0 if id didn't exist.
  // -------------------------------------------------------
  delete(id) {
    const result = db
      .prepare("DELETE FROM tasks WHERE id = ?")
      .run(id);
    return result.changes;
  },

  // -------------------------------------------------------
  // STATS  →  three COUNT queries for the Dashboard
  // -------------------------------------------------------
  getStats() {
    const total = db
      .prepare("SELECT COUNT(*) AS count FROM tasks")
      .get().count;
    const completed = db
      .prepare("SELECT COUNT(*) AS count FROM tasks WHERE status = 'completed'")
      .get().count;
    const pending = db
      .prepare("SELECT COUNT(*) AS count FROM tasks WHERE status = 'pending'")
      .get().count;
    return { total, completed, pending };
  },
};

module.exports = Task;
