import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password) return;
    setLoading(true);
    setError("");
    try {
      await register(username, password);
      navigate("/login");
    } catch (err) {
      setError("Username already taken");
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.logo}>💸 Ouch My Wallet</h1>
        <p style={styles.subtitle}>Create your account to get started.</p>

        <div style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.button} onClick={handleRegister} disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
          <p style={styles.loginText}>
            Already have an account?{" "}
            <Link to="/login" style={styles.link}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "#f5f5f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "48px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  logo: { fontSize: "28px", color: "#2d2d2d", marginBottom: "8px" },
  subtitle: { color: "#888", marginBottom: "32px", fontSize: "14px" },
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  input: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#fafafa",
    color: "#2d2d2d",
    width: "100%",
  },
  error: { color: "#e05c5c", fontSize: "13px", margin: 0 },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#7c9a7e",
    color: "white",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  loginText: { fontSize: "13px", color: "#888" },
  link: { color: "#7c9a7e", textDecoration: "none", fontWeight: "bold" },
};

export default Register;