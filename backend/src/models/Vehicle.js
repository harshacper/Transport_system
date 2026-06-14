const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
    unique: true,
  },
  vehicleType: {
    type: String,
    enum: [
      'Mini Truck', 
      'Pickup Van', 
      '14 Feet Truck', 
      'Container Truck', 
      'Trailer', 
      'Tanker', 
      'Refrigerated Truck'
    ],
    required: true,
  },
  capacityWeight: {
    type: Number, // in tons or kgs
    required: true,
  },
  verificationStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;
