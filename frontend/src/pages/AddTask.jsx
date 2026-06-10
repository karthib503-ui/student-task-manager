// ============================================================
// ADD TASK PAGE
// A simple form page for creating a new task.
// After success it redirects to the Task List using useNavigate.
//
// Concept: useNavigate()
//   React Router's hook for programmatic navigation.
//   navigate('/tasks') pushes a new entry onto the browser history.
// ============================================================

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import { createTask } from "../services/api";

export default function AddTask() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // useNavigate gives us a function to redirect programmatically
  const navigate = useNavigate();

  // -------------------------------------------------------
  // HANDLE SUBMIT
  // Called by TaskForm with { title, description }.
  // 1. Send POST request to the backend.
  // 2. On success: show a success message, then redirect.
  // 3. On failure: show an error message.
  // -------------------------------------------------------
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setErrorMsg("");
      await createTask(formData);
      setSuccessMsg("Task created successfully! Redirecting...");
      // Wait 1 second so the user can see the success message
      setTimeout(() => navigate("/tasks"), 1000);
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Failed to create task.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/tasks"
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to Task List
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
          Add New Task
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Fill in the details below to create a new task.
        </p>
      </div>

      {/* Success / Error messages */}
      {successMsg && (
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-200 px-4 py-3 rounded-lg">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
          {errorMsg}
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <TaskForm onSubmit={handleSubmit} loading={loading} />
      </div>

      {/* Learning note for students */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300">
        <strong>How this works:</strong> When you click "Add Task", the form
        data is sent as a <code>POST /api/tasks</code> request to the Express
        backend. The backend validates it, saves it to SQLite, and returns the
        new task. You are then redirected to the Task List.
      </div>
    </div>
  );
}
