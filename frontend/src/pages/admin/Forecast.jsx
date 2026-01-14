import { useEffect, useState } from "react";
import { api } from "../../api/api";
import LineChart from "../components/LineChart";

export default function Forecast() {
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

  return (
    <>
      <section className="card">
      <h2>Demand Forecast</h2>
      <p style={{ color: "#555" }}>
        Forecasted electricity demand based on historical patterns and ML predictions.
      </p>
      {loading ? "Loading..." : <LineChart data={data} />}
    </section>
    </>
  );
}
