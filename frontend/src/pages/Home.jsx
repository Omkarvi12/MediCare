//import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Featured from "../components/Featured";
import OfferBanner from "../components/OfferBanner";
import WhyChoose from "../components/WhyChoose";
import Testimonials from "../components/Testimonials";
import Brands from "../components/Brands";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      {/* <Navbar /> */}
      <Hero />
      <Categories />
      <Featured />
      <OfferBanner />
      <WhyChoose />
      <Testimonials />
      <Brands />
      <Newsletter />
      <Footer />
    </>
  );
}

export default Home;