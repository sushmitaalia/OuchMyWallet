import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { path: "/", label: "Daily", icon: "📅" },
    { path: "/monthly", label: "Monthly", icon: "📆" },
    { path: "/yearly", label: "Yearly", icon: "📊" },
    { path: "/billsplitter", label: "Bill Splitter", icon: "🧾" },
  ];

  return (
    <div style={{ ...styles.sidebar, width: collapsed ? "64px" : "220px" }}>
      {/* Header */}
      <div style={styles.header}>
        {!collapsed && <span style={styles.logo}>💸 Ouch My Wallet</span>}
        <button style={styles.hamburger} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "☰" : "✕"}
        </button>
      </div>

      {/* Nav Links */}
      <nav style={styles.nav}>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              ...styles.link,
              ...(location.pathname === link.path ? styles.activeLink : {}),
            }}
          >
            <span style={styles.icon}>{link.icon}</span>
            {!collapsed && <span>{link.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div style={styles.bottom}>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          <span style={styles.icon}>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    backgroundColor: "white",
    borderRight: "1px solid #e8ede8",
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
    transition: "width 0.2s ease",
    minHeight: "100vh",
    position: "sticky",
    top: 0,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    marginBottom: "32px",
  },
  logo: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#2d2d2d",
    whiteSpace: "nowrap",
  },
  hamburger: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#7c9a7e",
    padding: "4px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "0 8px",
    flex: 1,
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 12px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#666",
    fontSize: "14px",
    transition: "background 0.15s",
  },
  activeLink: {
    backgroundColor: "#eef3ee",
    color: "#4a7a4c",
    fontWeight: "600",
  },
  icon: { fontSize: "18px" },
  bottom: { padding: "0 8px" },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "transparent",
    color: "#666",
    fontSize: "14px",
    cursor: "pointer",
    width: "100%",
  },
};

export default Sidebar;