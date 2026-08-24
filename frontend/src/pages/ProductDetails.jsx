import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { BsCartPlus } from "react-icons/bs";
import { toast } from "react-toastify";

import api from "../api/api";
import { useCart } from "../context/CartContext";

import "../styles/productDetails.css";

function ProductDetails() {

  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const { refreshCart } = useCart();

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const response = await api.get(`/products/${id}`);

        setProduct(response.data.product);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    fetchProduct();

  }, [id]);

  const handleAddToCart = async () => {
    if (addingToCart || product.stock <= 0) {
      return;
    }

    try {
      setAddingToCart(true);

      await api.post("/cart", {
        productId: product._id,
        quantity: 1,
      });

      await refreshCart();

      setAddedToCart(true);
      toast.success("Product added to cart");

      window.setTimeout(() => {
        setAddedToCart(false);
      }, 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Unable to add product to cart"
      );
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {

    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  }

  if (!product) {

    return <h2 style={{ textAlign: "center" }}>Product Not Found</h2>;

  }

  return (

    <section className="product-details">

      <div className="container">

        <div className="product-wrapper">

          <div className="product-image">

            <img
              src={`http://localhost:5000/uploads/${product.image}`}
              alt={product.name}
            />

          </div>

          <div className="product-info">

            <span className="category">

              {product.category}

            </span>

            <h1>{product.name}</h1>

            <div className="rating">

              <FaStar />

              <span>{product.rating || 4.5}</span>

            </div>

            <h2>₹{product.price}</h2>

            <p>

              {product.description}

            </p>

            <div className="info">

              <p>

                <strong>Brand :</strong> {product.brand}

              </p>

              <p>

                <strong>Manufacturer :</strong> {product.manufacturer}

              </p>

              <p>

                <strong>Stock :</strong> {product.stock}

              </p>

            </div>

            <button
              className="cart-btn"
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || addingToCart}
            >

              <BsCartPlus />

              {product.stock <= 0
                ? "Out Of Stock"
                : addingToCart
                  ? "Adding..."
                  : addedToCart
                    ? "Added ✓"
                    : "Add To Cart"}

            </button>

          </div>

        </div>

      </div>

    </section>

  );

}

export default ProductDetails;
