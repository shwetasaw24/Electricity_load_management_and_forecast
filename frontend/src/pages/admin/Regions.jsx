import { useEffect, useState } from "react";
import { api } from "../../api/api";
import BarChart from "../components/BarChart";
import KPICard from "../components/KPICard";

export default function Regions() {
  const [data, setData] = useState([]);
  const [breakdown, setBreakdown] = useState(null);
  const [highConsumptionRegions, setHighConsumptionRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("mumbai");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRegionalData();
  }, [selectedRegion]);

  const fetchRegionalData = async () => {
    try {
      setLoading(true);
      const [loadRes, breakdownRes, highConsRes] = await Promise.all([
        api.get(`/analytics/regional-load/${selectedRegion}`),
        api.get("/analytics/load-breakdown"),
        api.get("/analytics/high-consumption-regions")
      ]);
      setData(loadRes.data);
      setBreakdown(breakdownRes.data);
      setHighConsumptionRegions(highConsRes.data);
    } catch (e) {
      setError(e.toString());
    } finally {
      setLoading(false);
    }
  };

  const regions = ["mumbai", "delhi", "bangalore", "chennai", "kolkata"];

  return (
    <>
      <section className="card">
        <h2>Region Consumption Pattern Analysis</h2>
        <p style={{ color: "#555" }}>
          Distribution of electricity demand across regions with industrial vs residential breakdown.
        </p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ marginRight: 16 }}>
            <strong>Select Region:</strong>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              style={{ marginLeft: 8, padding: "4px 8px" }}
            >
              {regions.map(region => (
                <option key={region} value={region}>{region.charAt(0).toUpperCase() + region.slice(1)}</option>
              ))}
            </select>
          </label>
        </div>

        {loading ? (
          "Loading..."
        ) : error ? (
          <div style={{ color: 'red' }}>Error: {error}</div>
        ) : (
          <>
            {breakdown && (
              <div style={{ marginBottom: 16 }}>
                <h4>Load Breakdown</h4>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <KPICard title="Industrial Load" value={`${breakdown.industrial}%`} />
                  <KPICard title="Residential Load" value={`${breakdown.residential}%`} />
                  <KPICard title="Commercial Load" value={`${breakdown.commercial}%`} />
                </div>
              </div>
            )}

            {highConsumptionRegions.length > 0 && (
              <div style={{ marginBottom: 16, padding: 12, background: "#fef3c7", borderRadius: 8 }}>
                <h4>High-Consumption Regions</h4>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {highConsumptionRegions.map((region, idx) => (
                    <span key={idx} style={{ padding: "4px 8px", background: "#f59e0b", color: "#fff", borderRadius: 4, fontSize: "12px" }}>
                      {region.name}: {region.load} MW
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4>Regional Load Distribution</h4>
              <BarChart data={data} />
            </div>
          </>
        )}
      </section>
    </>
  );
}
