import { useMemo, useState } from "react";
import { useProducts } from "../../contexts/ProductContext";
import ProductModal from "./ProductModal";

function NewArrivals({ activeFilter }) {
  const assetUrl = (path) => path ? `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}` : "";
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products, loading } = useProducts();

  const filteredProducts = useMemo(() => {
    const visibleProducts = products.filter((product) => product.active !== false);
    if (!activeFilter) return visibleProducts.filter((product) => product.isNew);
    const value = activeFilter.value.toLowerCase().trim();
    if (activeFilter.type === "category") {
      if (value === "novidades") return visibleProducts.filter((product) => product.isNew);
      return visibleProducts.filter((product) => product.category.toLowerCase().includes(value));
    }
    if (activeFilter.type === "search") return visibleProducts.filter((product) => product.name.toLowerCase().includes(value) || product.category.toLowerCase().includes(value));
    return visibleProducts.filter((product) => product.isNew);
  }, [activeFilter, products]);

  const title = activeFilter ? activeFilter.type === "category" ? activeFilter.value : `Resultado para "${activeFilter.value}"` : "Novidades";
  const subtitle = activeFilter ? "Confira os produtos encontrados no catálogo." : "Confira as peças mais recentes disponíveis no catálogo.";

  return (
    <section id="produtos" className="bg-white py-12 sm:py-14 min-h-[60vh]">
      <div className="site-container">
        <div className="mb-8"><p className="text-sm text-zinc-500 uppercase tracking-[3px]">Catálogo</p><h2 className="text-3xl md:text-4xl font-black mt-1">{title}</h2><p className="text-zinc-500 mt-3 max-w-xl">{subtitle}</p></div>
        {loading ? <div className="py-16 text-center text-zinc-500">Carregando catálogo...</div> : filteredProducts.length === 0 ? (
          <div className="py-16 text-center"><p className="text-xl font-bold">Nenhum produto encontrado</p><p className="text-zinc-500 mt-2">Tente pesquisar outro nome ou categoria.</p></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-5 gap-y-9 sm:gap-y-10">
            {filteredProducts.map((product) => {
              const soldOut = (product.sizes || []).length === 0;
              return <button key={product.id} onClick={() => setSelectedProduct(product)} className="text-left group min-w-0">
                <div className="aspect-[3/4] bg-zinc-100 rounded-2xl overflow-hidden relative">
                  <img src={assetUrl(product.images?.[0] || product.image)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                  {soldOut && <span className="absolute top-3 left-3 bg-black text-white text-[10px] uppercase tracking-[2px] px-3 py-2 rounded-full">Esgotado</span>}
                </div>
                <div className="mt-3"><p className="text-xs text-zinc-500 uppercase tracking-[2px] truncate">{product.category}</p><h3 className="font-semibold mt-1 leading-tight break-words">{product.name}</h3><p className="text-zinc-800 font-medium mt-1">R$ {Number(product.price).toFixed(2).replace(".", ",")}</p></div>
              </button>;
            })}
          </div>
        )}
      </div>
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  );
}

export default NewArrivals;
