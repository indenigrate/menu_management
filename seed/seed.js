const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../src/config/db');

// Load models
const Category = require('../src/models/Category');
const SubCategory = require('../src/models/SubCategory');
const Item = require('../src/models/Item');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to DB
connectDB();

const seedData = async () => {
  try {
    // Clear existing data
    console.log('Clearing data...');
    await Item.deleteMany();
    await SubCategory.deleteMany();
    await Category.deleteMany();

    console.log('Data cleared.');

    // --- Create Categories ---
    const category1 = await Category.create({
      name: 'Beverages',
      image: 'http://example.com/beverages.jpg',
      description: 'Refreshing drinks',
      taxApplicability: true,
      tax: 5,
      taxType: 'Percentage',
    });

    const category2 = await Category.create({
      name: 'Main Courses',
      image: 'http://example.com/mains.jpg',
      description: 'Hearty main dishes',
      taxApplicability: true,
      tax: 18,
      taxType: 'Percentage',
    });

    console.log('Categories created.');

    // --- Create SubCategories ---
    const subCategory1 = await SubCategory.create({
      name: 'Hot Coffees',
      image: 'http://example.com/coffee.jpg',
      description: 'Warm and comforting',
      category: category1._id,
      taxApplicability: category1.taxApplicability, // Inherited
      tax: category1.tax, // Inherited
    });

    const subCategory2 = await SubCategory.create({
      name: 'Pastas',
      image: 'http://example.com/pasta.jpg',
      description: 'Italian pasta dishes',
      category: category2._id,
      taxApplicability: category2.taxApplicability, // Inherited
      tax: category2.tax, // Inherited
    });

    console.log('SubCategories created.');

    // --- Create Items ---
    await Item.create({
      name: 'Cappuccino',
      image: 'http://example.com/cappuccino.jpg',
      description: 'Espresso with steamed milk foam',
      baseAmount: 150,
      discount: 10,
      // totalAmount will be 140
      category: category1._id,
      subCategory: subCategory1._id,
      taxApplicability: true,
      tax: 5,
    });

    await Item.create({
      name: 'Iced Latte',
      image: 'http://example.com/icedlatte.jpg',
      description: 'Chilled espresso with milk',
      baseAmount: 180,
      discount: 0,
      // totalAmount will be 180
      category: category1._id,
      taxApplicability: true,
      tax: 5,
    });

    await Item.create({
      name: 'Spaghetti Carbonara',
      image: 'http://example.com/carbonara.jpg',
      description: 'Classic pasta with eggs, cheese, and bacon',
      baseAmount: 450,
      discount: 50,
      // totalAmount will be 400
      category: category2._id,
      subCategory: subCategory2._id,
      taxApplicability: true,
      tax: 18,
    });

    await Item.create({
      name: 'Grilled Salmon',
      image: 'http://example.com/salmon.jpg',
      description: 'Served with vegetables',
      baseAmount: 650,
      discount: 0,
      // totalAmount will be 650
      category: category2._id,
      // No sub-category, directly under 'Main Courses'
      taxApplicability: true,
      tax: 18,
    });

    console.log('Items created.');
    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();