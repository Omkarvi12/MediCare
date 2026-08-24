const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // ==========================
    // USER
    // ==========================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },


    // ==========================
    // ORDER ITEMS
    // ==========================

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },

        name: {
          type: String,
          required: true
        },

        price: {
          type: Number,
          required: true
        },

        quantity: {
          type: Number,
          required: true,
          min: 1
        },

        totalPrice: {
          type: Number,
          required: true
        },

        image: {
          type: String
        }
      }
    ],


    // ==========================
    // SHIPPING ADDRESS
    // ==========================

    shippingAddress: {
      name: {
        type: String,
        required: true
      },

      phone: {
        type: String,
        required: true
      },

      address: {
        type: String,
        required: true
      }
    },


    // ==========================
    // PRICE DETAILS
    // ==========================

    subtotal: {
      type: Number,
      required: true
    },

    gst: {
      type: Number,
      required: true
    },

    deliveryCharge: {
      type: Number,
      default: 0
    },

    totalAmount: {
      type: Number,
      required: true
    },


    // ==========================
    // PAYMENT
    // ==========================

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD"
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending"
    },


    // ==========================
    // RAZORPAY DETAILS
    // ==========================

    razorpayOrderId: {
      type: String,
      default: ""
    },

    razorpayPaymentId: {
      type: String,
      default: ""
    },


    // ==========================
    // ORDER STATUS
    // ==========================

    orderStatus: {
      type: String,
      enum: [
        "Placed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
      ],
      default: "Placed"
    }
  },

  {
    timestamps: true
  }
);


module.exports =
  mongoose.model("Order", orderSchema);
