import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function AdminProducts() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================
  // Fetch Products
  // ==========================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products");

      setProducts(response.data.products || []);

    } catch (error) {
      console.error("Products fetch error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to fetch products"
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Load Products
  // ==========================
  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================
  // Delete Product
  // ==========================
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Product deleted successfully");

      // Remove deleted product from UI
      setProducts((prevProducts) =>
        prevProducts.filter(
          (product) => product._id !== id
        )
      );

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to delete product"
      );

    }
  };

  // ==========================
  // Loading
  // ==========================
  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading Products...</h2>
      </div>
    );
  }

  // ==========================
  // Error
  // ==========================
  if (error) {
    return (
      <div style={styles.center}>
        <h2>Something went wrong</h2>

        <p style={styles.error}>
          {error}
        </p>

        <button
          style={styles.button}
          onClick={fetchProducts}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* ==========================
          HEADER
      ========================== */}

      <header style={styles.header}>

        <div>
          <h1 style={styles.title}>
            Manage Products
          </h1>

          <p style={styles.subtitle}>
            Manage all MediCare products
          </p>
        </div>

        <div style={styles.headerButtons}>

          <button
            style={styles.backButton}
            onClick={() => navigate("/admin/dashboard")}
          >
            ← Dashboard
          </button>

          <button
            style={styles.addButton}
            onClick={() => navigate("/admin/products/add")}
          >
            + Add Product
          </button>

        </div>

      </header>


      {/* ==========================
          PRODUCT COUNT
      ========================== */}

      <div style={styles.summary}>

        <div>
          <strong>
            Total Products:
          </strong>{" "}
          {products.length}
        </div>

      </div>


      {/* ==========================
          PRODUCTS
      ========================== */}

      {products.length === 0 ? (

        <div style={styles.empty}>
          <h2>No Products Found</h2>

          <p>
            Add your first medicine product.
          </p>

          <button
            style={styles.addButton}
            onClick={() => navigate("/admin/products/add")}
          >
            + Add Product
          </button>
        </div>

      ) : (

        <div style={styles.grid}>

          {products.map((product) => (

            <div
              key={product._id}
              style={styles.card}
            >

              {/* Product Image */}

              <div style={styles.imageContainer}>

                {product.image ? (

                  <img
                    src={product.image}
                    alt={product.name}
                    style={styles.image}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />

                ) : null}

                <div
                  style={{
                    ...styles.placeholder,
                    display: product.image
                      ? "none"
                      : "flex",
                  }}
                >
                  💊
                </div>

              </div>


              {/* Product Information */}

              <div style={styles.content}>

                <span style={styles.category}>
                  {product.category}
                </span>

                <h3 style={styles.productName}>
                  {product.name}
                </h3>

                <p style={styles.brand}>
                  Brand: {product.brand}
                </p>

                <p style={styles.manufacturer}>
                  {product.manufacturer}
                </p>

                <p style={styles.description}>
                  {product.description}
                </p>


                {/* Price & Stock */}

                <div style={styles.details}>

                  <strong>
                    ₹{product.price}
                  </strong>

                  <span
                    style={{
                      ...styles.stock,
                      color:
                        product.stock > 0
                          ? "#15803d"
                          : "#dc2626",
                    }}
                  >
                    Stock: {product.stock}
                  </span>

                </div>


                {/* Availability */}

                <p
                  style={{
                    ...styles.availability,
                    color: product.isAvailable
                      ? "#15803d"
                      : "#dc2626",
                  }}
                >
                  {product.isAvailable
                    ? "Available"
                    : "Unavailable"}
                </p>


                {/* Actions */}

                <div style={styles.actions}>

                  <button
                    style={styles.editButton}
                    onClick={() =>
                      navigate(
                        `/admin/products/edit/${product._id}`
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    style={styles.deleteButton}
                    onClick={() =>
                      handleDelete(product._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}


/* ==========================
   STYLES
========================== */

const styles = {

  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    paddingBottom: "50px",
  },

  header: {
    backgroundColor: "#ffffff",
    padding: "25px 50px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e5e7eb",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    color: "#172554",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#64748b",
  },

  headerButtons: {
    display: "flex",
    gap: "12px",
  },

  backButton: {
    backgroundColor: "#e2e8f0",
    color: "#334155",
    border: "none",
    padding: "10px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

  addButton: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

  summary: {
    margin: "25px 50px",
    backgroundColor: "#ffffff",
    padding: "18px 22px",
    borderRadius: "10px",
    color: "#334155",
  },

  grid: {
    padding: "0 50px",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow:
      "0 4px 15px rgba(0, 0, 0, 0.07)",
  },

  imageContainer: {
    height: "190px",
    backgroundColor: "#f1f5f9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    padding: "15px",
  },

  placeholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "55px",
  },

  content: {
    padding: "20px",
  },

  category: {
    display: "inline-block",
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    padding: "5px 10px",
    borderRadius: "15px",
    fontSize: "12px",
    fontWeight: "600",
  },

  productName: {
    margin: "12px 0 7px",
    fontSize: "20px",
    color: "#172554",
  },

  brand: {
    margin: "5px 0",
    fontWeight: "600",
    color: "#475569",
  },

  manufacturer: {
    margin: "5px 0",
    color: "#64748b",
    fontSize: "14px",
  },

  description: {
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  details: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "15px",
    fontSize: "18px",
  },

  stock: {
    fontSize: "14px",
    fontWeight: "600",
  },

  availability: {
    fontSize: "14px",
    fontWeight: "600",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },

  editButton: {
    flex: 1,
    backgroundColor: "#f59e0b",
    color: "#ffffff",
    border: "none",
    padding: "10px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

  deleteButton: {
    flex: 1,
    backgroundColor: "#ef4444",
    color: "#ffffff",
    border: "none",
    padding: "10px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  error: {
    color: "#dc2626",
    marginBottom: "20px",
  },

  empty: {
    margin: "50px",
    padding: "60px",
    backgroundColor: "#ffffff",
    textAlign: "center",
    borderRadius: "14px",
  },

};

export default AdminProducts;
