const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ==========================
// Add Product To Cart
// ==========================
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check quantity
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1"
      });
    }

    // Check Product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found"
      });
    }

    // Check Stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock available"
      });
    }

    // Check Existing Cart Item
    let cartItem = await Cart.findOne({
      user: req.user.id,
      product: productId
    });

    if (cartItem) {

      const newQuantity =
        cartItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: "Requested quantity exceeds available stock"
        });
      }

      cartItem.quantity = newQuantity;

      cartItem.totalPrice =
        newQuantity * product.price;

      await cartItem.save();

      return res.status(200).json({
        success: true,
        message: "Cart Updated Successfully",
        cartItem
      });
    }

    // Create New Cart Item
    cartItem = await Cart.create({
      user: req.user.id,
      product: productId,
      quantity,
      totalPrice: quantity * product.price
    });

    res.status(201).json({
      success: true,
      message: "Product Added To Cart",
      cartItem
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// ==========================
// Get User Cart
// ==========================
const getCart = async (req, res) => {
  try {

    const cart = await Cart.find({
      user: req.user.id
    }).populate("product");

    res.status(200).json({
      success: true,
      totalItems: cart.length,
      cart
    });

  } catch (error) {

    console.error("Cart Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// ==========================
// Update Cart Quantity
// ==========================
const updateCart = async (req, res) => {
  try {

    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1"
      });
    }

    // Find Cart Item
    const cartItem = await Cart.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate("product");

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart Item Not Found"
      });
    }

    // Check Stock
    if (quantity > cartItem.product.stock) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock"
      });
    }

    // Update Quantity
    cartItem.quantity = quantity;

    // Update Total Price
    cartItem.totalPrice =
      quantity * cartItem.product.price;

    await cartItem.save();

    res.status(200).json({
      success: true,
      message: "Cart Quantity Updated",
      cartItem
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// ==========================
// Remove Product From Cart
// ==========================
const removeFromCart = async (req, res) => {
  try {

    const cartItem =
      await Cart.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id
      });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart Item Not Found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product Removed From Cart"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


module.exports = {
  addToCart,
  getCart,
  updateCart,
  removeFromCart
};