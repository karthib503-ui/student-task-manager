// ============================================================
// SERVER ENTRY POINT
// This is the main file that starts our Express web server.
// Express receives HTTP requests and routes them to handlers.
//
// Request flow:
//   Browser → Express Server → Route → Controller → Model → DB
//                                                         ↓
//   Browser ← JSON Response  ← Controller ←───────────────┘
// ============================================================

const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");

// Initialize the Express application
const app = express();
// Note: macOS AirPlay Receiver occupies port 5000 by default.
// We use 3001 to avoid that conflict.
const PORT = process.env.PORT || 3001;

// -------------------------------------------------------
// MIDDLEWARE
// Middleware runs on EVERY request before it reaches a route.
// -------------------------------------------------------

// cors() allows the React frontend (on a different port) to
// call our API without the browser blocking it (CORS policy).
app.use(cors());

// express.json() parses incoming requests with JSON bodies
// so req.body is available in controllers.
app.use(express.json());

// -------------------------------------------------------
// ROUTES
// All task-related endpoints live under /api/tasks.
// We import the router from taskRoutes.js and mount it here.
// -------------------------------------------------------
app.use("/api/tasks", taskRoutes);

// -------------------------------------------------------
// HEALTH CHECK
// A simple endpoint to confirm the server is running.
// -------------------------------------------------------
app.get("/", (req, res) => {
  res.json({ message: "Student Task Manager API is running!" });
});

// -------------------------------------------------------
// 404 HANDLER
// If no route matched, send a JSON 404 instead of HTML.
// -------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// -------------------------------------------------------
// GLOBAL ERROR HANDLER
// Catches any unhandled errors thrown inside route handlers.
// The 4-parameter signature (err, req, res, next) tells
// Express this is an error-handling middleware.
// -------------------------------------------------------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ success: false, message: "Internal server error." });
});

// -------------------------------------------------------
// START THE SERVER
// app.listen() starts the HTTP server on the given PORT.
// -------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
  console.log(`📋 API base URL: http://localhost:${PORT}/api/tasks`);
});
