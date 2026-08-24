import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const { isLoggedIn } = useAuth();

  const [cart, setCart] = useState([]);

  const [cartCount, setCartCount] = useState(0);

  // ==========================
  // Fetch Cart
  // ==========================

  const fetchCart = async () => {

    if (!isLoggedIn) {

      setCart([]);

      setCartCount(0);

      return;

    }

    try {

      const response = await api.get("/cart");

      const cartData = response.data.cart || [];

      setCart(cartData);

      // Total quantity
      const totalQuantity = cartData.reduce(
        (total, item) => total + item.quantity,
        0
      );

      setCartCount(totalQuantity);

    } catch (error) {

      console.error(
        "Cart Fetch Error:",
        error
      );

    }

  };

  // ==========================
  // Fetch When Login Changes
  // ==========================

  useEffect(() => {

    fetchCart();

  }, [isLoggedIn]);

  // ==========================
  // Refresh Cart
  // ==========================

  const refreshCart = () => {

    fetchCart();

  };

  return (

    <CartContext.Provider
      value={{
        cart,
        cartCount,
        refreshCart,
      }}
    >

      {children}

    </CartContext.Provider>

  );

};

export const useCart = () => useContext(CartContext);