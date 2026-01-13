import { useState } from "react";
import { api } from "../../api/api";

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
      setError(e.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Risk Advisory</h2>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button onClick={fetchRisk} disabled={loading}>{loading ? "Generating…" : "Generate Advisory"}</button>
        {error && <div style={{ color: "#b00020" }}>{error}</div>}
      </div>

      {res && (
        <div style={{ marginTop: 16, background: "#fcfcff", padding: 16, borderRadius: 8 }}>
          <div><strong>Predicted Load:</strong> {res.predicted_load}</div>
          <div><strong>Risk:</strong> {res.risk}</div>
          <div><strong>Reason:</strong> {res.reason}</div>
        </div>
      )}
    </>
  );
}
