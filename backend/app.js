const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

// ==========================
// Load Environment Variables
// ==========================

dotenv.config();


// ==========================
// Database
// ==========================

const connectDB = require("./config/db");


// ==========================
// Routes
// ==========================

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");


// ==========================
// Connect MongoDB
// ==========================

connectDB();


// ==========================
// Create Express App
// ==========================

const app = express();


// ==========================
// CORS
// ==========================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);


// ==========================
// Middlewares
// ==========================

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));


// ==========================
// Static Uploads
// ==========================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);


// ==========================
// API Routes
// ==========================

// Authentication
app.use("/api/auth", authRoutes);

// Products
app.use("/api/products", productRoutes);

// Cart
app.use("/api/cart", cartRoutes);

// Orders
app.use("/api/orders", orderRoutes);

// Users - Admin
app.use("/api/users", userRoutes);

// Payments
app.use("/api/payment", paymentRoutes);


// ==========================
// Home Route
// ==========================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 MediCare Backend Running Successfully..."
  });
});


// ==========================
// 404 Route
// ==========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found"
  });
});


// ==========================
// Start Server
// ==========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server Running on http://localhost:${PORT}`
  );
});