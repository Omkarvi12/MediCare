import "../styles/brands.css";

import medlifeplus from "../assets/images/brands/medlife-plus.png";
import vitacare from "../assets/images/brands/vitacare.png";
import healthnova from "../assets/images/brands/healthnova.png";
import bioheal from "../assets/images/brands/bioheal.png";
import wellcure from "../assets/images/brands/wellcure.png";
import careplus from "../assets/images/brands/careplus.png";
import puremeds from "../assets/images/brands/puremeds.png";
import meditrust from "../assets/images/brands/meditrust.png";

const brands = [
  {
    id: 1,
    image: medlifeplus,
    name: "MedLife Plus",
  },
  {
    id: 2,
    image: vitacare,
    name: "VitaCare",
  },
  {
    id: 3,
    image: healthnova,
    name: "HealthNova",
  },
  {
    id: 4,
    image: bioheal,
    name: "BioHeal",
  },
  {
    id: 5,
    image: wellcure,
    name: "WellCure",
  },
  {
    id: 6,
    image: careplus,
    name: "CarePlus",
  },
  {
    id: 7,
    image: puremeds,
    name: "PureMeds",
  },
  {
    id: 8,
    image: meditrust,
    name: "MediTrust",
  },
];

function Brands() {
  return (
    <section className="brands">

      <div className="container">

        <div className="section-title">

          <h2>Our Trusted Partners</h2>

          <p>
            Trusted healthcare brands delivering quality medicines
            and wellness products.
          </p>

        </div>

        <div className="brands-grid">

          {brands.map((brand) => (

            <div className="brand-card" key={brand.id}>

              <img
                src={brand.image}
                alt={brand.name}
              />

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Brands;