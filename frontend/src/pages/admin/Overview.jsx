import { useEffect, useState } from "react";
import { api } from "../../api/api";
import KPICard from "../components/KPICard";
import LineChart from "../components/LineChart";

export default function Overview() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get("/analytics/national-load")
      .then(r => setData(r.data))
      .catch(e => setError(e.toString()))
      .finally(() => setLoading(false));
  }, []);

  const peak = data.reduce((m, d) => Math.max(m, d?.load ?? 0), 0);
  const current = data.at(-1)?.load ?? 0;

  return (
    <>
      <section className="card">
      <h2>System Overview</h2>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>Error: {error}</div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            <KPICard title="Current Load" value={`${current} MW`} />
            <KPICard title="Peak Load" value={`${peak} MW`} />
            <KPICard title="Data Points" value={data.length} />
          </div>

          <p style={{ color: "#555", marginBottom: 8 }}>
            This chart shows national electricity demand trend for monitoring and forecasting.
          </p>

          {data.length > 0 ? <LineChart data={data} /> : <div>No data available</div>}
        </>
      )}
    </section>

    <div style={{ marginTop: 20, padding: 12, background: "#eef2ff", borderRadius: 8 }}>
      <strong>Summary:</strong> Load is trending {peak === 0 ? "unknown" : (current > peak * 0.9 ? "high" : "normal")}.
      Risk engine suggests monitoring industrial regions.
    </div>

    </>
  );
}
