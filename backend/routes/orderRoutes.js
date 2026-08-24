const express = require("express");

const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getSingleOrder,
    cancelOrder,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

const protect = require("../middleware/auth");
const admin = require("../middleware/admin");


// ==========================
// ADMIN - Get All Orders
// ==========================

router.get(
    "/admin/all",
    protect,
    admin,
    getAllOrders
);


// ==========================
// ADMIN - Update Order Status
// ==========================

router.put(
    "/admin/:id/status",
    protect,
    admin,
    updateOrderStatus
);


// ==========================
// USER - Create Order
// ==========================

router.post(
    "/",
    protect,
    createOrder
);


// ==========================
// USER - Get My Orders
// ==========================

router.get(
    "/",
    protect,
    getMyOrders
);


// ==========================
// USER - Cancel Order
// ==========================

router.put(
    "/:id/cancel",
    protect,
    cancelOrder
);


// ==========================
// USER - Get Single Order
// ==========================

router.get(
    "/:id",
    protect,
    getSingleOrder
);


module.exports = router;