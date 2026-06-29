import { useState, useRef, useEffect } from 'react'
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react'

const CATEGORIES = ["Todo", "Instalaciones", "Gastronomía", "Wellness", "Eventos"]

const galleryImages = [
  { num: 8, title: "Carpas Premium", category: "Instalaciones", desc: "Espacios de sombra con diseño nórdico" },
  { num: 4, title: "Atardecer en la Costa", category: "Instalaciones", desc: "Vistas panorámicas hacia Playa Grande" },
  { num: 7, title: "Piscina Infinita", category: "Instalaciones", desc: "Espejo de agua frente al mar" },
  { num: 3, title: "Spa & Relax", category: "Wellness", desc: "Tratamientos de bienestar y masajes" },
  { num: 11, title: "Gastronomía de Mar", category: "Gastronomía", desc: "Sabores frescos y coctelería de autor" },
  { num: 12, title: "Espacios de Sombra", category: "Instalaciones", desc: "Zonas de descanso exclusivas" },
  { num: 13, title: "Atención Premium", category: "Momentos", desc: "Servicio personalizado en carpa" },
  { num: 14, title: "Eventos Privados", category: "Eventos", desc: "La mítica esquina totalmente renovada" },
  { src: '/images/carpas-amigos.webp', title: "Experiencia Prius", category: "Momentos", desc: "Momentos únicos con amigos" },
  { src: '/images/gastronomia-1.webp', title: "Platos Seleccionados", category: "Gastronomía", desc: "Ingredientes locales de alta calidad" },
  { src: '/images/gastronomia-2.webp', title: "Coctelería Beach Front", category: "Gastronomía", desc: "Tragos diseñados para la tarde" },
  { src: '/images/pareja-playa.webp', title: "Relax Solárium", category: "Wellness", desc: "Desconexión absoluta frente al Atlántico" }
]

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("Todo")
  const [activeImage, setActiveImage] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  
  const sliderRef = useRef(null)

  // Filtrar imágenes según categoría seleccionada
  const filteredImages = galleryImages.filter(img => 
    activeCategory === "Todo" || img.category === activeCategory
  )

  // Controlar progreso del scroll horizontal en mobile
  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
      const totalScroll = scrollWidth - clientWidth
      if (totalScroll > 0) {
        setScrollProgress((scrollLeft / totalScroll) * 100)
      }
    }
  }

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const handleOpen = (img) => {
    setActiveImage(img)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsOpen(true)
      })
    })
  }

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => {
      setActiveImage(null)
    }, 400)
  }

  return (
    <section className="py-20 px-margin-mobile md:px-margin-desktop bg-white border-t border-hairline" id="galeria">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Encabezado Estilo Lookbook */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[9px] font-normal uppercase tracking-[0.3em] text-prius-black/40 block mb-1 font-display">
              Lookbook Editorial
            </span>
            <h2 className="text-2xl md:text-3xl font-normal tracking-tight text-prius-black uppercase font-display leading-none">
              La Estética <span className="text-gold">Prius</span>
            </h2>
          </div>
          <p className="text-prius-black/60 text-xs max-w-xs leading-relaxed">
            Una colección visual curada de nuestras instalaciones y la atmósfera sofisticada que se vive en Playa Grande.
          </p>
        </div>

        {/* Filtros de Categoría + Botones de Navegación Alineados */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-hairline/60">
          <div className="flex overflow-x-auto gap-2 scrollbar-none pr-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  setScrollProgress(0)
                  if (sliderRef.current) sliderRef.current.scrollLeft = 0
                }}
                className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-medium transition-all shrink-0 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-gold text-prius-black border border-gold'
                    : 'bg-transparent text-prius-black/55 border border-hairline hover:border-prius-black/30 hover:text-prius-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Controles de navegación para Desktop alineados a la derecha */}
          <div className="hidden md:flex gap-1.5 shrink-0">
            <button 
              onClick={() => scrollSlider('left')}
              className="p-2 bg-white border border-hairline rounded-full hover:border-gold hover:bg-prius-background transition-colors cursor-pointer"
              aria-label="Anterior"
            >
              <ChevronLeft size={14} className="text-prius-black" />
            </button>
            <button 
              onClick={() => scrollSlider('right')}
              className="p-2 bg-white border border-hairline rounded-full hover:border-gold hover:bg-prius-background transition-colors cursor-pointer"
              aria-label="Siguiente"
            >
              <ChevronRight size={14} className="text-prius-black" />
            </button>
          </div>
        </div>

        {/* CONTENEDOR DE GALERÍA */}
        <div className="relative">
          {/* Carrusel Horizontal */}
          <div 
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-none md:snap-none"
          >
            {filteredImages.map((img, idx) => (
              <div 
                key={idx}
                onClick={() => handleOpen(img)}
                className="w-[260px] md:w-[280px] shrink-0 snap-start group cursor-pointer"
              >
                {/* Contenedor de Imagen */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-hairline group-hover:border-gold transition-premium bg-prius-background">
                  <img 
                    alt={img.title} 
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-premium-slow" 
                    src={img.src || `/images/prius${img.num}.webp`} 
                  />
                  {/* Overlay táctil minimalista */}
                  <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-2 rounded-full border border-hairline opacity-0 group-hover:opacity-100 transition-premium">
                    <Maximize2 size={10} className="text-prius-black" />
                  </div>
                  
                  {/* Categoría pequeña en la esquina */}
                  <span className="absolute bottom-3 left-3 bg-neutral-950/70 backdrop-blur-md px-2.5 py-1 rounded-sm text-[8px] uppercase tracking-wider text-gold font-display">
                    {img.category}
                  </span>
                </div>

                {/* Textos inferiores */}
                <div className="mt-3 px-1">
                  <h4 className="text-xs font-medium text-prius-black uppercase tracking-tight font-display">
                    {img.title}
                  </h4>
                  <p className="text-[10px] text-prius-black/50 leading-relaxed font-light mt-0.5">
                    {img.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Barra de Progreso Minimalista (Mobile) */}
          <div className="w-24 h-[2px] bg-hairline mx-auto mt-6 relative rounded-full overflow-hidden md:hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gold transition-all duration-300 rounded-full"
              style={{ width: `${Math.max(10, scrollProgress)}%` }}
            />
          </div>

        </div>
      </div>

      {/* Lightbox Modal Refinado */}
      {activeImage && (
        <div 
          className={`fixed inset-0 bg-prius-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-opacity duration-400 ease-out ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleClose}
          style={{ willChange: 'opacity' }}
        >
          <button 
            onClick={handleClose}
            className={`absolute top-6 right-6 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/10 transition-all duration-400 ease-out cursor-pointer ${
              isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          >
            <X size={18} />
          </button>
          <div 
            className={`max-w-3xl w-full max-h-[80vh] flex flex-col items-center transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1) ${
              isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
            }`}
            onClick={e => e.stopPropagation()}
            style={{ willChange: 'transform, opacity' }}
          >
            <img 
              src={activeImage.src || `/images/prius${activeImage.num}.webp`} 
              alt={activeImage.title} 
              className="max-w-full max-h-[70vh] object-contain rounded-lg border border-white/10"
            />
            <div className="text-center mt-5">
              <span className="text-[9px] font-normal uppercase tracking-widest text-gold font-display">
                {activeImage.category}
              </span>
              <h3 className="text-white text-base font-extralight uppercase tracking-tight mt-0.5 font-display">
                {activeImage.title}
              </h3>
              <p className="text-white/60 text-[11px] font-light mt-1">
                {activeImage.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}