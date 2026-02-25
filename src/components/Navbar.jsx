import { useEffect, useState } from "react";
import "./layout.css";

function Navbar() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

return (
  <div className="navbar">
    <span>Smart Task Manager</span>

    <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
      {/* Dark mode toggle */}
      <button
        onClick={() =>
          setTheme(theme === "light" ? "dark" : "light")
        }
        style={{
          background: "transparent",
          border: "1px solid var(--sub-text)",
          borderRadius: "999px",
          padding: "6px 10px",
          cursor: "pointer",
          color: "var(--text-color)",
          fontSize: "16px"
        }}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem("user");
          window.location.href = "/";
        }}
        style={{
          background: "transparent",
          border: "1px solid var(--sub-text)",
          borderRadius: "999px",
          padding: "6px 10px",
          cursor: "pointer",
          color: "var(--text-color)"
        }}
      >
        🚪 Logout
      </button>
    </div>
  </div>
);
}

export default Navbar;