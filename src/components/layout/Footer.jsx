function Footer() {
  return (
    <footer className="bg-black text-white mt-10">
      <div className="max-w-7xl mx-auto px-5 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div><h2 className="text-2xl font-black tracking-[6px]">CICLO</h2><p className="text-zinc-400 mt-4 max-w-sm">Streetwear, lifestyle e peças selecionadas para quem vive fora do padrão.</p></div>
        <div><h3 className="font-bold mb-4">Atendimento</h3><div className="space-y-2 text-zinc-400"><p>WhatsApp: (27) 99727-3360 Gustavo</p><p>WhatsApp: (27) 99813-7352 Jhonatan</p><p>Segunda a sábado</p><p>Santa Maria de Jetibá - ES</p></div></div>
        <div><h3 className="font-bold mb-4">Links</h3><div className="space-y-2 text-zinc-400"><p>Instagram</p><p>Política de troca</p><p>Contato</p></div></div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-zinc-500">© 2026 Ciclo Infinite. Todos os direitos reservados.</div>
    </footer>
  );
}

export default Footer;
