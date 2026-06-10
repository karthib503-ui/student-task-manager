// ============================================================
// APP COMPONENT (Root)
// This is the top-level component that:
//   1. Sets up React Router for client-side navigation
//   2. Manages global dark mode state
//   3. Defines which component renders at each URL path
//
// React Router concept:
//   <BrowserRouter> — enables URL-based navigation
//   <Routes>        — container for all route definitions
//   <Route>         — maps a path to a component
//   path="/"        — matches the homepage exactly (with `end`)
// ============================================================

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import TaskList from "./pages/TaskList";
import AddTask from "./pages/AddTask";

export default function App() {
  // Dark mode state: true = dark, false = light
  // This lives in App so the Navbar toggle and the whole page share it
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    // The "dark" class on the root div enables Tailwind's dark: variants
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-200 dark:bg-gray-900 transition-colors duration-300">
        <BrowserRouter>
          {/* Navbar is outside Routes so it renders on every page */}
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

          {/* Main content area */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              {/* Route: /  → Dashboard page */}
              <Route path="/" element={<Dashboard />} />

              {/* Route: /tasks → Task List page */}
              <Route path="/tasks" element={<TaskList />} />

              {/* Route: /add → Add Task page */}
              <Route path="/add" element={<AddTask />} />

              {/* Fallback: any unknown URL shows 404 */}
              <Route
                path="*"
                element={
                  <div className="text-center py-24">
                    <p className="text-6xl mb-4">🔍</p>
                    <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                      Page Not Found
                    </h2>
                  </div>
                }
              />
            </Routes>
          </main>
        </BrowserRouter>
      </div>
    </div>
  );
}
