import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import { CartProvider } from "./contexts/CartContext";
import { ProductProvider } from "./contexts/ProductContext";
import CartDrawer from "./components/cart/CartDrawer";

function App() {
  const [route, setRoute] = useState(window.location.hash || "#/");

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (route === "#/admin") return <Admin />;

  return (
    <ProductProvider>
      <CartProvider>
        <Home />
        <CartDrawer />
      </CartProvider>
    </ProductProvider>
  );
}

export default App;
