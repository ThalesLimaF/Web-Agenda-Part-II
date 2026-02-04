export default function Navbar({ tema, onToggleTema }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <span className="brand-emoji">📒</span>
        <span className="brand-title">Web Agenda</span>
      </div>

      <button className="theme-switch" onClick={onToggleTema} type="button">
        <span className="theme-icon">{tema === "dark" ? "🌙" : "🌞"}</span>
        <span className="theme-text">{tema === "dark" ? "Dark" : "Light"}</span>
      </button>
    </header>
  );
}