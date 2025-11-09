# 🍽️ Menu Management Backend API

This is a **Node.js + Express** backend server for managing a restaurant's menu, built as part of an internship assignment.  
It uses **MongoDB** (via **Mongoose**) as the database.

The API supports a three-level menu structure:

1. **Category** (e.g., “Pizzas”, “Beverages”)  
2. **Sub-Category** (e.g., “Veg Pizzas”, “Hot Coffees”)  
3. **Item** (e.g., “Margherita Pizza”, “Cappuccino”)

---

## 🚀 Features

- Full CRUD operations (Create, Read, Update) for Categories, Sub-Categories, and Items.  
- Inheritance of tax details from Category to Sub-Category.  
- Automatic calculation of `totalAmount` for Items (`baseAmount - discount`).  
- Search API to find items by name.  
- Structured routing, controllers, and models.  
- Database seeding script for test data.  
- Automated API tests using Jest and Supertest.  

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (with Mongoose ODM)  
- **Testing:** Jest, Supertest  
- **Environment:** dotenv, cors  

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)  
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally)  
  **OR**  
- [Docker](https://www.docker.com/) (to run MongoDB in a container)  

---

## 📦 Setup & Installation

### 1. Clone the Repository

```bash
git clone <your-github-repo-url>
cd menu-management-api
```
### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project and add the following variables:

```env
PORT=5000

# Your MongoDB connection string
# Option 1: Local MongoDB instance
MONGO_URI=mongodb://127.0.0.1:27017/menuDB

# Option 2: MongoDB Atlas (replace with your credentials)
# MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/menuDB?retryWrites=true&w=majority
```

### 4. (Optional) Run MongoDB with Docker

If you don't have MongoDB installed locally, run it using Docker:

```bash
# This command pulls the 'mongo' image and starts a container named 'my-mongo'
# It also creates a persistent volume 'mongo-data' so your data isn't lost
docker run --name my-mongo -p 27017:27017 -v mongo-data:/data/db -d mongo
```

Your local connection string `mongodb://127.0.0.1:27017/menuDB` will now work.

---

## 🏃‍♂️ How to Run

### Development Mode (with auto-reload)

```bash
npm run dev
```

The server will start on [http://localhost:5000](http://localhost:5000).

### Production Mode

```bash
npm start
```

---

## 🌱 Seeding the Database

To populate your database with sample test data:

```bash
npm run seed
```

> ⚠️ **Warning:** This will delete all existing data in the database.

You should see console logs confirming the creation of categories, sub-categories, and items.

---

## 🧪 Running Tests

This project uses **Jest** and **Supertest** for automated API testing.
The tests will run against the database specified in your `.env` file.

> 🧹 The test suite cleans the database *before each test* to ensure a fresh state.

```bash
npm run test
```

You will see a detailed test report in your console.

---

## 📬 API Endpoints (Quick Reference)

All endpoints are prefixed with `/api`.

| Endpoint                                 | Method  | Description                                    |
| ---------------------------------------- | ------- | ---------------------------------------------- |
| `/categories`                            | `POST`  | Create a new category                          |
| `/categories`                            | `GET`   | Get all categories                             |
| `/categories/:identifier`                | `GET`   | Get a category by its ID or name               |
| `/categories/:id`                        | `PATCH` | Update a category                              |
| `/subcategories`                         | `POST`  | Create a new sub-category                      |
| `/subcategories`                         | `GET`   | Get all sub-categories                         |
| `/subcategories/:identifier`             | `GET`   | Get a sub-category by its ID or name           |
| `/subcategories/by-category/:categoryId` | `GET`   | Get all sub-categories for a specific category |
| `/subcategories/:id`                     | `PATCH` | Update a sub-category                          |
| `/items`                                 | `POST`  | Create a new item                              |
| `/items`                                 | `GET`   | Get all items                                  |
| `/items/by-category/:categoryId`         | `GET`   | Get all items for a specific category          |
| `/items/by-subcategory/:subCategoryId`   | `GET`   | Get all items for a specific sub-category      |
| `/items/search?name=Pizza`               | `GET`   | Search items by name                           |
| `/items/:identifier`                     | `GET`   | Get an item by its ID or name                  |
| `/items/:id`                             | `PATCH` | Update an item                                 |

---

## 🧾 License

This project is licensed under the **MIT License**.

---
