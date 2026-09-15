import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import { toast } from "react-toastify";
import "../styles/adminAddProduct.css";

function AdminAddProduct() {

  const navigate = useNavigate();
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Tablet",
    brand: "",
    manufacturer: "",
    price: "",
    stock: "",
    expiryDate: "",
    prescriptionRequired: false,
  });

  // Product Image
  const [image, setImage] = useState(null);


  // ==========================
  // Handle Input Change
  // ==========================

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked
    } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });

  };


  // ==========================
  // Handle Image
  // ==========================

  const handleImageChange = (e) => {

    const selectedImage =
      e.target.files[0];

    if (!selectedImage) {
      return;
    }


    // Only image files
    if (!selectedImage.type.startsWith("image/")) {

      toast.error("Please select a valid image file");

      e.target.value = "";

      return;
    }


    // 5 MB limit
    if (selectedImage.size > 5 * 1024 * 1024) {

      toast.error("Image size must be less than 5 MB");

      e.target.value = "";

      return;
    }


    setImage(selectedImage);

  };


  // ==========================
  // Submit Product
  // ==========================

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!image) {

      toast.error("Please select a product image");

      return;

    }


    try {

      setLoading(true);


      // ==========================
      // Create FormData
      // ==========================

      const productData = new FormData();


      productData.append(
        "name",
        formData.name
      );

      productData.append(
        "description",
        formData.description
      );

      productData.append(
        "category",
        formData.category
      );

      productData.append(
        "brand",
        formData.brand
      );

      productData.append(
        "manufacturer",
        formData.manufacturer
      );

      productData.append(
        "price",
        Number(formData.price)
      );

      productData.append(
        "stock",
        Number(formData.stock)
      );

      productData.append(
        "expiryDate",
        formData.expiryDate
      );

      productData.append(
        "prescriptionRequired",
        formData.prescriptionRequired
      );

      // IMPORTANT
      productData.append(
        "image",
        image
      );


      // ==========================
      // API Request
      // ==========================

      const response = await api.post(
        "/products",
        productData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      toast.success(
        response.data.message ||
        "Product Added Successfully ✅"
      );


      navigate(
        "/admin/products"
      );


    } catch (error) {

      console.error(
        "Add Product Error:",
        error
      );


      toast.error(
        error.response?.data?.message ||
        "Failed to add product"
      );


    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="admin-add-product-page">


      {/* ==========================
          HEADER
      ========================== */}

      <header className="admin-product-header">

        <div>

          <h1>
            MediCare Admin
          </h1>

          <p>
            Add New Product
          </p>

        </div>


        <button
          className="dashboard-btn"
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          Dashboard
        </button>

      </header>


      {/* ==========================
          MAIN
      ========================== */}

      <main className="admin-product-main">


        <div className="page-heading">

          <div>

            <span className="page-label">
              ADMIN PANEL
            </span>

            <h2>
              Add New Product
            </h2>

            <p>
              Add a new medicine to your MediCare
              inventory.
            </p>

          </div>


          <button
            className="back-products-btn"
            onClick={() =>
              navigate("/admin/products")
            }
          >
            ← Products
          </button>

        </div>


        {/* ==========================
            FORM
        ========================== */}

        <form
          className="product-form"
          onSubmit={handleSubmit}
        >


          {/* ==========================
              BASIC INFORMATION
          ========================== */}

          <div className="form-section">

            <div className="section-heading">

              <h3>
                Basic Information
              </h3>

              <p>
                Enter the basic details of the medicine.
              </p>

            </div>


            <div className="form-grid">


              {/* Product Name */}

              <div className="form-group">

                <label>
                  Product Name *
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Paracetamol 500mg"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* Category */}

              <div className="form-group">

                <label>
                  Category *
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


              {/* Description */}

              <div className="form-group full-width">

                <label>
                  Description *
                </label>

                <textarea
                  name="description"
                  placeholder="Enter medicine description..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  required
                />

              </div>

            </div>

          </div>


          {/* ==========================
              MANUFACTURER
          ========================== */}

          <div className="form-section">

            <div className="section-heading">

              <h3>
                Manufacturer Information
              </h3>

              <p>
                Enter brand and manufacturer details.
              </p>

            </div>


            <div className="form-grid">


              <div className="form-group">

                <label>
                  Brand *
                </label>

                <input
                  type="text"
                  name="brand"
                  placeholder="MediCare"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Manufacturer *
                </label>

                <input
                  type="text"
                  name="manufacturer"
                  placeholder="MediCare Pharmaceuticals"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

          </div>


          {/* ==========================
              INVENTORY
          ========================== */}

          <div className="form-section">

            <div className="section-heading">

              <h3>
                Inventory & Pricing
              </h3>

              <p>
                Enter price, stock and expiry information.
              </p>

            </div>


            <div className="form-grid">


              <div className="form-group">

                <label>
                  Price (₹) *
                </label>

                <input
                  type="number"
                  name="price"
                  placeholder="50"
                  min="1"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Stock *
                </label>

                <input
                  type="number"
                  name="stock"
                  placeholder="100"
                  min="1"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Expiry Date *
                </label>

                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

          </div>


          {/* ==========================
              PRODUCT IMAGE
          ========================== */}

          <div className="form-section">

            <div className="section-heading">

              <h3>
                Product Image
              </h3>

              <p>
                Upload the medicine image.
              </p>

            </div>


            <div className="form-group">

              <label>
                Product Image *
              </label>


              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                required
              />


              <small>
                JPG, JPEG, PNG, WEBP — Maximum 5 MB
              </small>


              {/* Selected Image */}

              {image && (

                <div
                  style={{
                    marginTop: "15px"
                  }}
                >

                  <p>
                    Selected Image:
                    <strong>
                      {" "}
                      {image.name}
                    </strong>
                  </p>

                  <img
                    src={URL.createObjectURL(image)}
                    alt="Product Preview"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "contain",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      padding: "5px"
                    }}
                  />

                </div>

              )}

            </div>

          </div>


          {/* ==========================
              PRESCRIPTION
          ========================== */}

          <div className="prescription-box">

            <input
              type="checkbox"
              id="prescriptionRequired"
              name="prescriptionRequired"
              checked={
                formData.prescriptionRequired
              }
              onChange={handleChange}
            />


            <div>

              <label
                htmlFor="prescriptionRequired"
              >
                Prescription Required
              </label>

              <p>
                Enable this if the medicine requires
                a valid prescription.
              </p>

            </div>

          </div>


          {/* ==========================
              BUTTONS
          ========================== */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                navigate("/admin/products")
              }
            >
              Cancel
            </button>


            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >

              {loading
                ? "Uploading Product..."
                : "Add Product"}

            </button>

          </div>


        </form>

      </main>

    </div>

  );

}

export default AdminAddProduct;
