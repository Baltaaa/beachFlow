import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Maximize2,
  X,
} from 'lucide-react'

// Cada "sector" agrupa varias fotos bajo un mismo servicio. La card de portada
// abre la galería interna del sector (con su propia navegación prev/next).
const SECTORS = [
  {
    id: 'carpas',
    label: 'Carpas & Sombrillas',
    tagline: 'Estructuras premium con lona náutica frente al mar.',
    cover: '/images/carpas-amigos.webp',
    images: [
      { src: '/images/carpas-amigos.webp', title: 'Living Familiar', desc: 'Espacios amplios y cómodos para disfrutar con la mejor compañía.' },
      { src: '/images/carpas-reposeras-2.jpg', title: 'Reposeras Ergonómicas', desc: 'Mobiliario exterior de alta gama diseñado para un descanso absoluto.' },
      { src: '/images/carpas-sombrillas-4.jpg', title: 'Sombrillas Exclusivas', desc: 'Sombrillas premium con amplio espacio de sombra y atención personalizada.' },
      { src: '/images/carpas-pasillo-6.jpg', title: 'Pasillos de Carpas', desc: 'Pasillos limpios, amplios y perfectamente mantenidos para un tránsito cómodo.' },
      { src: '/images/carpas-sombrillas-5.jpg', title: 'Espacio de Sombrillas', desc: 'Disfrutá de la brisa marina en nuestro sector exclusivo de sombrillas.' },
      { src: '/images/carpasYsombriService.webp', title: 'Santuario de Sombra', desc: 'Estructuras de madera premium con lona náutica de máxima protección UV.' },
    ],
  },
  {
    id: 'gastronomia-eventos',
    label: 'Gastronomía & Eventos',
    tagline: 'Gastronomía gourmet y salones para tus celebraciones.',
    cover: '/images/gastronomia-platos.png',
    images: [
      { src: '/images/gastronomia-platos.png', title: 'Platos Seleccionados', desc: 'Exquisita propuesta gastronómica con ensaladas frescas, ingredientes premium y platos de estación servidos frente al mar.' },
      { src: '/images/gastronomia-amigos.jpg', title: 'Momentos Compartidos', desc: 'Disfrutá de un almuerzo distendido con amigos, tragos frescos y la mejor energía de Playa Grande.' },
      { src: '/images/gastronomia-barra.jpg', title: 'Barra de Encuentros', desc: 'Un espacio de barra dinámico y moderno para disfrutar de cafetería de especialidad y coctelería de autor.' },
      { src: '/images/gastronomia-charla.jpg', title: 'Tardes de Encuentro', desc: 'Charlas inolvidables acompañadas de cervezas artesanales y una vista inigualable de la costa.' },
      { src: '/images/eventos-salon-noche.png', title: 'Salón de Eventos Nocturno', desc: 'La mítica esquina de Playa Grande iluminada de noche, lista para albergar las celebraciones más exclusivas frente al mar.' },
      { src: '/images/eventos-fiesta.jpg', title: 'Música en Vivo & Fiestas', desc: 'Eventos nocturnos con bandas en vivo, iluminación profesional y una atmósfera inigualable frente al Atlántico.' },
      { src: '/images/eventos-cumpleanos.jpg', title: 'Celebraciones Privadas', desc: 'Cumpleaños y eventos sociales en un ambiente festivo, con excelente barra de tragos y diseño interior de vanguardia.' },
    ],
  },
  {
    id: 'pileta',
    label: 'Pileta & Solárium',
    tagline: 'Piscina climatizada y solárium con vista al mar.',
    cover: '/images/instalaciones-solarium.jpg',
    images: [
      { src: '/images/instalaciones-solarium.jpg', title: 'Solárium & Pileta', desc: 'Espectacular vista panorámica desde nuestro solárium de madera noble equipado con camastros y piscina climatizada.' },
      { src: '/images/piletaService.webp', title: 'Espejo de Agua', desc: 'Piscina climatizada que se funde visualmente con el horizonte costero.' },
      { src: '/images/prius7.webp', title: 'Deck de Madera Noble', desc: 'Solárium exclusivo equipado con camastros acolchados premium.' },
    ],
  },
  {
    id: 'recreacion',
    label: 'Recreación & Club',
    tagline: 'Juegos y actividades al aire libre para toda la familia.',
    cover: '/images/prius5.webp',
    images: [
      { src: '/images/prius5.webp', title: 'Espacio de Recreación para Niños', desc: 'Un sector especialmente diseñado para que los más chicos se diviertan con juegos y actividades recreativas sobre la arena.' },
      { src: '/images/recreacion-metegol.jpg', title: 'Metegol en la Arena', desc: 'Diversión clásica frente al mar con torneos de metegol para disfrutar en familia.' },
      { src: '/images/recreacion-talleres.jpg', title: 'Talleres de Arte', desc: 'Espacio creativo para niños con talleres de collares, pulseras y manualidades guiadas.' },
      { src: '/images/recreacion-jenga.jpg', title: 'Jenga Gigante', desc: 'Desafíos de destreza y risas aseguradas con nuestro jenga gigante en la playa.' },
    ],
  },
  {
    id: 'wellness',
    label: 'Wellness',
    tagline: 'Masajes, yoga y bienestar frente al Atlántico.',
    cover: '/images/wellness-masajes.jpg',
    images: [
      { src: '/images/wellness-masajes.jpg', title: 'Masajes Terapéuticos', desc: 'Sesiones de masajes descontracturantes y relajantes a cargo de la kinesióloga Pilar Ferrando para renovar cuerpo y mente.' },
      { src: '/images/wellness-aquadance.jpg', title: 'Aqua Dance', desc: 'Clases dinámicas y divertidas de aqua dance en nuestra piscina climatizada para todas las edades.' },
      { src: '/images/wellness-yoga.jpg', title: 'Yoga Grupal', desc: 'Prácticas de yoga grupales sobre la arena para conectar con la respiración y el sonido del mar.' },
      { src: '/images/wellness-relax-arena.jpg', title: 'Oasis de Relajación', desc: 'Descanso absoluto en cómodas reposeras sobre la arena, disfrutando de la brisa marina y el sol.' },
      { src: '/images/recreacion-surf.jpg', title: 'Surf', desc: 'Disfrutá de las mejores olas de Playa Grande con tablas de surf de primer nivel.' },
    ],
  },
  {
    id: 'coworking',
    label: 'Coworking',
    tagline: 'Espacios de trabajo al aire libre frente al mar.',
    cover: '/images/coworking-deck.jpg',
    images: [
      { src: '/images/coworking-deck.jpg', title: 'Deck Principal', desc: 'Espacio de trabajo al aire libre sobre deck de madera noble, ideal para inspirarse frente al mar.' },
      { src: '/images/coworking-sala-1.jpg', title: 'Conexión estable para reuniones', desc: 'Espacio privado vidriado para conferencias y llamadas con aislamiento acústico.' },
      { src: '/images/prius3.webp', title: 'Espacio de Cowork', desc: 'Un rincón de paz y desconexión dentro del área de coworking para recargar energías entre tareas.' },
    ],
  },
  {
    id: 'instalaciones',
    label: 'Instalaciones',
    tagline: 'Vestuarios, lockers y espacios renovados.',
    cover: '/images/instalaciones-paseo.jpg',
    images: [
      { src: '/images/instalaciones-paseo.jpg', title: 'Paseo Playa Grande', desc: 'Ubicación privilegiada en el corazón del paseo de Playa Grande, integrando diseño moderno y naturaleza costera.' },
      { src: '/images/instalaciones-lockers-7.jpg', title: 'Lockers de Seguridad', desc: 'Tranquilidad absoluta para tus pertenencias con lockers privados y vestuarios de primer nivel.' },
      { src: '/images/gallery_1400392.webp', title: 'Vestuarios & Duchas', desc: 'Higiene, confort y privacidad en instalaciones totalmente renovadas.' },
      { src: '/images/instalaciones-bebes-8.jpg', title: 'Espacio para Bebés', desc: 'Cambiador y espacio adaptado para la comodidad de los más pequeños y sus familias.' },
      { src: '/images/instalaciones-banos-9.jpg', title: 'Baños Renovados', desc: 'Baños modernos, limpios y equipados con todo lo necesario para tu comodidad.' },
      { src: '/images/cabinas.jpg', title: 'Cabinas', desc: 'Cabinas privadas y vestuarios exclusivos para cambiarse con total comodidad.' },
    ],
  },
  {
    id: 'marcas',
    label: 'Marcas',
    tagline: 'Las marcas que confiaron en Prius Playa Grande.',
    cover: '/images/marca-burger-king.webp',
    images: [
      { src: '/images/marca-burger-king.webp', title: 'Burger King', desc: 'Activación de marca junto a Burger King, con un arco imponente que recibió a nuestros visitantes en la playa.' },
      { src: '/images/marca-santa-julia.webp', title: 'Santa Julia', desc: 'Santa Julia brindó con nuestros visitantes en una experiencia de coctelería frente al mar.' },
      { src: '/images/marca-medife.webp', title: 'Medifé', desc: 'Medifé se sumó a nuestras propuestas de bienestar y salud durante el verano.' },
      { src: '/images/marca-banco-macro.webp', title: 'Banco Macro', desc: 'Banco Macro acompañó un evento exclusivo junto a la pileta de Prius Playa Grande.' },
      { src: '/images/marca-dermaglos.webp', title: 'Dermaglós', desc: 'Dermaglós presente con una activación de cuidado solar y juegos para toda la familia.' },
      { src: '/images/marca-vea.webp', title: 'Vea', desc: 'Vea se sumó con una jornada de actividades y sorpresas para los más chicos en el espacio de playa.' },
      { src: '/images/marca-cencosud.webp', title: 'Cencosud', desc: 'Activación de la Tarjeta Cencosud junto a Vea, con beneficios exclusivos para nuestros visitantes.' },
      { src: '/images/marca-hawk-group.webp', title: 'Hawk Group', desc: 'Alianza estratégica con Hawk Group en experiencias exclusivas de socios.' },
      { src: '/images/marca-antonio-banderas.webp', title: 'Antonio Banderas Fragrances', desc: 'Activación de Antonio Banderas Fragrances, con una experiencia exclusiva de su línea King of Seduction frente al mar.' },
      { src: '/images/marca-arredo.webp', title: 'Arredo', desc: 'Arredo acompañó la temporada vistiendo a nuestro equipo con su sello de diseño.' },
      { src: '/images/marca-sancor-seguros.webp', title: 'Sancor Seguros', desc: 'Sancor Seguros acompañó jornadas y beneficios especiales para sus clientes.' },
      { src: '/images/marca-taragui.webp', title: 'Taragüi', desc: 'Taragüi presente en la playa con una acción de marca y regalos para nuestros visitantes.' },
    ],
  },
]

