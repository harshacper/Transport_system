import React from 'react';

const Earnings = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Earnings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 rounded-xl p-5 border border-green-100">
          <p className="text-sm text-green-800 font-semibold uppercase">Total Earnings</p>
          <h3 className="text-3xl font-bold text-green-900 mt-2">₹0</h3>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
          <p className="text-sm text-blue-800 font-semibold uppercase">Pending Payments</p>
          <h3 className="text-3xl font-bold text-blue-900 mt-2">₹0</h3>
        </div>
      </div>
      <p className="text-gray-500">Complete deliveries to see your earnings here.</p>
    </div>
  );
};

export default Earnings;
