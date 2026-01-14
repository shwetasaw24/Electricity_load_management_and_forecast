import React from "react";

export default function KPICard({ title, value, subtitle, loading }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 20, background: "#f7f9fc", borderRadius: 10, minWidth: 160, minHeight: 120, height: '100%', boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
      <div>
        <h4 style={{ margin: 0, color: "#333" }}>{title}</h4>
      </div>

      <div style={{ marginTop: 8 }}>
        {loading ? <em>Loading...</em> : <strong style={{ fontSize: 20 }}>{value}</strong>}
      </div>

      {subtitle && <div style={{ marginTop: 8, color: "#666", fontSize: 12 }}>{subtitle}</div>}
    </div>
  );
} 
