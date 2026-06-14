import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterDriver = () => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', aadhaarNumber: '', drivingLicenseNumber: '', 
    bankDetails: { accountNo: '', ifsc: '' }, upiId: ''
  });
  const { registerDriver } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    if (e.target.name.startsWith('bank_')) {
      const field = e.target.name.split('_')[1];
      setFormData({ ...formData, bankDetails: { ...formData.bankDetails, [field]: e.target.value }});
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerDriver(formData);
      navigate('/driver/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Driver Registration</h2>
        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="fullName" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="text" name="phone" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
            <input type="text" name="aadhaarNumber" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Driving License Number</label>
            <input type="text" name="drivingLicenseNumber" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange} required />
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold text-gray-700 mt-4 border-b pb-2 mb-2">Bank & Payment Details</h3>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bank Account Number</label>
            <input type="text" name="bank_accountNo" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
            <input type="text" name="bank_ifsc" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">UPI ID</label>
            <input type="text" name="upiId" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange} />
          </div>
          
          <div className="md:col-span-2 mt-4">
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600">
              Register Driver
            </button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link to="/login" className="text-blue-600 hover:underline">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterDriver;
