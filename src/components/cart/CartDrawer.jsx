import { useCart } from "../../contexts/CartContext";

function CartDrawer() {
  const { cartItems, cartOpen, setCartOpen, increaseQuantity, decreaseQuantity, removeItem, clearCart, cartTotal } = useCart();
  const whatsappNumber = "5527997273360";
  const formattedTotal = cartTotal.toFixed(2).replace(".", ",");
  const message = `Olá! Gostaria de finalizar este pedido:\n\n${cartItems.map((item) => `• ${item.quantity}x ${item.name}\n  Categoria: ${item.category}\n  Tamanho: ${item.size}\n  Valor unitário: R$ ${item.price.toFixed(2).replace(".", ",")}\n  Subtotal: R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}`).join("\n\n")}\n\nTotal do pedido: R$ ${formattedTotal}\n\nPode confirmar se está tudo disponível?`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <>
      {cartOpen && <div onClick={() => setCartOpen(false)} className="fixed inset-0 bg-black/50 z-40" />}
      <aside className={`fixed top-0 right-0 h-screen w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-5 border-b">
            <div><h2 className="text-2xl font-black">Carrinho</h2><p className="text-sm text-zinc-500">Revise seu pedido antes de finalizar.</p></div>
            <button onClick={() => setCartOpen(false)} className="text-2xl">✕</button>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center px-6"><div><p className="text-xl font-bold">Seu carrinho está vazio</p><p className="text-zinc-500 mt-2">Adicione peças para montar seu pedido.</p></div></div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {cartItems.map((item) => (
                  <div key={item.itemId} className="flex gap-4 border-b pb-5">
                    <div className="w-24 h-32 bg-zinc-100 rounded-xl overflow-hidden shrink-0"><img src={item.image ? `${import.meta.env.BASE_URL}${item.image.replace(/^\//, "")}` : ""} alt={item.name} className="w-full h-full object-cover" /></div>
                    <div className="flex-1">
                      <h3 className="font-bold leading-tight">{item.name}</h3>
                      <p className="text-sm text-zinc-500 mt-1">Tamanho: {item.size}</p>
                      <p className="font-semibold mt-2">R$ {item.price.toFixed(2).replace(".", ",")}</p>
                      <div className="flex items-center gap-3 mt-4">
                        <button onClick={() => decreaseQuantity(item.itemId)} className="w-8 h-8 rounded-full border border-zinc-300 hover:border-black">-</button>
                        <span className="font-bold">{item.quantity}</span>
                        <button onClick={() => increaseQuantity(item.itemId)} className="w-8 h-8 rounded-full border border-zinc-300 hover:border-black">+</button>
                      </div>
                      <button onClick={() => removeItem(item.itemId)} className="text-sm underline mt-3 text-zinc-500 hover:text-black">Remover</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t p-5">
                <div className="flex justify-between text-lg font-bold mb-4"><span>Total</span><span>R$ {formattedTotal}</span></div>
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="block w-full text-center bg-black text-white rounded-full py-4 font-bold hover:bg-zinc-800 transition">Finalizar compra no WhatsApp</a>
                <button onClick={clearCart} className="w-full mt-3 text-sm underline text-zinc-500 hover:text-black">Limpar carrinho</button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

export default CartDrawer;
