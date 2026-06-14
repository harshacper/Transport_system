import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateOrder = () => {
  const [formData, setFormData] = useState({
    pickupLocation: { address: '' },
    dropLocation: { address: '' },
    materialType: '',
    materialWeight: '',
    vehicleTypeRequired: 'Mini Truck',
    numberOfVehicles: 1,
    pickupDate: '',
    deliveryDate: '',
    charges: { loading: 0, unloading: 0, toll: 0 },
    billingMethod: 'Per Trip',
    extraNotes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('charges.')) {
      const chargeField = name.split('.')[1];
      setFormData({ ...formData, charges: { ...formData.charges, [chargeField]: Number(value) } });
    } else if (name === 'pickupAddress') {
      setFormData({ ...formData, pickupLocation: { ...formData.pickupLocation, address: value } });
    } else if (name === 'dropAddress') {
      setFormData({ ...formData, dropLocation: { ...formData.dropLocation, address: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/orders', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Order created successfully!');
      setTimeout(() => navigate('/company/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Transport Order</h2>
      {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      {success && <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm">{success}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Locations */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Pickup Address</label>
            <input type="text" name="pickupAddress" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Drop Address</label>
            <input type="text" name="dropAddress" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange} required />
          </div>

          {/* Material Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Material Type</label>
            <input type="text" name="materialType" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Material Weight (Tons/Kgs)</label>
            <input type="number" name="materialWeight" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange} required />
          </div>

          {/* Vehicle Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
            <select name="vehicleTypeRequired" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange}>
              <option>Mini Truck</option>
              <option>Pickup Van</option>
              <option>14 Feet Truck</option>
              <option>Container Truck</option>
              <option>Trailer</option>
              <option>Tanker</option>
              <option>Refrigerated Truck</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Vehicles</label>
            <input type="number" name="numberOfVehicles" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" min="1" value={formData.numberOfVehicles} onChange={handleChange} required />
          </div>

          {/* Dates */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Pickup Date</label>
            <input type="datetime-local" name="pickupDate" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Delivery Date</label>
            <input type="datetime-local" name="deliveryDate" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange} required />
          </div>

          {/* Charges & Billing */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Billing Method</label>
            <select name="billingMethod" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange}>
              <option>Per Trip</option>
              <option>Per Kilometer</option>
              <option>Per Weight</option>
              <option>Weight + Distance</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Loading (₹)</label>
              <input type="number" name="charges.loading" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange} defaultValue={0} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Unloading (₹)</label>
              <input type="number" name="charges.unloading" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange} defaultValue={0} />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Extra Notes</label>
            <textarea name="extraNotes" rows="3" className="mt-1 block w-full rounded-md border-gray-300 p-2 border" onChange={handleChange}></textarea>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Create Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;
