const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },    // e.g., "CREATE_USER", "UPDATE_LEAD_STATUS"
  details: { type: String, required: true },   // Explanatory human-readable execution context
  ipAddress: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);