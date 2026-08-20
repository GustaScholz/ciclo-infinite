function FloatingWhatsApp() {
  const whatsappNumber = "5527997273360";
  const message = "Olá! Vim pelo catálogo da Ciclo e gostaria de tirar uma dúvida.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a href={whatsappLink} target="_blank" rel="noreferrer" className="fixed right-5 bottom-5 z-30 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition" title="Falar no WhatsApp">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-8 h-8 fill-current"><path d="M16.02 3C8.85 3 3.02 8.82 3.02 15.98c0 2.29.6 4.52 1.73 6.49L3 29l6.7-1.7a12.93 12.93 0 0 0 6.32 1.62C23.18 28.92 29 23.1 29 15.98S23.18 3 16.02 3Zm0 23.72c-2.01 0-3.98-.54-5.7-1.57l-.41-.24-3.98 1.01 1.06-3.86-.27-.43a10.69 10.69 0 0 1-1.62-5.65c0-6.01 4.9-10.9 10.92-10.9s10.91 4.89 10.91 10.9-4.89 10.74-10.91 10.74Zm5.98-8.15c-.33-.17-1.96-.97-2.26-1.08-.3-.11-.52-.17-.74.17-.22.33-.85 1.08-1.04 1.3-.19.22-.39.25-.72.08-.33-.17-1.39-.51-2.65-1.63-.98-.87-1.64-1.95-1.83-2.28-.19-.33-.02-.51.15-.68.15-.15.33-.39.5-.58.17-.19.22-.33.33-.55.11-.22.06-.42-.03-.58-.08-.17-.74-1.78-1.01-2.44-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.58.08-.88.42-.3.33-1.16 1.13-1.16 2.75s1.19 3.19 1.36 3.41c.17.22 2.34 3.57 5.68 5.01.79.34 1.41.55 1.89.7.79.25 1.51.22 2.08.13.63-.09 1.96-.8 2.24-1.58.28-.78.28-1.44.19-1.58-.08-.14-.3-.22-.63-.39Z" /></svg>
    </a>
  );
}

export default FloatingWhatsApp;
