import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import "./index.css";
import "./styles/global.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <BrowserRouter>

      <AuthProvider>

        <CartProvider>

          <App />

          <ToastContainer
            position="top-right"
            autoClose={2500}
            newestOnTop
            pauseOnFocusLoss
          />

        </CartProvider>

      </AuthProvider>

    </BrowserRouter>

  </React.StrictMode>

);
