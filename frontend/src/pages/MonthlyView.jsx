import { useState, useEffect } from "react";
import { getMonthlyTransactions, getDailyTransactions } from "../api/transactions";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function MonthlyView() {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayTransactions, setDayTransactions] = useState([]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  useEffect(() => {
    fetchMonthlyData(currentMonth + 1);
    setSelectedMonth(currentMonth);
  }, []);

  const fetchMonthlyData = async (month) => {
    const data = await getMonthlyTransactions(currentYear, month);
    setMonthlyData(data);
  };

  const handleMonthClick = async (monthIndex) => {
    setSelectedMonth(monthIndex);
    setSelectedDay(null);
    setDayTransactions([]);
    const data = await getMonthlyTransactions(currentYear, monthIndex + 1);
    setMonthlyData(data);
  };

  const handleDayClick = async (date) => {
    if (selectedDay === date) {
      setSelectedDay(null);
      setDayTransactions([]);
      return;
    }
    setSelectedDay(date);
    const data = await getDailyTransactions(date);
    setDayTransactions(data);
  };

  const monthTotal = monthlyData.reduce((sum, d) => sum + d.total, 0);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Monthly Overview</h2>
      <p style={styles.subtitle}>{currentYear}</p>

      {/* Month Grid */}
      <div style={styles.monthGrid}>
        {MONTHS.map((month, index) => (
          <button
            key={index}
            style={{
              ...styles.monthBtn,
              ...(selectedMonth === index ? styles.monthBtnActive : {}),
            }}
            onClick={() => handleMonthClick(index)}
          >
            {month}
          </button>
        ))}
      </div>

      {/* Monthly Summary */}
      {selectedMonth !== null && (
        <div style={styles.summary}>
          <h3 style={styles.monthTitle}>
            {MONTHS[selectedMonth]} {currentYear}
          </h3>

          {monthlyData.length === 0 ? (
            <p style={styles.empty}>No expenses this month!</p>
          ) : (
            <>
              {monthlyData.map((day) => (
                <div key={day.date}>
                  <div style={styles.dayRow} onClick={() => handleDayClick(day.date)}>
                    <span style={styles.dayDate}>{day.date}</span>
                    <span style={styles.dayAmount}>৳{day.total.toFixed(2)}</span>
                    <span style={styles.arrow}>
                      {selectedDay === day.date ? "▲" : "▼"}
                    </span>
                  </div>

                  {selectedDay === day.date && (
                    <div style={styles.dayDetails}>
                      {dayTransactions.map((t) => (
                        <div key={t.id} style={styles.transaction}>
                          <span style={styles.txDesc}>{t.description}</span>
                          <span style={styles.txAmount}>৳{t.amount}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div style={styles.total}>
                <span>Total for {MONTHS[selectedMonth]}</span>
                <span style={styles.totalAmount}>৳{monthTotal.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "600px", margin: "0 auto" },
  title: { fontSize: "24px", marginBottom: "4px", color: "#2d2d2d" },
  subtitle: { color: "#888", marginBottom: "24px" },
  monthGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px", marginBottom: "32px",
  },
  monthBtn: {
    padding: "10px", borderRadius: "8px",
    border: "1px solid #e0e0e0", backgroundColor: "white",
    color: "#666", cursor: "pointer", fontSize: "13px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  monthBtnActive: {
    backgroundColor: "#7c9a7e", color: "white",
    border: "1px solid #7c9a7e", fontWeight: "bold",
  },
  summary: {
    backgroundColor: "white", borderRadius: "12px",
    padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  monthTitle: { fontSize: "18px", marginBottom: "16px", color: "#2d2d2d" },
  empty: { color: "#aaa", textAlign: "center", padding: "20px 0" },
  dayRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 0", borderBottom: "1px solid #f0f0f0", cursor: "pointer",
  },
  dayDate: { color: "#444", fontSize: "14px" },
  dayAmount: { color: "#7c9a7e", fontWeight: "bold", flex: 1, textAlign: "right", marginRight: "12px" },
  arrow: { color: "#bbb", fontSize: "11px" },
  dayDetails: {
    backgroundColor: "#f9fbf9", borderRadius: "8px",
    padding: "12px 16px", margin: "8px 0",
  },
  transaction: {
    display: "flex", justifyContent: "space-between",
    padding: "6px 0", fontSize: "14px", color: "#555",
  },
  txDesc: { flex: 1 },
  txAmount: { color: "#7c9a7e", fontWeight: "500" },
  total: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginTop: "16px", paddingTop: "16px", borderTop: "2px solid #eef3ee",
    color: "#2d2d2d", fontWeight: "500",
  },
  totalAmount: { fontSize: "18px", fontWeight: "bold", color: "#7c9a7e" },
};

export default MonthlyView;