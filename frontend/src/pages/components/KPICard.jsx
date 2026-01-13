import React from "react";

export default function KPICard({ title, value, subtitle, loading }) {
  return (
    <div style={{ padding: 20, background: "#f7f9fc", borderRadius: 10, minWidth: 160, boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
      <h4 style={{ margin: 0, color: "#333" }}>{title}</h4>
      <div style={{ marginTop: 8 }}>
        {loading ? <em>Loading...</em> : <strong style={{ fontSize: 20 }}>{value}</strong>}
      </div>
      {subtitle && <div style={{ marginTop: 6, color: "#666", fontSize: 12 }}>{subtitle}</div>}
    </div>
  );
}
