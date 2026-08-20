import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => { localStorage.setItem("cartItems", JSON.stringify(cartItems)); }, [cartItems]);

  function addToCart(product, size) {
    if (!size) return { success: false, message: "Selecione um tamanho antes de adicionar" };
    const itemId = `${product.id}-${size}`;
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.itemId === itemId);
      if (existingItem) return prevItems.map((item) => item.itemId === itemId ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prevItems, { itemId, id: product.id, name: product.name, category: product.category, price: product.price, image: product.images?.[0] || product.image, size, quantity: 1 }];
    });
    return { success: true, message: "Produto adicionado ao carrinho" };
  }

  function increaseQuantity(itemId) { setCartItems((prevItems) => prevItems.map((item) => item.itemId === itemId ? { ...item, quantity: item.quantity + 1 } : item)); }
  function decreaseQuantity(itemId) { setCartItems((prevItems) => prevItems.map((item) => item.itemId === itemId ? { ...item, quantity: item.quantity - 1 } : item).filter((item) => item.quantity > 0)); }
  function removeItem(itemId) { setCartItems((prevItems) => prevItems.filter((item) => item.itemId !== itemId)); }
  function clearCart() { setCartItems([]); }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return <CartContext.Provider value={{ cartItems, cartOpen, setCartOpen, addToCart, increaseQuantity, decreaseQuantity, removeItem, clearCart, cartCount, cartTotal }}>{children}</CartContext.Provider>;
}

export function useCart() { return useContext(CartContext); }
