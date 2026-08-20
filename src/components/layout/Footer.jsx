import { Instagram } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/";
const TIKTOK_URL = "https://www.tiktok.com/";

function TikTokIcon() {
  return <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true" fill="currentColor"><path d="M14.3 3.1c.5 2.2 1.8 3.6 4.1 4v3.1c-1.5 0-2.8-.4-4.1-1.2v6.2a5.9 5.9 0 1 1-5.1-5.8v3.2a2.8 2.8 0 1 0 1.9 2.6V3.1h3.2Z" /></svg>;
}

function Footer() {
  return (
    <footer className="bg-black text-white mt-10">
      <div className="site-container py-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
        <div><h2 className="text-2xl font-black tracking-[6px]">CICLO</h2><p className="text-zinc-400 mt-4 max-w-sm">Streetwear, lifestyle e peças selecionadas para quem vive fora do padrão.</p></div>
        <div><h3 className="font-bold mb-4">Atendimento</h3><div className="space-y-2 text-zinc-400"><p>WhatsApp: (27) 99727-3360 Gustavo</p><p>WhatsApp: (27) 99813-7352 Jhonatan</p><p>Segunda a sábado</p><p>Santa Maria de Jetibá - ES</p></div></div>
        <div><h3 className="font-bold mb-4">Redes sociais</h3><div className="flex items-center gap-3">
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-zinc-300 hover:text-white hover:border-white transition"><Instagram size={23} /></a>
          <a href={TIKTOK_URL} target="_blank" rel="noreferrer" aria-label="TikTok" className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-zinc-300 hover:text-white hover:border-white transition"><TikTokIcon /></a>
        </div></div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-zinc-500 px-4">© 2026 Ciclo Infinite. Todos os direitos reservados.</div>
    </footer>
  );
}

export default Footer;
