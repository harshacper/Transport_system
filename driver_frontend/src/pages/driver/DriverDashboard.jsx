import React from 'react';
import { Truck, CheckCircle, Clock, IndianRupee, Map } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-start border border-gray-100 hover:shadow-md transition-all relative overflow-hidden">
    <div className={`p-3 rounded-xl ${color} text-white mb-3 shadow-sm z-10`}>
      {icon}
    </div>
    <div className="z-10">
      <h3 className="text-2xl font-extrabold text-gray-800">{value}</h3>
      <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold mt-1">{title}</p>
    </div>
    {/* Subtle background glow */}
    <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full ${color} opacity-5 blur-2xl`}></div>
  </div>
);

const DriverDashboard = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Driver Overview</h2>
        <p className="text-sm text-gray-500 mt-1">Here is your fleet and earnings summary.</p>
      </div>
      
      {/* 2x2 Grid on Mobile, 4 columns on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Avail Orders" value="5" icon={<Truck size={22} />} color="bg-blue-500" />
        <StatCard title="Active Trips" value="1" icon={<Clock size={22} />} color="bg-orange-500" />
        <StatCard title="Earnings" value="₹12.5k" icon={<IndianRupee size={22} />} color="bg-emerald-500" />
        <StatCard title="Completed" value="4" icon={<CheckCircle size={22} />} color="bg-purple-500" />
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm p-6 mt-8 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Current Trip Status</h3>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">Idle</span>
        </div>
        <p className="text-gray-500 text-sm mb-6">You have no active trips running right now. Browse the marketplace to pick up a new load and start earning.</p>
        
        <Link to="/driver/available-orders" className="flex items-center justify-center w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-slate-800 transition-colors">
          <Map className="mr-2" size={18} />
          Find New Loads
        </Link>
      </div>
    </div>
  );
};

export default DriverDashboard;
