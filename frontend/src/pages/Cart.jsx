import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/api";

import { useCart } from "../context/CartContext";

import "../styles/cart.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const { refreshCart } = useCart();

  // ==========================
  // Image URL Helper
  // ==========================

  const getImageUrl = (image) => {
    if (!image) {
      return "/default-product.png";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${API_BASE_URL}/uploads/${image}`;
  };

  // ==========================
  // Fetch Cart
  // ==========================

  const fetchCart = async () => {
    try {
      const response = await api.get("/cart");

      setCart(response.data.cart || []);
    } catch (error) {
      console.error("Cart Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ==========================
  // Increase Quantity
  // ==========================

  const increaseQuantity = async (item) => {
    try {
      setUpdating(true);

      const newQuantity = item.quantity + 1;

      const response = await api.put(
        `/cart/${item._id}`,
        {
          quantity: newQuantity,
        }
      );

      setCart((prevCart) =>
        prevCart.map((cartItem) =>
          cartItem._id === item._id
            ? response.data.cartItem
            : cartItem
        )
      );

      await refreshCart();
    } catch (error) {
      console.error(
        "Increase Quantity Error:",
        error
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==========================
  // Decrease Quantity
  // ==========================

  const decreaseQuantity = async (item) => {
    if (item.quantity <= 1) {
      return;
    }

    try {
      setUpdating(true);

      const newQuantity = item.quantity - 1;

      const response = await api.put(
        `/cart/${item._id}`,
        {
          quantity: newQuantity,
        }
      );

      setCart((prevCart) =>
        prevCart.map((cartItem) =>
          cartItem._id === item._id
            ? response.data.cartItem
            : cartItem
        )
      );

      await refreshCart();
    } catch (error) {
      console.error(
        "Decrease Quantity Error:",
        error
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==========================
  // Remove Product
  // ==========================

  const removeProduct = async (cartId) => {
    try {
      setUpdating(true);

      await api.delete(`/cart/${cartId}`);

      setCart((prevCart) =>
        prevCart.filter(
          (item) => item._id !== cartId
        )
      );

      await refreshCart();
    } catch (error) {
      console.error(
        "Remove Product Error:",
        error
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==========================
  // Loading
  // ==========================

  if (loading) {
    return (
      <section className="cart-page">
        <div className="container">
          <h2 className="cart-loading">
            Loading Cart...
          </h2>
        </div>
      </section>
    );
  }

  // ==========================
  // Empty Cart
  // ==========================

  if (cart.length === 0) {
    return (
      <section className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <h2>
              Your Cart is Empty 🛒
            </h2>

            <p>
              You haven't added any products yet.
            </p>

            <Link
              to="/products"
              className="continue-shopping"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ==========================
  // Calculate Total
  // ==========================

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.totalPrice || 0),
    0
  );

  const deliveryCharge =
    subtotal >= 500 ? 0 : 40;

  const gst = subtotal * 0.05;

  const grandTotal =
    subtotal +
    deliveryCharge +
    gst;

  // ==========================
  // UI
  // ==========================

  return (
    <section className="cart-page">
      <div className="container">

        <div className="cart-title">
          <h1>My Cart</h1>

          <p>
            {cart.length} Product(s) in your cart
          </p>
        </div>

        <div className="cart-layout">

          {/* ==========================
              CART ITEMS
          ========================== */}

          <div className="cart-items">

            {cart.map((item) => (
              <div
                className="cart-item"
                key={item._id}
              >

                {/* Image */}

                <div className="cart-image">
                  <img
                    src={getImageUrl(
                      item.product?.image
                    )}
                    alt={
                      item.product?.name ||
                      "Product"
                    }
                    onError={(e) => {
                      e.currentTarget.src =
                        "/default-product.png";
                    }}
                  />
                </div>

                {/* Product Info */}

                <div className="cart-info">

                  <h3>
                    {item.product?.name}
                  </h3>

                  <p>
                    {item.product?.description}
                  </p>

                  <span>
                    Category:{" "}
                    {item.product?.category}
                  </span>

                  <h4>
                    ₹{item.product?.price}
                  </h4>

                </div>

                {/* Quantity */}

                <div className="cart-quantity">

                  <span>
                    Quantity
                  </span>

                  <div className="quantity-controls">

                    <button
                      onClick={() =>
                        decreaseQuantity(item)
                      }
                      disabled={
                        updating ||
                        item.quantity <= 1
                      }
                    >
                      −
                    </button>

                    <strong>
                      {item.quantity}
                    </strong>

                    <button
                      onClick={() =>
                        increaseQuantity(item)
                      }
                      disabled={updating}
                    >
                      +
                    </button>

                  </div>

                </div>

                {/* Total + Remove */}

                <div className="cart-total">

                  <strong>
                    ₹{item.totalPrice}
                  </strong>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeProduct(item._id)
                    }
                    disabled={updating}
                  >
                    Remove
                  </button>

                </div>

              </div>
            ))}

          </div>

          {/* ==========================
              SUMMARY
          ========================== */}

          <div className="cart-summary">

            <h2>
              Order Summary
            </h2>

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                ₹{subtotal.toFixed(2)}
              </strong>

            </div>

            <div className="summary-row">

              <span>
                GST (5%)
              </span>

              <strong>
                ₹{gst.toFixed(2)}
              </strong>

            </div>

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

            <div className="grand-total">

              <span>
                Total
              </span>

              <strong>
                ₹{grandTotal.toFixed(2)}
              </strong>

            </div>

            {/* Checkout Button */}

            <button
              className="checkout-btn"
              onClick={() =>
                navigate("/checkout")
              }
            >
              Proceed To Checkout
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Cart;