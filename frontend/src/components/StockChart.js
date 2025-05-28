import React from "react";
import Plot from "react-plotly.js";
import { theme } from "../theme";

const timeframes = [
  { label: "1 Day", value: "1d" },
  { label: "5 Days", value: "5d" },
  { label: "1 Month", value: "1mo" },
  { label: "6 Months", value: "6mo" },
  { label: "1 Year", value: "1y" },
];

// PUBLIC_INTERFACE
function StockChart({ ticker, data, timeframe, setTimeframe }) {
  if (!data?.length) return null;
  const dates = data.map(d => d.datetime);
  const prices = data.map(d => d.close);

  return (
    <div style={{
      background: "#fff",
      borderRadius: theme.borderRadius,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      marginBottom: 32,
      padding: 18,
    }}>
      <div style={{display:"flex", justifyContent: "flex-end", gap:8, marginBottom:8}}>
        {timeframes.map(tf => (
          <button
            key={tf.value}
            onClick={() => setTimeframe(tf.value)}
            style={{
              background: tf.value === timeframe ? theme.colors.primary : "#e0e3ed",
              color: tf.value === timeframe ? "#fff" : "#3a3a3a",
              border: "none",
              borderRadius: "8px",
              padding: "4px 14px",
              fontWeight: tf.value === timeframe ? 700 : 500,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            {tf.label}
          </button>
        ))}
      </div>
      <Plot
        data={[
          {
            x: dates,
            y: prices,
            type: "scatter",
            mode: "lines+markers",
            marker: { color: theme.colors.accent },
            line: { shape: "spline", width: 3, color: theme.colors.accent }
          }
        ]}
        layout={{
          title: { text: `${ticker.toUpperCase()} - Price Chart (${timeframes.find(tf => tf.value === timeframe)?.label || timeframe})`, font: { size: 20 } },
          xaxis: { title: 'Date/Time', gridcolor: "#e3e3e8" },
          yaxis: { title: 'Price', gridcolor: "#e3e3e8" },
          paper_bgcolor: "#fff",
          plot_bgcolor: "#fff",
          margin: { l: 55, r: 20, t: 40, b: 45 },
          height: 340
        }}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
        config={{
          responsive: true,
          displayModeBar: false,
        }}
      />
    </div>
  );
}

export default StockChart;
