export default function Gallery() {
  const images = [
    { num: 7, size: "col-span-2 row-span-2", title: "Atardecer en la Costa" },
    { num: 8, size: "col-span-1 row-span-1", title: "Carpas Premium" },
    { num: 9, size: "col-span-1 row-span-1", title: "Piscina Climatizada" },
    { num: 10, size: "col-span-1 row-span-2", title: "Spa & Relax" },
    { num: 11, size: "col-span-1 row-span-1", title: "Gastronomía de Mar" },
    { num: 12, size: "col-span-1 row-span-1", title: "Espacios de Sombra" },
    { num: 13, size: "col-span-1 row-span-1", title: "Atención Personalizada" },
    { num: 14, size: "col-span-1 row-span-1", title: "Experiencia Nocturna" }
  ]
  
  return (
    <section className="py-28 px-margin-mobile md:px-margin-desktop bg-white" id="galeria">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-16 text-center md:text-left">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-prius-black/40 bg-prius-background px-3 py-1.5 rounded-full border border-hairline">
            Galería Visual
          </span>
          <h2 className="text-[36px] md:text-[48px] font-normal tracking-tight mt-6 text-prius-black uppercase">
            Viví la Experiencia Prius
          </h2>
          <p className="text-prius-black/60 mt-4 max-w-xl text-sm md:text-base">
            Un recorrido visual por nuestras exclusivas instalaciones y momentos únicos en Playa Grande.
          </p>
        </div>

        {/* Bento Grid de Galería */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px] md:auto-rows-[220px]">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className={`relative overflow-hidden rounded-lg border border-hairline group cursor-pointer ${img.size}`}
            >
              <img 
                alt={img.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src={`/images/prius${img.num}.webp`} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-prius-black/80 via-prius-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold mb-1">Prius Playa Grande</span>
                <h4 className="text-white text-sm font-medium uppercase tracking-tight">{img.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}