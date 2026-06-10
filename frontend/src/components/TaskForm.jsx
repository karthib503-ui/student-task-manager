// ============================================================
// TASK FORM COMPONENT
// A reusable form used for both creating and editing tasks.
// It receives initial values and an onSubmit callback as props,
// so the parent page decides what happens on submission.
//
// State management:
//   - useState stores the current field values
//   - onChange handlers update state as the user types
//   - onSubmit prevents the default browser reload and calls
//     the parent's handler with the current form data
// ============================================================

import { useState } from "react";

export default function TaskForm({ initialValues = {}, onSubmit, loading }) {
  // Local state for each form field
  const [title, setTitle] = useState(initialValues.title || "");
  const [description, setDescription] = useState(
    initialValues.description || ""
  );
  const [errors, setErrors] = useState({});

  // -------------------------------------------------------
  // CLIENT-SIDE VALIDATION
  // Run before sending data to the backend.
  // Returns true if valid, false otherwise.
  // -------------------------------------------------------
  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (title.trim().length > 100)
      newErrors.title = "Title must be 100 characters or less.";
    if (description.trim().length > 500)
      newErrors.description = "Description must be 500 characters or less.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Stop the page from reloading
    if (!validate()) return;
    // Pass data up to the parent component (AddTask or EditTask)
    onSubmit({ title: title.trim(), description: description.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Study for Math exam"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {/* Show validation error if title is invalid */}
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about this task (optional)"
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 resize-none ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        <p className="mt-1 text-xs text-gray-400">{description.length}/500</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        {loading ? "Saving..." : initialValues.title ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
}
