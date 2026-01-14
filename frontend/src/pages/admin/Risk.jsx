import { useState } from "react";
import { api } from "../../api/api";
import KPICard from "../components/KPICard";
// import KPICard from "../components/KPICard";

export default function Risk() {
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRisk = async () => {
    try {
      setLoading(true);
      setError(null);
      const r = await api.post("/admin/advisory", {
        city: "mumbai",
        region: "central",
        building_type: "residential",
        purpose: "hospital",
        current_load: 8500
      });
      setRes(r.data);
    } catch (e) {
      setError(e?.response?.data?.detail || e.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="card">
      <h2>Risk Advisory</h2>
      <p style={{ color: "#555" }}>
        Evaluate system risk based on current load, weather and region type.
      </p>

      <button onClick={fetchRisk} disabled={loading}>
        {loading ? "Analyzing…" : "Generate Advisory"}
      </button>

      {error && <div style={{ color: 'red', marginTop: 8 }}>Error: {error}</div>}

      {res && (
        <div style={{ marginTop: 16 }}>
          <KPICard title="Predicted Load" value={`${res.predicted_national_load ?? res.predicted_load ?? 'N/A'} MW`} />
          <KPICard title="Recommended Release" value={`${res.region_recommended_release ?? 'N/A'} MW`} />
          <KPICard title="Risk Level" value={res.risk} />
          <p style={{ marginTop: 8 }}>{res.reason}</p>
        </div>
      )}
    </section>
    </>
  );
}
