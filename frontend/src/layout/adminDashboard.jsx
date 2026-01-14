import { useState } from "react";
import Overview from "../pages/admin/Overview";
import Forecast from "../pages/admin/Forecast";
import Regions from "../pages/admin/Regions";
import Risk from "../pages/admin/Risk";
import Weather from "../pages/admin/Weather";
import AlertsPanel from "../pages/admin/AlertPanel";
import HistoryPanel from "../pages/admin/HistoryPanel";

export default function AdminDashboard() {
  const [showAlerts, setShowAlerts] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div>
      <nav style={navStyle}>
        <h3>Energy Admin</h3>
        <div>
          <button onClick={() => setShowAlerts(true)} style={navBtn}>Alerts</button>
          <button onClick={() => setShowHistory(true)} style={navBtn}>History</button>
        </div>
      </nav>

      <div style={{ padding: 20 }}>
        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          <Overview />
          <Forecast />
          <Regions />
          <Risk />
          <Weather />
        </div>
      </div>

      {showAlerts && <AlertsPanel onClose={() => setShowAlerts(false)} />}
      {showHistory && <HistoryPanel onClose={() => setShowHistory(false)} />}
    </div>
  );
}

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 20px",
  background: "#111",
  color: "#fff",
  alignItems: 'center'
};

const navBtn = {
  marginLeft: 8,
  padding: '8px 10px',
  borderRadius: 6,
  background: '#1f2937',
  color: '#fff',
  border: 'none',
  cursor: 'pointer'
};
