import { useState, useEffect } from 'react'
import { 
  Menu, 
  X, 
  Handshake, 
  LayoutGrid, 
  Calendar, 
  Image, 
  MessageSquare 
} from 'lucide-react'

const SECTIONS = [
  { id: 'partners', label: 'Socios', icon: Handshake },
  { id: 'servicios', label: 'Servicios', icon: LayoutGrid },
  { id: 'eventos', label: 'Eventos', icon: Calendar },
  { id: 'galeria', label: 'Galería', icon: Image },
  { id: 'testimonios', label: 'Opiniones', icon: MessageSquare },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      if (scrollY < 50) {
        setIsScrolled(false)
      } else {
        setIsScrolled(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Ejecución inicial
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  // Estilos dinámicos del contenedor general del HEADER
  const headerBackgroundClass = !isScrolled
    ? 'top-[20px] w-full max-w-[1952px] px-4'
    : 'top-0 w-full max-w-full px-4 sm:px-6 py-1'

  // Estilos de los textos de navegación (Claros al inicio, oscuros al hacer scroll)
  const textColorClass = !isScrolled
    ? 'text-white/85 hover:text-gold transition-colors duration-300'
    : 'text-neutral-800 hover:text-gold transition-colors duration-300'

  const textIconColor = !isScrolled 
    ? 'text-white/60' 
    : 'text-neutral-500'

  // Cápsula de navegación central (Oscura al inicio, blanca al hacer scroll)
  const navPillBackground = !isScrolled
    ? 'bg-white/10 border border-white/5 backdrop-blur-md'
    : 'bg-white/90 border border-neutral-200/40 backdrop-blur-md shadow-sm'

  // Cápsula de Selector de Idioma (Oscura al inicio, blanca al hacer scroll)
  const languageButtonClass = !isScrolled
    ? 'bg-white/10 text-white/85 hover:bg-white/20 border border-white/5 backdrop-blur-md'
    : 'bg-white/90 text-neutral-800 hover:bg-white border border-neutral-200/40 backdrop-blur-md shadow-sm'

  // Cápsula de Menú Móvil (Oscura al inicio, blanca al hacer scroll)
  const menuButtonClass = !isScrolled
    ? 'bg-white/10 text-white hover:bg-white/20 border border-white/5 backdrop-blur-md'
    : 'bg-white/90 text-neutral-800 hover:bg-white border border-neutral-200/40 backdrop-blur-md shadow-sm'

  return (
    <>
      {/* CAPA DE DESENFOQUE PROGRESIVO EXTENDIDO (180px) CON GRADIENTE NEUTRO OSCURO SUAVE */}
      <div 
        aria-hidden="true" 
        className={`fixed top-0 left-0 right-0 h-[180px] pointer-events-none z-40 transition-all duration-700 ease-in-out ${
          isScrolled 
            ? 'opacity-100' 
            : 'opacity-0 invisible'
        }`}
        style={{
          background: 'linear-gradient(to bottom, rgba(15, 15, 15, 0.5) 0%, rgba(15, 15, 15, 0.35) 30%, rgba(15, 15, 15, 0.15) 60%, rgba(15, 15, 15, 0.02) 85%, rgba(15, 15, 15, 0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0.3) 75%, rgba(0,0,0,0) 100%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0.3) 75%, rgba(0,0,0,0) 100%)',
          backdropFilter: isScrolled ? 'blur(300px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(300px)' : 'none',
        }}
      />

      {/* Sutil gradiente oscuro inicial para el Hero */}
      <div 
        aria-hidden="true" 
        className={`pointer-events-none fixed inset-x-0 top-0 z-40 h-32 bg-gradient-to-b from-black/50 to-transparent transition-all duration-500 ${
          isScrolled ? 'opacity-0 invisible' : 'opacity-100'
        }`}
      />

      <header 
        className={`fixed z-50 transition-all duration-500 ease-in-out left-0 right-0 mx-auto ${headerBackgroundClass}`}
      >
        {/* Contenedor interno */}
        <div className={`mx-auto w-full px-4 sm:px-6 max-w-[1200px] flex items-center justify-between lg:grid lg:grid-cols-[auto_1fr_auto] gap-4 transition-all duration-500 ${
          isScrolled ? 'h-14' : 'h-18'
        }`}>
          
          {/* LEFT: Logo interactivo */}
          <div className="flex items-center shrink-0">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className="bg-transparent px-0 inline-flex h-9 items-center justify-center rounded-full transition-all duration-500 cursor-pointer"
            >
              <img 
                src="/favicon-512x512.png" 
                alt="Prius Monograma" 
                className={`w-auto object-contain transition-all duration-500 ${
                  isScrolled ? 'h-[30px] md:h-[34px]' : 'h-[38px] md:h-[44px]'
                }`}
              />
            </button>
          </div>

          {/* CENTER: Menú de navegación dinámico (Oculto en mobile/tablet, visible en desktop) */}
          <nav className={`hidden lg:flex items-center rounded-full transition-all duration-500 h-9 justify-self-center p-0.5 ${navPillBackground}`}>
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-semibold tracking-wider uppercase cursor-pointer transition-all ${textColorClass}`}
                >
                  <Icon size={10} className={`${textIconColor} shrink-0`} />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Selector de Idioma + CTA Principal */}
          <div className="flex items-center gap-2 shrink-0 justify-self-end">
            <div className="relative hidden sm:block">
              <button 
                type="button" 
                className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[10px] font-semibold transition-all duration-500 cursor-pointer ${languageButtonClass}`}
              >
                <span className="text-[12px] leading-none">🇦🇷</span>
                <span className="uppercase">es</span>
              </button>
            </div>
            
            {/* Botón de Menú Móvil */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className={`flex items-center rounded-full transition-all duration-500 size-9 shrink-0 justify-center lg:hidden cursor-pointer ${menuButtonClass}`}
              aria-label="Menu"
            >
              {isOpen ? <X size={15} /> : <Menu size={15} />}
            </button>

            <button 
              onClick={() => scrollToSection('contacto')}
              className="h-9 cursor-pointer items-center justify-center whitespace-nowrap rounded-full px-4 text-[10px] font-bold hidden sm:inline-flex uppercase tracking-wider transition-all duration-500 bg-gold text-prius-black hover:bg-gold-hover shadow-sm"
            >
              COTIZAR ESTADÍA
            </button>
          </div>
        </div>

        {/* Menú Móvil Desplegable */}
        {isOpen && (
          <div className={`absolute left-6 right-6 border border-white/10 rounded-2xl py-6 px-6 lg:hidden flex flex-col gap-4 animate-premium-fade z-40 transition-all duration-500 bg-neutral-950/95 backdrop-blur-xl text-white ${
            isScrolled ? 'top-[52px]' : 'top-[60px]'
          }`}>
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className="text-left text-xs font-semibold tracking-widest uppercase py-1.5 transition-colors duration-300 font-display text-white/90 hover:text-gold flex items-center gap-2.5"
                >
                  <Icon size={13} className="text-gold shrink-0" />
                  <span>{sec.label}</span>
                </button>
              );
            })}
            <button 
              onClick={() => scrollToSection('contacto')}
              className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-widest text-center mt-2 transition-all cursor-pointer bg-gold text-prius-black hover:bg-gold-hover"
            >
              COTIZAR ESTADÍA
            </button>
          </div>
        )}
      </header>
    </>
  )
}