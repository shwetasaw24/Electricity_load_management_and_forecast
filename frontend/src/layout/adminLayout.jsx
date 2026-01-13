import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      <nav style={{ width: 240, padding: 20, background: "#111", color: "#fff" }}>
        <h3>⚡ Admin</h3>
        <Link to="/admin">Overview</Link><br />
        <Link to="/admin/forecast">Forecast</Link><br />
        <Link to="/admin/regions">Regions</Link><br />
        <Link to="/admin/risk">Risk</Link><br />
        <Link to="/admin/weather">Weather</Link>
        <Link to="/admin/advisory">Advisory</Link>

      </nav>
      <main style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </main>
    </div>
  );
}
