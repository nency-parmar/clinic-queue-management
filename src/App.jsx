import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import ReceptionDashboard from "./pages/reception/ReceptionDashboard.jsx";

import DashboardLayout from "./components/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminDashboard />} />

          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/patient/*" element={<PatientDashboard />} />

          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/doctor/*" element={<DoctorDashboard />} />

          <Route path="/reception" element={<ReceptionDashboard />} />
          <Route path="/reception/*" element={<ReceptionDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;