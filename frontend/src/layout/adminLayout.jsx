import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import AlertsPanel from "../pages/admin/AlertPanel";

export default function AdminLayout() {
  const [showAlerts, setShowAlerts] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <nav style={navStyle}>
        <h3>⚡ Energy Admin</h3>
        <NavLink to="/admin">Dashboard</NavLink>
        <NavLink to="/admin/advisory">Advisory</NavLink>
        <button onClick={() => setShowAlerts(true)} style={alertBtn}>Alerts</button>
      </nav>

      <main style={{ flex: 1, padding: 24, background: "#f5f7fb" }}>
        <Outlet />
      </main>

      {showAlerts && <AlertsPanel onClose={() => setShowAlerts(false)} />}
    </div>
  );
}

function NavLink({ to, children }) {
  return (
    <Link to={to} style={{ display: "block", marginBottom: 10, color: "#fff", textDecoration: "none" }}>
      {children}
    </Link>
  );
}

const navStyle = {
  width: 220,
  padding: 20,
  background: "#111",
  color: "#fff"
};

const alertBtn = {
  marginTop: 20,
  padding: "8px 12px",
  background: "#e11d48",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};
