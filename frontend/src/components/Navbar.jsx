import { Link, NavLink } from "react-router-dom";

import {
  FaHeartPulse,
  FaBars,
  FaCartShopping,
  FaUser,
  FaMagnifyingGlass,
} from "react-icons/fa6";

import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import "../styles/navbar.css";

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  const { isLoggedIn, logout } = useAuth();

  const { cartCount } = useCart();

  return (

    <header>

      <div className="container navbar-container">

        {/* ==========================
            LOGO
        ========================== */}

        <Link
          to="/"
          className="logo"
        >

          <FaHeartPulse className="logo-icon" />

          <span>
            MediCare
          </span>

        </Link>


        {/* ==========================
            SEARCH
        ========================== */}

        <div className="search-box">

          <input
            type="text"
            placeholder="Search Medicines..."
          />

          <button>

            <FaMagnifyingGlass />

          </button>

        </div>


        {/* ==========================
            NAVIGATION
        ========================== */}

        <nav
          className={
            menuOpen
              ? "nav-menu active"
              : "nav-menu"
          }
        >

          <NavLink to="/">
            Home
          </NavLink>

          <NavLink to="/products">
            Medicines
          </NavLink>

          <NavLink to="/orders">
            Orders
          </NavLink>

          <NavLink to="/cart">
            Cart
          </NavLink>

        </nav>


        {/* ==========================
            RIGHT ICONS
        ========================== */}

        <div className="right-icons">

          {/* Profile */}

          <Link to="/profile">

            <FaUser />

          </Link>


          {/* Cart */}

          <Link
            to="/cart"
            className="cart-icon"
          >

            <FaCartShopping />

            <span>
              {cartCount}
            </span>

          </Link>


          {/* Login / Logout */}

          {isLoggedIn ? (

            <button
              className="logout-btn"
              onClick={logout}
            >

              Logout

            </button>

          ) : (

            <Link
              to="/login"
              className="login-btn"
            >

              Login

            </Link>

          )}


          {/* Mobile Menu */}

          <button
            className="menu-btn"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
          >

            <FaBars />

          </button>

        </div>

      </div>

    </header>

  );

}

export default Navbar;