const Item = require('../models/Item');
const mongoose = require('mongoose'); // Import mongoose

// CREATE Item
exports.createItem = async (req, res) => {
  try {
    // categoryId is required, subCategoryId is optional
    const { categoryId, subCategoryId } = req.body;

    if (!categoryId) {
      return res.status(400).send({ message: 'Category ID is required' });
    }

    const itemData = {
      ...req.body,
      category: categoryId,
      subCategory: subCategoryId || null, // Set to null if not provided
    };

    const item = new Item(itemData);
    await item.save(); // pre-save hook will calculate totalAmount
    res.status(201).send(item);
  } catch (error) {
    res.status(400).send({ message: "Error creating item", error: error.message });
  }
};

// GET All Items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find({})
      .populate('category', 'name')
      .populate('subCategory', 'name');
    res.status(200).send(items);
  } catch (error) {
    res.status(500).send({ message: "Error fetching items", error: error.message });
  }
};

// GET All Items under a Category
exports.getItemsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const items = await Item.find({ category: categoryId })
      .populate('subCategory', 'name');
    
    res.status(200).send(items);
  } catch (error) {
    res.status(500).send({ message: "Error fetching items", error: error.message });
  }
};

// GET All Items under a SubCategory
exports.getItemsBySubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.params;
    const items = await Item.find({ subCategory: subCategoryId })
      .populate('category', 'name');
    
    res.status(200).send(items);
  } catch (error) {
    res.status(500).send({ message: "Error fetching items", error: error.message });
  }
};

// GET Item by ID or Name
exports.getItem = async (req, res) => {
  try {
    const { identifier } = req.params;
    let item;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      item = await Item.findById(identifier).populate('category', 'name').populate('subCategory', 'name');
    }
    
    if (!item) {
      item = await Item.findOne({ name: identifier }).populate('category', 'name').populate('subCategory', 'name');
    }

    if (!item) {
      return res.status(404).send({ message: 'Item not found' });
    }
    
    res.status(200).send(item);
  } catch (error) {
    res.status(500).send({ message: "Error fetching item", error: error.message });
  }
};

// EDIT Item
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Manually fetch, update, and save to trigger the pre-save hook
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).send({ message: 'Item not found' });
    }

    // Update fields from req.body
    Object.assign(item, req.body);
    
    // The pre-save hook will recalculate totalAmount if baseAmount or discount changes
    await item.save(); 
    
    res.status(200).send(item);
  } catch (error) {
    res.status(400).send({ message: "Error updating item", error: error.message });
  }
};


// SEARCH Item by Name
exports.searchItemsByName = async (req, res) => {
  try {
    const { name } = req.query; // Search query from query parameter ?name=...

    if (!name) {
      return res.status(400).send({ message: 'Search query "name" is required' });
    }

    const items = await Item.find({
      name: { $regex: name, $options: 'i' } // 'i' for case-insensitive
    })
    .populate('category', 'name')
    .populate('subCategory', 'name');
    
    res.status(200).send(items);
  } catch (error) {
    res.status(500).send({ message: "Error searching items", error: error.message });
  }
};