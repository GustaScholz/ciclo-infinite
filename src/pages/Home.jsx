import { useState } from "react";

import Navbar from "../components/layout/Navbar";
import Banner from "../components/layout/Banner";
import NewArrivals from "../components/home/NewArrivals";
import Footer from "../components/layout/Footer";
import FloatingWhatsApp from "../components/layout/FloatingWhatsApp";

function Home() {
  const [activeFilter, setActiveFilter] = useState(null);

  function handleLogoClick() {
    setActiveFilter(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCategorySelect(category) {
    setActiveFilter({ type: "category", value: category });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSearchSubmit(term) {
    setActiveFilter({ type: "search", value: term });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const isProductPage = activeFilter !== null;

  return (
    <>
      <Navbar
        onLogoClick={handleLogoClick}
        onCategorySelect={handleCategorySelect}
        onSearchSubmit={handleSearchSubmit}
      />
      {!isProductPage && <Banner />}
      <NewArrivals activeFilter={activeFilter} />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

export default Home;
