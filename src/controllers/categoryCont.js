const mongoose = require('mongoose');
const Category = require('../models/Category');

// CREATE Category
exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).send(category);
  } catch (error) {
    res.status(400).send({ message: "Error creating category", error: error.message });
  }
};

// GET All Categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send({ message: "Error fetching categories", error: error.message });
  }
};

// GET Category by ID or Name
// We'll use a single parameter and check if it's a valid ID
exports.getCategory = async (req, res) => {
  try {
    const { identifier } = req.params;
    let category;

    // Check if identifier is a valid Mongoose ObjectId
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      category = await Category.findById(identifier);
    }
    
    // If not found by ID, try finding by name
    if (!category) {
      category = await Category.findOne({ name: identifier });
    }

    if (!category) {
      return res.status(404).send({ message: 'Category not found' });
    }
    
    res.status(200).send(category);
  } catch (error) {
    res.status(500).send({ message: "Error fetching category", error: error.message });
  }
};

// EDIT Category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    
    if (!category) {
      return res.status(404).send({ message: 'Category not found' });
    }
    
    res.status(200).send(category);
  } catch (error) {
    res.status(400).send({ message: "Error updating category", error: error.message });
  }
};

// Helper function for sub-category controller (used to get defaults)
exports.getCategoryById = async (id) => {
  return await Category.findById(id);
};