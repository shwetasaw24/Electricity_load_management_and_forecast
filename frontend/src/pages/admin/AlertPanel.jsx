import { useEffect, useState } from "react";
import { api } from "../../api/api";
import KPICard from "../components/KPICard";

export default function AlertsPanel({ onClose }) {
  const [alerts, setAlerts] = useState([]);
  const [weatherImpact, setWeatherImpact] = useState(null);
  const [powerRecommendations, setPowerRecommendations] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlertData = async () => {
      try {
        setLoading(true);
        const [alertsRes, weatherRes, powerRes, anomalyRes] = await Promise.all([
          api.get("/alerts"),
          api.get("/analytics/weather-impact"),
          api.get("/admin/power-recommendations"),
          api.get("/analytics/anomalies")
        ]);
        setAlerts(alertsRes.data);
        setWeatherImpact(weatherRes.data);
        setPowerRecommendations(powerRes.data);
        setAnomalies(anomalyRes.data);
      } catch (e) {
        console.error("Failed to fetch alert data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAlertData();
  }, []);

  const sendEmailAlert = async (alertId) => {
    try {
      await api.post(`/alerts/${alertId}/send-email`);
      alert("Email sent successfully!");
    } catch (e) {
      alert("Failed to send email: " + e.message);
    }
  };

  return (
    <div style={drawerStyle}>
      <button onClick={onClose} style={closeBtn}>Close</button>
      <h3>Alert & Notification Panel</h3>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>
            <h4>Weather Impact Monitor</h4>
            {weatherImpact && (
              <div style={{ padding: 12, background: "#e0f2fe", borderRadius: 8, marginBottom: 8 }}>
                <p><strong>Current Impact:</strong> {weatherImpact.description}</p>
                <p><strong>Load Change:</strong> {weatherImpact.load_change}%</p>
                <p><strong>Risk Level:</strong> {weatherImpact.risk_level}</p>
              </div>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <h4>Power Release Recommendation</h4>
            {powerRecommendations.map((rec, idx) => (
              <div key={idx} style={{ padding: 8, background: "#f0fdf4", borderRadius: 4, marginBottom: 8 }}>
                <strong>{rec.region}:</strong> {rec.recommended_mw} MW |
                <strong> Safe Capacity:</strong> {rec.safe_capacity} MW
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 20 }}>
            <h4>Anomaly Detection</h4>
            {anomalies.map((anomaly, idx) => (
              <div key={idx} style={{ padding: 8, background: "#fef3c7", borderRadius: 4, marginBottom: 8 }}>
                <strong>{anomaly.type}:</strong> {anomaly.description} |
                <strong> Severity:</strong> {anomaly.severity}
              </div>
            ))}
          </div>

          <div>
            <h4>Active Alerts</h4>
            {alerts.length === 0 && <div>No alerts</div>}
            {alerts.map(a => (
              <div key={a.id} style={alertCard(a.level)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <strong>{a.level}</strong><br />
                    {a.message}
                    <br />
                    <small style={{ color: "#666" }}>{new Date(a.timestamp).toLocaleString()}</small>
                  </div>
                  <button
                    onClick={() => sendEmailAlert(a.id)}
                    style={emailBtn}
                  >
                    📧 Send Email
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const drawerStyle = {
  position: "fixed",
  top: 0,
  right: 0,
  width: 400,
  height: "100%",
  background: "#fff",
  padding: 16,
  boxShadow: "-4px 0 12px rgba(0,0,0,0.2)",
  overflowY: "auto"
};

const closeBtn = {
  marginBottom: 10,
  padding: "8px 12px",
  background: "#6b7280",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer"
};

const alertCard = level => ({
  padding: 12,
  marginBottom: 12,
  borderRadius: 6,
  background: level === "Critical" ? "#fee2e2" : level === "Warning" ? "#fef3c7" : "#f0fdf4",
  borderLeft: `4px solid ${level === "Critical" ? "#dc2626" : level === "Warning" ? "#d97706" : "#16a34a"}`
});

const emailBtn = {
  padding: "4px 8px",
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: "12px"
};
