import { useState } from "react";
import { api } from "../../api/api";

export default function AdvisoryForm() {
  const [form, setForm] = useState({
    city: "",
    region: "",
    building_type: "residential",
    purpose: "hospital",
    current_load: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      setLoading(true);
      setError(null);
      // Try admin advisory first (admin UI). If auth not provided or timeout, fallback to public advisory API
      const payload = { ...form, current_load: Number(form.current_load) };
      const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));

      try {
        const r = await Promise.race([api.post("/admin/advisory", payload), timeout(5000)]);
        setResult(r.data);
      } catch (e) {
        if (e.message === 'Timeout') {
          // fallback: create last_24_loads seed if current_load provided
          const last24 = payload.current_load ? Array(24).fill(payload.current_load) : Array(24).fill(8000);
          const fallback = await api.post("/advisory", { city: payload.city || 'mumbai', last_24_loads: last24 });
          setResult(fallback.data);
          setError('Timeout; used public advisory fallback result.');
        } else {
          throw e;
        }
      }
    } catch (e) {
      setError(e?.response?.data?.detail || e.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Create Advisory</h3>

      <div style={{ display: "grid", gap: 8 }}>
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

        <button className="button" onClick={submit} disabled={loading}>
          {loading ? "Submitting…" : "Generate Advisory"}
        </button>

        {error && <div style={{ color: "#b00020" }}>{error}</div>}
        {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      </div>
    </div>
  );
}
