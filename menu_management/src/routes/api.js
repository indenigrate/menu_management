const express = require('express');
const router = express.Router();

// Import controllers
const catogryCont = require('../controllers/categoryCont');
const subcatogryCont = require('../controllers/subCategoryCont');
const itemController = require('../controllers/itemCont');

// === Category Routes ===
router.post('/categories', catogryCont.createCategory);
router.get('/categories', catogryCont.getAllCategories);
router.get('/categories/:identifier', catogryCont.getCategory); // by ID or Name
router.patch('/categories/:id', catogryCont.updateCategory);

// === SubCategory Routes ===
router.post('/subcategories', subcatogryCont.createSubCategory);
router.get('/subcategories', subcatogryCont.getAllSubCategories);
router.get('/subcategories/:identifier', subcatogryCont.getSubCategory); // by ID or Name
router.get('/subcategories/by-category/:categoryId', subcatogryCont.getSubCategoriesByCategory);
router.patch('/subcategories/:id', subcatogryCont.updateSubCategory);

// === Item Routes ===
router.post('/items', itemController.createItem);
router.get('/items', itemController.getAllItems);
router.get('/items/by-category/:categoryId', itemController.getItemsByCategory);
router.get('/items/by-subcategory/:subCategoryId', itemController.getItemsBySubCategory);
router.get('/items/search', itemController.searchItemsByName); // GET /api/items/search?name=Pizza
router.get('/items/:identifier', itemController.getItem); // by ID or Name
router.patch('/items/:id', itemController.updateItem);

module.exports = router;