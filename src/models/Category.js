const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String, // URL
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  taxApplicability: {
    type: Boolean,
    default: false,
  },
  tax: {
    type: Number,
    default: 0,
  },
  taxType: {
    type: String,
    // Example: 'Percentage', 'Fixed'
    // This was in the requirement but not detailed, adding as a string
  },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);