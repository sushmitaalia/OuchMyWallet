// function YearlyView() {
//   return <div>Yearly View - Coming Soon</div>;
// }
// export default YearlyView;
import { useState, useEffect } from "react";
import { getYearlyTransactions, getMonthlyTransactions } from "../api/transactions";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function YearlyView() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [yearlyData, setYearlyData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthTransactions, setMonthTransactions] = useState([]);

  const currentYear = new Date().getFullYear();

  // Example: last 5 years
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    fetchYearlyData(currentYear);
  }, []);

  const fetchYearlyData = async (year) => {
    const data = await getYearlyTransactions(year);
    setYearlyData(data);
  };

  const handleYearClick = async (year) => {
    setSelectedYear(year);
    setSelectedMonth(null);
    setMonthTransactions([]);
    await fetchYearlyData(year);
  };

  const handleMonthClick = async (month) => {
    if (selectedMonth === month) {
      setSelectedMonth(null);
      setMonthTransactions([]);
      return;
    }

    setSelectedMonth(month);

    const data = await getMonthlyTransactions(selectedYear, month + 1);
    setMonthTransactions(data);
  };

  const yearlyTotal = yearlyData.reduce((sum, m) => sum + m.total, 0);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Yearly Overview</h2>

      {/* Year Selector */}
      <div style={styles.yearGrid}>
        {years.map((year) => (
          <button
            key={year}
            style={{
              ...styles.yearBtn,
              ...(selectedYear === year ? styles.yearBtnActive : {})
            }}
            onClick={() => handleYearClick(year)}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Year Summary */}
      <div style={styles.summary}>
        <h3 style={styles.yearTitle}>{selectedYear}</h3>

        {yearlyData.length === 0 ? (
          <p style={styles.empty}>No expenses this year!</p>
        ) : (
          <>
            {yearlyData.map((month) => (
              <div key={month.month}>
                <div
                  style={styles.monthRow}
                  onClick={() => handleMonthClick(month.month - 1)}
                >
                  <span>{MONTHS[month.month - 1]}</span>

                  <span style={styles.monthAmount}>
                    ৳{month.total.toFixed(2)}
                  </span>

                  <span style={styles.arrow}>
                    {selectedMonth === month.month - 1 ? "▲" : "▼"}
                  </span>
                </div>

                {/* Monthly Details */}
                {selectedMonth === month.month - 1 && (
                  <div style={styles.monthDetails}>
                    {monthTransactions.map((day) => (
                      <div key={day.date} style={styles.transaction}>
                        <span>{day.date}</span>

                        <span style={styles.txAmount}>
                          ৳{day.total.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div style={styles.total}>
              <span>Total for {selectedYear}</span>

              <span style={styles.totalAmount}>
                ৳{yearlyTotal.toFixed(2)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto"
  },

  title: {
    fontSize: "24px",
    marginBottom: "24px"
  },

  yearGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    marginBottom: "32px"
  },

  yearBtn: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #2a2a4a",
    backgroundColor: "#1a1a2e",
    color: "#a0a0b0",
    cursor: "pointer",
    fontSize: "14px"
  },

  yearBtnActive: {
    backgroundColor: "#e94560",
    color: "white",
    border: "1px solid #e94560"
  },

  summary: {
    backgroundColor: "#1a1a2e",
    borderRadius: "12px",
    padding: "20px"
  },

  yearTitle: {
    fontSize: "20px",
    marginBottom: "16px"
  },

  empty: {
    color: "#a0a0b0",
    textAlign: "center"
  },

  monthRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #2a2a4a",
    cursor: "pointer"
  },

  monthAmount: {
    color: "#e94560",
    fontWeight: "bold"
  },

  arrow: {
    color: "#a0a0b0",
    fontSize: "12px"
  },

  monthDetails: {
    backgroundColor: "#16213e",
    borderRadius: "8px",
    padding: "12px",
    margin: "8px 0"
  },

  transaction: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    color: "#a0a0b0",
    fontSize: "14px"
  },

  txAmount: {
    color: "white"
  },

  total: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "2px solid #e94560"
  },

  totalAmount: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#e94560"
  }
};

export default YearlyView;