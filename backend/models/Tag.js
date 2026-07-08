const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  color: { type: String, default: '#4f46e5' } // Default Tailwind indigo accent hexadecimal color
}, { timestamps: true });

module.exports = mongoose.model('Tag', tagSchema);