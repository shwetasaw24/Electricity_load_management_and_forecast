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
      <section className="card">
      <h2>Regional Consumption</h2>
      <p style={{ color: "#555" }}>
        Distribution of electricity demand across regions.
      </p>
      {loading ? "Loading..." : <BarChart data={data} />}
    </section>
    </>
  );
}
