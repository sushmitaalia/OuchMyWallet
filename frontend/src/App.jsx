import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DailyView from "./pages/DailyView";
import MonthlyView from "./pages/MonthlyView";
import YearlyView from "./pages/YearlyView";
import BillSplitter from "./pages/BillSplitter";

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", backgroundColor: "#16213e", color: "white" }}>
        <Navbar />
        <div style={{ padding: "32px" }}>
          <Routes>
            <Route path="/" element={<DailyView />} />
            <Route path="/monthly" element={<MonthlyView />} />
            <Route path="/yearly" element={<YearlyView />} />
            <Route path="/billsplitter" element={<BillSplitter />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;