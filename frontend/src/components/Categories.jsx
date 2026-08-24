import "../styles/categories.css";

import tablets from "../assets/images/categories/tablets.png";
import syrups from "../assets/images/categories/syrups.png";
import injections from "../assets/images/categories/injections.png";
import devices from "../assets/images/categories/devices.png";
import babyCare from "../assets/images/categories/baby-care.png";
import healthDrinks from "../assets/images/categories/health-drinks.png";

const categories = [
  {
    id: 1,
    title: "Tablets",
    image: tablets,
  },
  {
    id: 2,
    title: "Syrups",
    image: syrups,
  },
  {
    id: 3,
    title: "Injections",
    image: injections,
  },
  {
    id: 4,
    title: "Medical Devices",
    image: devices,
  },
  {
    id: 5,
    title: "Baby Care",
    image: babyCare,
  },
  {
    id: 6,
    title: "Health Drinks",
    image: healthDrinks,
  },
];

function Categories() {
  return (
    <section className="categories">

      <div className="container">

        <div className="section-title">

          <h2>Shop by Categories</h2>

          <p>
            Find medicines and healthcare products by category.
          </p>

        </div>

        <div className="categories-grid">

          {categories.map((category) => (

            <div className="category-card" key={category.id}>

              <img
                src={category.image}
                alt={category.title}
              />

              <h3>{category.title}</h3>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Categories;