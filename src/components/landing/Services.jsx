import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Maximize2, 
  X,
  LayoutGrid,
  Briefcase,
  Umbrella,
  Waves,
  Utensils,
  Sparkles,
  Building2,
  Calendar,
  Gamepad2
} from 'lucide-react'

const CATEGORY_ITEMS = [
  { id: "Todo", label: "Todo", icon: LayoutGrid },
  { id: "Coworking", label: "Coworking", icon: Briefcase },
  { id: "Carpas & Sombrillas", label: "Carpas & Sombrillas", shortLabel: "Carpas & Sombrillas", icon: Umbrella },
  { id: "Pileta & Solárium", label: "Pileta & Solárium", shortLabel: "Pileta & Solárium", icon: Waves },
  { id: "Gastronomía", label: "Gastronomía", icon: Utensils },
  { id: "Wellness", label: "Wellness", icon: Sparkles },
  { id: "Instalaciones", label: "Instalaciones", icon: Building2 },
  { id: "Eventos", label: "Eventos", icon: Calendar },
  { id: "Recreación & Club", label: "Recreación & Club", shortLabel: "Recreación", icon: Gamepad2 },
]

const unifiedImages = [
  // --- COWORKING ---
  { src: "/images/coworking-deck.jpg", title: "Deck Principal", category: "Coworking", desc: "Espacio de trabajo al aire libre sobre deck de madera noble, ideal para inspirarse frente al mar." },
  { src: "/images/coworking-sala-1.jpg", title: "Conexión estable para reuniones", category: "Coworking", desc: "Espacio privado vidriado para conferencias y llamadas con aislamiento acústico." },
  { src: "/images/prius3.webp", title: "Espacio de Cowork", category: "Coworking", desc: "Un rincón de paz y desconexión dentro del área de coworking para recargar energías entre tareas." },

  // --- CARPAS & SOMBRILLAS ---
  { src: "/images/carpasYsombriService.webp", title: "Santuario de Sombra", category: "Carpas & Sombrillas", desc: "Estructuras de madera premium con lona náutica de máxima protección UV." },
  { src: "/images/carpas-amigos.webp", title: "Living Familiar", category: "Carpas & Sombrillas", desc: "Espacios amplios y cómodos para disfrutar con la mejor compañía." },
  { src: "/images/carpas-carperos-3.jpg", title: "Servicio de Carperos", category: "Carpas & Sombrillas", desc: "Atención personalizada directamente en tu sombra para mayor comodidad." },
  { src: "/images/carpas-reposeras-2.jpg", title: "Reposeras Ergonómicas", category: "Carpas & Sombrillas", desc: "Mobiliario exterior de alta gama diseñado para un descanso absoluto." },
  { src: "/images/carpas-sombrillas-4.jpg", title: "Sombrillas Exclusivas", category: "Carpas & Sombrillas", desc: "Sombrillas premium con amplio espacio de sombra y atención personalizada." },
  { src: "/images/carpas-sombrillas-5.jpg", title: "Espacio de Sombrillas", category: "Carpas & Sombrillas", desc: "Disfrutá de la brisa marina en nuestro sector exclusivo de sombrillas." },
  { src: "/images/carpas-pasillo-6.jpg", title: "Pasillos de Carpas", category: "Carpas & Sombrillas", desc: "Pasillos limpios, amplios y perfectamente mantenidos para un tránsito cómodo." },

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
  { src: "/images/wellness-yoga.jpg", title: "Yoga Grupal", category: "Wellness", desc: "Prácticas de yoga grupales sobre la arena para conectar con la respiración y el sonido del mar.", position: "object-bottom" },
  { src: "/images/wellness-relax-arena.jpg", title: "Oasis de Relajación", category: "Wellness", desc: "Descanso absoluto en cómodas reposeras sobre la arena, disfrutando de la brisa marina y el sol." },

  // --- INSTALACIONES ---
  { src: "/images/instalaciones-paseo.jpg", title: "Paseo Playa Grande", category: "Instalaciones", desc: "Ubicación privileged en el corazón del paseo de Playa Grande, integrando diseño moderno y naturaleza costera." },
  { src: "/images/instalaciones-solarium.jpg", title: "Solárium & Pileta", category: "Instalaciones", desc: "Espectacular vista panorámica desde nuestro solárium de madera noble equipado con camastros y piscina climatizada." },
  { src: "/images/instalaciones-lockers-7.jpg", title: "Lockers de Seguridad", category: "Instalaciones", desc: "Tranquilidad absoluta para tus pertenencias con lockers privados y vestuarios de primer nivel." },
  { src: "/images/gallery_1400392.webp", title: "Vestuarios & Duchas", category: "Instalaciones", desc: "Higiene, confort y privacidad en instalaciones totalmente renovadas." },
  { src: "/images/instalaciones-bebes-8.jpg", title: "Espacio para Bebés", category: "Instalaciones", desc: "Cambiador y espacio adaptado para la comodidad de los más pequeños y sus familias." },
  { src: "/images/instalaciones-banos-9.jpg", title: "Baños Renovados", category: "Instalaciones", desc: "Baños modernos, limpios y equipados con todo lo necesario para tu comodidad." },
  { src: "/images/cabinas.jpg", title: "Cabinas", category: "Instalaciones", desc: "Cabinas privadas y vestuarios exclusivos para cambiarse con total comodidad." },

  // --- EVENTOS ---
  { src: "/images/eventos-salon-noche.png", title: "Salón de Eventos Nocturno", category: "Eventos", desc: "La mítica esquina de Playa Grande iluminada de noche, lista para albergar las celebraciones más exclusivas frente al mar." },
  { src: "/images/eventos-cumpleanos.jpg", title: "Celebraciones Privadas", category: "Eventos", desc: "Cumpleaños y eventos sociales en un ambiente festivo, con excelente barra de tragos y diseño interior de vanguardia." },
  { src: "/images/eventos-fiesta.jpg", title: "Música en Vivo & Fiestas", category: "Eventos", desc: "Eventos nocturnos con bandas en vivo, iluminación profesional y una atmósfera inigualable frente al Atlántico." },
  { src: "/images/event1.png", title: "Lanzamientos y Cenas", category: "Eventos", desc: "El entorno ideal para potenciar tu marca o agasajar a tus clientes." },
  { src: "/images/event2.webp", title: "Casamientos y Fiestas de 15", category: "Eventos", desc: "Celebraciones mágicas con el Atlántico como testigo y un servicio premium." },

  // --- RECREACIÓN & CLUB ---
  { src: "/images/prius5.webp", title: "Espacio de Recreación para Niños", category: "Recreación & Club", desc: "Un sector especialmente diseñado para que los más chicos se diviertan con juegos y actividades recreativas sobre la arena." },
  { src: "/images/recreacion-metegol.jpg", title: "Metegol en la Arena", category: "Recreación & Club", desc: "Diversión clásica frente al mar con torneos de metegol para disfrutar en familia." },
  { src: "/images/recreacion-talleres.jpg", title: "Talleres de Arte", category: "Recreación & Club", desc: "Espacio creativo para niños con talleres de collares, pulseras y manualidades guiadas." },
  { src: "/images/recreacion-jenga.jpg", title: "Jenga Gigante", category: "Recreación & Club", desc: "Desafíos de destreza y risas aseguradas con nuestro jenga gigante en la playa." },
  { src: "/images/recreacion-surf.jpg", title: "Surf", category: "Recreación & Club", desc: "Disfrutá de las mejores olas de Playa Grande con tablas de surf de primer nivel." },
]

