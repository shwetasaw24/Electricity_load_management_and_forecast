import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Registeration";
import AdminLayout from "./layout/adminLayout";
import AdminDashboard from "./layout/adminDashboard";
import AdvisoryForm from "./pages/admin/AdvisoryForm";
import UserLayout from "./layout/UserLayout";
import Protected from "./layout/Protected";
import { AuthProvider } from "./auth/authContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/admin" element={<Protected role="admin"><AdminLayout /></Protected>}>
            <Route index element={<AdminDashboard />} />
            <Route path="advisory" element={<AdvisoryForm />} />
          </Route>
          <Route path="/user/*" element={<Protected role="user"><UserLayout /></Protected>} />
          <Route path="*" element={<div style={{ padding: 20 }}>Page not found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
