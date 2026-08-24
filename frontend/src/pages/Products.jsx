import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaCartPlus,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import { toast } from "react-toastify";

import api from "../api/api";
import { useCart } from "../context/CartContext";

import "../styles/products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [error, setError] = useState("");
  const [cartStatus, setCartStatus] = useState({});

  const { refreshCart } = useCart();

  // ==========================
  // Fetch Products
  // ==========================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products");

        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Products Fetch Error:", error);

        setError(
          error.response?.data?.message ||
          "Unable to fetch products"
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

  const addToCart = async (productId) => {
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
      console.error("Add To Cart Error:", error);

      setCartStatus((previous) => ({
        ...previous,
        [productId]: "",
      }));

      toast.error(
        error.response?.data?.message ||
        "Unable to add product to cart"
      );
    }
  };

  // ==========================
  // Filter + Search + Sort
  // ==========================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (search.trim() !== "") {
      const searchText = search.toLowerCase().trim();

      result = result.filter(
        (product) =>
          product.name
            ?.toLowerCase()
            .includes(searchText) ||
          product.description
            ?.toLowerCase()
            .includes(searchText) ||
          product.brand
            ?.toLowerCase()
            .includes(searchText)
      );
    }

    // Category
    if (category !== "All") {
      result = result.filter(
        (product) =>
          product.category === category
      );
    }

    // Sort
    if (sort === "price-low") {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    if (sort === "name") {
      result.sort(
        (a, b) =>
          a.name.localeCompare(b.name)
      );
    }

    if (sort === "rating") {
      result.sort(
        (a, b) =>
          (b.rating || 0) -
          (a.rating || 0)
      );
    }

    return result;
  }, [
    products,
    search,
    category,
    sort,
  ]);

  // ==========================
  // Categories
  // ==========================

  const categories = [
    "All",
    "Tablet",
    "Capsule",
    "Syrup",
    "Injection",
    "Cream",
    "Drops",
    "Medical Device",
  ];

  // ==========================
  // Loading
  // ==========================

  if (loading) {
    return (
      <section className="products-page">
        <div className="container">
          <div className="products-loading">
            <h2>
              Loading Medicines...
            </h2>

            <p>
              Please wait...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ==========================
  // Error
  // ==========================

  if (error) {
    return (
      <section className="products-page">
        <div className="container">
          <div className="products-error">
            <h2>
              Something went wrong
            </h2>

            <p>
              {error}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ==========================
  // UI
  // ==========================

  return (
    <section className="products-page">
      <div className="container">

        {/* ==========================
            PAGE HEADER
        ========================== */}

        <div className="products-header">

          <div>
            <h1>
              Medicines & Healthcare
            </h1>

            <p>
              Find medicines and healthcare
              products at MediCare.
            </p>
          </div>

          <div className="product-count">

            <strong>
              {filteredProducts.length}
            </strong>

            <span>
              Products
            </span>

          </div>

        </div>

        {/* ==========================
            SEARCH + SORT
        ========================== */}

        <div className="products-toolbar">

          <div className="product-search">

            <FaMagnifyingGlass />

            <input
              type="text"
              placeholder="Search medicines..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
          >
            <option value="default">
              Sort By
            </option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>

            <option value="name">
              Name: A-Z
            </option>

            <option value="rating">
              Rating
            </option>
          </select>

        </div>

        {/* ==========================
            CATEGORY FILTER
        ========================== */}

        <div className="category-filter">

          {categories.map((item) => (

            <button
              key={item}
              className={
                category === item
                  ? "category-active"
                  : ""
              }
              onClick={() =>
                setCategory(item)
              }
            >
              {item}
            </button>

          ))}

        </div>

        {/* ==========================
            PRODUCTS
        ========================== */}

        {filteredProducts.length === 0 ? (

          <div className="no-products">

            <h2>
              No Products Found
            </h2>

            <p>
              Try another medicine name
              or category.
            </p>

          </div>

        ) : (

          <div className="products-grid">

            {filteredProducts.map(
              (product) => (

                <div
                  className="product-card"
                  key={product._id}
                >

                  {/* ==========================
                      PRODUCT IMAGE
                  ========================== */}

                  <Link
                    to={`/product/${product._id}`}
                    className="product-image"
                  >

                    <img
                      src={
                        product.image
                          ? product.image.startsWith(
                              "http"
                            )
                            ? product.image
                            : `http://localhost:5000/uploads/${product.image}`
                          : "/placeholder.png"
                      }
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "/placeholder.png";
                      }}
                    />

                  </Link>

                  {/* ==========================
                      CATEGORY
                  ========================== */}

                  <span className="product-category">
                    {product.category}
                  </span>

                  {/* ==========================
                      NAME
                  ========================== */}

                  <Link
                    to={`/product/${product._id}`}
                    className="product-name"
                  >
                    <h3>
                      {product.name}
                    </h3>
                  </Link>

                  {/* ==========================
                      DESCRIPTION
                  ========================== */}

                  <p className="product-description">
                    {product.description}
                  </p>

                  {/* ==========================
                      RATING
                  ========================== */}

                  <div className="product-rating">

                    <FaStar />

                    <span>
                      {product.rating > 0
                        ? product.rating
                        : "New"}
                    </span>

                  </div>

                  {/* ==========================
                      PRICE
                  ========================== */}

                  <div className="product-price">
                    ₹{product.price}
                  </div>

                  {/* ==========================
                      STOCK
                  ========================== */}

                  <div
                    className={
                      product.stock > 0
                        ? "product-stock in-stock"
                        : "product-stock out-stock"
                    }
                  >
                    {product.stock > 0
                      ? `In Stock (${product.stock})`
                      : "Out Of Stock"}
                  </div>

                  {/* ==========================
                      BUTTONS
                  ========================== */}

                  <div className="product-actions">

                    <Link
                      to={`/product/${product._id}`}
                      className="view-product-btn"
                    >
                      View Details
                    </Link>

                    <button
                      className="add-cart-btn"
                      disabled={
                        product.stock <= 0 ||
                        cartStatus[product._id] === "adding"
                      }
                      onClick={() =>
                        addToCart(product._id)
                      }
                    >

                      <FaCartPlus />

                      {product.stock <= 0
                        ? "Unavailable"
                        : cartStatus[product._id] === "adding"
                          ? "Adding..."
                          : cartStatus[product._id] === "added"
                            ? "Added ✓"
                            : "Add"}

                    </button>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>
    </section>
  );
}

export default Products;
