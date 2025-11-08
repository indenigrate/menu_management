const SubCategory = require('../models/SubCategory');
const { getCategoryById } = require('./categoryCont'); // Import helper

// CREATE SubCategory
exports.createSubCategory = async (req, res) => {
  try {
    const { categoryId } = req.body; // We expect categoryId in the body
    
    const parentCategory = await getCategoryById(categoryId);
    if (!parentCategory) {
      return res.status(404).send({ message: 'Parent category not found' });
    }

    const subCategoryData = {
      ...req.body,
      category: categoryId,
      // Set defaults from parent category if not provided
      taxApplicability: req.body.taxApplicability !== undefined ? req.body.taxApplicability : parentCategory.taxApplicability,
      tax: req.body.tax !== undefined ? req.body.tax : parentCategory.tax,
    };

    const subCategory = new SubCategory(subCategoryData);
    await subCategory.save();
    res.status(201).send(subCategory);
  } catch (error) {
    res.status(400).send({ message: "Error creating sub-category", error: error.message });
  }
};

// GET All SubCategories
exports.getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({}).populate('category', 'name'); // Show category name
    res.status(200).send(subCategories);
  } catch (error) {
    res.status(500).send({ message: "Error fetching sub-categories", error: error.message });
  }
};

// GET All SubCategories under a specific Category
exports.getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subCategories = await SubCategory.find({ category: categoryId });
    
    if (!subCategories) {
      return res.status(404).send({ message: 'No sub-categories found for this category' });
    }
    
    res.status(200).send(subCategories);
  } catch (error) {
    res.status(500).send({ message: "Error fetching sub-categories", error: error.message });
  }
};

// GET SubCategory by ID or Name
exports.getSubCategory = async (req, res) => {
  try {
    const { identifier } = req.params;
    let subCategory;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      subCategory = await SubCategory.findById(identifier).populate('category', 'name');
    }
    
    if (!subCategory) {
      subCategory = await SubCategory.findOne({ name: identifier }).populate('category', 'name');
    }

    if (!subCategory) {
      return res.status(404).send({ message: 'Sub-category not found' });
    }
    
    res.status(200).send(subCategory);
  } catch (error) {
    res.status(500).send({ message: "Error fetching sub-category", error: error.message });
  }
};

// EDIT SubCategory
exports.updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategory.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    
    if (!subCategory) {
      return res.status(404).send({ message: 'Sub-category not found' });
    }
    
    res.status(200).send(subCategory);
  } catch (error) {
    res.status(400).send({ message: "Error updating sub-category", error: error.message });
  }
};