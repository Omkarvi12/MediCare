const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { getRazorpay } = require("../config/razorpay");


// ======================================================
// CREATE ORDER
// ======================================================

const createOrder = async (req, res) => {

    try {

        const {
            name,
            phone,
            address,
            paymentMethod = "COD",
            razorpayOrderId = "",
            razorpayPaymentId = ""
        } = req.body;


        // ==========================
        // Validate Delivery Details
        // ==========================

        if (
            !name?.trim() ||
            !phone?.trim() ||
            !address?.trim()
        ) {

            return res.status(400).json({
                success: false,
                message: "Please fill all delivery details"
            });

        }


        // ==========================
        // Validate Payment Method
        // ==========================

        if (
            !["COD", "ONLINE"].includes(paymentMethod)
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid payment method"
            });

        }


        // ==========================
        // Validate Online Payment
        // ==========================

        if (paymentMethod === "ONLINE") {

            if (
                !razorpayOrderId ||
                !razorpayPaymentId
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Online payment details are required"
                });

            }

        }


        // ==========================
        // Get User Cart
        // ==========================

        const cart = await Cart.find({
            user: req.user.id
        }).populate("product");


        // ==========================
        // Empty Cart
        // ==========================

        if (!cart || cart.length === 0) {

            return res.status(400).json({
                success: false,
                message: "Your cart is empty"
            });

        }


        // ==========================
        // Validate Products & Stock
        // ==========================

        for (const item of cart) {

            if (!item.product) {

                return res.status(400).json({
                    success: false,
                    message: "Product no longer exists"
                });

            }


            if (!item.product.isAvailable) {

                return res.status(400).json({
                    success: false,
                    message:
                        `${item.product.name} is unavailable`
                });

            }


            if (
                item.quantity >
                item.product.stock
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Not enough stock for ${item.product.name}`
                });

            }

        }


        // ==========================
        // Create Order Items
        // ==========================

        const orderItems = cart.map((item) => ({

            product:
                item.product._id,

            name:
                item.product.name,

            price:
                item.product.price,

            quantity:
                item.quantity,

            totalPrice:
                item.quantity *
                item.product.price,

            image:
                item.product.image || ""

        }));


        // ==========================
        // Calculate Subtotal
        // ==========================

        const subtotal = orderItems.reduce(
            (total, item) =>
                total + item.totalPrice,
            0
        );


        // ==========================
        // GST 5%
        // ==========================

        const gst =
            Number(
                (subtotal * 0.05).toFixed(2)
            );


        // ==========================
        // Delivery Charge
        // ==========================

        const deliveryCharge =
            subtotal >= 500
                ? 0
                : 40;


        // ==========================
        // Final Total
        // ==========================

        const totalAmount =
            Number(
                (
                    subtotal +
                    gst +
                    deliveryCharge
                ).toFixed(2)
            );


        // ==========================
        // Confirm Online Payment
        // ==========================

        if (paymentMethod === "ONLINE") {

            const existingOrder =
                await Order.findOne({
                    razorpayPaymentId,
                    paymentMethod: "ONLINE"
                });

            if (existingOrder) {

                return res.status(409).json({
                    success: false,
                    message:
                        "This payment has already been used for an order"
                });

            }

            const razorpay = getRazorpay();

            const [razorpayOrder, payment] =
                await Promise.all([
                    razorpay.orders.fetch(
                        razorpayOrderId
                    ),
                    razorpay.payments.fetch(
                        razorpayPaymentId
                    )
                ]);

            const expectedAmount =
                Math.round(totalAmount * 100);

            const belongsToUser =
                razorpayOrder.notes?.userId ===
                String(req.user.id);

            const isMatchingPayment =
                payment.order_id === razorpayOrderId &&
                payment.amount === expectedAmount &&
                payment.currency === "INR" &&
                belongsToUser;

            if (!isMatchingPayment) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Payment details do not match this order"
                });

            }

            if (payment.status === "authorized") {

                await razorpay.payments.capture(
                    razorpayPaymentId,
                    expectedAmount,
                    "INR"
                );

            } else if (payment.status !== "captured") {

                return res.status(400).json({
                    success: false,
                    message:
                        "Payment has not been completed"
                });

            }

        }


        // ==========================
        // Payment Status
        // ==========================

        const paymentStatus =
            paymentMethod === "ONLINE"
                ? "Paid"
                : "Pending";


        // ==========================
        // Create Order
        // ==========================

        const order = await Order.create({

            user:
                req.user.id,

            items:
                orderItems,

            shippingAddress: {

                name:
                    name.trim(),

                phone:
                    phone.trim(),

                address:
                    address.trim()

            },

            subtotal,

            gst,

            deliveryCharge,

            totalAmount,

            paymentMethod,

            paymentStatus,

            razorpayOrderId:
                paymentMethod === "ONLINE"
                    ? razorpayOrderId
                    : "",

            razorpayPaymentId:
                paymentMethod === "ONLINE"
                    ? razorpayPaymentId
                    : "",

            orderStatus:
                "Placed"

        });


        // ==========================
        // Reduce Product Stock
        // ==========================

        for (const item of cart) {

            await Product.findByIdAndUpdate(
                item.product._id,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );

        }


        // ==========================
        // Clear User Cart
        // ==========================

        await Cart.deleteMany({
            user: req.user.id
        });


        // ==========================
        // Response
        // ==========================

        return res.status(201).json({

            success: true,

            message:
                "Order Placed Successfully",

            order

        });

    } catch (error) {

        console.error(
            "Create Order Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ======================================================
// GET MY ORDERS
// ======================================================

const getMyOrders = async (req, res) => {

    try {

        const orders =
            await Order.find({
                user: req.user.id
            })
            .populate("items.product")
            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            success: true,

            totalOrders:
                orders.length,

            orders

        });

    } catch (error) {

        console.error(
            "Get My Orders Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ======================================================
// GET SINGLE ORDER
// ======================================================

const getSingleOrder = async (req, res) => {

    try {

        const order =
            await Order.findOne({

                _id:
                    req.params.id,

                user:
                    req.user.id

            })
            .populate("items.product");


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order Not Found"

            });

        }


        return res.status(200).json({

            success: true,

            order

        });

    } catch (error) {

        console.error(
            "Get Single Order Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ======================================================
// CANCEL ORDER - USER
// ======================================================

const cancelOrder = async (req, res) => {

    try {

        const order =
            await Order.findOne({

                _id:
                    req.params.id,

                user:
                    req.user.id

            });


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order Not Found"

            });

        }


        // ==========================
        // Only Placed Orders
        // ==========================

        if (
            order.orderStatus !==
            "Placed"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Only placed orders can be cancelled"

            });

        }


        // ==========================
        // Restore Stock
        // ==========================

        for (
            const item
            of order.items
        ) {

            await Product.findByIdAndUpdate(

                item.product,

                {
                    $inc: {
                        stock:
                            item.quantity
                    }
                }

            );

        }


        // ==========================
        // Update Order
        // ==========================

        order.orderStatus =
            "Cancelled";


        // ==========================
        // COD
        // ==========================

        // COD cancellation:
        // Payment remains Pending.


        // ==========================
        // ONLINE
        // ==========================

        // Online payment refund should
        // be handled through Razorpay
        // Refund API separately.


        await order.save();


        return res.status(200).json({

            success: true,

            message:
                "Order Cancelled Successfully",

            order

        });

    } catch (error) {

        console.error(
            "Cancel Order Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ======================================================
// ADMIN - GET ALL ORDERS
// ======================================================

const getAllOrders = async (req, res) => {

    try {

        const orders =
            await Order.find()
            .populate(
                "user",
                "name email phone"
            )
            .populate(
                "items.product"
            )
            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            success: true,

            totalOrders:
                orders.length,

            orders

        });

    } catch (error) {

        console.error(
            "Get All Orders Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ======================================================
// ADMIN - UPDATE ORDER STATUS
// ======================================================

const updateOrderStatus = async (req, res) => {

    try {

        const {
            orderStatus
        } = req.body;


        const allowedStatuses = [

            "Placed",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"

        ];


        // ==========================
        // Validate Status
        // ==========================

        if (!orderStatus) {

            return res.status(400).json({

                success: false,

                message:
                    "Order status is required"

            });

        }


        if (
            !allowedStatuses.includes(
                orderStatus
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid order status"

            });

        }


        // ==========================
        // Find Order
        // ==========================

        const order =
            await Order.findById(
                req.params.id
            );


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order Not Found"

            });

        }


        // ==========================
        // Already Cancelled
        // ==========================

        if (
            order.orderStatus ===
            "Cancelled"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Cancelled order cannot be updated"

            });

        }


        // ==========================
        // Admin Cancellation
        // ==========================

        if (
            orderStatus ===
            "Cancelled"
        ) {

            for (
                const item
                of order.items
            ) {

                await Product.findByIdAndUpdate(

                    item.product,

                    {
                        $inc: {
                            stock:
                                item.quantity
                        }
                    }

                );

            }

        }


        // ==========================
        // Update Status
        // ==========================

        order.orderStatus =
            orderStatus;


        // ==========================
        // COD Delivered = Paid
        // ==========================

        if (

            orderStatus ===
            "Delivered" &&

            order.paymentMethod ===
            "COD"

        ) {

            order.paymentStatus =
                "Paid";

        }


        await order.save();


        return res.status(200).json({

            success: true,

            message:
                "Order Status Updated Successfully",

            order

        });

    } catch (error) {

        console.error(
            "Update Order Status Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    createOrder,

    getMyOrders,

    getSingleOrder,

    cancelOrder,

    getAllOrders,

    updateOrderStatus

};
