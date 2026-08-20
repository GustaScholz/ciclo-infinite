import { useMemo, useState } from "react";

import products from "../../data/products";
import ProductModal from "./ProductModal";

function NewArrivals({ activeFilter }) {
  const assetUrl = (path) => path ? `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}` : "";
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    if (!activeFilter) return products.filter((product) => product.isNew);
    const value = activeFilter.value.toLowerCase().trim();
    if (activeFilter.type === "category") {
      if (value === "novidades") return products.filter((product) => product.isNew);
      return products.filter((product) => product.category.toLowerCase().includes(value));
    }
    if (activeFilter.type === "search") {
      return products.filter((product) => {
        const name = product.name.toLowerCase();
        const category = product.category.toLowerCase();
        return name.includes(value) || category.includes(value);
      });
    }
    return products.filter((product) => product.isNew);
  }, [activeFilter]);

  const title = activeFilter ? activeFilter.type === "category" ? activeFilter.value : `Resultado para "${activeFilter.value}"` : "Novidades";
  const subtitle = activeFilter ? "Confira os produtos encontrados no catálogo." : "Confira as peças mais recentes disponíveis no catálogo.";

  return (
    <section id="produtos" className="bg-white py-14 min-h-screen">
      <div className="max-w-7xl mx-auto px-5">
        <div className="mb-8">
          <p className="text-sm text-zinc-500 uppercase tracking-[3px]">Catálogo</p>
          <h2 className="text-3xl md:text-4xl font-black mt-1">{title}</h2>
          <p className="text-zinc-500 mt-3 max-w-xl">{subtitle}</p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center"><p className="text-xl font-bold">Nenhum produto encontrado</p><p className="text-zinc-500 mt-2">Tente pesquisar outro nome ou categoria.</p></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {filteredProducts.map((product) => (
              <button key={product.id} onClick={() => setSelectedProduct(product)} className="text-left group">
                <div className="aspect-[3/4] bg-zinc-100 rounded-2xl overflow-hidden">
                  <img src={assetUrl(product.images?.[0] || product.image)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-zinc-400 text-sm">Foto do produto</div>`; }} />
                </div>
                <div className="mt-3"><p className="text-xs text-zinc-500 uppercase tracking-[2px]">{product.category}</p><h3 className="font-semibold mt-1 leading-tight">{product.name}</h3><p className="text-zinc-800 font-medium mt-1">R$ {product.price.toFixed(2).replace(".", ",")}</p></div>
              </button>
            ))}
          </div>
        )}
      </div>
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  );
}

export default NewArrivals;
