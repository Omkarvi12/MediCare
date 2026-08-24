import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import "../styles/checkout.css";

function Checkout() {

  const navigate = useNavigate();

  const { user, token } = useAuth();
  const { refreshCart } = useCart();

  // ============================================
  // STATES
  // ============================================

  const [cart, setCart] = useState([]);

  const [loading, setLoading] = useState(true);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "COD",
  });


  // ============================================
  // AUTH HEADER
  // ============================================

  const getHeaders = () => {

    if (!token) {
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  };


  // ============================================
  // LOAD RAZORPAY SDK
  // ============================================

  const loadRazorpay = () => {

    return new Promise((resolve) => {

      // Already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      // Check existing script
      const existingScript =
        document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        );

      if (existingScript) {

        existingScript.onload = () => {
          resolve(true);
        };

        existingScript.onerror = () => {
          resolve(false);
        };

        return;
      }

      // Create script
      const script =
        document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.async = true;

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);

    });
  };


  // ============================================
  // FETCH CART
  // ============================================

  const fetchCart = async () => {

    try {

      const response =
        await api.get(
          "/cart",
          {
            headers: getHeaders(),
          }
        );

      setCart(
        response.data.cart || []
      );

    } catch (error) {

      console.error(
        "Checkout Cart Error:",
        error
      );

      setErrorMessage(
        error.response?.data?.message ||
        "Unable to load cart."
      );

    }
  };


  // ============================================
  // FETCH PROFILE
  // ============================================

  const fetchProfile = async () => {

    try {

      const response =
        await api.get(
          "/auth/profile",
          {
            headers: getHeaders(),
          }
        );

      const profile =
        response.data.user;

      setFormData((prev) => ({
        ...prev,

        name:
          profile?.name ||
          user?.name ||
          "",

        phone:
          profile?.phone ||
          user?.phone ||
          "",

        address:
          profile?.address ||
          user?.address ||
          "",
      }));

    } catch (error) {

      console.error(
        "Checkout Profile Error:",
        error
      );

      // Profile fetch fail ho to AuthContext
      // se details lene ki koshish

      setFormData((prev) => ({
        ...prev,

        name: user?.name || prev.name,

        phone: user?.phone || prev.phone,

        address:
          user?.address ||
          prev.address,
      }));
    }
  };


  // ============================================
  // INITIAL LOAD
  // ============================================

  useEffect(() => {

    const loadCheckout = async () => {

      if (!token) {

        setLoading(false);

        setErrorMessage(
          "Please login before checkout."
        );

        return;
      }

      try {

        await Promise.all([
          fetchCart(),
          fetchProfile(),
        ]);

      } finally {

        setLoading(false);

      }
    };

    loadCheckout();

  }, [token]);


  // ============================================
  // HANDLE INPUT
  // ============================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove old error while typing
    if (errorMessage) {
      setErrorMessage("");
    }

  };


  // ============================================
  // CALCULATE TOTAL
  // ============================================

  const subtotal = cart.reduce(
    (total, item) => {

      const price =
        Number(
          item.product?.price || 0
        );

      const quantity =
        Number(
          item.quantity || 0
        );

      return (
        total +
        price * quantity
      );

    },
    0
  );


  const gst =
    subtotal * 0.05;


  const deliveryCharge =
    subtotal >= 500
      ? 0
      : 40;


  const grandTotal =
    subtotal +
    gst +
    deliveryCharge;


  // ============================================
  // RESET PAYMENT STATE
  // ============================================

  const resetPaymentState = (
    message = ""
  ) => {

    setPlacingOrder(false);

    setErrorMessage(message);

    setSuccessMessage("");

  };


  // ============================================
  // CREATE COD ORDER
  // ============================================

  const placeCODOrder = async () => {

    try {

      const response =
        await api.post(
          "/orders",
          {
            name:
              formData.name.trim(),

            phone:
              formData.phone.trim(),

            address:
              formData.address.trim(),

            paymentMethod: "COD",
          },
          {
            headers: getHeaders(),
          }
        );

      if (!response.data?.success) {

        throw new Error(
          response.data?.message ||
          "Unable to place order."
        );

      }

      setSuccessMessage(
        "Order placed successfully!"
      );

      await refreshCart();

      setTimeout(() => {

        navigate("/orders");

      }, 800);

    } catch (error) {

      console.error(
        "COD Order Error:",
        error
      );

      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        "Unable to place order."
      );

      setPlacingOrder(false);

    }

  };


  // ============================================
  // START ONLINE PAYMENT
  // ============================================

  const startOnlinePayment = async () => {

    let razorpayInstance = null;

    try {

      setErrorMessage("");

      setSuccessMessage("");


      // ========================================
      // LOAD RAZORPAY
      // ========================================

      const sdkLoaded =
        await loadRazorpay();

      if (!sdkLoaded || !window.Razorpay) {

        resetPaymentState(
          "Razorpay could not be loaded. Please refresh the page."
        );

        return;
      }


      // ========================================
      // FRONTEND RAZORPAY KEY
      // ========================================

      const razorpayKey =
        import.meta.env
          .VITE_RAZORPAY_KEY_ID;


      if (!razorpayKey) {

        resetPaymentState(
          "Razorpay Key ID is missing. Add VITE_RAZORPAY_KEY_ID to frontend .env."
        );

        return;
      }


      console.log(
        "Razorpay Key:",
        razorpayKey.substring(0, 8) +
        "..."
      );


      // ========================================
      // CREATE RAZORPAY ORDER
      // ========================================

      const paymentResponse =
        await api.post(
          "/payment/create-order",
          {},
          {
            headers: getHeaders(),
          }
        );


      console.log(
        "Payment Order Response:",
        paymentResponse.data
      );


      if (
        !paymentResponse.data?.success
      ) {

        throw new Error(
          paymentResponse.data?.message ||
          "Unable to create payment order."
        );

      }


      const razorpayOrder =
        paymentResponse.data.order;


      if (!razorpayOrder?.id) {

        throw new Error(
          "Razorpay Order ID was not received."
        );

      }


      // ========================================
      // RAZORPAY OPTIONS
      // ========================================

      const options = {

        key: razorpayKey,

        amount:
          razorpayOrder.amount,

        currency:
          razorpayOrder.currency ||
          "INR",

        name: "MediCare",

        description:
          "MediCare Medicine Order",

        order_id:
          razorpayOrder.id,

        prefill: {

          name:
            formData.name.trim(),

          email:
            user?.email || "",

          contact:
            formData.phone.trim(),

        },

        notes: {

          address:
            formData.address.trim(),

        },

        theme: {

          color: "#16a34a",

        },

        config: {

          display: {

            blocks: {

              upi: {

                name: "Pay via UPI",

                instruments: [
                  {
                    method: "upi",
                  },
                ],

              },

            },

            sequence: [
              "block.upi",
            ],

            preferences: {

              show_default_blocks: true,

            },

          },

        },


        // ======================================
        // MODAL
        // ======================================

        modal: {

          escape: true,

          backdropclose: false,

          ondismiss: () => {

            console.log(
              "Razorpay modal closed"
            );

            resetPaymentState(
              "Payment was cancelled."
            );

          },

        },


        // ======================================
        // PAYMENT SUCCESS
        // ======================================

        handler:
          async function (
            paymentResult
          ) {

            console.log(
              "Razorpay Payment Success:",
              paymentResult
            );


            try {

              setSuccessMessage(
                "Payment successful. Verifying payment..."
              );


              // ==================================
              // VERIFY PAYMENT
              // ==================================

              const verifyResponse =
                await api.post(
                  "/payment/verify",
                  {
                    razorpay_order_id:
                      paymentResult
                        .razorpay_order_id,

                    razorpay_payment_id:
                      paymentResult
                        .razorpay_payment_id,

                    razorpay_signature:
                      paymentResult
                        .razorpay_signature,
                  },
                  {
                    headers:
                      getHeaders(),
                  }
                );


              console.log(
                "Payment Verify Response:",
                verifyResponse.data
              );


              if (
                !verifyResponse.data
                  ?.success
              ) {

                throw new Error(
                  verifyResponse.data
                    ?.message ||
                  "Payment verification failed."
                );

              }


              // ==================================
              // CREATE ACTUAL MEDICARE ORDER
              // ==================================

              setSuccessMessage(
                "Payment verified. Placing your order..."
              );


              const orderResponse =
                await api.post(
                  "/orders",
                  {
                    name:
                      formData.name.trim(),

                    phone:
                      formData.phone.trim(),

                    address:
                      formData.address.trim(),

                    paymentMethod:
                      "ONLINE",

                    razorpayOrderId:
                      paymentResult
                        .razorpay_order_id,

                    razorpayPaymentId:
                      paymentResult
                        .razorpay_payment_id,
                  },
                  {
                    headers:
                      getHeaders(),
                  }
                );


              console.log(
                "MediCare Order Response:",
                orderResponse.data
              );


              if (
                !orderResponse.data
                  ?.success
              ) {

                throw new Error(
                  orderResponse.data
                    ?.message ||
                  "Unable to create MediCare order."
                );

              }


              // ==================================
              // SUCCESS
              // ==================================

              setPlacingOrder(false);

              setErrorMessage("");

              setSuccessMessage(
                "Payment successful! Order placed successfully."
              );


              await refreshCart();


              setTimeout(() => {

                navigate("/orders");

              }, 1000);

            } catch (error) {

              console.error(
                "Payment Handler Error:",
                error
              );

              console.error(
                "Server Response:",
                error.response?.data
              );


              resetPaymentState(
                error.response?.data
                  ?.message ||
                error.message ||
                "Payment verification failed."
              );

            }

          },

      };


      // ========================================
      // CREATE RAZORPAY INSTANCE
      // ========================================

      razorpayInstance =
        new window.Razorpay(
          options
        );


      // ========================================
      // PAYMENT FAILED
      // ========================================

      razorpayInstance.on(
        "payment.failed",
        (response) => {

          console.error(
            "Razorpay Payment Failed:",
            response
          );


          const message =
            response?.error
              ?.description ||
            response?.error
              ?.reason ||
            "Payment failed. Please try again.";


          // VERY IMPORTANT
          // Unlock page

          setPlacingOrder(false);

          setSuccessMessage("");

          setErrorMessage(message);


          // Close popup

          try {

            razorpayInstance.close();

          } catch {

            console.log(
              "Razorpay close ignored"
            );

          }

        }
      );


      // ========================================
      // OPEN RAZORPAY
      // ========================================

      console.log(
        "Opening Razorpay..."
      );


      razorpayInstance.open();


    } catch (error) {

      console.error(
        "Online Payment Error:",
        error
      );

      console.error(
        "Server Response:",
        error.response?.data
      );


      let message =
        error.response?.data
          ?.message ||
        error.message ||
        "Unable to start online payment.";


      // Razorpay authentication
      // error ko user-friendly banana

      if (
        message
          .toLowerCase()
          .includes("authentication failed")
      ) {

        message =
          "Razorpay authentication failed. Please check Razorpay Test API Key ID and Secret in backend .env.";

      }


      resetPaymentState(
        message
      );

    }

  };


  // ============================================
  // PLACE ORDER
  // ============================================

  const handlePlaceOrder = async (e) => {

    e.preventDefault();


    // Prevent double click

    if (placingOrder) {
      return;
    }


    setErrorMessage("");

    setSuccessMessage("");


    // ==========================================
    // LOGIN CHECK
    // ==========================================

    if (!token) {

      setErrorMessage(
        "Please login before placing an order."
      );

      return;
    }


    // ==========================================
    // CART CHECK
    // ==========================================

    if (cart.length === 0) {

      setErrorMessage(
        "Your cart is empty."
      );

      return;
    }


    // ==========================================
    // NAME
    // ==========================================

    if (!formData.name.trim()) {

      setErrorMessage(
        "Please enter your full name."
      );

      return;
    }


    // ==========================================
    // PHONE
    // ==========================================

    if (!formData.phone.trim()) {

      setErrorMessage(
        "Please enter your phone number."
      );

      return;
    }


    if (
      !/^[0-9]{10}$/.test(
        formData.phone.trim()
      )
    ) {

      setErrorMessage(
        "Please enter a valid 10-digit phone number."
      );

      return;
    }


    // ==========================================
    // ADDRESS
    // ==========================================

    if (!formData.address.trim()) {

      setErrorMessage(
        "Please enter your delivery address."
      );

      return;
    }


    // ==========================================
    // START PROCESSING
    // ==========================================

    setPlacingOrder(true);


    // ==========================================
    // COD
    // ==========================================

    if (
      formData.paymentMethod ===
      "COD"
    ) {

      await placeCODOrder();

      return;
    }


    // ==========================================
    // ONLINE
    // ==========================================

    if (
      formData.paymentMethod ===
      "ONLINE"
    ) {

      await startOnlinePayment();

      return;
    }


    // ==========================================
    // UNKNOWN PAYMENT METHOD
    // ==========================================

    setPlacingOrder(false);

    setErrorMessage(
      "Please select a payment method."
    );

  };


  // ============================================
  // LOADING
  // ============================================

  if (loading) {

    return (

      <section className="checkout-page">

        <div className="container">

          <div className="empty-checkout">

            <h2>
              Loading Checkout...
            </h2>

          </div>

        </div>

      </section>

    );

  }


  // ============================================
  // EMPTY CART
  // ============================================

  if (cart.length === 0) {

    return (

      <section className="checkout-page">

        <div className="container">

          <div className="empty-checkout">

            <h2>
              Your Cart is Empty 🛒
            </h2>

            <p>
              Please add products before checkout.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
            >
              Continue Shopping
            </button>

          </div>

        </div>

      </section>

    );

  }


  // ============================================
  // UI
  // ============================================

  return (

    <section className="checkout-page">

      <div className="container">


        {/* ======================================
            TITLE
        ====================================== */}

        <div className="checkout-title">

          <h1>
            Checkout
          </h1>

          <p>
            Complete your order
          </p>

        </div>


        {/* ======================================
            ERROR
        ====================================== */}

        {errorMessage && (

          <div
            className="checkout-error"
            role="alert"
          >
            {errorMessage}
          </div>

        )}


        {/* ======================================
            SUCCESS
        ====================================== */}

        {successMessage && (

          <div
            className="checkout-success"
            role="status"
          >
            {successMessage}
          </div>

        )}


        {/* ======================================
            LAYOUT
        ====================================== */}

        <div className="checkout-layout">


          {/* ====================================
              FORM
          ==================================== */}

          <form
            className="checkout-form"
            onSubmit={handlePlaceOrder}
          >

            <h2>
              Delivery Details
            </h2>


            {/* NAME */}

            <div className="form-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                disabled={placingOrder}
              />

            </div>


            {/* PHONE */}

            <div className="form-group">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                maxLength="10"
                disabled={placingOrder}
              />

            </div>


            {/* ADDRESS */}

            <div className="form-group">

              <label>
                Delivery Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter complete delivery address"
                rows="5"
                disabled={placingOrder}
              />

            </div>


            {/* ==================================
                PAYMENT
            ================================== */}

            <div className="payment-section">

              <h3>
                Payment Method
              </h3>


              {/* COD */}

              <label
                className="payment-option"
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={
                    formData.paymentMethod ===
                    "COD"
                  }
                  onChange={handleChange}
                  disabled={placingOrder}
                />

                <span>
                  Cash On Delivery
                </span>

              </label>


              {/* ONLINE */}

              <label
                className="payment-option"
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  checked={
                    formData.paymentMethod ===
                    "ONLINE"
                  }
                  onChange={handleChange}
                  disabled={placingOrder}
                />

                <span>
                  Online Payment
                </span>

              </label>

            </div>


            {/* ==================================
                BUTTON
            ================================== */}

            <button
              type="submit"
              className="place-order-btn"
              disabled={placingOrder}
            >

              {placingOrder

                ? formData.paymentMethod ===
                  "ONLINE"

                  ? "Processing Payment..."

                  : "Placing Order..."

                : formData.paymentMethod ===
                  "ONLINE"

                  ? `Pay ₹${grandTotal.toFixed(2)}`

                  : "Place Order"

              }

            </button>

          </form>


          {/* ====================================
              SUMMARY
          ==================================== */}

          <div className="checkout-summary">

            <h2>
              Order Summary
            </h2>


            {/* PRODUCTS */}

            {cart.map((item) => (

              <div
                className="checkout-item"
                key={item._id}
              >

                <div
                  className="checkout-product-info"
                >

                  <img
                    src={
                      item.product?.image
                        ?.startsWith("http")
                        ? item.product.image
                        : `http://localhost:5000/uploads/${item.product?.image}`
                    }
                    alt={
                      item.product?.name ||
                      "Product"
                    }
                    onError={(e) => {

                      e.currentTarget.style.display =
                        "none";

                    }}
                  />

                  <div>

                    <h4>
                      {item.product?.name}
                    </h4>

                    <p>
                      ₹
                      {Number(
                        item.product?.price ||
                        0
                      ).toFixed(2)}
                      {" "}×{" "}
                      {item.quantity}
                    </p>

                  </div>

                </div>


                <strong>

                  ₹
                  {(
                    Number(
                      item.product?.price ||
                      0
                    ) *
                    Number(
                      item.quantity ||
                      0
                    )
                  ).toFixed(2)}

                </strong>

              </div>

            ))}


            <hr />


            {/* SUBTOTAL */}

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                ₹{subtotal.toFixed(2)}
              </strong>

            </div>


            {/* GST */}

            <div className="summary-row">

              <span>
                GST (5%)
              </span>

              <strong>
                ₹{gst.toFixed(2)}
              </strong>

            </div>


            {/* DELIVERY */}

            <div className="summary-row">

              <span>
                Delivery
              </span>

              <strong>

                {deliveryCharge === 0
                  ? "FREE"
                  : `₹${deliveryCharge}`}

              </strong>

            </div>


            <hr />


            {/* TOTAL */}

            <div className="grand-total">

              <span>
                Total
              </span>

              <strong>
                ₹{grandTotal.toFixed(2)}
              </strong>

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}

export default Checkout;
