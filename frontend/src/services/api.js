// ============================================================
// API SERVICE
// This file centralizes ALL communication with the backend.
// Components never make HTTP requests directly — they call
// these functions instead.  This keeps API logic in one place.
//
// We use axios (a popular HTTP client library) which:
//   - Automatically converts responses to JSON
//   - Provides cleaner error handling than fetch()
//   - Lets us set a baseURL so we never repeat it
// ============================================================

import axios from "axios";

// Create an axios instance with shared config.
// Every function below uses this instance.
const api = axios.create({
  baseURL: "/api", // Vite proxy forwards this to http://localhost:5000/api
  headers: { "Content-Type": "application/json" },
});

// -------------------------------------------------------
// TASK API FUNCTIONS
// Each function maps to one backend REST endpoint.
// They all return promises — call them with await or .then()
// -------------------------------------------------------

// GET /api/tasks → fetch all tasks
export const fetchTasks = () => api.get("/tasks");

// GET /api/tasks/stats → dashboard counts
export const fetchStats = () => api.get("/tasks/stats");

// GET /api/tasks/:id → fetch one task
export const fetchTask = (id) => api.get(`/tasks/${id}`);

// POST /api/tasks → create a new task
// data = { title, description }
export const createTask = (data) => api.post("/tasks", data);

// PUT /api/tasks/:id → update title/description
// data = { title, description }
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);

// PATCH /api/tasks/:id/complete → mark as completed
export const completeTask = (id) => api.patch(`/tasks/${id}/complete`);

// DELETE /api/tasks/:id → permanently delete
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
