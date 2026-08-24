import "../styles/newsletter.css";

import {
  FaPaperPlane,
  FaUser,
  FaEnvelope,
  FaCheckCircle,
} from "react-icons/fa";

function Newsletter() {
  return (
    <section className="newsletter">

      <div className="container newsletter-container">

        {/* Left */}

        <div className="newsletter-content">

          <span className="newsletter-tag">
            Stay Connected
          </span>

          <h2>
            Subscribe to MediCare Newsletter
          </h2>

          <p>
            Get exclusive discounts, medicine offers,
            healthcare tips and wellness updates directly
            in your inbox.
          </p>

          <div className="newsletter-benefits">

            <div>
              <FaCheckCircle />
              Weekly Health Tips
            </div>

            <div>
              <FaCheckCircle />
              Exclusive Medicine Offers
            </div>

            <div>
              <FaCheckCircle />
              New Product Updates
            </div>

            <div>
              <FaCheckCircle />
              Special Member Discounts
            </div>

          </div>

        </div>

        {/* Right */}

        <div className="newsletter-form-box">

          <h3>Join 25,000+ Happy Subscribers</h3>

          <form>

            <div className="input-box">
              <FaUser />
              <input
                type="text"
                placeholder="Full Name"
              />
            </div>

            <div className="input-box">
              <FaEnvelope />
              <input
                type="email"
                placeholder="Email Address"
              />
            </div>

            <button type="submit">

              Subscribe Now

              <FaPaperPlane />

            </button>

          </form>

        </div>

      </div>

    </section>
  );
}

export default Newsletter;