import { useEffect, useState } from "react";
import { api } from "../../api/api";

export default function StatusSection() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/user/status?city=mumbai").then(r => setData(r.data));
  }, []);

  if (!data) return null;

  return (
    <section className="card">
      <h2>Local Energy Status</h2>
      <div>⚡ Status: {data.status}</div>
      <div>📍 Area: {data.area}</div>
      <div>🕒 Updated: {data.updated}</div>

      {data.reason && <div>ℹ Reason: {data.reason}</div>}
      {data.outage && <div>🚧 Outage: {data.outage}</div>}
      {data.weather_alert && <div>🌡 Weather Alert: {data.weather_alert}</div>}
    </section>
  );
}
