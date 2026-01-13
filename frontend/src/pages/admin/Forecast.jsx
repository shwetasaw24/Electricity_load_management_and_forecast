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
      <h2>Forecast</h2>
      {error && <div style={{ color: "#b00020" }}>Error: {error}</div>}
      {loading ? <div>Loading...</div> : <LineChart data={data} />}
    </>
  );
}
