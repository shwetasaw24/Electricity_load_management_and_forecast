import { useEffect } from "react";
import { useAuth } from "../auth/authContext";
import { useNavigate } from "react-router-dom";

export default function Protected({ role, children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else if (user.role !== role) {
        navigate("/login");
      }
    }
  }, [user, role, navigate, loading]);

  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== role) return <div>Unauthorized</div>;

  return children;
}
