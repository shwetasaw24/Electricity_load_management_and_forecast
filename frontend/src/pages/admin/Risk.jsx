import { useState, useEffect } from "react";
import { api } from "../../api/api";
import KPICard from "../components/KPICard";

export default function Risk() {
  const [res, setRes] = useState(null);
  const [peakRiskData, setPeakRiskData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch peak risk data on component mount
    fetchPeakRisk();
  }, []);

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

  const fetchPeakRisk = async () => {
    try {
      const r = await api.get("/admin/peak-risk");
      setPeakRiskData(r.data);
    } catch (e) {
      console.error("Failed to fetch peak risk data:", e);
    }
  };

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
        <h2>Risk & Safety Advisory Engine</h2>
        <p style={{ color: "#555" }}>
          Evaluate system risk based on current load, weather and region type.
        </p>

        {peakRiskData && (
          <div style={{ marginBottom: 16, padding: 12, background: "#fef2f2", borderRadius: 8, borderLeft: `4px solid ${getRiskColor(peakRiskData.risk_level)}` }}>
            <h4>Peak Risk & Alert Center</h4>
            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
              <div>
                <strong>Risk Level:</strong>
                <span style={{ color: getRiskColor(peakRiskData.risk_level), marginLeft: 8 }}>
                  {peakRiskData.risk_level}
                </span>
              </div>
              <div>
                <strong>Predicted Peak Hours:</strong> {peakRiskData.peak_hours}
              </div>
            </div>
          </div>
        )}

        <button onClick={fetchRisk} disabled={loading} style={{ marginBottom: 16 }}>
          {loading ? "Analyzing…" : "Generate Advisory"}
        </button>

        {error && <div style={{ color: 'red', marginTop: 8 }}>Error: {error}</div>}

        {res && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <KPICard title="Predicted Load" value={`${res.predicted_national_load ?? res.predicted_load ?? 'N/A'} MW`} />
              <KPICard title="Recommended Release" value={`${res.region_recommended_release ?? 'N/A'} MW`} />
              <KPICard title="Risk Level" value={res.risk} />
            </div>
            <p style={{ marginTop: 8, padding: 12, background: "#f3f4f6", borderRadius: 4 }}>
              <strong>Reason:</strong> {res.reason}
            </p>
          </div>
        )}
      </section>
    </>
  );
}
