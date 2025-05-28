import React from "react";
import { theme } from "../theme";

// PUBLIC_INTERFACE
function StockInfoCard({ info }) {
  if (!info) return null;
  const {
    ticker, name, sector, industry, currentPrice,
    marketCap, exchange, currency, logo_url, website, description
  } = info;

  return (
    <div style={{
      background: "#fff",
      padding: "1.5rem 2rem",
      borderRadius: theme.borderRadius,
      marginBottom: "2rem",
      boxShadow: "0 2px 8px rgba(26,35,126,0.08)",
      display: "flex",
      gap: "2.5rem",
      alignItems: "flex-start"
    }}>
      {logo_url && <img src={logo_url} alt={ticker + " logo"} style={{width: 70, height: 70, objectFit: "contain"}} />}
      <div style={{flex:1}}>
        <h2 style={{margin:0, fontWeight:700, color: theme.colors.primary}}>{name || ticker}</h2>
        <div style={{marginBottom:10, color: "#555"}}>{ticker} • {exchange}</div>
        <div style={{marginBottom:14}}><b>Sector:</b> {sector} &nbsp; <b>Industry:</b> {industry}</div>
        <div style={{marginBottom:14}}>
          <b>Price:</b> {currentPrice != null ? `${currentPrice} ${currency}` : "N/A"}
          &nbsp; | &nbsp;
          <b>Market Cap:</b> {marketCap != null ? `$${(+marketCap).toLocaleString()}` : "N/A"}
        </div>
        {website && (
          <a href={website} style={{color: theme.colors.accent, textDecoration: "none", fontWeight:600}} target="_blank" rel="noopener noreferrer">{website.replace(/^https?:\/\//, "")}</a>
        )}
        {description && (
          <div style={{marginTop:14, color:"#444", fontSize:"0.98rem"}}>{description}</div>
        )}
      </div>
    </div>
  );
}

export default StockInfoCard;
