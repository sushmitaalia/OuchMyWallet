import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isLoggedIn } from "./api/auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DailyView from "./pages/DailyView";
import MonthlyView from "./pages/MonthlyView";
import YearlyView from "./pages/YearlyView";
import BillSplitter from "./pages/BillSplitter";
import Sidebar from "./components/Sidebar";

function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div style={styles.layout}>
                <Sidebar />
                <div style={styles.content}>
                  <Routes>
                    <Route path="/" element={<DailyView />} />
                    <Route path="/monthly" element={<MonthlyView />} />
                    <Route path="/yearly" element={<YearlyView />} />
                    <Route path="/billsplitter" element={<BillSplitter />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#f5f5f0",
  },
  content: {
    flex: 1,
    padding: "40px",
    overflowY: "auto",
    backgroundColor: "#f5f5f0",
  },
};
export default App;