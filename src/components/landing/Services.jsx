import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

const CATEGORIES = [
  "Todo", 
  "Coworking", 
  "Carpas & Sombrillas", 
  "Pileta & Solárium", 
  "Gastronomía",
  "Wellness", 
  "Instalaciones", 
  "Eventos",
  "Recreación & Club"
]

const unifiedImages = [
  // COWORKING (5 imágenes)
  { src: "/images/prius13.webp", title: "Seaside Workbox", category: "Coworking", desc: "Escritorios ergonómicos con vista panorámica y conectividad de alta velocidad." },
  { src: "/images/prius14.webp", title: "Sala de Reuniones", category: "Coworking", desc: "Espacio privado vidriado para conferencias y llamadas con aislamiento acústico." },
  { src: "/images/prius11.webp", title: "Conexión Ininterrumpida", category: "Coworking", desc: "Internet de fibra simétrica para nómadas digitales que eligen trabajar frente al mar." },
  { src: "/images/prius12.webp", title: "Coffee & Work", category: "Coworking", desc: "Servicio de cafetería de especialidad directo a tu puesto de trabajo." },
  { src: "/images/prius9.webp", title: "Outdoor Lounge", category: "Coworking", desc: "Terrazas preparadas para trabajar al aire libre bajo la brisa marina." },

  // CARPAS & SOMBRILLAS (5 imágenes)
  { src: "/images/carpasYsombriService.webp", title: "Santuario de Sombra", category: "Carpas & Sombrillas", desc: "Estructuras de madera premium con lona náutica de máxima protección UV." },
  { src: "/images/carpas-amigos.webp", title: "Living Familiar", category: "Carpas & Sombrillas", desc: "Espacios amplios y cómodos para disfrutar con la mejor compañía." },
  { src: "/images/prius1.webp", title: "Servicio de Carperos", category: "Carpas & Sombrillas", desc: "Atención personalizada directamente en tu sombra para mayor comodidad." },
  { src: "/images/prius2.webp", title: "Reposeras Ergonómicas", category: "Carpas & Sombrillas", desc: "Mobiliario exterior de alta gama diseñado para un descanso absoluto." },
  { src: "/images/playa-grande-aerea.webp", title: "Exclusividad en Arena", category: "Carpas & Sombrillas", desc: "El sector más codiciado de Playa Grande con un diseño estructural único." },

  // PILETA & SOLÁRIUM (5 imágenes)
  { src: "/images/piletaService.webp", title: "Espejo de Agua", category: "Pileta & Solárium", desc: "Piscina climatizada que se funde visualmente con el horizonte costero." },
  { src: "/images/prius7.webp", title: "Deck de Madera Noble", category: "Pileta & Solárium", desc: "Solárium exclusivo equipado con camastros acolchados premium." },
  { src: "/images/prius8.webp", title: "Atardeceres Climatizados", category: "Pileta & Solárium", desc: "Disfrutá del agua templada mientras contemplás la caída del sol." },
  { src: "/images/pareja-playa.webp", title: "Relax Junto a la Pileta", category: "Pileta & Solárium", desc: "Desconexión total y ambiente sofisticado a metros del mar." },
  { src: "/images/prius10.webp", title: "Pool Bar Service", category: "Pileta & Solárium", desc: "Tragos de autor y coctelería fresca directo a tu camastro." },

  // GASTRONOMÍA (5 imágenes)
  { src: "/images/gastronomia-1.webp", title: "Sabores de Costa", category: "Gastronomía", desc: "Gastronomía gourmet frente al mar con ingredientes frescos del Atlántico." },
  { src: "/images/gastronomia-2.webp", title: "Cocktails de Autor", category: "Gastronomía", desc: "Tragos exclusivos y coctelería premium diseñados por destacados bartenders." },
  { src: "/images/prius12.webp", title: "Cafetería Premium", category: "Gastronomía", desc: "Café de especialidad y pastelería artesanal para arrancar el día de la mejor manera." },
  { src: "/images/prius10.webp", title: "Bistró de Playa", category: "Gastronomía", desc: "Almuerzos ligeros, ensaladas de estación y mariscos seleccionados." },
  { src: "/images/prius9.webp", title: "Sunset Dining", category: "Gastronomía", desc: "Disfrutá de una experiencia culinaria única contemplando la caída del sol." },

  // WELLNESS (5 imágenes)
  { src: "/images/prius3.webp", title: "Oasis de Relajación", category: "Wellness", desc: "Gabinete privado con masajes descontracturantes y relajantes con terapeutas certificados." },
  { src: "/images/prius4.webp", title: "Terapias de Mar", category: "Wellness", desc: "Tratamientos corporales y faciales con aromaterapia y esencias naturales." },
  { src: "/images/prius6.webp", title: "Espacio de Meditación", category: "Wellness", desc: "Un rincón de paz diseñado para armonizar cuerpo y mente." },
  { src: "/images/prius11.webp", title: "ESPACIO CAMBIADOR BEBÉS", category: "Wellness", desc: "Comodidad pensada para toda la familia en áreas totalmente dedicadas." },
  { src: "/images/gallery_IMG_1832.webp", title: "Atardecer Consciente", category: "Wellness", desc: "Prácticas guiadas al final del día para reconectar con el entorno." },

  // INSTALACIONES (5 imágenes)
  { src: "/images/gallery_IMG_1832.webp", title: "INSTALACIONES PRIUS", category: "Instalaciones", desc: "Espacios modernos y confortables." },
  { src: "/images/gallery_IMG_1852.webp", title: "VESTUARIOS & DUCHAS", category: "Instalaciones", desc: "Higiene y confort de primer nivel." },
  { src: "/images/cabinas.jpg", title: "LOCKERS DE SEGURIDAD", category: "Instalaciones", desc: "Tranquilidad absoluta para tus pertenencias." },
  { src: "/images/prius1.webp", title: "DUCHAS PRIVADAS", category: "Instalaciones", desc: "Instalaciones impecables y renovadas." },
  { src: "/images/prius2.webp", title: "Espacios de Tocador", category: "Instalaciones", desc: "Espejos con iluminación profesional y secadores de pelo de uso libre." },

  // EVENTOS (5 imágenes)
  { src: "/images/event1.webp", title: "Lanzamientos y Cenas", category: "Eventos", desc: "El entorno ideal para potenciar tu marca o agasajar a tus clientes." },
  { src: "/images/event2.webp", title: "Casamientos y Fiestas de 15", category: "Eventos", desc: "Celebraciones mágicas con el Atlántico como testigo y un servicio premium." },
  { src: "/images/event4.webp", title: "Cumpleaños y Aniversarios", category: "Eventos", desc: "Festejá tus momentos especiales en un ambiente completamente reservado." },
  { src: "/images/prius14.webp", title: "Eventos Corporativos", category: "Eventos", desc: "Salón climatizado y equipado con tecnología de última generación para conferencias." },
  { src: "/images/prius13.webp", title: "Celebraciones Exclusivas", category: "Eventos", desc: "Un espacio único que se adapta perfectamente al estilo de tu evento." },

  // RECREACIÓN & CLUB (5 imágenes)
  { src: "/images/prius5.webp", title: "Yoga al Amanecer", category: "Recreación & Club", desc: "Clases de yoga sobre la arena para comenzar el día con energía renovada." },
  { src: "/images/prius6.webp", title: "Clínicas de Surf", category: "Recreación & Club", desc: "Instrucción y práctica en las mejores olas de Playa Grande con profesionales." },
  { src: "/images/prius13.webp", title: "Club de Niños", category: "Recreación & Club", desc: "Talleres lúdicos y actividades recreativas coordinadas para los más chicos." },
  { src: "/images/prius14.webp", title: "Torneos de Playa", category: "Recreación & Club", desc: "Actividades deportivas grupales que fomentan la diversión y camaradería." },
  { src: "/images/gallery_IMG_1832.webp", title: "Caminatas Guiadas", category: "Recreación & Club", desc: "Recorridos costeros para disfrutar del paisaje y el aire de mar." }
]

