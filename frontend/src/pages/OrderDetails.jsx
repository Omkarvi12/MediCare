import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../api/api";
import { toast } from "react-toastify";

import "../styles/orderDetails.css";

function OrderDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const [cancelling, setCancelling] = useState(false);

  // ==========================
  // API BASE URL
  // ==========================

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ==========================
  // IMAGE URL HELPER
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
  // FETCH ORDER
  // ==========================

  const fetchOrder = async () => {
    try {
      const response = await api.get(
        `/orders/${id}`
      );

      setOrder(
        response.data.order
      );

    } catch (error) {
      console.error(
        "Order Details Error:",
        error.response?.data || error
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // ==========================
  // CANCEL ORDER
  // ==========================

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      setCancelling(true);

      const response = await api.put(
        `/orders/${id}/cancel`
      );

      if (response.data.success) {
        toast.success(
          "Order Cancelled Successfully"
        );

        setOrder(
          response.data.order
        );
      }

    } catch (error) {
      console.error(
        "Cancel Order Error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
        "Unable to cancel order"
      );

    } finally {
      setCancelling(false);
    }
  };

  // ==========================
  // LOADING
  // ==========================

  if (loading) {
    return (
      <section className="order-details-page">
        <div className="container">
          <h2>
            Loading Order...
          </h2>
        </div>
      </section>
    );
  }

  // ==========================
  // ORDER NOT FOUND
  // ==========================

  if (!order) {
    return (
      <section className="order-details-page">
        <div className="container">
          <div className="order-not-found">
            <h2>
              Order Not Found
            </h2>

            <Link to="/orders">
              Back To Orders
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ==========================
  // MAIN UI
  // ==========================

  return (
    <section className="order-details-page">

      <div className="container">

        {/* ==========================
            HEADER
        ========================== */}

        <div className="order-details-header">

          <div>

            <h1>
              Order Details
            </h1>

            <p>
              Order #{order._id}
            </p>

          </div>

          <div
            className={`order-status-badge ${
              order.orderStatus
                ?.toLowerCase()
                .replace(/\s+/g, "-")
            }`}
          >
            {order.orderStatus}
          </div>

        </div>

        {/* ==========================
            ORDER INFO
        ========================== */}

        <div className="order-info-grid">

          {/* ORDER INFORMATION */}

          <div className="info-card">

            <h3>
              Order Information
            </h3>

            <p>
              <strong>
                Order ID:
              </strong>{" "}

              {order._id}
            </p>

            <p>
              <strong>
                Date:
              </strong>{" "}

              {new Date(
                order.createdAt
              ).toLocaleString("en-IN")}
            </p>

            <p>
              <strong>
                Order Status:
              </strong>{" "}

              {order.orderStatus}
            </p>

          </div>

          {/* PAYMENT INFORMATION */}

          <div className="info-card">

            <h3>
              Payment Information
            </h3>

            <p>
              <strong>
                Payment Method:
              </strong>{" "}

              {order.paymentMethod}
            </p>

            <p>
              <strong>
                Payment Status:
              </strong>{" "}

              {order.paymentStatus}
            </p>

          </div>

          {/* DELIVERY ADDRESS */}

          <div className="info-card">

            <h3>
              Delivery Address
            </h3>

            <p>
              <strong>
                Name:
              </strong>{" "}

              {order.shippingAddress.name}
            </p>

            <p>
              <strong>
                Phone:
              </strong>{" "}

              {order.shippingAddress.phone}
            </p>

            <p>
              <strong>
                Address:
              </strong>{" "}

              {order.shippingAddress.address}
            </p>

          </div>

        </div>

        {/* ==========================
            ORDERED PRODUCTS
        ========================== */}

        <div className="order-products-card">

          <h2>
            Ordered Products
          </h2>

          <div className="order-products">

            {order.items.map((item) => (

              <div
                className="order-product"
                key={item._id}
              >

                <div className="order-product-image">

                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.src =
                        "/default-product.png";
                    }}
                  />

                </div>

                <div className="order-product-info">

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    ₹{item.price} ×{" "}
                    {item.quantity}
                  </p>

                </div>

                <div className="order-product-total">

                  ₹{item.totalPrice}

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* ==========================
            PRICE SUMMARY
        ========================== */}

        <div className="order-price-card">

          <h2>
            Price Summary
          </h2>

          <div className="price-row">

            <span>
              Subtotal
            </span>

            <strong>
              ₹{order.subtotal.toFixed(2)}
            </strong>

          </div>

          <div className="price-row">

            <span>
              GST (5%)
            </span>

            <strong>
              ₹{order.gst.toFixed(2)}
            </strong>

          </div>

          <div className="price-row">

            <span>
              Delivery
            </span>

            <strong>

              {order.deliveryCharge === 0
                ? "FREE"
                : `₹${order.deliveryCharge}`}

            </strong>

          </div>

          <hr />

          <div className="final-price">

            <span>
              Total Amount
            </span>

            <strong>
              ₹{order.totalAmount.toFixed(2)}
            </strong>

          </div>

        </div>

        {/* ==========================
            CANCEL ORDER
        ========================== */}

        {order.orderStatus === "Placed" && (

          <div className="cancel-order-section">

            <button
              className="cancel-order-btn"
              onClick={handleCancelOrder}
              disabled={cancelling}
            >

              {cancelling
                ? "Cancelling..."
                : "Cancel Order"}

            </button>

          </div>

        )}

        {/* ==========================
            BACK TO ORDERS
        ========================== */}

        <div className="back-orders">

          <Link to="/orders">
            ← Back To My Orders
          </Link>

        </div>

      </div>

    </section>
  );
}

export default OrderDetails;