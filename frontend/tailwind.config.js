// ============================================================
// TAILWIND CSS CONFIG
// Tailwind scans these files and generates only the CSS classes
// that are actually used — keeping the final bundle small.
// ============================================================
/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind where to look for class names
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class", // Enable dark mode via a 'dark' class on <html>
  theme: {
    extend: {},
  },
  plugins: [],
};
