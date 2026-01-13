import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layout/adminLayout";
import Overview from "./pages/admin/Overview";
import Forecast from "./pages/admin/Forecast";
import Regions from "./pages/admin/Regions";
import Risk from "./pages/admin/Risk";
import Weather from "./pages/admin/Weather";
import AdvisoryForm from './pages/admin/AdvisoryForm';


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Overview />} />
          <Route path="forecast" element={<Forecast />} />
          <Route path="regions" element={<Regions />} />
          <Route path="risk" element={<Risk />} />
          <Route path="weather" element={<Weather />} />
          <Route path="advisory" element={<AdvisoryForm />} />

        </Route>
        <Route path="*" element={<div style={{padding:20}}>Page not found. Go to <a href="/admin">Admin</a></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
