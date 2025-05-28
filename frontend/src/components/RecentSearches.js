import React from "react";
import { theme } from "../theme";

// PUBLIC_INTERFACE
function RecentSearches({ recent, setTicker }) {
  if (!recent?.length) return null;
  return (
    <div style={{
      background: "#fff",
      padding: "10px 18px",
      borderRadius: theme.borderRadius,
      boxShadow: "0 2px 8px rgba(0,0,0,0.045)",
      marginBottom: "2rem"
    }}>
      <div style={{fontWeight:600, marginBottom:9,color:"#222",fontSize:"1.07rem"}}>Recently Searched</div>
      <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
        {recent.map(r => (
          <button
            key={r.ticker}
            onClick={() => setTicker(r.ticker)}
            style={{
              background: theme.colors.accent,
              color: "#fff",
              border: "none",
              borderRadius: "14px",
              padding: "7px 16px",
              cursor: "pointer",
              marginBottom: 4,
              fontSize: "0.99rem",
              fontWeight: 500,
            }}
          >
            {r.ticker} <span style={{color:"#c6ecf7", marginLeft:3, fontSize:"0.92em"}}>{r.name?.slice(0,22) || ""}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default RecentSearches;
