import { useEffect, useState } from "react";
import { api } from "../../api/api";
import KPICard from "../components/KPICard";
import LineChart from "../components/LineChart";

export default function Overview() {
  const [data, setData] = useState([]);
  const [forecastPeak, setForecastPeak] = useState(null);
  const [riskLevel, setRiskLevel] = useState("Normal");
  const [weatherImpact, setWeatherImpact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        const [loadRes, forecastRes, riskRes, weatherRes] = await Promise.all([
          api.get("/analytics/national-load"),
          api.get("/analytics/forecast-peak"),
          api.get("/admin/current-risk-level"),
          api.get("/analytics/weather-impact")
        ]);
        setData(loadRes.data);
        setForecastPeak(forecastRes.data);
        setRiskLevel(riskRes.data.level);
        setWeatherImpact(weatherRes.data);
      } catch (e) {
        setError(e.toString());
      } finally {
        setLoading(false);
      }
    };
    fetchOverviewData();
  }, []);

  const peak = data.reduce((m, d) => Math.max(m, d?.load ?? 0), 0);
  const current = data.at(-1)?.load ?? 0;

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case "critical": return "#dc2626";
      case "warning": return "#d97706";
      case "normal": return "#16a34a";
      default: return "#6b7280";
    }
  };

  return (
    <>
      <section className="card">
        <h2>System Overview (Landing Page)</h2>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>Error: {error}</div>
        ) : (
          <>
            <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
              <KPICard title="Current Load" value={`${current} MW`} />
              <KPICard title="Peak Load" value={`${peak} MW`} />
              <KPICard title="Forecasted Peak (Next 24h)" value={forecastPeak ? `${forecastPeak.load} MW` : "N/A"} />
              <KPICard title="Risk Level" value={riskLevel} style={{ color: getRiskColor(riskLevel) }} />
            </div>

            {weatherImpact && (
              <div style={{ marginBottom: 16, padding: 12, background: "#f0f9ff", borderRadius: 8, borderLeft: "4px solid #0ea5e9" }}>
                <h4>Weather Impact</h4>
                <p><strong>Current Impact:</strong> {weatherImpact.description}</p>
                <p><strong>Load Change:</strong> {weatherImpact.load_change}%</p>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <h4>Next 24h / 7 days demand forecast graph</h4>
              <p style={{ color: "#555", marginBottom: 8 }}>
                Uses ML forecast output for monitoring and preventive action.
              </p>
              {data.length > 0 ? <LineChart data={data} /> : <div>No data available</div>}
            </div>
          </>
        )}
      </section>

      <div style={{ marginTop: 20, padding: 12, background: "#eef2ff", borderRadius: 8 }}>
        <strong>Summary:</strong> Load is trending {peak === 0 ? "unknown" : (current > peak * 0.9 ? "high" : "normal")}.
        Risk engine suggests monitoring industrial regions. Current risk level: <span style={{ color: getRiskColor(riskLevel) }}>{riskLevel}</span>.
      </div>
    </>
  );
}
