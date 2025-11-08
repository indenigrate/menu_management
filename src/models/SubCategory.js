const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
    // Default will be handled in the controller based on the parent category
  },
  tax: {
    type: Number,
    // Default will be handled in the controller
  },
  // Reference to the parent category
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('SubCategory', subCategorySchema);