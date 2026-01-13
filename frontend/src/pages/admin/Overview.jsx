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

  const current = data.at(-1)?.load || 0;

  return (
    <>
      <h2>Overview</h2>
      {error && <div style={{ color: "#b00020" }}>Error: {error}</div>}
      <div style={{ display: "flex", gap: 20 }}>
        <KPICard title="Current Load" value={`${current} MW`} loading={loading} />
        <KPICard title="Data Points" value={data.length} loading={loading} />
      </div>

      {!loading && data.length === 0 && <div>No data available. Run seed script on backend.</div>}

      <LineChart data={data} />
    </>
  );
}
