const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
  },
  pickupLocation: {
    address: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number }
  },
  dropLocation: {
    address: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number }
  },
  materialType: { type: String, required: true },
  materialWeight: { type: Number, required: true }, // in kg/tons
  vehicleTypeRequired: { type: String, required: true },
  numberOfVehicles: { type: Number, default: 1 },
  pickupDate: { type: Date, required: true },
  deliveryDate: { type: Date, required: true },
  charges: {
    loading: { type: Number, default: 0 },
    unloading: { type: Number, default: 0 },
    toll: { type: Number, default: 0 }
  },
  billingMethod: {
    type: String,
    enum: ['Per Trip', 'Per Kilometer', 'Per Weight', 'Weight + Distance'],
    required: true
  },
  estimatedCost: { type: Number, required: true },
  extraNotes: { type: String },
  status: {
    type: String,
    enum: ['Created', 'Accepted', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Created'
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
