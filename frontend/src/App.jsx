import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import PublicDoctors from './pages/PublicDoctors';
import Appointments from './pages/Appointments';
import Prescriptions from './pages/Prescriptions';
import Billing from './pages/Billing';
import Rooms from './pages/Rooms';
import Reports from './pages/Reports';
import Staff from './pages/Staff';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ReceptionDashboard from './pages/ReceptionDashboard';
import PatientInfo from './pages/PatientInfo';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import DischargeForm from './pages/DischargeForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/doctors" element={<PublicDoctors />} />
        <Route path="/patients-info" element={<PatientInfo />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Panels */}
        <Route path="/patient-dashboard" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/doctor-dashboard" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/reception-dashboard" element={
          <ProtectedRoute allowedRoles={['receptionist']}>
            <ReceptionDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin', 'staff', 'receptionist']}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="prescriptions" element={<Prescriptions />} />
          <Route path="billing" element={<Billing />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="reports" element={<Reports />} />
          <Route path="staff" element={<Staff />} />
          <Route path="discharges" element={<DischargeForm />} />
        </Route>

        {/* Global Shortcuts/Redirects for ease of use */}
        <Route path="/billing" element={<ProtectedRoute allowedRoles={['admin', 'staff']}><Layout><Billing /></Layout></ProtectedRoute>} />
        <Route path="/rooms" element={<ProtectedRoute allowedRoles={['admin', 'staff']}><Layout><Rooms /></Layout></ProtectedRoute>} />
        <Route path="/discharges" element={<ProtectedRoute allowedRoles={['admin', 'staff']}><Layout><DischargeForm /></Layout></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
