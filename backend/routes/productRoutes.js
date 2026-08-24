const express = require("express");

const router = express.Router();


// ==========================
// Controllers
// ==========================

const {
    addProduct,
    getProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    searchProducts
} = require("../controllers/productController");


// ==========================
// Middleware
// ==========================

const protect = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");


// ==========================
// PUBLIC - Search Products
// ==========================

router.get(
    "/search",
    searchProducts
);


// ==========================
// PUBLIC - Get All Products
// ==========================

router.get(
    "/",
    getProducts
);


// ==========================
// PUBLIC - Get Single Product
// ==========================

router.get(
    "/:id",
    getSingleProduct
);


// ==========================
// ADMIN - Add Product
// Image → Multer → Controller → Cloudinary
// ==========================

router.post(
    "/",
    protect,
    admin,
    upload.single("image"),
    addProduct
);


// ==========================
// ADMIN - Update Product
// Image → Multer → Controller → Cloudinary
// ==========================

router.put(
    "/:id",
    protect,
    admin,
    upload.single("image"),
    updateProduct
);


// ==========================
// ADMIN - Delete Product
// ==========================

router.delete(
    "/:id",
    protect,
    admin,
    deleteProduct
);


module.exports = router;