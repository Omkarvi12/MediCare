const express = require("express");

const router = express.Router();

const {
  addToCart,
  getCart,
  updateCart,
  removeFromCart
} = require("../controllers/cartController");

const protect = require("../middleware/auth");

// ==========================
// Add Product To Cart
// ==========================

router.post(
  "/",
  protect,
  addToCart
);


// ==========================
// Get User Cart
// ==========================

router.get(
  "/",
  protect,
  getCart
);


// ==========================
// Update Cart Quantity
// ==========================

router.put(
  "/:id",
  protect,
  updateCart
);


// ==========================
// Remove Product From Cart
// ==========================

router.delete(
  "/:id",
  protect,
  removeFromCart
);


module.exports = router;