import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActiveOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/orders/company', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (error) {
        console.error('Error fetching orders', error);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading orders...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Active Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No active orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-3 text-sm font-semibold text-gray-600">ID</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Pickup</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Drop</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Material</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Cost</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-500">{order._id.substring(0, 8)}...</td>
                  <td className="p-3 text-sm text-gray-800">{order.pickupLocation.address}</td>
                  <td className="p-3 text-sm text-gray-800">{order.dropLocation.address}</td>
                  <td className="p-3 text-sm text-gray-600">{order.materialType} ({order.materialWeight})</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'Created' ? 'bg-yellow-100 text-yellow-800' : 
                      order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm font-medium text-gray-800">₹{order.estimatedCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActiveOrders;
