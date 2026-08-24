import "../styles/whyChoose.css";

import {
  FaTruckFast,
  FaShieldHeart,
  FaHeadset,
  FaMoneyCheckDollar,
} from "react-icons/fa6";

function WhyChoose() {
  return (
    <section className="why">

      <div className="container">

        <div className="section-title">

          <h2>Why Choose MediCare?</h2>

          <p>
            Trusted healthcare with quality products and fast service.
          </p>

        </div>

        <div className="why-grid">

          <div className="why-card">
            <FaShieldHeart className="why-icon" />
            <h3>100% Genuine Medicines</h3>
            <p>
              All medicines are sourced directly from trusted suppliers.
            </p>
          </div>

          <div className="why-card">
            <FaTruckFast className="why-icon" />
            <h3>Fast Delivery</h3>
            <p>
              Quick doorstep delivery across India.
            </p>
          </div>

          <div className="why-card">
            <FaMoneyCheckDollar className="why-icon" />
            <h3>Secure Payments</h3>
            <p>
              Safe and encrypted online payment methods.
            </p>
          </div>

          <div className="why-card">
            <FaHeadset className="why-icon" />
            <h3>24×7 Support</h3>
            <p>
              Our support team is available anytime for assistance.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default WhyChoose;