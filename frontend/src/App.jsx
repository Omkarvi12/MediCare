import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

import AdminProducts from "./pages/AdminProducts";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminRoute from "./components/AdminRoute";
import AdminOrders from "./pages/AdminOrders";
import AdminEditProduct from "./pages/AdminEditProduct";
import AdminUsers from "./pages/AdminUsers";
function App() {
  return (
    <Routes>

      {/* ==========================
          PUBLIC ROUTES
      ========================== */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/products"
        element={<Products />}
      />

      <Route
        path="/product/:id"
        element={<ProductDetails />}
      />
      {/* ==========================
          PROTECTED - CART
      ========================== */}

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />


      {/* ==========================
          PROTECTED - CHECKOUT
      ========================== */}

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />


      {/* ==========================
          PROTECTED - ORDERS
      ========================== */}

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />


      {/* ==========================
          PROTECTED - ORDER DETAILS
      ========================== */}

      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }
      />


      {/* ==========================
          PROTECTED - PROFILE
      ========================== */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />


      {/* ==========================
          ADMIN DASHBOARD
      ========================== */}

      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* ==========================
          ADMIN PRODUCTS
      ========================== */}

      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        }

      />
      <Route
  path="/admin/products/add"
  element={
    <AdminRoute>
      <AdminAddProduct />
    </AdminRoute>
  }
/>
<Route
  path="/admin/products/edit/:id"
  element={
    <AdminRoute>
      <AdminEditProduct />
    </AdminRoute>
  }
/>
<Route
  path="/admin/users"
  element={
    <AdminRoute>
      <AdminUsers />
    </AdminRoute>
  }
/>
<Route
  path="/admin/orders"
  element={
    <AdminRoute>
      <AdminOrders />
    </AdminRoute>
  }
/>

    </Routes>
    
  );
}

export default App;
