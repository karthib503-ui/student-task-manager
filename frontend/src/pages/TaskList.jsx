// ============================================================
// TASK LIST PAGE
// Displays all tasks in a table with search, filter, and pagination.
// This page demonstrates:
//   - Lifting state: parent manages tasks so child actions update UI
//   - Derived state:  filteredTasks is computed from tasks + filters
//   - Edit modal:     inline editing using conditional rendering
// ============================================================

import { useEffect, useState } from "react";
import TaskTable from "../components/TaskTable";
import TaskForm from "../components/TaskForm";
import {
  fetchTasks,
  deleteTask,
  completeTask,
  updateTask,
} from "../services/api";

// Number of tasks per page (bonus: pagination)
const PAGE_SIZE = 8;

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bonus features: search, filter, pagination
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "pending" | "completed"
  const [page, setPage] = useState(1);

  // Edit modal state
  const [editingTask, setEditingTask] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // -------------------------------------------------------
  // Load all tasks from the backend on first render
  // -------------------------------------------------------
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await fetchTasks();
      setTasks(res.data.data);
    } catch {
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------
  // DELETE: Remove task from backend, then update local state
  // We update state locally so we don't need another API call.
  // -------------------------------------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task? This cannot be undone.")) return;
    try {
      await deleteTask(id);
      // Filter out the deleted task from local state
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("Failed to delete task.");
    }
  };

  // -------------------------------------------------------
  // COMPLETE: Mark task done, update that one item in state
  // -------------------------------------------------------
  const handleComplete = async (id) => {
    try {
      const res = await completeTask(id);
      const updated = res.data.data;
      // Replace the old task object with the updated one
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      alert("Failed to complete task.");
    }
  };

  // -------------------------------------------------------
  // EDIT: Open modal with selected task pre-filled
  // -------------------------------------------------------
  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleEditSubmit = async (formData) => {
    try {
      setEditLoading(true);
      const res = await updateTask(editingTask.id, formData);
      const updated = res.data.data;
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? updated : t))
      );
      setEditingTask(null); // Close modal
    } catch {
      alert("Failed to update task.");
    } finally {
      setEditLoading(false);
    }
  };

  // -------------------------------------------------------
  // DERIVED STATE: compute filtered/searched/paginated list
  // This runs on every render — no extra useState needed.
  // -------------------------------------------------------
  const filtered = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || t.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 when search/filter changes
  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
  };
  const handleFilter = (val) => {
    setFilter(val);
    setPage(1);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Task List
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {filtered.length} task{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Search + Filter controls */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <select
            value={filter}
            onChange={(e) => handleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Task Table */}
      <TaskTable
        tasks={paginated}
        onDelete={handleDelete}
        onComplete={handleComplete}
        onEdit={handleEdit}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-40 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-40 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Next →
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Edit Task
              </h2>
              <button
                onClick={() => setEditingTask(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            <TaskForm
              initialValues={editingTask}
              onSubmit={handleEditSubmit}
              loading={editLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}
