const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
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
    default: false,
  },
  tax: {
    type: Number,
    default: 0,
  },
  baseAmount: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
  },
  // Reference to the parent category
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  // Optional reference to the parent sub-category
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: false, // As items can be directly under a category
  },
}, { timestamps: true });

// Mongoose pre-save hook to calculate totalAmount before saving
itemSchema.pre('save', function(next) {
  this.totalAmount = this.baseAmount - this.discount;
  next();
});

module.exports = mongoose.model('Item', itemSchema);