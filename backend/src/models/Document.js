const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'ownerModel'
  },
  ownerModel: {
    type: String,
    required: true,
    enum: ['Driver', 'Vehicle']
  },
  docType: {
    type: String,
    required: true,
    enum: ['DL', 'FC', 'Insurance', 'RC', 'Aadhaar', 'PAN']
  },
  fileUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;