function useModalNavigation(selectedIdx, setSelectedIdx, imageIdx, setImageIdx) {
  const sector = selectedIdx !== null ? SECTORS[selectedIdx] : null

  const close = () => setSelectedIdx(null)
  const next = () => {
    if (!sector) return
    setImageIdx((i) => (i + 1) % sector.images.length)
  }
  const prev = () => {
    if (!sector) return
    setImageIdx((i) => (i - 1 + sector.images.length) % sector.images.length)
  }

  return { sector, close, next, prev }
}

// --- Modal Desktop: layout lateral (imagen 65% / info 35%), coherente con el
// modal previo del sitio pero ahora navega dentro de la galería del sector.
function DesktopModal({ selectedIdx, setSelectedIdx, imageIdx, setImageIdx }) {
  const { sector, close, next, prev } = useModalNavigation(selectedIdx, setSelectedIdx, imageIdx, setImageIdx)
  if (!sector) return null
  const image = sector.images[imageIdx]

  return (
    <div
      className="hidden md:flex fixed inset-0 z-[9999] items-center justify-center p-6 bg-neutral-950/85 backdrop-blur-md animate-premium-fade overflow-y-auto"
      onClick={close}
    >
      <div
        className="relative w-full max-w-[1200px] 2xl:max-w-[1400px] bg-white rounded-3xl overflow-hidden flex shadow-[0_30px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)] animate-premium-slide max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute top-4 right-4 z-30 p-2.5 bg-neutral-950/80 hover:bg-gold hover:text-prius-black text-white rounded-full border border-white/15 transition-all duration-200 cursor-pointer"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        <div className="w-[65%] bg-neutral-900 relative min-h-[280px] max-h-[75vh] flex items-center justify-center p-8 shrink-0">
          <img
            key={image.src}
            src={image.src}
            alt={image.title}
            className="max-w-full max-h-full object-contain rounded-xl shadow-xl animate-image-fade"
          />

          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-neutral-950/70 hover:bg-gold hover:text-prius-black text-white rounded-full border border-white/15 transition-all duration-200 cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Siguiente"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-neutral-950/70 hover:bg-gold hover:text-prius-black text-white rounded-full border border-white/15 transition-all duration-200 cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>

          <span className="absolute bottom-4 left-4 bg-neutral-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-sm text-[10px] 2xl:text-xs uppercase tracking-wider text-gold font-display border border-gold/30">
            {sector.label}
          </span>

          <div className="absolute bottom-4 right-4 flex gap-1.5">
            {sector.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setImageIdx(i)}
                aria-label={`Ir a la foto ${i + 1}`}
                className="cursor-pointer transition-all duration-300"
                style={{
                  width: i === imageIdx ? 18 : 6,
                  height: 6,
                  borderRadius: 999,
                  background: i === imageIdx ? '#F2CA50' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </div>
        </div>

        <div className="w-[35%] p-10 flex flex-col justify-center bg-white overflow-y-auto relative border-l border-hairline">
          <span className="text-[11px] 2xl:text-xs font-bold uppercase tracking-widest text-gold font-display block mb-3.5">
            Experiencia Prius &middot; {imageIdx + 1} / {sector.images.length}
          </span>
          <h3 className="text-2xl 2xl:text-[28px] font-bold uppercase tracking-tight text-prius-black font-display leading-tight mb-4">
            {image.title}
          </h3>
          <div className="h-[2px] bg-gold/40 w-16 mb-5" />
          <p className="text-sm 2xl:text-base text-prius-black/70 leading-relaxed font-light">
            {image.desc}
          </p>
        </div>
      </div>
    </div>
  )
}

// --- Modal Mobile: hoja inferior fullscreen, imagen arriba con swipe táctil
// y ficha de texto abajo, siguiendo el patrón de bottom-sheet del rediseño.
function MobileModal({ selectedIdx, setSelectedIdx, imageIdx, setImageIdx }) {
  const { sector, close, next, prev } = useModalNavigation(selectedIdx, setSelectedIdx, imageIdx, setImageIdx)
  const touchX = useRef(0)

  if (!sector) return null
  const image = sector.images[imageIdx]

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchX.current
    if (dx > 40) prev()
    else if (dx < -40) next()
  }

  return (
    <div className="flex md:hidden fixed inset-0 z-[9999] bg-neutral-950/95 backdrop-blur-md flex-col animate-premium-fade">
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative w-full flex-1 min-h-0 bg-neutral-900 flex items-center justify-center p-4"
      >
        <img
          key={image.src}
          src={image.src}
          alt={image.title}
          className="max-w-full max-h-full object-contain rounded-xl animate-image-fade"
        />

        <button
          onClick={close}
          aria-label="Cerrar"
          className="absolute top-4 right-4 p-2.5 bg-neutral-950/80 text-white rounded-full border border-white/15 cursor-pointer"
        >
          <X size={18} />
        </button>
        <button
          onClick={prev}
          aria-label="Anterior"
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-neutral-950/70 text-white rounded-full border border-white/15 cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={next}
          aria-label="Siguiente"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-neutral-950/70 text-white rounded-full border border-white/15 cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>

        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {sector.images.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === imageIdx ? 16 : 5,
                height: 5,
                borderRadius: 999,
                background: i === imageIdx ? '#F2CA50' : 'rgba(255,255,255,0.4)',
                transition: 'all .25s',
              }}
            />
          ))}
        </div>
      </div>

      <div className="shrink-0 max-h-[40vh] bg-white rounded-t-3xl -mt-4 p-6 flex flex-col overflow-y-auto shadow-[0_-8px_24px_rgba(0,0,0,0.2)] animate-premium-slide">
        <div className="w-9 h-1 rounded-full bg-hairline mx-auto mb-[18px]" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-gold font-display block mb-2.5">
          {sector.label} &middot; {imageIdx + 1} / {sector.images.length}
        </span>
        <h3 className="text-lg font-bold uppercase tracking-tight text-prius-black font-display leading-tight mb-2.5">
          {image.title}
        </h3>
        <p className="text-[13px] text-prius-black/70 leading-relaxed font-light">
          {image.desc}
        </p>
      </div>
    </div>
  )
}

