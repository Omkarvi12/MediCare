import { useEffect, useState } from "react";

import api from "../api/api";

import { Link } from "react-router-dom";

import { FaStar } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { BsCartPlus } from "react-icons/bs";
import { toast } from "react-toastify";

import { useCart } from "../context/CartContext";

import "../styles/featured.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function Featured() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartStatus, setCartStatus] = useState({});

  const { refreshCart } = useCart();

  // ==========================
  // Image URL Helper
  // ==========================

  const getImageUrl = (image) => {
    if (!image) {
      return "/default-product.png";
    }

    // Cloudinary / external image
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Old local image
    return `${API_BASE_URL}/uploads/${image}`;
  };

  // ==========================
  // Fetch Products
  // ==========================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");

        setProducts(response.data.products || []);
      } catch (error) {
        console.error(
          "Error Fetching Products:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ==========================
  // Add To Cart
  // ==========================

  const handleAddToCart = async (productId) => {
    if (cartStatus[productId] === "adding") {
      return;
    }

    try {
      setCartStatus((previous) => ({
        ...previous,
        [productId]: "adding",
      }));

      await api.post("/cart", {
        productId,
        quantity: 1,
      });

      await refreshCart();

      setCartStatus((previous) => ({
        ...previous,
        [productId]: "added",
      }));

      toast.success("Product added to cart");

      window.setTimeout(() => {
        setCartStatus((previous) => {
          const next = { ...previous };

          delete next[productId];

          return next;
        });
      }, 1500);
    } catch (error) {
      setCartStatus((previous) => ({
        ...previous,
        [productId]: "",
      }));

      toast.error(
        error.response?.data?.message ||
          "Please login first to add products to cart"
      );
    }
  };

  // ==========================
  // Loading
  // ==========================

  if (loading) {
    return (
      <section className="featured">
        <div className="container">
          <h2
            style={{
              textAlign: "center",
            }}
          >
            Loading Products...
          </h2>
        </div>
      </section>
    );
  }

  // ==========================
  // Featured Products
  // ==========================

  return (
    <section className="featured">
      <div className="container">
        <div className="section-title">
          <h2>Featured Products</h2>

          <p>
            Best Selling Healthcare Products
          </p>
        </div>

        <div className="featured-grid">
          {products.map((product) => (
            <div
              className="product-card"
              key={product._id}
            >
              {/* ==========================
                  Product Image
              ========================== */}

              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src =
                    "/default-product.png";
                }}
              />

              {/* ==========================
                  Category
              ========================== */}

              <span className="category">
                {product.category}
              </span>

              {/* ==========================
                  Product Name
              ========================== */}

              <h3>{product.name}</h3>

              {/* ==========================
                  Rating
              ========================== */}

              <div className="rating">
                <FaStar />

                <span>
                  {product.rating || 4.5}
                </span>
              </div>

              {/* ==========================
                  Price
              ========================== */}

              <h4>₹{product.price}</h4>

              {/* ==========================
                  Stock
              ========================== */}

              <p className="stock">
                {product.stock > 0
                  ? `In Stock (${product.stock})`
                  : "Out Of Stock"}
              </p>

              {/* ==========================
                  Buttons
              ========================== */}

              <div className="product-buttons">
                {/* View Details */}

                <Link
                  to={`/product/${product._id}`}
                  className="details-btn"
                >
                  <FiEye />

                  View Details
                </Link>

                {/* Add To Cart */}

                <button
                  className="cart-btn"
                  onClick={() =>
                    handleAddToCart(product._id)
                  }
                  disabled={
                    product.stock <= 0 ||
                    cartStatus[product._id] ===
                      "adding"
                  }
                >
                  <BsCartPlus />

                  {product.stock <= 0
                    ? "Out Of Stock"
                    : cartStatus[product._id] ===
                      "adding"
                    ? "Adding..."
                    : cartStatus[product._id] ===
                      "added"
                    ? "Added ✓"
                    : "Add To Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Featured;