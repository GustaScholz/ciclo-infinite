import { X } from "lucide-react";

function Sidebar({ menuOpen, setMenuOpen, onCategorySelect }) {
  const categorias = ["Novidades", "Camisetas", "Moletons", "Calças", "Bermudas", "Tênis", "Bonés", "Acessórios", "Promoções"];

  function handleClick(categoria) {
    onCategorySelect(categoria);
    setMenuOpen(false);
  }

  return (
    <>
      {menuOpen && <div onClick={() => setMenuOpen(false)} className="fixed inset-0 bg-black/50 z-40" />}
      <aside className={`fixed top-0 left-0 h-screen w-80 bg-white z-50 shadow-2xl transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-black">Categorias</h2>
          <button onClick={() => setMenuOpen(false)} className="hover:opacity-60 transition"><X size={26} /></button>
        </div>
        <nav className="flex flex-col py-4">
          {categorias.map((categoria) => <button key={categoria} onClick={() => handleClick(categoria)} className="text-left px-6 py-4 hover:bg-zinc-100 transition text-[15px]">{categoria}</button>)}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
