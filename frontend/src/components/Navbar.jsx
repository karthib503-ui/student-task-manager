// ============================================================
// NAVBAR COMPONENT
// A reusable navigation bar displayed at the top of every page.
// It uses React Router's <NavLink> which automatically adds an
// "active" style to the link matching the current URL.
// ============================================================

import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ darkMode, toggleDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // NavLink className can be a function that receives { isActive }
  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-yellow-800 text-white"
        : "text-slate-900 hover:bg-yellow-600 hover:text-slate-900"
    }`;

  return (
    <nav className="bg-yellow-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <span className="text-slate-900 font-bold text-lg">
              Karthick123 Student Task Manager
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/" end className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/tasks" className={linkClass}>
              Task List
            </NavLink>
            <NavLink to="/add" className={linkClass}>
              + Add Task
            </NavLink>

            {/* Dark mode toggle button */}
            <button
              onClick={toggleDarkMode}
              className="ml-2 p-2 rounded-md text-slate-900 hover:bg-yellow-600 hover:text-slate-900 transition-colors"
              title="Toggle dark mode"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-slate-900 hover:text-slate-700 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden pb-3 flex flex-col gap-1">
            <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>
              Dashboard
            </NavLink>
            <NavLink to="/tasks" className={linkClass} onClick={() => setMenuOpen(false)}>
              Task List
            </NavLink>
            <NavLink to="/add" className={linkClass} onClick={() => setMenuOpen(false)}>
              + Add Task
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}