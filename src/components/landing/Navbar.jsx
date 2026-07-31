import { useState, useEffect } from 'react'
import { 
  Menu, 
  X, 
  LayoutGrid, 
  Calendar, 
  MessageSquare 
} from 'lucide-react'

const SECTIONS = [
  { id: 'servicios', label: 'Playa', icon: LayoutGrid },
  { id: 'eventos', label: 'Eventos', icon: Calendar },
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
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - 110
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    setIsOpen(false)
  }

  // Estilos dinámicos del contenedor general del HEADER (Navy oscuro en estado sticky)
  const headerBackgroundClass = !isScrolled
    ? 'top-[32px] w-full max-w-[1952px] px-4'
    : 'top-0 w-full max-w-full px-4 sm:px-6 py-2 bg-neutral-950/85 backdrop-blur-lg border-b border-white/10 shadow-xl'

  // Textos e íconos SIEMPRE legibles con colores claros sobre fondo oscuro / hero
  const textColorClass = 'text-white/90 hover:text-gold transition-colors duration-300'
  const textIconColor = 'text-gold'

  // Cápsula de navegación central
  const navPillBackground = 'bg-white/10 border border-white/15 backdrop-blur-md'

  // Cápsula de Contacto / WhatsApp
  const contactButtonClass = 'bg-white/10 text-white hover:bg-white/20 border border-white/15 backdrop-blur-md'

  // Cápsula de Menú Móvil
  const menuButtonClass = 'bg-white/10 text-white hover:bg-white/20 border border-white/15 backdrop-blur-md'

  return (
    <>
      {/* CAPA DE DESENFOQUE PROGRESIVO OBLIGATORIA */}
      <div 
        aria-hidden="true" 
        className={`fixed top-0 left-0 right-0 h-[90px] pointer-events-none z-40 transition-all duration-700 ease-in-out ${
          isScrolled 
            ? 'opacity-100' 
            : 'opacity-0 invisible'
        }`}
        style={{
          background: 'linear-gradient(to bottom, rgba(10, 10, 12, 0.7) 0%, rgba(10, 10, 12, 0.4) 50%, rgba(10, 10, 12, 0) 100%)',
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
        }}
      />

      {/* Sutil gradiente oscuro inicial para el Hero */}
      <div 
        aria-hidden="true" 
        className={`pointer-events-none fixed inset-x-0 top-0 z-40 h-32 bg-gradient-to-b from-black/60 to-transparent transition-all duration-500 ${
          isScrolled ? 'opacity-0 invisible' : 'opacity-100'
        }`}
      />

      <header 
        className={`fixed z-50 transition-all duration-500 ease-in-out left-0 right-0 mx-auto ${headerBackgroundClass}`}
      >
        {/* Contenedor interno alineado */}
        <div className={`mx-auto w-full px-4 sm:px-8 max-w-[1140px] relative flex items-center justify-between gap-4 transition-all duration-500 ${
          isScrolled ? 'h-12 sm:h-14' : 'h-[72px]'
        }`}>
          
          {/* LEFT: Logo blanco de Prius siempre nítido y legible */}
          <div className="flex items-center shrink-0">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className="bg-transparent px-0 inline-flex h-9 items-center justify-center rounded-full transition-all duration-500 cursor-pointer"
            >
              <img 
                src="/images/prius-logo-white.png" 
                alt="Prius Playa Grande" 
                className={`w-auto object-contain transition-all duration-500 ${
                  isScrolled ? 'h-[36px] md:h-[40px]' : 'h-[48px] md:h-[58px]'
                }`}
              />
            </button>
          </div>

          {/* CENTER: Menú de navegación dinámico perfectamente centrado */}
          <nav className={`hidden lg:flex items-center rounded-full transition-all duration-500 h-9 p-0.5 absolute left-1/2 -translate-x-1/2 ${navPillBackground}`}>
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-semibold tracking-wider uppercase cursor-pointer transition-all ${textColorClass}`}
                >
                  <Icon size={11} className={`${textIconColor} shrink-0`} />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Botón WhatsApp "Contacto" + CTA Principal */}
          <div className="flex items-center gap-2 shrink-0 justify-self-end">
            <a 
              href="https://wa.me/542235765482"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-[10px] font-semibold transition-all duration-500 cursor-pointer ${contactButtonClass}`}
            >
              <svg className="w-3.5 h-3.5 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.758.459 3.474 1.33 4.982L2 22l5.176-1.332c1.458.796 3.097 1.215 4.832 1.216h.004c5.507 0 9.99-4.479 9.99-9.985 0-2.667-1.039-5.176-2.927-7.062A9.927 9.927 0 0 0 12.012 2zm0 18.334h-.003c-1.488 0-2.947-.4-4.218-1.155l-.302-.18-3.132.806.835-3.042-.198-.312a8.318 8.318 0 0 1-1.272-4.464c0-4.587 3.733-8.318 8.322-8.318 2.222 0 4.312.866 5.882 2.436a8.27 8.27 0 0 1 2.433 5.883c0 4.588-3.733 8.318-8.322 8.318zm4.562-6.229c-.25-.125-1.48-.73-1.71-.813-.23-.083-.397-.125-.563.125-.166.25-.646.813-.791.979-.145.166-.291.187-.541.062-.25-.125-1.056-.39-2.012-1.242-.744-.663-1.247-1.482-1.393-1.732-.146-.25-.015-.385.11-.51.112-.112.25-.291.375-.437.125-.146.166-.25.25-.417.083-.166.042-.312-.021-.437-.062-.125-.563-1.354-.771-1.854-.203-.488-.41-.422-.563-.43-.145-.007-.312-.01-.479-.01-.167 0-.437.062-.666.312-.229.25-.875.854-.875 2.083 0 1.229.896 2.417 1.021 2.583.125.167 1.763 2.693 4.272 3.776.597.258 1.063.412 1.426.528.599.19 1.144.163 1.575.099.481-.072 1.48-.604 1.688-1.188.208-.583.208-1.083.146-1.188-.063-.104-.229-.166-.479-.291z" />
              </svg>
              <span className="uppercase">Contacto</span>
            </a>
            
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
              className="h-9 cursor-pointer items-center justify-center whitespace-nowrap rounded-full px-5 text-[10px] font-bold hidden sm:inline-flex uppercase tracking-wider transition-all duration-500 bg-gold text-prius-black hover:bg-gold-hover shadow-md font-display"
            >
              RESERVÁ
            </button>
          </div>
        </div>

        {/* Menú Móvil Desplegable */}
        {isOpen && (
          <div className="absolute left-4 right-4 border border-white/10 rounded-2xl py-6 px-6 lg:hidden flex flex-col gap-4 animate-premium-fade z-40 transition-all duration-500 bg-neutral-950/95 backdrop-blur-xl text-white top-[56px] shadow-2xl">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className="text-left text-xs font-semibold tracking-widest uppercase py-1.5 transition-colors duration-300 font-display text-white/90 hover:text-gold flex items-center gap-2.5"
                >
                  <Icon size={14} className="text-gold shrink-0" />
                  <span>{sec.label}</span>
                </button>
              );
            })}
            
            <a 
              href="https://wa.me/542235765482" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-xs font-bold uppercase tracking-widest text-center mt-1 transition-all cursor-pointer bg-white/10 text-white hover:bg-white/20 border border-white/10"
            >
              <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.758.459 3.474 1.33 4.982L2 22l5.176-1.332c1.458.796 3.097 1.215 4.832 1.216h.004c5.507 0 9.99-4.479 9.99-9.985 0-2.667-1.039-5.176-2.927-7.062A9.927 9.927 0 0 0 12.012 2zm0 18.334h-.003c-1.488 0-2.947-.4-4.218-1.155l-.302-.18-3.132.806.835-3.042-.198-.312a8.318 8.318 0 0 1-1.272-4.464c0-4.587 3.733-8.318 8.322-8.318 2.222 0 4.312.866 5.882 2.436a8.27 8.27 0 0 1 2.433 5.883c0 4.588-3.733 8.318-8.322 8.318zm4.562-6.229c-.25-.125-1.48-.73-1.71-.813-.23-.083-.397-.125-.563.125-.166.25-.646.813-.791.979-.145.166-.291.187-.541.062-.25-.125-1.056-.39-2.012-1.242-.744-.663-1.247-1.482-1.393-1.732-.146-.25-.015-.385.11-.51.112-.112.25-.291.375-.437.125-.146.166-.25.25-.417.083-.166.042-.312-.021-.437-.062-.125-.563-1.354-.771-1.854-.203-.488-.41-.422-.563-.43-.145-.007-.312-.01-.479-.01-.167 0-.437.062-.666.312-.229.25-.875.854-.875 2.083 0 1.229.896 2.417 1.021 2.583.125.167 1.763 2.693 4.272 3.776.597.258 1.063.412 1.426.528.599.19 1.144.163 1.575.099.481-.072 1.48-.604 1.688-1.188.208-.583.208-1.083.146-1.188-.063-.104-.229-.166-.479-.291z" />
              </svg>
              <span>Contacto</span>
            </a>

            <button 
              onClick={() => scrollToSection('contacto')}
              className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-widest text-center transition-all cursor-pointer bg-gold text-prius-black hover:bg-gold-hover font-display"
            >
              RESERVÁ
            </button>
          </div>
        )}
      </header>
    </>
  )
}