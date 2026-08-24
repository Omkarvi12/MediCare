import { Link } from "react-router-dom";
import { FaArrowRight, FaTruck } from "react-icons/fa6";

import "../styles/hero.css";

import doctor from "../assets/images/hero/doctor.png";

function Hero() {
  return (
    <section className="hero">

      <div className="container hero-container">

        {/* Left */}

        <div className="hero-content">

          <span className="hero-badge">
            <FaTruck />
            Trusted Online Pharmacy
          </span>

          <h1>
            Your Health,
            <br />
            Our Responsibility
          </h1>

          <p>
            Buy genuine medicines, healthcare products,
            wellness essentials and medical devices with
            fast delivery across India.
          </p>

          <div className="hero-buttons">

            <Link to="/products" className="btn-primary">
              Shop Now
              <FaArrowRight />
            </Link>

            <Link to="/register" className="btn-secondary">
              Join Now
            </Link>

          </div>

        </div>

        {/* Right */}

        <div className="hero-image">

          <img src={doctor} alt="Doctor" />

        </div>

      </div>

    </section>
  );
}

export default Hero;