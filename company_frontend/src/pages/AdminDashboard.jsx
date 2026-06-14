import React from 'react';
import { Users, Truck, CheckCircle, ShieldAlert } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Control Panel</h1>
            <p className="text-gray-500 mt-1">Platform overview and management</p>
          </div>
          <div className="bg-red-600 text-white px-4 py-2 rounded-md font-medium">
            Superadmin
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
            <div className="p-4 rounded-full bg-blue-500 text-white"><Users size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Total Companies</p>
              <h3 className="text-2xl font-bold text-gray-800">142</h3>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
            <div className="p-4 rounded-full bg-orange-500 text-white"><Truck size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Total Drivers</p>
              <h3 className="text-2xl font-bold text-gray-800">530</h3>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
            <div className="p-4 rounded-full bg-green-500 text-white"><CheckCircle size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Completed Trips</p>
              <h3 className="text-2xl font-bold text-gray-800">1,204</h3>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
            <div className="p-4 rounded-full bg-red-500 text-white"><ShieldAlert size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Pending Approvals</p>
              <h3 className="text-2xl font-bold text-gray-800">28</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Pending Approvals</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3 text-sm font-semibold text-gray-600">Type</th>
                  <th className="p-3 text-sm font-semibold text-gray-600">Name</th>
                  <th className="p-3 text-sm font-semibold text-gray-600">Document Status</th>
                  <th className="p-3 text-sm font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">Driver</span></td>
                  <td className="p-3 font-medium">Rajesh Kumar</td>
                  <td className="p-3 text-yellow-600 font-medium">DL Pending Verification</td>
                  <td className="p-3">
                    <button className="text-blue-600 font-medium hover:underline">Review Docs</button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3"><span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold">Company</span></td>
                  <td className="p-3 font-medium">ABC Logistics</td>
                  <td className="p-3 text-yellow-600 font-medium">GST Verification</td>
                  <td className="p-3">
                    <button className="text-blue-600 font-medium hover:underline">Review Docs</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
