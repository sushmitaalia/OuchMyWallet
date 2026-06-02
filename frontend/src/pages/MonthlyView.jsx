import { useState, useEffect } from "react";
import { getMonthlyTransactions, getDailyTransactions } from "../api/transactions";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function MonthlyView() {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyDetails, setDailyDetails] = useState([]);
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

      {/* Month Selector */}
      <div style={styles.monthGrid}>
        {MONTHS.map((month, index) => (
          <button
            key={index}
            style={{
              ...styles.monthBtn,
              ...(selectedMonth === index ? styles.monthBtnActive : {})
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
          <h3 style={styles.monthTitle}>{MONTHS[selectedMonth]} {currentYear}</h3>

          {monthlyData.length === 0 ? (
            <p style={styles.empty}>No expenses this month!</p>
          ) : (
            <>
              {monthlyData.map((day) => (
                <div key={day.date}>
                  <div
                    style={styles.dayRow}
                    onClick={() => handleDayClick(day.date)}
                  >
                    <span>{day.date}</span>
                    <span style={styles.dayAmount}>৳{day.total.toFixed(2)}</span>
                    <span style={styles.arrow}>
                      {selectedDay === day.date ? "▲" : "▼"}
                    </span>
                  </div>

                  {/* Day Details */}
                  {selectedDay === day.date && (
                    <div style={styles.dayDetails}>
                      {dayTransactions.map((t) => (
                        <div key={t.id} style={styles.transaction}>
                          <span>{t.description}</span>
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
  title: { fontSize: "24px", marginBottom: "4px" },
  subtitle: { color: "#a0a0b0", marginBottom: "24px" },
  monthGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px", marginBottom: "32px"
  },
  monthBtn: {
    padding: "10px", borderRadius: "8px", border: "1px solid #2a2a4a",
    backgroundColor: "#1a1a2e", color: "#a0a0b0", cursor: "pointer", fontSize: "13px"
  },
  monthBtnActive: {
    backgroundColor: "#e94560", color: "white", border: "1px solid #e94560"
  },
  summary: {
    backgroundColor: "#1a1a2e", borderRadius: "12px", padding: "20px"
  },
  monthTitle: { fontSize: "18px", marginBottom: "16px" },
  empty: { color: "#a0a0b0", textAlign: "center" },
  dayRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 0", borderBottom: "1px solid #2a2a4a", cursor: "pointer"
  },
  dayAmount: { color: "#e94560", fontWeight: "bold" },
  arrow: { color: "#a0a0b0", fontSize: "12px" },
  dayDetails: {
    backgroundColor: "#16213e", borderRadius: "8px",
    padding: "12px", margin: "8px 0"
  },
  transaction: {
    display: "flex", justifyContent: "space-between",
    padding: "6px 0", color: "#a0a0b0", fontSize: "14px"
  },
  txAmount: { color: "white" },
  total: {
    display: "flex", justifyContent: "space-between",
    marginTop: "16px", paddingTop: "16px", borderTop: "2px solid #e94560"
  },
  totalAmount: { fontSize: "18px", fontWeight: "bold", color: "#e94560" }
};

export default MonthlyView;