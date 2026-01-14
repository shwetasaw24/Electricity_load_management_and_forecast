import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";

export default function UserLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <nav style={navStyle}>
        <h3>⚡ Energy User</h3>
        <NavLink to="/user">Dashboard</NavLink>
        {/* Add more user routes here */}
        <button onClick={doLogout} style={logoutBtn}>Logout</button>
      </nav>

      <main style={{ flex: 1, padding: 24, background: "#f5f7fb" }}>
        <Outlet />
      </main>
    </div>
  );
}

const logoutBtn = {
  marginTop: 12,
  padding: "8px 12px",
  background: "#333",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};

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
