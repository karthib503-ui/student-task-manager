// ============================================================
// TASK TABLE COMPONENT
// Displays all tasks in a responsive table with action buttons.
// Each row has Edit, Complete, and Delete actions.
// Props:
//   tasks    - array of task objects from the backend
//   onDelete - called with task id when Delete is clicked
//   onComplete - called with task id when Complete is clicked
//   onEdit   - called with task object when Edit is clicked
// ============================================================

export default function TaskTable({ tasks, onDelete, onComplete, onEdit }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-5xl mb-4">📭</p>
        <p className="text-lg">No tasks yet. Add your first task!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {["Title", "Description", "Status", "Created", "Actions"].map(
              (h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              {/* Title */}
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white max-w-xs">
                <span className={task.status === "completed" ? "line-through text-gray-400" : ""}>
                  {task.title}
                </span>
              </td>

              {/* Description */}
              <td className="px-4 py-3 text-gray-600 dark:text-gray-300 max-w-xs">
                <span className="line-clamp-2">{task.description || "—"}</span>
              </td>

              {/* Status Badge */}
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}
                >
                  {task.status === "completed" ? "✅ Completed" : "⏳ Pending"}
                </span>
              </td>

              {/* Created Date */}
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {new Date(task.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>

              {/* Action Buttons */}
              <td className="px-4 py-3">
                <div className="flex gap-2 flex-wrap">
                  {/* Edit button */}
                  <button
                    onClick={() => onEdit(task)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 rounded-md transition-colors"
                  >
                    ✏️ Edit
                  </button>

                  {/* Complete button — only shown for pending tasks */}
                  {task.status !== "completed" && (
                    <button
                      onClick={() => onComplete(task.id)}
                      className="px-3 py-1 text-xs bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 rounded-md transition-colors"
                    >
                      ✔ Complete
                    </button>
                  )}

                  {/* Delete button */}
                  <button
                    onClick={() => onDelete(task.id)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 rounded-md transition-colors"
                  >
                    🗑 Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
