const mongoose = require('mongoose');

// Dynamic sub-document tracking chronological comments left by specific agents
const noteSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  email: { type: String, required: true, index: true },
  phone: { type: String, required: true, index: true },
  source: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Qualified', 'Lost', 'Won'], 
    default: 'New',
    index: true
  },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  notes: [noteSchema]
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);