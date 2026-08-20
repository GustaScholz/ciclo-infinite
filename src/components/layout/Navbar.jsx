import { useState } from "react";
import { Menu, Search, Heart, ShoppingBag } from "lucide-react";

import Sidebar from "./Sidebar";
import SearchModal from "./SearchModal";
import { useCart } from "../../contexts/CartContext";

function Navbar({ onLogoClick, onCategorySelect, onSearchSubmit }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, setCartOpen } = useCart();

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-30">
        <div className="mx-auto max-w-7xl h-16 flex items-center justify-between px-5">
          <button onClick={() => setMenuOpen(true)} className="flex items-center gap-2 font-semibold hover:opacity-60 transition">
            <Menu size={24} strokeWidth={2} />
            <span className="text-sm">MENU</span>
          </button>
          <button onClick={onLogoClick} className="text-xl font-black tracking-[6px] hover:opacity-60 transition">CICLO</button>
          <div className="flex items-center gap-5">
            <button onClick={() => setSearchOpen(true)} className="hover:opacity-60 transition" title="Pesquisar"><Search size={23} strokeWidth={2} /></button>
            <button className="hover:opacity-60 transition" title="Favoritos"><Heart size={23} strokeWidth={2} /></button>
            <button onClick={() => setCartOpen(true)} className="relative hover:opacity-60 transition" title="Carrinho">
              <ShoppingBag size={23} strokeWidth={2} />
              {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} onCategorySelect={onCategorySelect} />
      <SearchModal open={searchOpen} setOpen={setSearchOpen} onSearchSubmit={onSearchSubmit} />
    </>
  );
}

export default Navbar;
