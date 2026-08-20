import { createContext, useContext, useCallback, useEffect, useState } from "react";
import fallbackProducts from "../data/products";

const ProductContext = createContext({
  products: fallbackProducts,
  loading: false,
  refreshProducts: () => {},
});

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(true);

  const refreshProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}data/products.json?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Não foi possível carregar os produtos");
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Formato de produtos inválido");
      setProducts(data);
    } catch (error) {
      console.warn("Usando catálogo de segurança:", error);
      setProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  return (
    <ProductContext.Provider value={{ products, loading, refreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
