import { useState, useEffect } from 'react'
import { Menu, X, LayoutGrid, Calendar, HelpCircle as HelpIcon } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  return (
    <header 
      className={`fixed inset-x-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'top-0 bg-white/85 backdrop-blur-xl border-b border-hairline py-3 shadow-sm' 
          : 'top-9 py-0'
      }`}
    >
      {/* Gradiente oscuro superior sutil para dar legibilidad en estado inicial */}
      <div 
        aria-hidden="true" 
        className={`pointer-events-none fixed inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-black/45 via-black/15 to-transparent transition-opacity duration-500 ${
          isScrolled ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      {/* Contenedor alineado con el contenido del Hero (max-w-[1320px]) */}
      <div className="mx-auto w-full px-6 md:px-0 max-w-[1320px] flex h-16 items-center justify-between sm:grid sm:grid-cols-[1fr_auto_1fr]">
        
        {/* LEFT: Logo limpio sin fondo ni borde (se mantiene idéntico al scrollear sin invertir colores) */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="flex items-center cursor-pointer justify-self-start transition-all duration-300 hover:opacity-90"
        >
          <img 
            src="/logo-prius.png" 
            alt="Prius" 
            className={`w-auto object-contain transition-all duration-500 ${
              isScrolled ? 'h-10 md:h-12' : 'h-12 md:h-14'
            }`}
          />
        </button>

        {/* CENTER: Menú de navegación translúcido integrado como píldora */}
        <nav className={`flex items-center rounded-full backdrop-blur-md transition-all duration-500 hidden h-10 justify-self-center p-1 sm:flex ${
          isScrolled ? 'bg-black/5' : 'bg-white/15'
        }`}>
          <button
            onClick={() => scrollToSection('servicios')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-medium tracking-wider transition-all uppercase cursor-pointer ${
              isScrolled 
                ? 'text-black/75 hover:bg-black/5 hover:text-black' 
                : 'text-white/75 hover:bg-white/15 hover:text-white'
            }`}
          >
            <LayoutGrid size={12} className={isScrolled ? "text-black/50" : "text-white/60"} /> Servicios
          </button>
          <button
            onClick={() => scrollToSection('eventos')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-medium tracking-wider transition-all uppercase cursor-pointer ${
              isScrolled 
                ? 'text-black/75 hover:bg-black/5 hover:text-black' 
                : 'text-white/75 hover:bg-white/15 hover:text-white'
            }`}
          >
            <Calendar size={12} className={isScrolled ? "text-black/50" : "text-white/60"} /> Eventos
          </button>
          <button
            onClick={() => scrollToSection('contacto')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-medium tracking-wider transition-all uppercase cursor-pointer ${
              isScrolled 
                ? 'text-black/75 hover:bg-black/5 hover:text-black' 
                : 'text-white/75 hover:bg-white/15 hover:text-white'
            }`}
          >
            <HelpIcon size={12} className={isScrolled ? "text-black/50" : "text-white/60"} /> Consultas
          </button>
        </nav>

        {/* RIGHT: Selector de Idioma + CTA Principal */}
        <div className="flex items-center gap-2 justify-self-end">
          <div className="relative hidden sm:block">
            <button 
              type="button" 
              className={`inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[11px] font-medium backdrop-blur-md transition-all duration-500 cursor-pointer ${
                isScrolled 
                  ? 'bg-black/5 text-black/85 hover:bg-black/10' 
                  : 'bg-white/15 text-white/85 hover:bg-white/20'
              }`}
            >
              <span className="text-[14px] leading-none">🇦🇷</span>
              <span className="uppercase">es</span>
            </button>
          </div>
          
          {/* Botón de Menú Móvil */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className={`flex items-center rounded-full backdrop-blur-md transition-all duration-500 size-10 shrink-0 justify-center sm:hidden cursor-pointer ${
              isScrolled 
                ? 'bg-black/5 text-black hover:bg-black/10' 
                : 'bg-white/15 text-white hover:bg-white/20'
            }`}
            aria-label="Menu"
          >
            {isOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          <button 
            onClick={() => scrollToSection('contacto')}
            className={`h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-full px-5 text-[11px] font-bold hidden sm:inline-flex uppercase tracking-wider transition-all duration-500 ${
              isScrolled 
                ? 'bg-black text-white hover:bg-black/90' 
                : 'bg-white text-black hover:bg-white/90'
            }`}
          >
            COTIZAR ESTADÍA
          </button>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {isOpen && (
        <div className={`absolute left-8 right-8 border rounded-2xl py-6 px-6 sm:hidden flex flex-col gap-5 animate-premium-fade z-40 transition-all duration-500 ${
          isScrolled 
            ? 'top-[64px] bg-white/95 border-hairline text-black' 
            : 'top-[72px] bg-black/90 border-white/10 text-white'
        }`}>
          {['servicios', 'eventos', 'galeria', 'contacto'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className={`text-left text-xs font-semibold tracking-widest uppercase py-1 transition-colors duration-300 font-display ${
                isScrolled ? 'text-black/90 hover:text-gold' : 'text-white/90 hover:text-gold'
              }`}
            >
              {item}
            </button>
          ))}
          <button 
            onClick={() => scrollToSection('contacto')}
            className={`w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-center mt-2 transition-all cursor-pointer ${
              isScrolled ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            COTIZAR ESTADÍA
          </button>
        </div>
      )}
    </header>
  )
}