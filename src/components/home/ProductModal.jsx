import { useEffect, useState } from "react";
import { useCart } from "../../contexts/CartContext";

function ProductModal({ product, onClose }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [toast, setToast] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    setCurrentImage(0);
    setSelectedSize("");
  }, [product]);

  function handleAddToCart() {
    const result = addToCart(product, selectedSize);
    setToast({ type: result.success ? "success" : "error", message: result.message });
    setTimeout(() => setToast(null), 2500);
  }

  if (!product) return null;

  const whatsappNumber = "5527997273360";
  const formattedPrice = product.price.toFixed(2).replace(".", ",");
  const images = (product.images || [product.image]).map((path) => path ? `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}` : "");
  const message = `Olá! Tenho interesse nessa peça:\n\n${product.name}\nValor: R$ ${formattedPrice}\nTamanho: ${selectedSize || "não selecionado"}\n\nEla ainda está disponível?`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  function nextImage() { setCurrentImage((prev) => prev === images.length - 1 ? 0 : prev + 1); }
  function prevImage() { setCurrentImage((prev) => prev === 0 ? images.length - 1 : prev - 1); }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden relative max-h-[92vh]">
        <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-white w-10 h-10 rounded-full shadow flex items-center justify-center font-bold hover:bg-zinc-100">✕</button>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative bg-zinc-100 h-[420px] md:h-[560px]">
            <img src={images[currentImage]} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 w-10 h-10 rounded-full shadow font-bold">‹</button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 w-10 h-10 rounded-full shadow font-bold">›</button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => <button key={index} onClick={() => setCurrentImage(index)} className={`h-2 rounded-full transition-all ${index === currentImage ? "w-7 bg-black" : "w-2 bg-black/40"}`} />)}
                </div>
              </>
            )}
          </div>

          <div className="p-6 md:p-8 overflow-y-auto">
            <p className="text-xs text-zinc-500 uppercase tracking-[3px]">{product.category}</p>
            <h2 className="text-2xl md:text-3xl font-black mt-2">{product.name}</h2>
            <p className="text-2xl font-semibold mt-3">R$ {formattedPrice}</p>
            <p className="text-zinc-600 mt-4 text-sm leading-relaxed">{product.description}</p>
            <div className="mt-6">
              <p className="font-semibold mb-3">Selecione o tamanho</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => <button key={size} onClick={() => setSelectedSize(size)} className={`border rounded-full px-5 py-2 transition ${selectedSize === size ? "bg-black text-white border-black" : "border-zinc-300 hover:border-black"}`}>{size}</button>)}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 mt-8">
              <button onClick={handleAddToCart} className={`w-full rounded-full py-4 font-bold transition ${selectedSize ? "bg-black text-white hover:bg-zinc-800" : "bg-zinc-200 text-zinc-400"}`}>{selectedSize ? "Adicionar ao carrinho" : "Selecione um tamanho para adicionar"}</button>
              <a href={whatsappLink} target="_blank" rel="noreferrer" className={`w-full text-center rounded-full py-4 font-bold transition ${selectedSize ? "border border-black hover:bg-zinc-100" : "border border-zinc-300 text-zinc-400 pointer-events-none"}`}>{selectedSize ? "Comprar agora pelo WhatsApp" : "Selecione um tamanho para comprar"}</a>
            </div>
          </div>
        </div>
      </div>
      {toast && <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] px-6 py-4 rounded-full shadow-xl text-sm font-semibold transition ${toast.type === "success" ? "bg-black text-white" : "bg-red-600 text-white"}`}>{toast.message}</div>}
    </div>
  );
}

export default ProductModal;
