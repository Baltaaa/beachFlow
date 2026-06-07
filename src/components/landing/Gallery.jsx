import { useState } from 'react'
import { Maximize2, X } from 'lucide-react'

export default function Gallery() {
  const [activeImage, setActiveImage] = useState(null)

  const images = [
    { num: 7, size: "md:col-span-2 md:row-span-2 aspect-square md:aspect-auto", title: "Atardecer en la Costa", category: "Playa Grande" },
    { num: 8, size: "col-span-1 row-span-1 aspect-square", title: "Carpas Premium", category: "Instalaciones" },
    { num: 9, size: "col-span-1 row-span-1 aspect-square", title: "Piscina Climatizada", category: "Exclusivo" },
    { num: 10, size: "md:col-span-1 md:row-span-2 aspect-square md:aspect-auto", title: "Spa & Relax", category: "Bienestar" },
    { num: 11, size: "col-span-1 row-span-1 aspect-square", title: "Gastronomía de Mar", category: "Restaurante" },
    { num: 12, size: "col-span-1 row-span-1 aspect-square", title: "Espacios de Sombra", category: "Servicios" },
    { num: 13, size: "col-span-1 row-span-1 aspect-square", title: "Atención Personalizada", category: "Experiencia" },
    { num: 14, size: "col-span-1 row-span-1 aspect-square", title: "Experiencia Nocturna", category: "Eventos" }
  ]
  
  return (
    <section className="py-28 px-margin-mobile md:px-margin-desktop bg-white" id="galeria">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Encabezado Minimalista */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-prius-black/40 block mb-3">
              Galería Visual
            </span>
            <h2 className="text-[36px] md:text-[52px] font-normal tracking-tight text-prius-black uppercase font-display leading-none">
              Viví la Experiencia <span className="text-gold italic font-serif">Prius</span>
            </h2>
          </div>
          <p className="text-prius-black/60 text-sm max-w-md leading-relaxed">
            Un recorrido visual por nuestras exclusivas instalaciones y momentos únicos diseñados bajo un concepto de minimalismo estructural y confort absoluto.
          </p>
        </div>

        {/* Bento Grid de Galería Ultra-Moderno */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-auto md:auto-rows-[240px]">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              onClick={() => setActiveImage(img)}
              className={`relative overflow-hidden rounded-lg border border-hairline group cursor-pointer bg-prius-background transition-premium hover:border-gold ${img.size}`}
            >
              <img 
                alt={img.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-premium-slow" 
                src={`/images/prius${img.num}.webp`} 
              />
              
              {/* Overlay Minimalista */}
              <div className="absolute inset-0 bg-prius-black/40 opacity-0 group-hover:opacity-100 transition-premium flex flex-col justify-between p-6">
                <div className="flex justify-end">
                  <div className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white transform translate-y-2 group-hover:translate-y-0 transition-premium">
                    <Maximize2 size={14} />
                  </div>
                </div>
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-premium">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gold block mb-1 font-display">
                    {img.category}
                  </span>
                  <h4 className="text-white text-sm font-normal uppercase tracking-tight font-display">
                    {img.title}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal con Animación Premium */}
      {activeImage && (
        <div 
          className="fixed inset-0 bg-prius-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-premium-fade"
          onClick={() => setActiveImage(null)}
        >
          <button 
            onClick={() => setActiveImage(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/10 transition-premium"
          >
            <X size={20} />
          </button>
          <div 
            className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center animate-premium-slide"
            onClick={e => e.stopPropagation()}
          >
            <img 
              src={`/images/prius${activeImage.num}.webp`} 
              alt={activeImage.title} 
              className="max-w-full max-h-[75vh] object-contain rounded-lg border border-white/10 shadow-2xl"
            />
            <div className="text-center mt-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold font-display">
                {activeImage.category}
              </span>
              <h3 className="text-white text-lg font-normal uppercase tracking-tight mt-1 font-display">
                {activeImage.title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}