import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterCompany = () => {
  const [formData, setFormData] = useState({
    companyName: '', ownerName: '', email: '', phone: '', password: '', gstNumber: '', address: ''
  });
  const { registerCompany } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerCompany(formData);
      navigate('/company/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Company Registration</h2>
        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input type="text" name="companyName" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Owner Name</label>
            <input type="text" name="ownerName" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange} required />
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
            <label className="block text-sm font-medium text-gray-700">GST Number</label>
            <input type="text" name="gstNumber" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange} required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea name="address" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" rows="3" onChange={handleChange} required></textarea>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Register Company
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

export default RegisterCompany;
