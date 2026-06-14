const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  aadhaarNumber: {
    type: String,
    required: true,
    unique: true,
  },
  drivingLicenseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  bankDetails: {
    accountNo: { type: String },
    ifsc: { type: String }
  },
  upiId: {
    type: String
  },
  verificationStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
}, { timestamps: true });

const Driver = mongoose.model('Driver', driverSchema);
module.exports = Driver;
