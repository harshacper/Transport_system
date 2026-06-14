const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Started', 'Reached Pickup', 'Loaded', 'Reached Destination', 'Unloaded', 'Completed'],
    default: 'Pending'
  },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  routeHistory: [{
    lat: { type: Number },
    lng: { type: Number },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;
