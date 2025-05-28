import React, { useState } from "react";
import { theme } from "../theme";

// PUBLIC_INTERFACE
function StockSearchBar({ onSearch, isLoading }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSearch(input.trim().toUpperCase());
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 24,
        justifyContent: "center",
      }}
    >
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter stock ticker (e.g., AAPL, TSLA)"
        style={{
          padding: "10px 16px",
          border: `1.5px solid ${theme.colors.primary}`,
          borderRadius: theme.borderRadius,
          fontSize: "1rem",
          outline: "none",
          width: 220,
        }}
        disabled={isLoading}
        maxLength={12}
      />
      <button
        style={{
          background: theme.colors.accent,
          color: "#fff",
          border: "none",
          borderRadius: theme.borderRadius,
          padding: "10px 20px",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: "pointer",
        }}
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}

export default StockSearchBar;
