import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AcceptedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/driver`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (error) {
        console.error('Error fetching driver orders', error);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading orders...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Assigned Orders</h2>
      
      {orders.length === 0 ? (
        <p className="text-gray-500">You have no assigned or accepted orders currently.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="border border-gray-200 rounded-lg p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg">{order.companyId?.companyName || 'Unknown Company'}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  order.status === 'Accepted' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {order.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-500">Pickup</p>
                  <p className="font-medium">{order.pickupLocation.address}</p>
                </div>
                <div>
                  <p className="text-gray-500">Drop</p>
                  <p className="font-medium">{order.dropLocation.address}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{order.materialType} • {order.materialWeight}</span>
                <span className="font-bold text-lg text-blue-600">₹{order.estimatedCost}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcceptedOrders;
