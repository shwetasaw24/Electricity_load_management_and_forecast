import { useEffect, useState } from "react";
import { api } from "../../api/api";

export default function AlertsPanel({ onClose }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    api.get("/alerts").then(r => setAlerts(r.data));
  }, []);

  return (
    <div style={drawerStyle}>
      <button onClick={onClose} style={closeBtn}>Close</button>
      <h3>Alerts</h3>
      {alerts.length === 0 && <div>No alerts</div>}
      {alerts.map(a => (
        <div key={a.id} style={alertCard(a.level)}>
          <strong>{a.level}</strong><br />
          {a.message}
        </div>
      ))}
    </div>
  );
}

const drawerStyle = {
  position: "fixed",
  top: 0,
  right: 0,
  width: 320,
  height: "100%",
  background: "#fff",
  padding: 16,
  boxShadow: "-4px 0 12px rgba(0,0,0,0.2)"
};

const closeBtn = {
  marginBottom: 10
};

const alertCard = level => ({
  padding: 10,
  marginBottom: 10,
  borderRadius: 6,
  background: level === "Critical" ? "#fee2e2" : "#fef9c3"
});
