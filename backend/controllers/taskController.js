// ============================================================
// TASK CONTROLLER
// Controllers handle the REQUEST → RESPONSE cycle.
// They:
//   1. Read data from the HTTP request (req)
//   2. Call the Model to interact with the database
//   3. Send back an HTTP response (res)
// Controllers should NOT contain SQL — that belongs in the model.
// ============================================================

const { validationResult } = require("express-validator");
const Task = require("../models/task");

// Helper: send a consistent error response
const sendError = (res, status, message) =>
  res.status(status).json({ success: false, message });

// -------------------------------------------------------
// GET /tasks — Fetch all tasks
// -------------------------------------------------------
exports.getAllTasks = (req, res) => {
  try {
    const tasks = Task.getAll();
    res.json({ success: true, data: tasks });
  } catch (err) {
    sendError(res, 500, "Failed to fetch tasks.");
  }
};

// -------------------------------------------------------
// GET /tasks/:id — Fetch a single task by its ID
// -------------------------------------------------------
exports.getTaskById = (req, res) => {
  try {
    const task = Task.getById(req.params.id);
    if (!task) return sendError(res, 404, "Task not found.");
    res.json({ success: true, data: task });
  } catch (err) {
    sendError(res, 500, "Failed to fetch task.");
  }
};

// -------------------------------------------------------
// POST /tasks — Create a new task
// validationResult checks if express-validator found errors
// -------------------------------------------------------
exports.createTask = (req, res) => {
  // Check for validation errors set by the middleware
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  try {
    const { title, description } = req.body;
    const task = Task.create({ title, description });
    // 201 = "Created" — use this status code for new resources
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    sendError(res, 500, "Failed to create task.");
  }
};

// -------------------------------------------------------
// PUT /tasks/:id — Update title and description of a task
// -------------------------------------------------------
exports.updateTask = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  try {
    const existing = Task.getById(req.params.id);
    if (!existing) return sendError(res, 404, "Task not found.");

    const { title, description } = req.body;
    const updated = Task.update(req.params.id, { title, description });
    res.json({ success: true, data: updated });
  } catch (err) {
    sendError(res, 500, "Failed to update task.");
  }
};

// -------------------------------------------------------
// PATCH /tasks/:id/complete — Mark a task as completed
// PATCH is used for partial updates (we only change status)
// -------------------------------------------------------
exports.completeTask = (req, res) => {
  try {
    const existing = Task.getById(req.params.id);
    if (!existing) return sendError(res, 404, "Task not found.");

    const updated = Task.complete(req.params.id);
    res.json({ success: true, data: updated });
  } catch (err) {
    sendError(res, 500, "Failed to complete task.");
  }
};

// -------------------------------------------------------
// DELETE /tasks/:id — Delete a task permanently
// -------------------------------------------------------
exports.deleteTask = (req, res) => {
  try {
    const deleted = Task.delete(req.params.id);
    if (!deleted) return sendError(res, 404, "Task not found.");
    // 200 with a message — the resource no longer exists
    res.json({ success: true, message: "Task deleted successfully." });
  } catch (err) {
    sendError(res, 500, "Failed to delete task.");
  }
};

// -------------------------------------------------------
// GET /tasks/stats — Dashboard summary counts
// -------------------------------------------------------
exports.getStats = (req, res) => {
  try {
    const stats = Task.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    sendError(res, 500, "Failed to fetch stats.");
  }
};
