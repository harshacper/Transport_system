import React from 'react';

const Settings = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>
      <p className="text-gray-500 mb-4">Manage your personal information, vehicle details, and documents here.</p>
      
      <div className="space-y-4">
        <div className="border border-gray-200 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800">Profile Information</h3>
          <p className="text-sm text-gray-500 mt-1">Update your name, contact details, and password.</p>
          <button className="mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm font-medium transition-colors">Edit Profile</button>
        </div>
        
        <div className="border border-gray-200 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800">Vehicle & Documents</h3>
          <p className="text-sm text-gray-500 mt-1">Upload updated RC, Insurance, or Driving License.</p>
          <button className="mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm font-medium transition-colors">Manage Documents</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
