// ============================================================
// STAT CARD COMPONENT
// A small reusable card for displaying a single statistic.
// Used on the Dashboard page (Total / Completed / Pending).
// Props:
//   label  - text shown below the number
//   value  - the number to display
//   color  - Tailwind color class for the accent bar
//   icon   - emoji or icon to display
// ============================================================

export default function StatCard({ label, value, color, icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center gap-4 border-l-4 border-solid" style={{ borderLeftColor: "var(--accent)" }}>
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}
