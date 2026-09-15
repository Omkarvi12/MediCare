import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

import "../styles/adminEditProduct.css";

function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Tablet",
    brand: "",
    manufacturer: "",
    price: "",
    stock: "",
    image: "",
    expiryDate: "",
    prescriptionRequired: false,
  });

  // ==========================
  // Fetch Product
  // ==========================

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/products/${id}`);

      const product = response.data.product;

      setFormData({
        name: product.name || "",
        description: product.description || "",
        category: product.category || "Tablet",
        brand: product.brand || "",
        manufacturer: product.manufacturer || "",
        price: product.price || "",
        stock: product.stock ?? "",
        image: product.image || "",
        expiryDate: product.expiryDate
          ? product.expiryDate.split("T")[0]
          : "",
        prescriptionRequired:
          product.prescriptionRequired || false,
      });

    } catch (error) {
      console.error("Fetch Product Error:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch product"
      );

      navigate("/admin/products");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);


  // ==========================
  // Handle Change
  // ==========================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };


  // ==========================
  // Update Product
  // ==========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      await api.put(
        `/products/${id}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product updated successfully");

      navigate("/admin/products");

    } catch (error) {
      console.error("Update Product Error:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to update product"
      );

    } finally {
      setSaving(false);
    }
  };


  // ==========================
  // Loading
  // ==========================

  if (loading) {
    return (
      <div className="edit-loading">
        <h2>Loading Product...</h2>
      </div>
    );
  }


  return (
    <div className="admin-edit-page">

      {/* HEADER */}

      <header className="edit-header">

        <div>
          <h1>MediCare Admin</h1>

          <p>
            Edit Product
          </p>
        </div>

        <button
          className="back-button"
          onClick={() =>
            navigate("/admin/products")
          }
        >
          ← Products
        </button>

      </header>


      {/* MAIN */}

      <main className="edit-main">

        <div className="edit-heading">

          <h2>
            Edit Product
          </h2>

          <p>
            Update medicine information and inventory.
          </p>

        </div>


        {/* FORM */}

        <form
          className="edit-form"
          onSubmit={handleSubmit}
        >

          {/* Product Name */}

          <div className="form-group">

            <label>
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>


          {/* Description */}

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />

          </div>


          {/* Category */}

          <div className="form-group">

            <label>
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >

              <option value="Tablet">
                Tablet
              </option>

              <option value="Capsule">
                Capsule
              </option>

              <option value="Syrup">
                Syrup
              </option>

              <option value="Injection">
                Injection
              </option>

              <option value="Cream">
                Cream
              </option>

              <option value="Drops">
                Drops
              </option>

              <option value="Medical Device">
                Medical Device
              </option>

            </select>

          </div>


          {/* Brand */}

          <div className="form-group">

            <label>
              Brand
            </label>

            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
            />

          </div>


          {/* Manufacturer */}

          <div className="form-group">

            <label>
              Manufacturer
            </label>

            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              required
            />

          </div>


          {/* Price */}

          <div className="form-group">

            <label>
              Price (₹)
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="1"
              required
            />

          </div>


          {/* Stock */}

          <div className="form-group">

            <label>
              Stock
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
            />

          </div>


          {/* Image */}

          <div className="form-group">

            <label>
              Image URL
            </label>

            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />

          </div>


          {/* Expiry */}

          <div className="form-group">

            <label>
              Expiry Date
            </label>

            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
            />

          </div>


          {/* Prescription */}

          <div className="checkbox-group">

            <input
              type="checkbox"
              id="prescriptionRequired"
              name="prescriptionRequired"
              checked={formData.prescriptionRequired}
              onChange={handleChange}
            />

            <label htmlFor="prescriptionRequired">
              Prescription Required
            </label>

          </div>


          {/* ACTIONS */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate("/admin/products")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="update-button"
              disabled={saving}
            >
              {saving
                ? "Updating..."
                : "Update Product"}
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default AdminEditProduct;
