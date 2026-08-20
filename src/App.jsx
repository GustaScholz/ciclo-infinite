import Home from "./pages/Home";
import { CartProvider } from "./contexts/CartContext";
import CartDrawer from "./components/cart/CartDrawer";

function App() {
  return (
    <CartProvider>
      <Home />
      <CartDrawer />
    </CartProvider>
  );
}

export default App;
