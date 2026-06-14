import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, PlusCircle, List, UserCheck, Map, CreditCard, LogOut } from 'lucide-react';

const DashboardLayout = ({ children, role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'http://localhost:5173/login';
      return;
    }
    if (user && user.user && user.user.role !== 'Company') {
      logout();
      window.location.href = 'http://localhost:5174/login';
    }
  }, [user, logout]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/company/dashboard', icon: <Home size={20} /> },
    { name: 'Add', path: '/company/create-order', icon: <PlusCircle size={20} /> },
    { name: 'Orders', path: '/company/active-orders', icon: <List size={20} /> },
    { name: 'Drivers', path: '/company/driver-requests', icon: <UserCheck size={20} /> },
    { name: 'Track', path: '/company/tracking', icon: <Map size={20} /> },
    { name: 'Pay', path: '/company/payments', icon: <CreditCard size={20} /> },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden relative">
      {/* Top Header */}
      <header className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md z-10">
        <h1 className="text-xl font-bold tracking-wider text-orange-500">TRANSLOGIS</h1>
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium">{user?.companyName || 'Company'}</span>
          <button onClick={handleLogout} className="p-1.5 bg-slate-800 rounded-full hover:bg-red-500 transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 flex justify-around p-2 pb-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive ? 'text-orange-500' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {item.icon}
              <span className="text-[10px] mt-1 font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardLayout;
