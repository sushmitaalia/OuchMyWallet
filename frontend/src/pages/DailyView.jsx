import { useState, useEffect } from "react";
import { createTransaction, getDailyTransactions, deleteTransaction } from "../api/transactions";

function DailyView() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const fetchTransactions = async () => {
    try {
      const data = await getDailyTransactions(today);
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAdd = async () => {
    if (!description || !amount) return;
    setLoading(true);
    setError("");
    try {
      await createTransaction(description, parseFloat(amount), today);
      setDescription("");
      setAmount("");
      await fetchTransactions();
    } catch (err) {
      setError("Failed to add transaction. Make sure you are logged in.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      await fetchTransactions();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Today's Expenses</h2>
      <p style={styles.date}>{today}</p>

      {/* Add Transaction */}
      <div style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="What did you spend on?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          style={styles.input}
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button style={styles.button} onClick={handleAdd} disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {/* Transaction List */}
      <div style={styles.list}>
        {transactions.length === 0 ? (
          <p style={styles.empty}>No expenses yet today!</p>
        ) : (
          transactions.map((t) => (
            <div key={t.id} style={styles.item}>
              <span style={styles.itemDesc}>{t.description}</span>
              <span style={styles.itemAmount}>৳{t.amount}</span>
              <button style={styles.deleteBtn} onClick={() => handleDelete(t.id)}>✕</button>
            </div>
          ))
        )}
      </div>

      {/* Total */}
      {transactions.length > 0 && (
        <div style={styles.total}>
          <span>Total Spent Today</span>
          <span style={styles.totalAmount}>৳{total.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "600px", margin: "0 auto" },
  title: { fontSize: "24px", marginBottom: "4px", color: "#2d2d2d" },
  date: { color: "#888", marginBottom: "24px" },
  form: { display: "flex", gap: "12px", marginBottom: "16px" },
  input: {
    flex: 1, padding: "10px 14px", borderRadius: "8px",
    border: "1px solid #e0e0e0", backgroundColor: "white",
    color: "#2d2d2d", fontSize: "14px", outline: "none",
  },
  button: {
    padding: "10px 20px", borderRadius: "8px", border: "none",
    backgroundColor: "#7c9a7e", color: "white", cursor: "pointer", fontSize: "14px",
    fontWeight: "bold",
  },
  error: { color: "#e05c5c", fontSize: "13px", marginBottom: "12px" },
  list: { display: "flex", flexDirection: "column", gap: "10px" },
  empty: { color: "#aaa", textAlign: "center", marginTop: "40px" },
  item: {
    display: "flex", alignItems: "center", padding: "14px 18px",
    backgroundColor: "white", borderRadius: "8px", gap: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  itemDesc: { flex: 1, fontSize: "15px", color: "#2d2d2d" },
  itemAmount: { color: "#7c9a7e", fontWeight: "bold", fontSize: "15px" },
  deleteBtn: {
    background: "none", border: "none", color: "#ccc",
    cursor: "pointer", fontSize: "16px"
  },
  total: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginTop: "24px", padding: "16px 18px", backgroundColor: "white",
    borderRadius: "8px", borderLeft: "4px solid #7c9a7e",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  totalAmount: { fontSize: "20px", fontWeight: "bold", color: "#7c9a7e" }
};

export default DailyView;