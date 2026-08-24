import "../styles/testimonials.css";

import customer1 from "../assets/images/testimonials/customer1.png";
import customer2 from "../assets/images/testimonials/customer2.png";
import customer3 from "../assets/images/testimonials/customer3.png";
import customer4 from "../assets/images/testimonials/customer4.png";

import { FaStar } from "react-icons/fa";

const reviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    image: customer1,
    review:
      "Very fast delivery and genuine medicines. Highly recommended.",
  },
  {
    id: 2,
    name: "Priya Verma",
    image: customer2,
    review:
      "Best online pharmacy. Excellent customer support.",
  },
  {
    id: 3,
    name: "Aman Singh",
    image: customer3,
    review:
      "Affordable prices with quality products.",
  },
  {
    id: 4,
    name: "Sneha Patel",
    image: customer4,
    review:
      "Easy ordering process and quick delivery.",
  },
];

function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">

        <div className="section-title">
          <h2>What Our Customers Say</h2>
          <p>Trusted by thousands of happy customers.</p>
        </div>

        <div className="testimonial-grid">

          {reviews.map((item) => (
            <div className="testimonial-card" key={item.id}>

              <div className="testimonial-image">
                <img
                  src={item.image}
                  alt={item.name}
                />
              </div>

              <h3>{item.name}</h3>

              <div className="stars">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>

              <p>{item.review}</p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Testimonials;