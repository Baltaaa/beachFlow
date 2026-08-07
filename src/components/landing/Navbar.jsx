import { useState, useEffect } from 'react'
import {
  Menu,
  X,
  LayoutGrid,
  Calendar,
  MessageSquare,
  ArrowRight,
  Phone,
} from 'lucide-react'

const SECTIONS = [
  { id: 'servicios', label: 'Playa & Servicios', icon: LayoutGrid },
  { id: 'eventos', label: 'Salón de Eventos', icon: Calendar },
  { id: 'testimonios', label: 'Opiniones', icon: MessageSquare },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState('dark')

  // El header lee el atributo data-theme de la sección que tiene detrás
  // (seteado en LandingPage.jsx en cada bloque) para pasar de modo oscuro
  // a claro y viceversa a medida que se scrollea. Con scroll-behavior:smooth
  // global el navegador dispara muy pocos eventos "scroll" durante la
  // animación (a veces uno solo, lejos de la posición final), así que en
  // vez de atarnos a esos eventos usamos un loop de rAF que muestrea la
  // posición en cada frame mientras el componente está montado.
  useEffect(() => {
    let rafId
    let lastScrolled = null
    let lastTheme = null

    const sample = () => {
      const isScrolled = window.scrollY > 16
      const probeY = window.innerWidth < 768 ? 70 : 100
      let detectedTheme = 'dark'
      const el = document.elementFromPoint(window.innerWidth / 2, probeY)
      let node = el
      while (node) {
        if (node.getAttribute && node.getAttribute('data-theme')) {
          detectedTheme = node.getAttribute('data-theme')
          break
        }
        node = node.parentElement
      }
      if (isScrolled !== lastScrolled) {
        lastScrolled = isScrolled
        setScrolled(isScrolled)
      }
      if (detectedTheme !== lastTheme) {
        lastTheme = detectedTheme
        setTheme(detectedTheme)
      }
      rafId = requestAnimationFrame(sample)
    }

    rafId = requestAnimationFrame(sample)
    return () => cancelAnimationFrame(rafId)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const scrollToSection = (id) => {
    setIsOpen(false)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 150)
  }

  const isDark = theme === 'dark'

  // --- Clases derivadas del estado (scrolled x theme), desktop ---
  const desktopInnerClass = !scrolled
    ? 'max-w-[1920px] h-[88px] bg-transparent border-transparent px-8'
    : isDark
      ? 'max-w-[1200px] h-[60px] bg-neutral-950/85 border-gold/30 shadow-[0_0_20px_rgba(242,202,80,0.18),0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-lg px-6'
      : 'max-w-[1200px] h-[60px] bg-white/[0.78] border-black/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-lg px-6'

  const desktopTextClass = !scrolled
    ? 'text-white/85'
    : isDark ? 'text-white/80' : 'text-black/65'

  const desktopPillClass = !scrolled
    ? 'bg-white/10 border-white/15'
    : isDark ? 'bg-white/5 border-white/10' : 'bg-black/[0.04] border-black/10'

  // --- Estilos del header mobile: flota transparente arriba de todo (estado
  // original, sin tocar) y solo adopta el tratamiento "sticky" (fondo, blur,
  // sombra) al scrollear. Un gradiente CSS no se puede animar suavemente
  // vía `transition` (background-image no es interpolable), así que en vez
  // de mutar un único fondo usamos dos capas fijas (una oscura, una clara)
  // apiladas y cruzamos su opacidad — eso sí es animable — para lograr un
  // fundido suave tanto al aparecer el fondo sticky como al cambiar de tema.
  const mobileLayerBase = {
    position: 'absolute',
    inset: 0,
    backdropFilter: `blur(${scrolled ? 18 : 0}px) saturate(160%)`,
    WebkitBackdropFilter: `blur(${scrolled ? 18 : 0}px) saturate(160%)`,
    transition: 'opacity 550ms ease, backdrop-filter 550ms ease',
  }
  const mobileDarkLayerStyle = {
    ...mobileLayerBase,
    opacity: scrolled && isDark ? 1 : 0,
    background: 'linear-gradient(to bottom, rgba(10,10,10,0.92), rgba(10,10,10,0.8))',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
  }
  const mobileLightLayerStyle = {
    ...mobileLayerBase,
    opacity: scrolled && !isDark ? 1 : 0,
    background: 'linear-gradient(to bottom, rgba(249,249,249,0.92), rgba(249,249,249,0.8))',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  }

  const mobileBurgerClass = !scrolled
    ? 'border-white/15 bg-white/10 text-white'
    : isDark
      ? 'border-white/[0.12] bg-white/[0.08] text-white'
      : 'border-black/10 bg-black/5 text-black'

  return (
    <>
      {/* ===== Desktop / Tablet ===== */}
      <header className="hidden md:block fixed z-50 left-0 right-0 mx-auto top-4 px-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <div className={`mx-auto relative flex items-center justify-between gap-4 border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full ${desktopInnerClass}`}>

          <div className="flex items-center shrink-0">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-transparent px-0 inline-flex items-center justify-center cursor-pointer"
            >
              <img
                src={scrolled ? '/images/prius-icon.png' : '/images/prius-logo-white.png'}
                alt="Prius Playa Grande"
                className="w-auto object-contain transition-all duration-500 ease-out"
                style={{ height: scrolled ? 34 : 62 }}
              />
            </button>
          </div>

          <nav className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2 transition-all duration-700">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-[10px] 2xl:text-xs font-bold tracking-[0.15em] uppercase cursor-pointer transition-colors duration-400 hover:text-gold ${desktopTextClass}`}
                >
                  <Icon size={12} className="text-gold shrink-0" />
                  <span>{sec.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://wa.me/542235765482"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] 2xl:text-xs font-semibold transition-colors duration-400 cursor-pointer border ${desktopPillClass} ${desktopTextClass}`}
            >
              <svg className="w-3.5 h-3.5 fill-[#25D366]" viewBox="0 0 24 24">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.758.459 3.474 1.33 4.982L2 22l5.176-1.332c1.458.796 3.097 1.215 4.832 1.216h.004c5.507 0 9.99-4.479 9.99-9.985 0-2.667-1.039-5.176-2.927-7.062A9.927 9.927 0 0 0 12.012 2zm0 18.334h-.003c-1.488 0-2.947-.4-4.218-1.155l-.302-.18-3.132.806.835-3.042-.198-.312a8.318 8.318 0 0 1-1.272-4.464c0-4.587 3.733-8.318 8.322-8.318 2.222 0 4.312.866 5.882 2.436a8.27 8.27 0 0 1 2.433 5.883c0 4.588-3.733 8.318-8.322 8.318zm4.562-6.229c-.25-.125-1.48-.73-1.71-.813-.23-.083-.397-.125-.563.125-.166.25-.646.813-.791.979-.145.166-.291.187-.541.062-.25-.125-1.056-.39-2.012-1.242-.744-.663-1.247-1.482-1.393-1.732-.146-.25-.015-.385.11-.51.112-.112.25-.291.375-.437.125-.146.166-.25.25-.417.083-.166.042-.312-.021-.437-.062-.125-.563-1.354-.771-1.854-.203-.488-.41-.422-.563-.43-.145-.007-.312-.01-.479-.01-.167 0-.437.062-.666.312-.229.25-.875.854-.875 2.083 0 1.229.896 2.417 1.021 2.583.125.167 1.763 2.693 4.272 3.776.597.258 1.063.412 1.426.528.599.19 1.144.163 1.575.099.481-.072 1.48-.604 1.688-1.188.208-.583.208-1.083.146-1.188-.063-.104-.229-.166-.479-.291z" />
              </svg>
              <span className="uppercase">Contacto</span>
            </a>

            <button
              onClick={() => scrollToSection('contacto')}
              className="h-9 2xl:h-10 cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-full px-5 2xl:px-7 text-[10px] 2xl:text-xs font-bold uppercase tracking-wider transition-all duration-500 bg-gold text-prius-black hover:bg-gold-hover shadow-lg font-display active:scale-95"
            >
              RESERVÁ
            </button>
          </div>
        </div>
      </header>

      {/* ===== Mobile ===== */}
      <header
        className={`md:hidden fixed inset-x-0 top-0 z-50 box-border transition-[height] duration-500 ease-out ${scrolled ? 'h-16' : 'h-24'}`}
      >
        <div style={mobileDarkLayerStyle} />
        <div style={mobileLightLayerStyle} />

        <div className="relative h-full flex items-center justify-between px-5">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-transparent px-0 inline-flex items-center justify-center cursor-pointer"
          >
            <img
              src={scrolled ? '/images/prius-icon.png' : '/images/prius-logo-white.png'}
              alt="Prius Playa Grande"
              className="w-auto object-contain transition-all duration-500 ease-out"
              style={{ height: scrolled ? 28 : 58 }}
            />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center justify-center size-9 rounded-full border cursor-pointer transition-colors duration-400 ${mobileBurgerClass}`}
            aria-label="Menu"
          >
            {isOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </header>

      {/* Menú Mobile Fullscreen */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-[45] bg-neutral-950/[0.96] backdrop-blur-md flex flex-col pt-[88px] px-[22px] pb-8 box-border animate-premium-fade">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold font-display mb-4 block">
            Navegación
          </span>

          <div className="flex flex-col">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className="flex items-center gap-3 py-4 px-[18px] rounded-2xl border border-white/[0.06] bg-white/[0.03] mb-2.5 cursor-pointer"
                >
                  <Icon size={16} className="text-gold shrink-0" />
                  <span className="text-[15px] font-bold uppercase tracking-wide text-white font-display">
                    {sec.label}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-auto space-y-3 pt-6 border-t border-white/10">
            <button
              onClick={() => scrollToSection('contacto')}
              className="w-full py-4 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gold text-prius-black shadow-xl font-display flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>RESERVÁ TU LUGAR</span>
              <ArrowRight size={14} />
            </button>

            <a
              href="https://wa.me/542235765482"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/5 text-white border border-white/10 font-display"
            >
              <Phone size={14} className="text-gold" />
              <span>WHATSAPP</span>
            </a>
          </div>
        </div>
      )}
    </>
  )
}
