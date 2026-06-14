const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Razorpay', 'UPI', 'Net Banking', 'Wallet'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Paid', 'Failed'],
    default: 'Pending',
  },
  transactionId: {
    type: String,
  }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
