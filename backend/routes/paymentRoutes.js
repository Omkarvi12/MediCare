const express = require("express");

const router = express.Router();

const {
    createPaymentOrder,
    verifyPayment
} = require("../controllers/paymentController");

const protect = require("../middleware/auth");

// ==========================
// Create Payment Order
// ==========================

router.post(
    "/create-order",
    protect,
    createPaymentOrder
);

// ==========================
// Verify Payment
// ==========================

router.post(
    "/verify",
    protect,
    verifyPayment
);

module.exports = router;