import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

import "../styles/adminOrders.css";

function AdminOrders() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================
  // Fetch All Orders
  // ==========================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/orders/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.orders || []);

    } catch (error) {
      console.error("Orders fetch error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to fetch orders"
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);


  // ==========================
  // Update Order Status
  // ==========================

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {

      await api.put(
        `/orders/admin/${orderId}/status`,
        {
          orderStatus: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Order status updated successfully ✅"
      );

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: newStatus,
              }
            : order
        )
      );

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to update order status"
      );

    }
  };


  // ==========================
  // Loading
  // ==========================

  if (loading) {
    return (
      <div className="admin-orders-loading">
        <h2>Loading Orders...</h2>
      </div>
    );
  }


  // ==========================
  // Error
  // ==========================

  if (error) {
    return (
      <div className="admin-orders-error">

        <h2>
          Something went wrong
        </h2>

        <p>
          {error}
        </p>

        <button
          onClick={fetchOrders}
        >
          Try Again
        </button>

      </div>
    );
  }


  return (
    <div className="admin-orders-page">

      {/* ==========================
          HEADER
      ========================== */}

      <header className="admin-orders-header">

        <div>
          <h1>
            MediCare Admin
          </h1>

          <p>
            Manage Customer Orders
          </p>
        </div>

        <button
          className="dashboard-button"
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          ← Dashboard
        </button>

      </header>


      {/* ==========================
          MAIN
      ========================== */}

      <main className="admin-orders-main">

        <div className="orders-heading">

          <div>
            <h2>
              All Orders
            </h2>

            <p>
              Total Orders:{" "}
              <strong>
                {orders.length}
              </strong>
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={fetchOrders}
          >
            ↻ Refresh
          </button>

        </div>


        {/* ==========================
            NO ORDERS
        ========================== */}

        {orders.length === 0 ? (

          <div className="no-orders">

            <div className="no-orders-icon">
              🛒
            </div>

            <h2>
              No Orders Found
            </h2>

            <p>
              Customer orders will appear here.
            </p>

          </div>

        ) : (

          <div className="orders-container">

            {orders.map((order) => (

              <div
                className="order-card"
                key={order._id}
              >

                {/* ==========================
                    ORDER HEADER
                ========================== */}

                <div className="order-card-header">

                  <div>

                    <h3>
                      Order #{order._id.slice(-8)}
                    </h3>

                    <p>
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>

                  <span
                    className={`status-badge status-${order.orderStatus.toLowerCase()}`}
                  >
                    {order.orderStatus}
                  </span>

                </div>


                {/* ==========================
                    CUSTOMER
                ========================== */}

                <div className="order-section">

                  <h4>
                    Customer Information
                  </h4>

                  <div className="customer-info">

                    <p>
                      <strong>Name:</strong>{" "}
                      {order.user?.name || "N/A"}
                    </p>

                    <p>
                      <strong>Email:</strong>{" "}
                      {order.user?.email || "N/A"}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {order.user?.phone || "N/A"}
                    </p>

                  </div>

                </div>


                {/* ==========================
                    SHIPPING
                ========================== */}

                <div className="order-section">

                  <h4>
                    Shipping Address
                  </h4>

                  <p>
                    <strong>
                      {order.shippingAddress?.name}
                    </strong>
                  </p>

                  <p>
                    {order.shippingAddress?.phone}
                  </p>

                  <p>
                    {order.shippingAddress?.address}
                  </p>

                </div>


                {/* ==========================
                    PRODUCTS
                ========================== */}

                <div className="order-section">

                  <h4>
                    Products
                  </h4>

                  <div className="order-items">

                    {order.items?.map(
                      (item, index) => (

                        <div
                          className="order-item"
                          key={index}
                        >

                          <div className="item-image">

                            {item.image ? (

                              <img
                                src={item.image}
                                alt={item.name}
                                onError={(e) => {
                                  e.currentTarget.style.display =
                                    "none";
                                  e.currentTarget.nextSibling.style.display =
                                    "flex";
                                }}
                              />

                            ) : null}

                            <div
                              className="item-placeholder"
                              style={{
                                display: item.image
                                  ? "none"
                                  : "flex",
                              }}
                            >
                              💊
                            </div>

                          </div>


                          <div className="item-info">

                            <h5>
                              {item.name}
                            </h5>

                            <p>
                              ₹{item.price} ×{" "}
                              {item.quantity}
                            </p>

                          </div>


                          <strong>
                            ₹{item.totalPrice}
                          </strong>

                        </div>

                      )
                    )}

                  </div>

                </div>


                {/* ==========================
                    PAYMENT
                ========================== */}

                <div className="order-payment">

                  <div>

                    <p>
                      Payment Method
                    </p>

                    <strong>
                      {order.paymentMethod}
                    </strong>

                  </div>


                  <div>

                    <p>
                      Payment Status
                    </p>

                    <strong>
                      {order.paymentStatus}
                    </strong>

                  </div>


                  <div>

                    <p>
                      Subtotal
                    </p>

                    <strong>
                      ₹{order.subtotal}
                    </strong>

                  </div>


                  <div>

                    <p>
                      GST
                    </p>

                    <strong>
                      ₹{order.gst}
                    </strong>

                  </div>


                  <div>

                    <p>
                      Delivery
                    </p>

                    <strong>
                      ₹{order.deliveryCharge}
                    </strong>

                  </div>


                  <div className="total-amount">

                    <p>
                      Total Amount
                    </p>

                    <strong>
                      ₹{order.totalAmount}
                    </strong>

                  </div>

                </div>


                {/* ==========================
                    UPDATE STATUS
                ========================== */}

                <div className="status-update">

                  <label>
                    Update Order Status
                  </label>

                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(
                        order._id,
                        e.target.value
                      )
                    }
                  >

                    <option value="Placed">
                      Placed
                    </option>

                    <option value="Processing">
                      Processing
                    </option>

                    <option value="Shipped">
                      Shipped
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>

                  </select>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default AdminOrders;
