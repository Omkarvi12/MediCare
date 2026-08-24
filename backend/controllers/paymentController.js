const crypto = require("crypto");

const Cart = require("../models/Cart");
const { getRazorpay } = require("../config/razorpay");


// ======================================================
// CREATE RAZORPAY ORDER
// ======================================================

const createPaymentOrder = async (req, res) => {

    try {

        console.log(
            "================================"
        );

        console.log(
            "CREATE RAZORPAY ORDER"
        );

        console.log(
            "User:",
            req.user?.id
        );


        // ==========================
        // Razorpay Instance
        // ==========================

        const razorpay =
            getRazorpay();


        // ==========================
        // Get User Cart
        // ==========================

        const cart =
            await Cart.find({
                user: req.user.id
            }).populate("product");


        // ==========================
        // Check Empty Cart
        // ==========================

        if (
            !cart ||
            cart.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Your cart is empty"

            });

        }


        // ==========================
        // Validate Products
        // ==========================

        for (
            const item of cart
        ) {

            if (!item.product) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Product no longer exists"

                });

            }


            if (
                !item.product.isAvailable
            ) {

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
        // Calculate Subtotal
        // ==========================

        const subtotal =
            cart.reduce(
                (total, item) => {

                    return (
                        total +
                        (
                            item.quantity *
                            item.product.price
                        )
                    );

                },
                0
            );


        // ==========================
        // GST 5%
        // ==========================

        const gst =
            Number(
                (
                    subtotal * 0.05
                ).toFixed(2)
            );


        // ==========================
        // Delivery Charge
        // ==========================

        const deliveryCharge =
            subtotal >= 500
                ? 0
                : 40;


        // ==========================
        // Final Amount
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
        // Convert To Paise
        // ==========================

        const amountInPaise =
            Math.round(
                totalAmount * 100
            );


        console.log(
            "Subtotal:",
            subtotal
        );

        console.log(
            "GST:",
            gst
        );

        console.log(
            "Delivery:",
            deliveryCharge
        );

        console.log(
            "Total:",
            totalAmount
        );

        console.log(
            "Razorpay Amount:",
            amountInPaise
        );


        // ==========================
        // Create Razorpay Order
        // ==========================

        const razorpayOrder =
            await razorpay.orders.create({

                amount:
                    amountInPaise,

                currency:
                    "INR",

                receipt:
                    `medicare_${Date.now()}`,

                notes: {

                    userId:
                        String(req.user.id),

                    source:
                        "MediCare"

                }

            });


        console.log(
            "Razorpay Order Created:",
            razorpayOrder.id
        );


        console.log(
            "================================"
        );


        // ==========================
        // Response
        // ==========================

        return res.status(200).json({

            success: true,

            order:
                razorpayOrder,

            amount:
                totalAmount,

            subtotal,

            gst,

            deliveryCharge

        });


    } catch (error) {

        console.error(
            "================================"
        );

        console.error(
            "CREATE PAYMENT ORDER ERROR"
        );

        console.error(
            "Status:",
            error.statusCode
        );

        console.error(
            "Code:",
            error.error?.code
        );

        console.error(
            "Description:",
            error.error?.description
        );

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "================================"
        );


        // ==========================
        // Razorpay Authentication Error
        // ==========================

        if (
            error.statusCode === 401
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Razorpay authentication failed. Please check Razorpay API Key ID and Secret."

            });

        }


        return res.status(500).json({

            success: false,

            message:
                error.error?.description ||
                error.message ||
                "Unable to create Razorpay order"

        });

    }

};


// ======================================================
// VERIFY RAZORPAY PAYMENT
// ======================================================

const verifyPayment = async (
    req,
    res
) => {

    try {

        const {

            razorpay_order_id,

            razorpay_payment_id,

            razorpay_signature

        } = req.body;


        // ==========================
        // Validate Fields
        // ==========================

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment verification details are missing"

            });

        }


        // ==========================
        // Get Secret
        // ==========================

        const keySecret =
            process.env
                .RAZORPAY_KEY_SECRET
                ?.trim();


        if (!keySecret) {

            return res.status(500).json({

                success: false,

                message:
                    "Razorpay secret key is missing"

            });

        }


        // ==========================
        // Signature Body
        // ==========================

        const body =
            razorpay_order_id +
            "|" +
            razorpay_payment_id;


        // ==========================
        // Generate Signature
        // ==========================

        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    keySecret
                )
                .update(body)
                .digest("hex");


        // ==========================
        // Compare Signature
        // ==========================

        const receivedSignature =
            String(razorpay_signature);

        const isValid =
            receivedSignature.length ===
            expectedSignature.length &&
            crypto.timingSafeEqual(
                Buffer.from(expectedSignature),
                Buffer.from(receivedSignature)
            );


        if (!isValid) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment verification failed"

            });

        }


        // ==========================
        // Payment Verified
        // ==========================

        console.log(
            "Razorpay Payment Verified:",
            razorpay_payment_id
        );


        return res.status(200).json({

            success: true,

            message:
                "Payment verified successfully",

            paymentId:
                razorpay_payment_id,

            orderId:
                razorpay_order_id

        });


    } catch (error) {

        console.error(
            "Payment Verification Error:",
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

    createPaymentOrder,

    verifyPayment

};