export default function Services() {
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [imageIdx, setImageIdx] = useState(0)
  const [edges, setEdges] = useState({ atStart: true, atEnd: false })
  const sliderRef = useRef(null)
  const edgesRafRef = useRef(null)

  const openSector = (i) => {
    setSelectedIdx(i)
    setImageIdx(0)
  }

  useEffect(() => {
    document.body.style.overflow = selectedIdx !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedIdx])

  // Sombras de profundidad en los bordes de la fila de sectores: aparecen
  // solo cuando hay contenido oculto hacia ese lado, con un pequeño umbral
  // para no titilar por redondeo de subpíxel.
  useEffect(() => {
    const el = sliderRef.current
    if (!el) return

    const updateEdges = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el
      const threshold = 4
      setEdges({
        atStart: scrollLeft <= threshold,
        atEnd: scrollLeft + clientWidth >= scrollWidth - threshold,
      })
    }

    const onScroll = () => {
      if (edgesRafRef.current) return
      edgesRafRef.current = requestAnimationFrame(() => {
        edgesRafRef.current = null
        updateEdges()
      })
    }

    updateEdges()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateEdges)
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateEdges)
      if (edgesRafRef.current) cancelAnimationFrame(edgesRafRef.current)
    }
  }, [])

  return (
    <section className="min-h-screen flex flex-col justify-center py-16 md:py-24 2xl:py-32 px-margin-mobile md:px-8 bg-prius-background border-t border-hairline" id="servicios">
      <div className="max-w-[1920px] 2xl:max-w-[2200px] mx-auto w-full relative z-10">

        <div className="max-w-[1200px] mx-auto md:px-6 mb-10 2xl:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
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

        {/* --- Desktop / Tablet: fila horizontal de sectores --- */}
        <div className="hidden md:block relative max-w-[1200px] mx-auto px-6">
          <div
            className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-prius-background to-transparent pointer-events-none z-10 transition-opacity duration-300"
            style={{ opacity: edges.atStart ? 0 : 1 }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-prius-background to-transparent pointer-events-none z-10 transition-opacity duration-300"
            style={{ opacity: edges.atEnd ? 0 : 1 }}
          />

          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto pb-6 scroll-smooth scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {SECTORS.map((sector, i) => (
              <div
                key={sector.id}
                onClick={() => openSector(i)}
                className="group relative w-[340px] 2xl:w-[380px] h-[450px] 2xl:h-[480px] shrink-0 bg-neutral-950 border border-hairline rounded-2xl 2xl:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:border-gold/50 transition-all duration-300 cursor-pointer"
              >
                <img
                  alt={sector.label}
                  src={sector.cover}
                  className={
                    sector.lightTile
                      ? 'w-full h-full object-contain p-16 box-border bg-white'
                      : 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out'
                  }
                />

                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />

                <button
                  onClick={(e) => { e.stopPropagation(); openSector(i) }}
                  className="absolute top-4 right-4 z-10 p-2.5 bg-neutral-950/60 backdrop-blur-md text-white hover:bg-gold hover:text-prius-black rounded-full border border-white/15 transition-all duration-200 cursor-pointer shadow-md"
                  title="Ampliar vista"
                >
                  <Maximize2 size={13} />
                </button>

                <div className="absolute inset-x-0 bottom-0 p-7 2xl:p-8 z-10 flex flex-col justify-end">
                  <h4 className="text-lg 2xl:text-xl font-bold text-white uppercase tracking-tight font-display mb-1.5 leading-snug drop-shadow-sm">
                    {sector.label}
                  </h4>
                  <p className="text-xs 2xl:text-sm text-white/75 font-light leading-relaxed mb-4 drop-shadow-sm">
                    {sector.tagline}
                  </p>

                  <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[10px] 2xl:text-xs font-bold text-gold uppercase tracking-widest font-display transition-transform duration-300 group-hover:translate-x-1">
                      <span>VER GALERÍA</span>
                      <ArrowRight size={13} />
                    </span>
                    <span className="text-[10px] text-white/50 font-semibold">{sector.images.length} fotos</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Mobile: slider horizontal, una card a la vez con snap --- */}
        <div className="md:hidden relative -mx-margin-mobile">
          {/* Sombra derecha: sugiere que hay más sectores para descubrir deslizando */}
          <div className="absolute right-0 top-0 bottom-2 w-14 bg-gradient-to-l from-prius-background to-transparent pointer-events-none z-10" />

          <div
            className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none px-margin-mobile"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollPaddingLeft: '20px' }}
          >
            {SECTORS.map((sector, i) => (
              <div
                key={sector.id}
                onClick={() => openSector(i)}
                className="relative w-[78%] h-[400px] shrink-0 snap-start rounded-[20px] overflow-hidden bg-neutral-950 shadow-md active:scale-[0.98] transition-transform duration-150 cursor-pointer"
              >
                <img
                  alt={sector.label}
                  src={sector.cover}
                  className={
                    sector.lightTile
                      ? 'w-full h-full object-contain p-11 box-border bg-white'
                      : 'w-full h-full object-cover'
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/35 to-transparent" />

                <button
                  onClick={(e) => { e.stopPropagation(); openSector(i) }}
                  className="absolute top-3.5 right-3.5 p-2 bg-neutral-950/60 backdrop-blur-md text-white rounded-full border border-white/15"
                >
                  <Maximize2 size={12} />
                </button>

                <div className="absolute inset-x-0 bottom-0 p-[18px]">
                  <h4 className="text-base font-bold text-white uppercase font-display mb-1 leading-tight">
                    {sector.label}
                  </h4>
                  <p className="text-[11.5px] text-white/75 font-light leading-tight mb-2.5">
                    {sector.tagline}
                  </p>
                  <div className="flex items-center justify-between pt-2.5 border-t border-white/15">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gold uppercase tracking-widest font-display">
                      <span>VER GALERÍA</span>
                      <ArrowRight size={11} />
                    </span>
                    <span className="text-[9px] text-white/50 font-semibold">{sector.images.length} fotos</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {createPortal(
        <>
          <DesktopModal selectedIdx={selectedIdx} setSelectedIdx={setSelectedIdx} imageIdx={imageIdx} setImageIdx={setImageIdx} />
          <MobileModal selectedIdx={selectedIdx} setSelectedIdx={setSelectedIdx} imageIdx={imageIdx} setImageIdx={setImageIdx} />
        </>,
        document.body
      )}
    </section>
  )
}
