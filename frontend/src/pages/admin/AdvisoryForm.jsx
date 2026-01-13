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
      const r = await api.post("/admin/advisory", {
        ...form,
        current_load: Number(form.current_load)
      });
      setResult(r.data);
    } catch (e) {
      setError(e.toString());
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
