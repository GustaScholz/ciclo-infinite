import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useProducts } from "../../contexts/ProductContext";
import ProductModal from "../home/ProductModal";

function SearchModal({ open, setOpen, onSearchSubmit }) {
  const assetUrl = (path) => path ? `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}` : "";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products } = useProducts();

  const filteredProducts = useMemo(() => {
    const visible = products.filter((product) => product.active !== false);
    const term = searchTerm.toLowerCase().trim();
    if (!term) return visible.slice(0, 4);
    return visible.filter((product) => product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term)).slice(0, 4);
  }, [searchTerm, products]);

  function closeSearch() { setOpen(false); setSearchTerm(""); }
  function handleViewAll() { if (!searchTerm.trim()) return; onSearchSubmit(searchTerm); closeSearch(); }
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-white/70 backdrop-blur-xl overflow-y-auto">
        <div className="site-container py-6 sm:py-8">
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            <div className="relative w-full max-w-3xl"><Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" /><input autoFocus type="text" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Buscar" className="w-full h-14 sm:h-16 border border-black bg-white/80 backdrop-blur-md pl-14 pr-14 outline-none text-[15px]" />{searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-5 top-1/2 -translate-y-1/2 bg-zinc-300 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-zinc-500 transition"><X size={17} /></button>}</div>
            <button onClick={closeSearch} className="hover:opacity-60 transition shrink-0"><X size={28} /></button>
          </div>
          <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-[1fr_260px] gap-10">
            <div><p className="text-sm font-medium mb-5">Produtos</p>{filteredProducts.length === 0 ? <div><p className="text-lg font-bold">Nenhum produto encontrado</p><p className="text-zinc-500 mt-2">Tente pesquisar outro nome ou categoria.</p></div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-7">{filteredProducts.map((product) => <button key={product.id} onClick={() => setSelectedProduct(product)} className="flex gap-5 text-left group"><div className="w-24 sm:w-28 h-32 sm:h-36 bg-zinc-100 overflow-hidden shrink-0"><img src={assetUrl(product.images?.[0] || product.image)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /></div><div className="pt-2 min-w-0"><h3 className="font-medium leading-snug break-words">{product.name}</h3><p className="text-sm text-zinc-500 mt-1">{product.category}</p><p className="font-medium mt-1">R$ {Number(product.price).toFixed(2).replace(".", ",")}</p></div></button>)}</div>}{searchTerm && filteredProducts.length > 0 && <button onClick={handleViewAll} className="mt-10 border border-black px-6 sm:px-8 py-4 text-sm uppercase tracking-[2px] sm:tracking-[3px] hover:bg-black hover:text-white transition">Ver tudo para "{searchTerm}"</button>}</div>
            <div className="border-l border-zinc-200 pl-8 hidden md:block"><p className="text-sm font-medium mb-5">Pesquisas rápidas</p><div className="space-y-4">{["Camiseta", "Bermuda", "Calça", "Boné", "Moletom"].map((term) => <button key={term} onClick={() => setSearchTerm(term)} className="block hover:underline">{term}</button>)}</div></div>
          </div>
        </div>
      </div>
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  );
}

export default SearchModal;
