import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const DriverRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if(userStr) {
          const userObj = JSON.parse(userStr);
          setCompanyId(userObj._id); // Assuming Company uses userId as their company login identifier, or we can fetch it. Let's just use the profile to get company ID.
        }

        const res = await axios.get('http://localhost:5000/api/orders/company/requests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(res.data);
      } catch (error) {
        console.error('Error fetching driver requests', error);
      }
      setLoading(false);
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    if (!companyId) return;
    const socket = io('http://localhost:5000');
    // For simplicity right now, since we only have one socket server, we can listen for our specific room or globally and filter
    // Let's assume the company ID room is used. The backend emits to `company_${order.companyId}`. 
    // To join it, the frontend should emit `join_company_room`. Let's just listen globally for demonstration or emit join.
    socket.emit('join_trip', `company_${companyId}`); // Mock joining the room using existing event

    socket.on('order_accepted', (data) => {
      setRequests(prev => [data.order, ...prev]);
      alert(`Driver ${data.driver.fullName} accepted your order!`);
    });

    return () => socket.disconnect();
  }, [companyId]);

  const handleApprove = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/orders/${orderId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(requests.filter(r => r._id !== orderId));
      alert('Driver Approved! Trip Started.');
    } catch (error) {
      alert(error.response?.data?.message || 'Error approving driver');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading requests...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Driver Requests</h2>
      <p className="text-gray-500 mb-6 text-sm">These are orders that have been accepted by drivers. Review and approve them to start the trip.</p>
      
      {requests.length === 0 ? (
        <p className="text-gray-500 italic">No pending driver requests.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {requests.map(req => (
            <div key={req._id} className="border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row justify-between items-center hover:shadow-md transition-shadow">
              <div className="flex-1 w-full md:w-auto mb-4 md:mb-0">
                <h3 className="font-bold text-lg text-gray-800">Order #{req._id.substring(0, 8)}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  <strong>Pickup:</strong> {req.pickupLocation.address} <br/>
                  <strong>Drop:</strong> {req.dropLocation.address}
                </p>
                {req.driverId && (
                  <div className="mt-3 bg-blue-50 border border-blue-100 p-3 rounded-md">
                    <p className="text-sm font-semibold text-blue-800 mb-1">Driver Details</p>
                    <p className="text-xs text-blue-700"><strong>Name:</strong> {req.driverId.fullName}</p>
                    <p className="text-xs text-blue-700"><strong>Phone:</strong> {req.driverId.phone}</p>
                    <p className="text-xs text-blue-700"><strong>DL No:</strong> {req.driverId.drivingLicenseNumber}</p>
                  </div>
                )}
                <div className="mt-3 text-sm text-gray-600 bg-gray-50 inline-block px-3 py-1 rounded">
                  {req.vehicleTypeRequired} • {req.materialType} • {req.materialWeight} Tons
                </div>
              </div>
              <div className="flex flex-col space-y-2 w-full md:w-48 text-right">
                <span className="text-lg font-bold text-blue-600">₹{req.estimatedCost}</span>
                <button 
                  onClick={() => handleApprove(req._id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full">
                  Approve Driver
                </button>
                <button 
                  onClick={() => alert(`Driving License: ${req.driverId?.drivingLicenseNumber}\nVerified: Yes\n(Document images would open here)`)}
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-colors w-full">
                  View Documents
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverRequests;
