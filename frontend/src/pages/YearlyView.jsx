import { useState, useEffect } from "react";
import { getYearlyTransactions } from "../api/transactions";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function YearlyView() {
  const [yearlyData, setYearlyData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchYearlyData(year);
  }, [year]);

  const fetchYearlyData = async (y) => {
    const data = await getYearlyTransactions(y);
    setYearlyData(data);
  };

  const total = yearlyData.reduce((sum, m) => sum + m.total, 0);
  const maxAmount = Math.max(...yearlyData.map((d) => d.total), 1);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Yearly Overview</h2>

      {/* Year Selector */}
      <div style={styles.yearSelector}>
        <button style={styles.arrowBtn} onClick={() => setYear(year - 1)}>◀</button>
        <span style={styles.year}>{year}</span>
        <button style={styles.arrowBtn} onClick={() => setYear(year + 1)}>▶</button>
      </div>

      {yearlyData.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={styles.empty}>No expenses for {year}!</p>
        </div>
      ) : (
        <div style={styles.card}>
          {yearlyData.map((m) => (
            <div key={m.month} style={styles.row}>
              <span style={styles.monthName}>{MONTHS[m.month - 1]}</span>
              <div style={styles.barContainer}>
                <div
                  style={{
                    ...styles.bar,
                    width: `${(m.total / maxAmount) * 100}%`,
                  }}
                />
              </div>
              <span style={styles.amount}>৳{m.total.toFixed(2)}</span>
            </div>
          ))}

          <div style={styles.total}>
            <span>Total for {year}</span>
            <span style={styles.totalAmount}>৳{total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "600px", margin: "0 auto" },
  title: { fontSize: "24px", marginBottom: "24px", color: "#2d2d2d" },
  yearSelector: {
    display: "flex", alignItems: "center", gap: "20px", marginBottom: "32px",
  },
  arrowBtn: {
    background: "white", border: "1px solid #e0e0e0", color: "#555",
    padding: "8px 14px", borderRadius: "8px", cursor: "pointer",
    fontSize: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  year: { fontSize: "22px", fontWeight: "bold", color: "#2d2d2d" },
  emptyBox: {
    backgroundColor: "white", borderRadius: "12px", padding: "40px",
    textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  empty: { color: "#aaa" },
  card: {
    backgroundColor: "white", borderRadius: "12px", padding: "24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    display: "flex", flexDirection: "column", gap: "14px",
  },
  row: {
    display: "flex", alignItems: "center", gap: "12px",
  },
  monthName: { width: "90px", fontSize: "14px", color: "#555" },
  barContainer: {
    flex: 1, height: "8px", backgroundColor: "#f0f0f0", borderRadius: "4px",
  },
  bar: {
    height: "100%", backgroundColor: "#7c9a7e", borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  amount: {
    width: "110px", textAlign: "right", color: "#7c9a7e",
    fontWeight: "bold", fontSize: "14px",
  },
  total: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginTop: "8px", paddingTop: "16px", borderTop: "2px solid #eef3ee",
    color: "#2d2d2d", fontWeight: "500",
  },
  totalAmount: { fontSize: "18px", fontWeight: "bold", color: "#7c9a7e" },
};

export default YearlyView;