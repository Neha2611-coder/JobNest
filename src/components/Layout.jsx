import { NavLink, Link, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../api.jsx";

const navigation = [
  { to: "/", label: "Home", end: true },
  { to: "/jobs", label: "Jobs" },
  { to: "/jobs?type=Internship", label: "Internships" },
  { to: "/applications", label: "My Applications" },
  { to: "/post-job", label: "Post a Job" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = user?.name?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpper || "RS";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="site-header">
      <div className="nav-inner">
        <Link className="brand" to="/" aria-label="JobNest home">
          <span className="brand-icon"><GraduationCap size={19} /></span>
          <span>Job<span>Nest</span></span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={`main-nav ${menuOpen ? "nav-open" : ""}`}>
          {navigation.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="mobile-nav-actions">
            {user ? <button type="button" className="nav-link" onClick={handleLogout}>Logout</button> : <>
              <Link className="nav-link" to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link className="button button-primary button-small" to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
            </>}
          </div>
        </nav>
        <div className="nav-actions">
          {user ? <>
            <button type="button" className="nav-login" onClick={handleLogout}>Logout</button>
            <Link className="profile-pill" to="/profile" aria-label="Open profile">
              <span className="avatar-small">{initials}</span>
              <span>{user.name}<small>{user.role}</small></span>
            </Link>
          </> : <>
            <Link className="nav-login" to="/login">Login</Link>
            <Link className="button button-primary button-small" to="/register">Register</Link>
          </>}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link className="brand footer-brand" to="/">
          <span className="brand-icon"><GraduationCap size={18} /></span>
          <span>Job<span>Nest</span></span>
        </Link>
        <p>Helping students find their next opportunity.</p>
        <span className="footer-note"><BriefcaseBusiness size={14} /> Built for campus careers</span>
      </div>
    </footer>
  );
}

export function Layout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
}
