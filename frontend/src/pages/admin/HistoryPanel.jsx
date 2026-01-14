import { useEffect, useState } from "react";
import { api } from "../../api/api";

export default function HistoryPanel({ onClose }) {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    api.get("/analytics/national-load")
      .then(r => setSeries(r.data || []))
      .catch(() => setSeries([]));
  }, []);

  const recent = series.slice(-24).reverse();

  return (
    <div style={drawerStyle}>
      <button onClick={onClose} style={closeBtn}>Close</button>
      <h3>Recent National Load (last 24)</h3>
      {recent.length === 0 && <div>No data</div>}

      <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
        {recent.map((r, idx) => (
          <div key={idx} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
            <strong>{r.timestamp || `t-${idx}`}</strong> — {r.load ?? r}
          </div>
        ))}
      </div>
    </div>
  );
}

const drawerStyle = {
  position: "fixed",
  top: 0,
  right: 0,
  width: 360,
  height: "100%",
  background: "#fff",
  padding: 16,
  boxShadow: "-4px 0 12px rgba(0,0,0,0.15)",
  zIndex: 60
};

const closeBtn = {
  marginBottom: 10
};