export default function Services() {
  const [activeCategory, setActiveCategory] = useState("Todo")
  const [scrollProgress, setScrollProgress] = useState(0)
  
  const sliderRef = useRef(null)

  const filteredImages = unifiedImages.filter(img => 
    activeCategory === "Todo" || img.category === activeCategory
  )

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
      const scrollAmount = direction === 'left' ? -320 : 320
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const scrollToContact = () => {
    const element = document.getElementById('contacto')
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - 110
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="min-h-screen flex flex-col justify-center py-20 px-margin-mobile md:px-margin-desktop bg-prius-background border-t border-hairline" id="servicios">
      <div className="max-w-[1440px] mx-auto w-full relative z-10">
        
        {/* Encabezado Principal de Servicios */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[9px] md:text-[11px] font-normal uppercase tracking-[0.3em] text-prius-black/40 block mb-1 font-display">
              Estilo de Vida Prius
            </span>
            <h2 className="text-2xl md:text-4xl font-normal tracking-tight text-prius-black uppercase font-display leading-none">
              Servicios de <span className="text-gold">Exclusividad</span> Absoluta
            </h2>
          </div>
          <p className="text-prius-black/60 text-xs md:text-sm max-w-xs leading-relaxed font-light">
            Minimalismo estructural y confort absoluto diseñado al detalle para una experiencia de playa incomparable.
          </p>
        </div>

        {/* Filtros de Categoría Minimalistas + Controles de Navegación */}
        <div className="flex items-center justify-between border-b border-hairline/60 pb-6 mb-8">
          <div className="flex overflow-x-auto gap-2 scrollbar-none pb-2 md:pb-0">
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

          {/* Controles de navegación para Desktop */}
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

        {/* CONTENEDOR DE GALERÍA DE DOBLE FLUJO */}
        <div className="relative">
          
          {/* Carrusel Horizontal con animación de entrada suave al cambiar de categoría */}
          <div 
            key={activeCategory}
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-none md:snap-none animate-[premiumFadeIn_0.4s_ease-out_forwards]"
          >
            {filteredImages.map((img, idx) => (
              <div 
                key={idx}
                className="w-[280px] md:w-[320px] shrink-0 snap-start group bg-white border border-hairline rounded-xl overflow-hidden flex flex-col justify-between hover:border-gold transition-premium"
              >
                {/* Contenedor de Imagen de Proporción Elegante */}
                <div className="relative aspect-[4/3] overflow-hidden bg-prius-background border-b border-hairline">
                  <img 
                    alt={img.title} 
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-premium-slow" 
                    src={img.src} 
                  />
                  
                  {/* Categoría pequeña en la esquina */}
                  <span className="absolute bottom-3 left-3 bg-neutral-950/70 backdrop-blur-md px-2.5 py-1 rounded-sm text-[8px] uppercase tracking-wider text-gold font-display">
                    {img.category}
                  </span>
                </div>

                {/* Contenido inferior tipo tarjeta */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="text-xs font-bold text-prius-black uppercase tracking-tight font-display mb-1.5">
                      {img.title}
                    </h4>
                    <p className="text-[11px] text-prius-black/60 leading-relaxed font-light mb-4 min-h-[50px] line-clamp-3">
                      {img.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-hairline flex items-center justify-between">
                    <button 
                      onClick={scrollToContact}
                      className="text-[9px] font-medium text-prius-black hover:text-gold transition-colors uppercase tracking-widest text-left flex items-center gap-1 group/btn font-display cursor-pointer"
                    >
                      Reservar lugar 
                      <ArrowRight size={10} className="transform group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
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
    </section>
  )
}