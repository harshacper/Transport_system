import React, { useState } from 'react';

const CompanyPayments = () => {
  const [payments] = useState([
    { id: 'PAY-1001', orderId: 'ORD-991', driver: 'Rajesh K', amount: 15000, status: 'Pending', date: '2026-06-12' },
    { id: 'PAY-1002', orderId: 'ORD-982', driver: 'Suresh L', amount: 22000, status: 'Paid', date: '2026-06-10' },
  ]);

  const handlePay = (id) => {
    alert(`Mock Payment Integration: Initiating Razorpay/UPI flow for ${id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Management</h2>
      <p className="text-gray-500 mb-6 text-sm">Release payments to drivers upon successful delivery confirmation.</p>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-3 text-sm font-semibold text-gray-600">Payment ID</th>
              <th className="p-3 text-sm font-semibold text-gray-600">Order Ref</th>
              <th className="p-3 text-sm font-semibold text-gray-600">Driver</th>
              <th className="p-3 text-sm font-semibold text-gray-600">Amount</th>
              <th className="p-3 text-sm font-semibold text-gray-600">Status</th>
              <th className="p-3 text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm text-gray-500">{payment.id}</td>
                <td className="p-3 text-sm text-gray-800 font-medium">{payment.orderId}</td>
                <td className="p-3 text-sm text-gray-800">{payment.driver}</td>
                <td className="p-3 text-sm font-bold text-gray-800">₹{payment.amount}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="p-3">
                  {payment.status === 'Pending' ? (
                    <button 
                      onClick={() => handlePay(payment.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                      Pay Now
                    </button>
                  ) : (
                    <button className="text-blue-600 hover:underline text-sm font-medium">
                      View Invoice
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyPayments;
