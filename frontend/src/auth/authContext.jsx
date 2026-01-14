import { createContext, useContext, useEffect, useState } from "react";
import { api, setAuthHeaders } from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { email, role }
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage token and user
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token) {
      setAuthToken(token);
    }
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    setLoading(false);
  }, []);

  async function loginWithCredentials(email, password) {
    const r = await api.post("/auth/login", { email, password });
    const userData = { email: r.data.email, role: r.data.role };
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    setAuthHeaders(email, password);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    return r.data;
  }

  function logout() {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.removeItem("user");
    setAuthHeaders(null, null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginWithCredentials, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
