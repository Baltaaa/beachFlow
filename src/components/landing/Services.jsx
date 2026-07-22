import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, ArrowRight, Maximize2, X } from 'lucide-react'

const CATEGORIES = [
  "Todo",
  "Coworking",
  "Carpas & Sombrillas",
  "Pileta & Solárium",
  "Gastronomía",
  "Wellness",
  "Instalaciones",
  "Eventos",
  "Recreación & Club",
]

const unifiedImages = [
  // --- COWORKING ---
  { src: "/images/coworking-deck.jpg", title: "Deck Principal", category: "Coworking", desc: "Espacio de trabajo al aire libre sobre deck de madera noble, ideal para inspirarse frente al mar." },
  { src: "/images/prius13.webp", title: "Seaside Workbox", category: "Coworking", desc: "Escritorios ergonómicos con vista panorámica y conectividad de alta velocidad." },
  { src: "/images/prius14.webp", title: "Sala de Reuniones", category: "Coworking", desc: "Espacio privado vidriado para conferencias y llamadas con aislamiento acústico." },
  { src: "/images/prius11.webp", title: "Conexión Ininterrumpida", category: "Coworking", desc: "Internet de fibra simétrica para nómadas digitales que eligen trabajar frente al mar." },
  { src: "/images/prius3.webp", title: "Oasis de Relajación Coworking", category: "Coworking", desc: "Un rincón de paz y desconexión dentro del área de coworking para recargar energías entre tareas." },

  // --- CARPAS & SOMBRILLAS ---
  { src: "/images/carpasYsombriService.webp", title: "Santuario de Sombra", category: "Carpas & Sombrillas", desc: "Estructuras de madera premium con lona náutica de máxima protección UV." },
  { src: "/images/carpas-amigos.webp", title: "Living Familiar", category: "Carpas & Sombrillas", desc: "Espacios amplios y cómodos para disfrutar con la mejor compañía." },
  { src: "/images/prius1.webp", title: "Servicio de Carperos", category: "Carpas & Sombrillas", desc: "Atención personalizada directamente en tu sombra para mayor comodidad." },
  { src: "/images/prius2.webp", title: "Reposeras Ergonómicas", category: "Carpas & Sombrillas", desc: "Mobiliario exterior de alta gama diseñado para un descanso absoluto." },

  // --- PILETA & SOLÁRIUM ---
  { src: "/images/piletaService.webp", title: "Espejo de Agua", category: "Pileta & Solárium", desc: "Piscina climatizada que se funde visualmente con el horizonte costero." },
  { src: "/images/prius7.webp", title: "Deck de Madera Noble", category: "Pileta & Solárium", desc: "Solárium exclusivo equipado con camastros acolchados premium." },
  { src: "/images/pileta-relax-mate.jpg", title: "Relax y Tradición", category: "Pileta & Solárium", desc: "Disfrutá de unos mates frente a la piscina climatizada en un entorno de confort absoluto." },
  { src: "/images/pareja-playa.webp", title: "Relax Junto a la Pileta", category: "Pileta & Solárium", desc: "Desconexión total y ambiente sofisticado a metros del mar." },

  // --- GASTRONOMÍA ---
  { src: "/images/gastronomia-platos.png", title: "Platos Seleccionados", category: "Gastronomía", desc: "Exquisita propuesta gastronómica con ensaladas frescas, ingredientes premium y platos de estación servidos frente al mar." },
  { src: "/images/gastronomia-amigos.jpg", title: "Momentos Compartidos", category: "Gastronomía", desc: "Disfrutá de un almuerzo distendido con amigos, tragos frescos y la mejor energía de Playa Grande." },
  { src: "/images/gastronomia-charla.jpg", title: "Tardes de Encuentro", category: "Gastronomía", desc: "Charlas inolvidables acompañadas de cervezas artesanales y una vista inigualable de la costa." },
  { src: "/images/gastronomia-barra.jpg", title: "Barra de Encuentros", category: "Gastronomía", desc: "Un espacio de barra dinámico y moderno para disfrutar de cafetería de especialidad y coctelería de autor." },
  { src: "/images/gastronomia-1.webp", title: "Sabores de Costa", category: "Gastronomía", desc: "Gastronomía gourmet frente al mar con ingredientes frescos del Atlántico." },
  { src: "/images/gastronomia-2.webp", title: "Cocktails de Autor", category: "Gastronomía", desc: "Tragos exclusivos y coctelería premium diseñados por destacados bartenders." },

  // --- WELLNESS ---
  { src: "/images/wellness-masajes.jpg", title: "Masajes Terapéuticos", category: "Wellness", desc: "Sesiones de masajes descontracturantes y relajantes a cargo de la kinesiologa Pilar Ferrando para renovar cuerpo y mente." },
  { src: "/images/wellness-aquadance.jpg", title: "Aqua Dance", category: "Wellness", desc: "Clases dinámicas y divertidas de aqua dance en nuestra piscina climatizada para todas las edades." },
  { src: "/images/wellness-yoga.jpg", title: "Yoga Grupal", category: "Wellness", desc: "Prácticas de yoga grupales sobre la arena para conectar con la respiración y el sonido del mar." },
  { src: "/images/prius4.webp", title: "Terapias de Mar", category: "Wellness", desc: "Tratamientos corporales y faciales con aromaterapia y esencias naturales." },
  { src: "/images/prius6.webp", title: "Espacio de Meditación", category: "Wellness", desc: "Un rincón de paz diseñado para armonizar cuerpo y mente." },
  { src: "/images/wellness-relax-arena.jpg", title: "Oasis de Relajación", category: "Wellness", desc: "Descanso absoluto en cómodas reposeras sobre la arena, disfrutando de la brisa marina y el sol." },

  // --- INSTALACIONES ---
  { src: "/images/instalaciones-paseo.jpg", title: "Paseo Playa Grande", category: "Instalaciones", desc: "Ubicación privilegiada en el corazón del paseo de Playa Grande, integrando diseño moderno y naturaleza costera." },
  { src: "/images/instalaciones-solarium.jpg", title: "Solárium & Pileta", category: "Instalaciones", desc: "Espectacular vista panorámica desde nuestro solárium de madera noble equipado con camastros y piscina climatizada." },
  { src: "/images/cabinas.jpg", title: "Lockers de Seguridad", category: "Instalaciones", desc: "Tranquilidad absoluta para tus pertenencias con lockers privados y vestuarios de primer nivel." },
  { src: "/images/gallery_1400392.webp", title: "Vestuarios & Duchas", category: "Instalaciones", desc: "Higiene, confort y privacidad en instalaciones totalmente renovadas." },

  // --- EVENTOS ---
  { src: "/images/eventos-salon-noche.png", title: "Salón de Eventos Nocturno", category: "Eventos", desc: "La mítica esquina de Playa Grande iluminada de noche, lista para albergar las celebraciones más exclusivas frente al mar." },
  { src: "/images/eventos-cumpleanos.jpg", title: "Celebraciones Privadas", category: "Eventos", desc: "Cumpleaños y eventos sociales en un ambiente festivo, con excelente barra de tragos y diseño interior de vanguardia." },
  { src: "/images/eventos-fiesta.jpg", title: "Música en Vivo & Fiestas", category: "Eventos", desc: "Eventos nocturnos con bandas en vivo, iluminación profesional y una atmósfera inigualable frente al Atlántico." },
  { src: "/images/event1.webp", title: "Lanzamientos y Cenas", category: "Eventos", desc: "El entorno ideal para potenciar tu marca o agasajar a tus clientes." },
  { src: "/images/event2.webp", title: "Casamientos y Fiestas de 15", category: "Eventos", desc: "Celebraciones mágicas con el Atlántico como testigo y un servicio premium." },

  // --- RECREACIÓN & CLUB ---
  { src: "/images/recreacion-metegol.jpg", title: "Metegol en la Arena", category: "Recreación & Club", desc: "Diversión clásica frente al mar con torneos de metegol para disfrutar en familia." },
  { src: "/images/recreacion-talleres.jpg", title: "Talleres de Arte", category: "Recreación & Club", desc: "Espacio creativo para niños con talleres de collares, pulseras y manualidades guiadas." },
  { src: "/images/recreacion-jenga.jpg", title: "Jenga Gigante", category: "Recreación & Club", desc: "Desafíos de destreza y risas aseguradas con nuestro jenga gigante en la playa." },
  { src: "/images/recreacion-surf.jpg", title: "Clases de Surf", category: "Recreación & Club", desc: "Aprendé y perfeccioná tu técnica de surf en las mejores olas de Playa Grande con instructores calificados." },
  { src: "/images/prius5.webp", title: "Yoga al Amanecer", category: "Recreación & Club", desc: "Clases de yoga sobre la arena para comenzar el día con energía renovada." },
]

