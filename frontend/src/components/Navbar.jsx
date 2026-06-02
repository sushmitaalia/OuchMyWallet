import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const links = [
    { path: "/", label: "Daily" },
    { path: "/monthly", label: "Monthly" },
    { path: "/yearly", label: "Yearly" },
    { path: "/billsplitter", label: "Bill Splitter" },
  ];

  return (
    <nav style={styles.nav}>
      <h1 style={styles.logo}>💸 Ouch My Wallet</h1>
      <div style={styles.links}>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              ...styles.link,
              ...(location.pathname === link.path ? styles.active : {}),
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    backgroundColor: "#1a1a2e",
    color: "white",
  },
  logo: {
    fontSize: "20px",
    margin: 0,
  },
  links: {
    display: "flex",
    gap: "24px",
  },
  link: {
    color: "#a0a0b0",
    textDecoration: "none",
    fontSize: "15px",
  },
  active: {
    color: "white",
    fontWeight: "bold",
    borderBottom: "2px solid #e94560",
    paddingBottom: "4px",
  },
};

export default Navbar;