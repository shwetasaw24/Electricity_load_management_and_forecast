import { useEffect, useState } from "react";
import { api } from "../../api/api";
import BarChart from "../components/BarChart";

export default function Regions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get("/analytics/regional-load/mumbai")
      .then(r => setData(r.data))
      .catch(e => setError(e.toString()))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h2>Region Analysis</h2>
      {error && <div style={{ color: "#b00020" }}>Error: {error}</div>}
      {loading ? <div>Loading...</div> : <BarChart data={data} />}
      {!loading && data.length === 0 && <div>No regional data found. Seed backend DB.</div>}
    </>
  );
}
