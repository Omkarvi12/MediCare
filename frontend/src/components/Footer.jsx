import "../styles/footer.css";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowUp,
} from "react-icons/fa";

import { Link } from "react-router-dom";

function Footer() {

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">

      <div className="container footer-container">

        {/* Company */}

        <div className="footer-box">

          <h2>MediCare</h2>

          <p>
            India's trusted online pharmacy providing genuine
            medicines, healthcare products and wellness essentials
            with fast delivery.
          </p>

          <div className="footer-social">

            <a href="#">
              <FaFacebookF />
            </a>

            <a href="#">
              <FaInstagram />
            </a>

            <a href="#">
              <FaTwitter />
            </a>

            <a href="#">
              <FaLinkedinIn />
            </a>

          </div>

        </div>

        {/* Quick Links */}

        <div className="footer-box">

          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>

        </div>

        {/* Categories */}

        <div className="footer-box">

          <h3>Categories</h3>

          <Link to="/products">Tablets</Link>
          <Link to="/products">Syrups</Link>
          <Link to="/products">Devices</Link>
          <Link to="/products">Health Drinks</Link>

        </div>

        {/* Contact */}

        <div className="footer-box">

          <h3>Contact</h3>

          <p>
            <FaPhoneAlt />
            +91 9876543210
          </p>

          <p>
            <FaEnvelope />
            support@medicare.com
          </p>

          <p>
            <FaMapMarkerAlt />
            Lucknow, Uttar Pradesh
          </p>

        </div>

      </div>

      {/* Bottom */}

      <div className="footer-bottom">

        <p>
          © 2026 MediCare. All Rights Reserved.
        </p>

        <button onClick={scrollTop}>
          <FaArrowUp />
        </button>

      </div>

    </footer>
  );
}

export default Footer;