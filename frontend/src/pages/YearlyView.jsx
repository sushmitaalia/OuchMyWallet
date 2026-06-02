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

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Yearly Overview</h2>

      {/* Year Selector */}
      <div style={styles.yearSelector}>
        <button style={styles.arrowBtn} onClick={() => setYear(year - 1)}>◀</button>
        <span style={styles.year}>{year}</span>
        <button style={styles.arrowBtn} onClick={() => setYear(year + 1)}>▶</button>
      </div>

      {/* Yearly Data */}
      {yearlyData.length === 0 ? (
        <p style={styles.empty}>No expenses for {year}!</p>
      ) : (
        <div style={styles.list}>
          {yearlyData.map((m) => (
            <div key={m.month} style={styles.row}>
              <span style={styles.monthName}>{MONTHS[m.month - 1]}</span>
              <div style={styles.barContainer}>
                <div
                  style={{
                    ...styles.bar,
                    width: `${(m.total / Math.max(...yearlyData.map(d => d.total))) * 100}%`
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
  title: { fontSize: "24px", marginBottom: "24px" },
  yearSelector: {
    display: "flex", alignItems: "center", gap: "20px",
    marginBottom: "32px"
  },
  arrowBtn: {
    background: "none", border: "1px solid #2a2a4a", color: "white",
    padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "16px"
  },
  year: { fontSize: "22px", fontWeight: "bold" },
  empty: { color: "#a0a0b0", textAlign: "center", marginTop: "40px" },
  list: { display: "flex", flexDirection: "column", gap: "12px" },
  row: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "12px 16px", backgroundColor: "#1a1a2e", borderRadius: "8px"
  },
  monthName: { width: "90px", fontSize: "14px" },
  barContainer: {
    flex: 1, height: "8px", backgroundColor: "#2a2a4a", borderRadius: "4px"
  },
  bar: { height: "100%", backgroundColor: "#e94560", borderRadius: "4px" },
  amount: { width: "100px", textAlign: "right", color: "#e94560", fontWeight: "bold", fontSize: "14px" },
  total: {
    display: "flex", justifyContent: "space-between",
    marginTop: "8px", padding: "16px", backgroundColor: "#1a1a2e",
    borderRadius: "8px", borderTop: "2px solid #e94560"
  },
  totalAmount: { fontSize: "18px", fontWeight: "bold", color: "#e94560" }
};

export default YearlyView;