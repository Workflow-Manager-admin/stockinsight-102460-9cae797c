import React, { useState, useEffect } from "react";
import axios from "axios";
import StockSearchBar from "./components/StockSearchBar";
import StockInfoCard from "./components/StockInfoCard";
import StockChart from "./components/StockChart";
import RecentSearches from "./components/RecentSearches";
import { theme } from "./theme";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

function App() {
  const [ticker, setTicker] = useState("");
  const [companyInfo, setCompanyInfo] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState("1mo");
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch company info and chart data
  useEffect(() => {
    if (ticker) {
      setLoading(true);
      axios.get(`${BACKEND_URL}/api/stock/info/${ticker}`)
        .then(res => {
          setCompanyInfo(res.data);
          setLoading(false);
        })
        .catch(() => {
          setCompanyInfo(null); setLoading(false);
        });

      axios.get(`${BACKEND_URL}/api/stock/history/${ticker}?timeframe=${timeframe}`)
        .then(res => setChartData(res.data.prices || []))
        .catch(() => setChartData([]));
    }
  }, [ticker, timeframe]);

  // Get recent searches (once and after searches)
  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/stock/recent`)
      .then(res => setRecent(res.data.recent || []));
  }, [ticker]);

  const handleTickerSearch = t => setTicker(t);

  return (
    <div style={{
      background: theme.colors.secondary,
      minHeight: "100vh",
      padding: 0,
      fontFamily: theme.font,
    }}>
      <header style={{
        background: theme.colors.primary,
        color: "#fff",
        padding: "2rem 0 1.5rem 0",
        textAlign: "center",
        fontWeight: 700,
        fontSize: "2rem",
        letterSpacing: "2px",
      }}>
        StockInsight
      </header>
      <div style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "1.5rem"
      }}>
        <StockSearchBar onSearch={handleTickerSearch} isLoading={loading} />
        {companyInfo &&
          <StockInfoCard info={companyInfo} />}
        {companyInfo &&
          <StockChart ticker={ticker} data={chartData} timeframe={timeframe} setTimeframe={setTimeframe} />}
        <RecentSearches recent={recent} setTicker={setTicker} />
      </div>
    </div>
  );
}

export default App;
