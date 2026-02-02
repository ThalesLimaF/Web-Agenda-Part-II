import { useState } from "react";

export default function Navbar() {
  const [dark, setDark] = useState(false);

  function toggleTheme() {
    document.body.classList.toggle("dark");
    setDark(!dark);
  }

  return (
    <nav className="navbar">
      <h1>📒 Web Agenda</h1>

      <button className="theme-btn" onClick={toggleTheme}>
        {dark ? "☀️" : "🌙"}
      </button>
    </nav>
  );
}