import { useEffect, useState } from "react";

function Banner() {
  const banners = [
    { image: `${import.meta.env.BASE_URL}images/banners/banner-1-small.webp`, title: "CICLO", subtitle: "Streetwear • Underground • Lifestyle", buttonText: "VER COLEÇÃO" },
    { image: `${import.meta.env.BASE_URL}images/banners/banner-2-small.webp`, title: "NOVA COLEÇÃO", subtitle: "Peças selecionadas para o seu estilo", buttonText: "CONFERIR" },
    { image: `${import.meta.env.BASE_URL}images/banners/banner-3-small.webp`, title: "LANÇAMENTOS", subtitle: "Novidades chegando na loja", buttonText: "VER NOVIDADES" },
  ];

  const [currentBanner, setCurrentBanner] = useState(0);
  const [resetTimer, setResetTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => prev === banners.length - 1 ? 0 : prev + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length, resetTimer]);

  function changeBanner(index) {
    setCurrentBanner(index);
    setResetTimer((prev) => prev + 1);
  }

  return (
    <section className="relative h-[70vh] overflow-hidden bg-black">
      {banners.map((banner, index) => (
        <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentBanner ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"}`}>
          <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex items-center justify-center text-center px-5">
            <div className="text-white">
              <h1 className="text-4xl md:text-6xl font-black tracking-[8px]">{banner.title}</h1>
              <p className="mt-4 text-sm md:text-base text-zinc-200">{banner.subtitle}</p>
              <button className="mt-8 bg-white text-black px-8 py-3 rounded-full font-bold transition duration-300 hover:scale-105 hover:bg-zinc-100 active:scale-95">{banner.buttonText}</button>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {banners.map((_, index) => (
          <button key={index} onClick={() => changeBanner(index)} className={`h-2 rounded-full transition-all duration-300 ${index === currentBanner ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`} />
        ))}
      </div>
    </section>
  );
}

export default Banner;