const PRIORITY_TITLES = [
  "Deck Principal",
  "Reposeras Ergonómicas",
  "Solárium & Pileta",
  "Sabores de Costa",
  "Lanzamientos y Cenas"
]

const priorityItems = PRIORITY_TITLES.map(title => 
  unifiedImages.find(img => img.title === title)
).filter(Boolean)

const remainingItems = unifiedImages.filter(img => 
  !PRIORITY_TITLES.includes(img.title)
)

const mixedRemaining = [...remainingItems].sort((a, b) => {
  const hashA = (a.title.charCodeAt(0) || 0) + (a.desc.length % 7)
  const hashB = (b.title.charCodeAt(0) || 0) + (b.desc.length % 7)
  return hashA - hashB
})

const todoImages = [...priorityItems, ...mixedRemaining]

function ImageModal({ selectedImage, onClose }) {
  if (!selectedImage) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-md animate-premium-fade overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[1200px] 2xl:max-w-[1500px] bg-white rounded-3xl overflow-hidden border border-hairline flex flex-col md:flex-row shadow-2xl animate-premium-slide max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-neutral-950/80 hover:bg-gold hover:text-prius-black text-white rounded-full border border-white/15 transition-all duration-200 cursor-pointer"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        <div className="w-full md:w-[65%] bg-neutral-900 relative min-h-[280px] max-h-[45vh] md:max-h-[75vh] flex items-center justify-center p-4 md:p-8 shrink-0">
          <img
            src={selectedImage.src}
            alt={selectedImage.title}
            className="max-w-full max-h-full object-contain rounded-xl shadow-xl"
          />
          <span className="absolute bottom-4 left-4 bg-neutral-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-sm text-[10px] 2xl:text-xs uppercase tracking-wider text-gold font-display border border-gold/30">
            {selectedImage.category}
          </span>
        </div>

        <div className="w-full md:w-[35%] p-6 md:p-10 flex flex-col justify-between bg-white overflow-y-auto border-t md:border-t-0 md:border-l border-hairline">
          <div className="space-y-4 my-auto">
            <span className="text-[10px] 2xl:text-xs font-bold uppercase tracking-widest text-gold font-display block">
              Experiencia Prius
            </span>
            <h3 className="text-xl md:text-3xl font-bold uppercase tracking-tight text-prius-black font-display leading-tight">
              {selectedImage.title}
            </h3>
            <div className="h-[2px] bg-gold/40 w-16" />
            <p className="text-xs md:text-sm 2xl:text-base text-prius-black/70 leading-relaxed font-light">
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

  const filteredImages = activeCategory === "Todo"
    ? todoImages
    : unifiedImages.filter((img) => img.category === activeCategory)

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
      } else {
        setScrollProgress(0)
      }
    }
  }

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section className="min-h-screen flex flex-col justify-center py-16 md:py-24 2xl:py-32 px-margin-mobile md:px-margin-desktop bg-prius-background border-t border-hairline" id="servicios">
      <div className="max-w-[1920px] 2xl:max-w-[2200px] mx-auto w-full relative z-10">
        
        <div className="max-w-[1440px] 2xl:max-w-[1800px] mx-auto mb-10 2xl:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[9px] md:text-[11px] 2xl:text-xs font-bold uppercase tracking-[0.3em] text-prius-black/40 block mb-1.5 font-display">
              Estilo de Vida Prius
            </span>
            <h2 className="text-2xl md:text-4xl 2xl:text-5xl 3xl:text-6xl font-normal tracking-tight text-prius-black uppercase font-display leading-none">
              Servicios de <span className="text-gold font-bold">Exclusividad</span> Absoluta
            </h2>
          </div>
          <p className="text-prius-black/70 text-xs md:text-sm 2xl:text-base max-w-sm leading-relaxed font-light">
            Minimalismo estructural y confort absoluto diseñado al detalle para una experiencia de playa incomparable.
          </p>
        </div>

        {/* Sección de Categorías en una Sola Fila Única sin saltos de línea */}
        <div className="max-w-[1440px] 2xl:max-w-[1800px] mx-auto flex items-center justify-between border-b border-hairline/60 pb-6 mb-8 gap-4 overflow-hidden">
          
          <div className="flex items-center gap-1.5 lg:gap-2 overflow-x-auto scrollbar-none py-1 w-full lg:w-auto" style={{ scrollbarWidth: 'none' }}>
            {CATEGORY_ITEMS.map((cat) => {
              const IconComp = cat.icon
              const isSelected = activeCategory === cat.id
              const displayLabel = cat.shortLabel || cat.label
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id)
                    setScrollProgress(0)
                    if (sliderRef.current) sliderRef.current.scrollLeft = 0
                  }}
                  className={`flex items-center gap-1.5 px-3 lg:px-3.5 2xl:px-4 py-1.5 lg:py-2 rounded-full text-[9px] xl:text-[10px] 2xl:text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-gold text-prius-black border border-gold shadow-sm'
                      : 'bg-white text-prius-black/70 border border-hairline hover:border-gold/60 hover:text-prius-black hover:bg-gold/5'
                  }`}
                >
                  <IconComp size={11} className={`shrink-0 ${isSelected ? 'text-prius-black' : 'text-gold'}`} />
                  <span>{displayLabel}</span>
                </button>
              )
            })}
          </div>

          <div className="hidden lg:flex gap-2 shrink-0">
            <button
              onClick={() => scrollSlider('left')}
              className="p-2.5 bg-white border border-hairline rounded-full hover:bg-gold hover:text-prius-black hover:border-gold transition-all duration-200 cursor-pointer shadow-sm text-prius-black"
              aria-label="Anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollSlider('right')}
              className="p-2.5 bg-white border border-hairline rounded-full hover:bg-gold hover:text-prius-black hover:border-gold transition-all duration-200 cursor-pointer shadow-sm text-prius-black"
              aria-label="Siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </div>

        </div>

        <div className="relative max-w-[1440px] 2xl:max-w-[1800px] mx-auto">
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-prius-background to-transparent pointer-events-none z-10" />

          <div
            key={activeCategory}
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory scrollbar-none md:snap-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(img)}
                className="group relative w-[290px] sm:w-[340px] 2xl:w-[400px] h-[400px] md:h-[450px] 2xl:h-[500px] shrink-0 snap-start bg-neutral-950 border border-hairline rounded-2xl 2xl:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:border-gold/50 transition-all duration-300 cursor-pointer"
              >
                <img
                  alt={img.title}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${img.position || 'object-center'}`}
                  src={img.src}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />

                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-neutral-950/60 backdrop-blur-md text-gold text-[8px] 2xl:text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-gold/30">
                    {img.category}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImage(img)
                  }}
                  className="absolute top-4 right-4 z-10 p-2.5 bg-neutral-950/60 backdrop-blur-md text-white hover:bg-gold hover:text-prius-black rounded-full border border-white/15 transition-all duration-200 cursor-pointer shadow-md"
                  title="Ampliar vista"
                >
                  <Maximize2 size={13} />
                </button>

                <div className="absolute inset-x-0 bottom-0 p-6 2xl:p-8 z-10 flex flex-col justify-end">
                  <h4 className="text-base md:text-lg 2xl:text-xl font-bold text-white uppercase tracking-tight font-display mb-1.5 leading-snug drop-shadow-sm">
                    {img.title}
                  </h4>
                  <p className="text-xs 2xl:text-sm text-white/75 font-light line-clamp-2 leading-relaxed mb-4 drop-shadow-sm">
                    {img.desc}
                  </p>

                  <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[10px] 2xl:text-xs font-bold text-gold uppercase tracking-widest font-display transition-transform duration-300 group-hover:translate-x-1">
                      <span>VER DETALLE</span>
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-1.5 mt-6">
            <div className="w-28 h-[2px] bg-hairline relative rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gold transition-all duration-300 rounded-full"
                style={{ width: `${Math.max(15, scrollProgress)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <ImageModal selectedImage={selectedImage} onClose={() => setSelectedImage(null)} />
    </section>
  )
}