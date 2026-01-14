import { useEffect, useState } from "react";
import { api } from "../../api/api";
import LineChart from "../components/LineChart";

export default function Forecast() {
  const [data, setData] = useState([]);
  const [forecast24h, setForecast24h] = useState([]);
  const [forecast7d, setForecast7d] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("24h");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [loadRes, forecast24Res, forecast7Res] = await Promise.all([
          api.get("/analytics/national-load"),
          api.get("/analytics/forecast?period=24h"),
          api.get("/analytics/forecast?period=7d")
        ]);
        setData(loadRes.data);
        setForecast24h(forecast24Res.data);
        setForecast7d(forecast7Res.data);
      } catch (e) {
        setError(e.toString());
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDisplayData = () => {
    switch (selectedPeriod) {
      case "24h": return forecast24h;
      case "7d": return forecast7d;
      default: return data;
    }
  };

  const getAccuracy = () => {
    // Mock accuracy calculation - in real app, this would come from ML model
    return selectedPeriod === "24h" ? "92%" : "88%";
  };

  return (
    <>
      <section className="card">
        <h2>Demand Forecasting Panel</h2>
        <p style={{ color: "#555" }}>
          Forecasted electricity demand based on historical patterns and ML predictions.
        </p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ marginRight: 16 }}>
            <input
              type="radio"
              value="24h"
              checked={selectedPeriod === "24h"}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            />
            Next 24 Hours
          </label>
          <label>
            <input
              type="radio"
              value="7d"
              checked={selectedPeriod === "7d"}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            />
            Next 7 Days
          </label>
        </div>

        <div style={{ marginBottom: 16, padding: 12, background: "#f0f9ff", borderRadius: 8 }}>
          <strong>Forecast Accuracy:</strong> {getAccuracy()} | <strong>ML Model:</strong> LSTM Neural Network
        </div>

        {loading ? (
          "Loading..."
        ) : error ? (
          <div style={{ color: 'red' }}>Error: {error}</div>
        ) : (
          <LineChart data={getDisplayData()} />
        )}
      </section>
    </>
  );
}
