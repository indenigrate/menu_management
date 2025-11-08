const request = require('supertest');
const app = require('../src/app'); // Import your express app
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load models
const Category = require('../src/models/Category');
const SubCategory = require('../src/models/SubCategory');
const Item = require('../src/models/Item');

// Load env vars
dotenv.config({ path: './.env' });

let server;
let categoryId;
let subCategoryId;
let itemId;

// Connect to the database before all tests
beforeAll(async () => {
  // Use a separate test database or ensure the main one is clean
  // For simplicity, we'll use the main DB URI from .env
  // In a real-world app, you'd use a dedicated TEST_MONGO_URI
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI not found in .env file');
  }

  await mongoose.connect(mongoUri);

  // Start the server on a random port for testing
  server = app.listen(0);
});

// Clear the database before each test
beforeEach(async () => {
  await Item.deleteMany();
  await SubCategory.deleteMany();
  await Category.deleteMany();
});

// Close the database connection and server after all tests
afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
});

describe('Menu Management API', () => {

  // --- Category Tests ---
  describe('Categories', () => {
    it('should CREATE a new category', async () => {
      const res = await request(server)
        .post('/api/categories')
        .send({
          name: 'Desserts',
          image: 'http://example.com/desserts.jpg',
          description: 'Sweet treats',
          taxApplicability: true,
          tax: 12,
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('name', 'Desserts');
      categoryId = res.body._id; // Save for later tests
    });

    it('should GET all categories', async () => {
      await request(server).post('/api/categories').send({ name: 'Appetizers', image: 'img.jpg', description: 'starters' });
      
      const res = await request(server).get('/api/categories');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty('name', 'Appetizers');
    });

    it('should GET a category by ID', async () => {
      const category = await Category.create({ name: 'Drinks', image: 'img.jpg', description: 'drinks' });
      
      const res = await request(server).get(`/api/categories/${category._id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', 'Drinks');
    });

    it('should UPDATE a category', async () => {
      const category = await Category.create({ name: 'Salads', image: 'img.jpg', description: 'fresh greens' });

      const res = await request(server)
        .patch(`/api/categories/${category._id}`)
        .send({ description: 'Updated description' });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('description', 'Updated description');
    });
  });

  // --- SubCategory Tests ---
  describe('SubCategories', () => {
    it('should CREATE a new subcategory', async () => {
      const category = await Category.create({ name: 'Beverages', image: 'img.jpg', description: 'drinks', tax: 5, taxApplicability: true });

      const res = await request(server)
        .post('/api/subcategories')
        .send({
          name: 'Cold Drinks',
          image: 'http://example.com/cold.jpg',
          description: 'Chilled beverages',
          categoryId: category._id,
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('name', 'Cold Drinks');
      expect(res.body).toHaveProperty('tax', 5); // Inherited tax
      subCategoryId = res.body._id; // Save for later
    });

    it('should GET all subcategories for a category', async () => {
      const category = await Category.create({ name: 'Beverages', image: 'img.jpg', description: 'drinks' });
      await SubCategory.create({ name: 'Hot', image: 'img.jpg', description: 'hot', category: category._id });

      const res = await request(server).get(`/api/subcategories/by-category/${category._id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty('name', 'Hot');
    });
  });

  // --- Item Tests ---
  describe('Items', () => {
    let testCategory;
    let testSubCategory;

    // This block now also runs before each 'Item' test
    beforeEach(async () => {
      // Create common test data for items
      testCategory = await Category.create({ name: 'Pizzas', image: 'img.jpg', description: 'pizza' });
      testSubCategory = await SubCategory.create({ name: 'Veg', image: 'img.jpg', description: 'veg', category: testCategory._id });
    });

    it('should CREATE a new item and calculate totalAmount', async () => {
      const res = await request(server)
        .post('/api/items')
        .send({
          name: 'Margherita',
          image: 'http://example.com/margherita.jpg',
          description: 'Classic cheese pizza',
          baseAmount: 300,
          discount: 50,
          categoryId: testCategory._id,
          subCategoryId: testSubCategory._id,
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('name', 'Margherita');
      expect(res.body).toHaveProperty('totalAmount', 250); // 300 - 50
      itemId = res.body._id; // Save for later
    });

    it('should GET all items by subcategory', async () => {
      // **FIXED:** Changed 'categoryId' to 'category'
      await Item.create({ name: 'Corn Pizza', image: 'img.jpg', description: 'corn', baseAmount: 200, category: testCategory._id, subCategory: testSubCategory._id });

      const res = await request(server).get(`/api/items/by-subcategory/${testSubCategory._id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty('name', 'Corn Pizza');
    });

    it('should UPDATE an item and recalculate totalAmount', async () => {
      // **FIXED:** Changed 'categoryId' to 'category'
      const item = await Item.create({ name: 'Farmhouse', image: 'img.jpg', description: 'veg', baseAmount: 400, discount: 50, category: testCategory._id });

      const res = await request(server)
        .patch(`/api/items/${item._id}`)
        .send({ baseAmount: 450, discount: 100 });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('totalAmount', 350); // 450 - 100
    });

    it('should SEARCH for items by name', async () => {
      // **FIXED:** Changed 'categoryId' to 'category' in all three lines
      await Item.create({ name: 'Pepperoni Pizza', image: 'img.jpg', description: 'pep', baseAmount: 500, category: testCategory._id });
      await Item.create({ name: 'Double Pepperoni', image: 'img.jpg', description: 'pep', baseAmount: 600, category: testCategory._id });
      await Item.create({ name: 'Cheese Burst', image: 'img.jpg', description: 'cheese', baseAmount: 400, category: testCategory._id });

      const res = await request(server).get('/api/items/search?name=Pepp');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('name', 'Pepperoni Pizza');
      expect(res.body[1]).toHaveProperty('name', 'Double Pepperoni');
    });
  });
});