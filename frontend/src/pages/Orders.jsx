import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/api";

import "../styles/orders.css";

function Orders() {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");


  // ======================================================
  // IMAGE URL HELPER
  // ======================================================

  const getImageUrl = (image) => {

    if (!image) {
      return "";
    }

    // Cloudinary / external image
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Old local image
    return `http://localhost:5000/uploads/${image}`;

  };


  // ======================================================
  // FETCH ORDERS
  // ======================================================

  const fetchOrders = async () => {

    try {

      setLoading(true);

      setErrorMessage("");

      const response =
        await api.get("/orders");

      setOrders(
        response.data.orders || []
      );

    } catch (error) {

      console.error(
        "Orders Fetch Error:",
        error
      );

      setErrorMessage(
        error.response?.data?.message ||
        "Unable to fetch orders"
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchOrders();

  }, []);


  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {

    return (

      <section className="orders-page">

        <div className="container">

          <h2 className="orders-loading">
            Loading Orders...
          </h2>

        </div>

      </section>

    );

  }


  // ======================================================
  // ERROR
  // ======================================================

  if (errorMessage) {

    return (

      <section className="orders-page">

        <div className="container">

          <div className="empty-orders">

            <h1>
              My Orders
            </h1>

            <div className="empty-orders-box">

              <h2>
                Unable To Load Orders
              </h2>

              <p>
                {errorMessage}
              </p>

              <button
                className="shop-now-btn"
                onClick={fetchOrders}
              >
                Try Again
              </button>

            </div>

          </div>

        </div>

      </section>

    );

  }


  // ======================================================
  // NO ORDERS
  // ======================================================

  if (orders.length === 0) {

    return (

      <section className="orders-page">

        <div className="container">

          <div className="empty-orders">

            <h1>
              My Orders
            </h1>

            <div className="empty-orders-box">

              <h2>
                No Orders Yet 📦
              </h2>

              <p>
                You haven't placed any orders yet.
              </p>

              <Link
                to="/products"
                className="shop-now-btn"
              >
                Start Shopping
              </Link>

            </div>

          </div>

        </div>

      </section>

    );

  }


  // ======================================================
  // ORDERS UI
  // ======================================================

  return (

    <section className="orders-page">

      <div className="container">


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="orders-header">

          <div>

            <h1>
              My Orders
            </h1>

            <p>
              {orders.length} order(s) placed
            </p>

          </div>


          <Link
            to="/products"
            className="continue-shopping-btn"
          >
            Continue Shopping
          </Link>

        </div>


        {/* ==================================================
            ORDERS LIST
        ================================================== */}

        <div className="orders-list">

          {orders.map((order) => (

            <div
              className="order-card"
              key={order._id}
            >


              {/* ==================================================
                  ORDER HEADER
              ================================================== */}

              <div className="order-header">


                {/* ORDER ID */}

                <div>

                  <span className="order-label">
                    Order ID
                  </span>

                  <strong>
                    #{order._id}
                  </strong>

                </div>


                {/* DATE */}

                <div>

                  <span className="order-label">
                    Date
                  </span>

                  <strong>
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString(
                      "en-IN"
                    )}
                  </strong>

                </div>


                {/* STATUS */}

                <div>

                  <span className="order-label">
                    Status
                  </span>

                  <span
                    className={`order-status ${
                      order.orderStatus
                        ?.toLowerCase()
                        .replace(
                          /\s+/g,
                          "-"
                        )
                    }`}
                  >
                    {order.orderStatus}
                  </span>

                </div>

              </div>


              {/* ==================================================
                  PRODUCTS
              ================================================== */}

              <div className="order-products">

                {order.items
                  ?.slice(0, 3)
                  .map((item) => (

                    <div
                      className="order-product"
                      key={item._id}
                    >


                      {/* PRODUCT IMAGE */}

                      <img
                        src={getImageUrl(
                          item.image
                        )}
                        alt={item.name}
                        onError={(e) => {

                          // Hide broken image
                          e.currentTarget.style.display =
                            "none";

                        }}
                      />


                      {/* PRODUCT INFO */}

                      <div>

                        <h3>
                          {item.name}
                        </h3>

                        <p>
                          ₹{item.price} ×{" "}
                          {item.quantity}
                        </p>

                      </div>

                    </div>

                  ))}


                {/* MORE PRODUCTS */}

                {order.items?.length > 3 && (

                  <p className="more-items">

                    +{order.items.length - 3}
                    {" "}
                    more product(s)

                  </p>

                )}

              </div>


              {/* ==================================================
                  ORDER FOOTER
              ================================================== */}

              <div className="order-footer">


                {/* PAYMENT */}

                <div>

                  <span>
                    Payment
                  </span>

                  <strong>
                    {order.paymentMethod}
                  </strong>

                </div>


                {/* PAYMENT STATUS */}

                <div>

                  <span>
                    Payment Status
                  </span>

                  <strong>
                    {order.paymentStatus}
                  </strong>

                </div>


                {/* TOTAL */}

                <div>

                  <span>
                    Total Amount
                  </span>

                  <strong className="order-total">

                    ₹
                    {Number(
                      order.totalAmount || 0
                    ).toFixed(2)}

                  </strong>

                </div>


                {/* VIEW DETAILS */}

                <Link
                  to={`/orders/${order._id}`}
                  className="view-order-btn"
                >
                  View Details
                </Link>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}

export default Orders;