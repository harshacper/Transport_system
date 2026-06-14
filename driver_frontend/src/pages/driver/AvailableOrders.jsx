import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const AvailableOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/orders/available', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (error) {
        console.error('Error fetching orders', error);
      }
      setLoading(false);
    };

    fetchOrders();

    const socket = io('http://localhost:5000');
    socket.on('new_order', (order) => {
      setOrders(prev => [order, ...prev]);
      alert('New Order Available!');
    });

    return () => socket.disconnect();
  }, []);

  const handleAccept = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      // Assume a route exists to accept order
      await axios.put(`http://localhost:5000/api/orders/${orderId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(orders.filter(o => o._id !== orderId));
      alert('Order Accepted! Awaiting Company Approval.');
    } catch (error) {
      alert(error.response?.data?.message || 'Error accepting order');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading available orders...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Orders Nearby</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No new orders available right now.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map(order => (
            <div key={order._id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{order.companyId?.companyName}</h3>
                  <p className="text-sm text-gray-500">{new Date(order.pickupDate).toLocaleString()}</p>
                </div>
                <div className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                  ₹{order.estimatedCost}
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <div className="mt-1 bg-green-500 w-2 h-2 rounded-full mr-3"></div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Pickup</p>
                    <p className="text-sm font-medium">{order.pickupLocation.address}</p>
                  </div>
                </div>
                <div className="border-l-2 border-dashed border-gray-300 ml-1 h-4"></div>
                <div className="flex items-start">
                  <div className="mt-1 bg-red-500 w-2 h-2 rounded-full mr-3"></div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Drop</p>
                    <p className="text-sm font-medium">{order.dropLocation.address}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center border-t pt-4">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">{order.materialType}</span> • {order.materialWeight}
                </div>
                <button 
                  onClick={() => handleAccept(order._id)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Accept Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableOrders;
