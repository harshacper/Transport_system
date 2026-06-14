import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import RegisterDriver from './pages/RegisterDriver';
import DashboardLayout from './components/DashboardLayout';

import DriverDashboard from './pages/driver/DriverDashboard';
import AvailableOrders from './pages/driver/AvailableOrders';
import LiveTracking from './pages/driver/LiveTracking';
import AcceptedOrders from './pages/driver/AcceptedOrders';
import Earnings from './pages/driver/Earnings';
import Settings from './pages/driver/Settings';

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
              <Route path="/register/driver" element={<RegisterDriver />} />
              
              <Route path="/driver/dashboard" element={<DashboardLayout role="Driver"><DriverDashboard /></DashboardLayout>} />
              <Route path="/driver/available-orders" element={<DashboardLayout role="Driver"><AvailableOrders /></DashboardLayout>} />
              <Route path="/driver/accepted-orders" element={<DashboardLayout role="Driver"><AcceptedOrders /></DashboardLayout>} />
              <Route path="/driver/live-tracking" element={<DashboardLayout role="Driver"><LiveTracking /></DashboardLayout>} />
              <Route path="/driver/earnings" element={<DashboardLayout role="Driver"><Earnings /></DashboardLayout>} />
              <Route path="/driver/settings" element={<DashboardLayout role="Driver"><Settings /></DashboardLayout>} />
            </Routes>
          </Router>
        </AuthProvider>
      </div>
    </div>
  );
}

export default App;
