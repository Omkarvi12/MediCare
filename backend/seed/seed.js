const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDB = require("../config/db");
const Product = require("../models/Product");
const products = require("../data/products");

// Load .env
dotenv.config();

// Connect Database
connectDB();

const importData = async () => {
  try {

    // Delete Old Products
    await Product.deleteMany();

    // Insert New Products
    await Product.insertMany(products);

    console.log("✅ Products Imported Successfully");

    process.exit();

  } catch (error) {

    console.error("❌ Error:", error);

    process.exit(1);

  }
};

importData();