function ImageModal({ selectedImage, onClose }) {
  if (!selectedImage) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-neutral-950/55 backdrop-blur-[18px] animate-premium-fade"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[900px] bg-white rounded-2xl overflow-hidden border border-hairline flex flex-col md:flex-row shadow-2xl animate-premium-slide max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 bg-neutral-950/85 hover:bg-gold hover:text-prius-black text-white rounded-full border border-white/15 transition-all duration-300 cursor-pointer"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>

        <div className="w-full md:w-3/5 bg-neutral-100 relative min-h-[250px] md:min-h-[450px]">
          <img
            src={selectedImage.src}
            alt={selectedImage.title}
            className="w-full h-full object-cover absolute inset-0"
          />
          <span className="absolute bottom-4 left-4 bg-neutral-950/80 backdrop-blur-md px-3 py-1 rounded-sm text-[9px] uppercase tracking-wider text-gold font-display border border-white/10">
            {selectedImage.category}
          </span>
        </div>

        <div className="w-full md:w-2/5 p-8 flex flex-col justify-between bg-white overflow-y-auto max-h-[350px] md:max-h-full">
          <div className="space-y-4">
            <span className="text-[9px] font-bold uppercase tracking-widest text-gold font-display block">
              Experiencia Prius
            </span>
            <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-prius-black font-display leading-tight">
              {selectedImage.title}
            </h3>
            <div className="h-[1px] bg-hairline w-12" />
            <p className="text-xs md:text-sm text-prius-black/70 leading-relaxed font-light">
              {selectedImage.desc}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function Services() {
  const [activeCategory, setActiveCategory] = useState("Todo")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [selectedImage, setSelectedImage] = useState(null)

  const sliderRef = useRef(null)

  const filteredImages = unifiedImages.filter(
    (img) => activeCategory === "Todo" || img.category === activeCategory
  )

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedImage])

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

  return (
    <section className="min-h-screen flex flex-col justify-center py-20 px-margin-mobile md:px-margin-desktop bg-prius-background border-t border-hairline" id="servicios">
      <div className="max-w-[1440px] mx-auto w-full relative z-10">
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

        <div className="relative">
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-prius-background via-prius-background/80 to-transparent pointer-events-none z-10" />

          <div
            key={activeCategory}
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-none md:snap-none animate-[premiumFadeIn_0.4s_ease-out_forwards]"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredImages.map((img, idx) => (
              <div
                key={idx}
                className="w-[280px] md:w-[320px] shrink-0 snap-start group bg-white border border-hairline rounded-xl overflow-hidden flex flex-col justify-between hover:border-gold transition-premium"
              >
                <div
                  onClick={() => setSelectedImage(img)}
                  className="relative aspect-[4/3] overflow-hidden bg-prius-background border-b border-hairline cursor-pointer"
                >
                  <img
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-premium-slow"
                    src={img.src}
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedImage(img)
                    }}
                    className="absolute top-3 right-3 p-2 bg-neutral-950/60 backdrop-blur-md text-white hover:bg-gold hover:text-prius-black rounded-full border border-white/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform md:translate-y-1 md:group-hover:translate-y-0 cursor-pointer"
                    title="Pantalla completa"
                  >
                    <Maximize2 size={12} />
                  </button>

                  <span className="absolute bottom-3 left-3 bg-neutral-950/70 backdrop-blur-md px-2.5 py-1 rounded-sm text-[8px] uppercase tracking-wider text-gold font-display">
                    {img.category}
                  </span>
                </div>

                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="text-xs font-bold text-prius-black uppercase tracking-tight font-display mb-3">
                      {img.title}
                    </h4>
                  </div>

                  <div className="pt-3 border-t border-hairline flex items-center justify-between">
                    <button
                      onClick={() => setSelectedImage(img)}
                      className="text-[9px] font-medium text-prius-black hover:text-gold transition-colors uppercase tracking-widest text-left flex items-center gap-1 group/btn font-display cursor-pointer"
                    >
                      Ver Detalle
                      <ArrowRight size={10} className="transform group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-24 h-[2px] bg-hairline mx-auto mt-6 relative rounded-full overflow-hidden md:hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gold transition-all duration-300 rounded-full"
              style={{ width: `${Math.max(10, scrollProgress)}%` }}
            />
          </div>
        </div>
      </div>

      <ImageModal selectedImage={selectedImage} onClose={() => setSelectedImage(null)} />
    </section>
  )
}