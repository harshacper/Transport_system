import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import RegisterCompany from './pages/RegisterCompany';
import DashboardLayout from './components/DashboardLayout';
import CompanyDashboard from './pages/company/CompanyDashboard';
import CreateOrder from './pages/company/CreateOrder';
import ActiveOrders from './pages/company/ActiveOrders';
import DriverRequests from './pages/company/DriverRequests';
import CompanyTracking from './pages/company/CompanyTracking';
import CompanyPayments from './pages/company/CompanyPayments';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div className="bg-gray-900 min-h-screen flex justify-center">
      {/* Mobile constraint container */}
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl overflow-hidden">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register/company" element={<RegisterCompany />} />
              
              <Route path="/company/dashboard" element={<DashboardLayout role="Company"><CompanyDashboard /></DashboardLayout>} />
              <Route path="/company/create-order" element={<DashboardLayout role="Company"><CreateOrder /></DashboardLayout>} />
              <Route path="/company/active-orders" element={<DashboardLayout role="Company"><ActiveOrders /></DashboardLayout>} />
              <Route path="/company/driver-requests" element={<DashboardLayout role="Company"><DriverRequests /></DashboardLayout>} />
              <Route path="/company/tracking" element={<DashboardLayout role="Company"><CompanyTracking /></DashboardLayout>} />
              <Route path="/company/payments" element={<DashboardLayout role="Company"><CompanyPayments /></DashboardLayout>} />
              
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </Router>
        </AuthProvider>
      </div>
    </div>
  );
}

export default App;
