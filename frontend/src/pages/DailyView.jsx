import { useState, useEffect } from "react";
import { createTransaction, getDailyTransactions, deleteTransaction } from "../api/transactions";

function DailyView() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const fetchTransactions = async () => {
    const data = await getDailyTransactions(today);
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAdd = async () => {
    if (!description || !amount) return;
    setLoading(true);
    await createTransaction(description, parseFloat(amount), today);
    setDescription("");
    setAmount("");
    await fetchTransactions();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    await fetchTransactions();
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
        />
        <button style={styles.button} onClick={handleAdd} disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

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
  title: { fontSize: "24px", marginBottom: "4px" },
  date: { color: "#a0a0b0", marginBottom: "24px" },
  form: { display: "flex", gap: "12px", marginBottom: "24px" },
  input: {
    flex: 1, padding: "10px 14px", borderRadius: "8px",
    border: "1px solid #2a2a4a", backgroundColor: "#1a1a2e",
    color: "white", fontSize: "14px"
  },
  button: {
    padding: "10px 20px", borderRadius: "8px", border: "none",
    backgroundColor: "#e94560", color: "white", cursor: "pointer", fontSize: "14px"
  },
  list: { display: "flex", flexDirection: "column", gap: "10px" },
  empty: { color: "#a0a0b0", textAlign: "center", marginTop: "40px" },
  item: {
    display: "flex", alignItems: "center", padding: "14px 18px",
    backgroundColor: "#1a1a2e", borderRadius: "8px", gap: "12px"
  },
  itemDesc: { flex: 1, fontSize: "15px" },
  itemAmount: { color: "#e94560", fontWeight: "bold", fontSize: "15px" },
  deleteBtn: {
    background: "none", border: "none", color: "#a0a0b0",
    cursor: "pointer", fontSize: "16px"
  },
  total: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginTop: "24px", padding: "16px 18px", backgroundColor: "#1a1a2e",
    borderRadius: "8px", borderTop: "2px solid #e94560"
  },
  totalAmount: { fontSize: "20px", fontWeight: "bold", color: "#e94560" }
};

export default DailyView;