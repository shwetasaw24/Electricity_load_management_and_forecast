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

  const fetchRisk = async (payload = form) => {
    try {
      setLoading(true);
      setError(null);
      const body = {
        city: payload.city || 'mumbai',
        region: payload.region || 'central',
        building_type: payload.building_type || 'residential',
        purpose: payload.purpose || 'hospital',
        current_load: payload.current_load || 8000
      };

      const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));

      try {
        const r = await Promise.race([api.post("/admin/advisory", body), timeout(5000)]);
        setRes(r.data);
      } catch (e) {
        // If admin auth is not provided or timeout, fallback to public advisory endpoint
        const status = e?.response?.status;
        if (e.message === 'Timeout' || status === 401 || status === 403) {
          try {
            const fallback = await api.post("/advisory", { city: body.city, last_24_loads: Array(24).fill(body.current_load) });
            setRes(fallback.data);
            setError("Admin auth required or timeout; using public advisory fallback result.");
          } catch (e2) {
            setError(e2?.response?.data?.detail || e2.toString());
          }
        } else {
          setError(e?.response?.data?.detail || e.toString());
        }
      }
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

  const [form, setForm] = useState({
    city: "mumbai",
    region: "central",
    building_type: "residential",
    purpose: "hospital",
    current_load: 8500
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'current_load' ? Number(value) : value }));
  };

  const fmt = (v) => (typeof v === 'number' ? v.toLocaleString() : v);

  return (
    <>
      <section className="card">
        <h2>Risk & Safety Advisory Engine</h2>
        <p style={{ color: "#555" }}>
          Evaluate system risk based on current load, weather and region type.
        </p>

        {peakRiskData ? (
          <div style={{ marginBottom: 16, padding: 12, background: "#fef2f2", borderRadius: 8, borderLeft: `4px solid ${getRiskColor(peakRiskData.risk_level)}` }}>
            <h4>Peak Risk & Alert Center</h4>
            <div style={{ display: "flex", gap: 16, marginTop: 8, alignItems: 'center' }}>
              <div>
                <strong>Risk Level:</strong>
                <span style={{ color: getRiskColor(peakRiskData.risk_level), marginLeft: 8 }}>
                  {peakRiskData.risk_level}
                </span>
              </div>
              <div>
                <strong>Predicted Peak Hours:</strong> {peakRiskData.peak_hours}
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <button className="button" onClick={fetchPeakRisk} style={{ padding: '6px 10px' }}>Refresh</button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: 16, padding: 12, background: "#fff7ed", borderRadius: 8 }}>
            <strong>Peak Risk:</strong> Data unavailable — try refreshing.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
          <input name="region" placeholder="Region" value={form.region} onChange={handleChange} />
          <select name="building_type" value={form.building_type} onChange={handleChange}>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
          </select>
          <select name="purpose" value={form.purpose} onChange={handleChange}>
            <option value="hospital">Hospital</option>
            <option value="school">School</option>
            <option value="factory">Factory</option>
            <option value="home">Home</option>
          </select>
          <input name="current_load" placeholder="Current Load" type="number" value={form.current_load} onChange={handleChange} />
          <div />
        </div>

        <div style={{ marginBottom: 8 }}>
          <button onClick={() => fetchRisk(form)} disabled={loading} className="button">
            {loading ? "Analyzing…" : "Generate Advisory"}
          </button>
        </div>

        {error && <div style={{ color: 'red', marginTop: 8 }}>Error: {error}</div>}

        {res ? (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: 'stretch' }}>
              <KPICard title="Predicted Load" value={`${fmt(res.predicted_national_load ?? res.predicted_load ?? 'N/A')} MW`} loading={loading && !res} />
              <KPICard title="Recommended Release" value={`${fmt(res.region_recommended_release ?? 'N/A')} MW`} loading={loading && !res} />
              <KPICard title="Risk Level" value={<span style={{ color: getRiskColor(res.risk), fontWeight: 700 }}>{res.risk}</span>} />
            </div>
            <p style={{ marginTop: 8, padding: 12, background: "#f3f4f6", borderRadius: 4 }}>
              <strong>Reason:</strong> {res.reason ?? 'Not provided'}
            </p>
          </div>
        ) : (
          <div style={{ marginTop: 16, color: '#6b7280' }}>No advisory generated yet.</div>
        )}
      </section>
    </>
  );
}
