// ============================================================
// MAIN ENTRY POINT
// This file bootstraps the React application.
// ReactDOM.createRoot() mounts our <App /> component into the
// <div id="root"> element defined in index.html.
// ============================================================
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Import Tailwind CSS

ReactDOM.createRoot(document.getElementById("root")).render(
  // StrictMode helps catch common bugs during development
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
