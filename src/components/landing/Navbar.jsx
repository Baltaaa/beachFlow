import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
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
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out py-4 px-6 md:px-12 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl border-b border-hairline/80 shadow-sm py-3.5' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1440px] mx-auto flex justify-between items-center">
        
        {/* LEFT: Wordmark con estrella dorada de Prius */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="flex flex-col items-start leading-none group text-left cursor-pointer z-50"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[#D4A017] text-xs animate-pulse">◆</span>
            <span className={`text-xl font-bold tracking-[0.2em] uppercase font-display transition-colors duration-300 ${
              isScrolled ? 'text-prius-black hover:text-[#D4A017]' : 'text-white group-hover:text-gold'
            }`}>
              PRIUS
            </span>
          </div>
          <span className={`text-[8px] tracking-[0.45em] uppercase pl-5 mt-1 font-sans transition-colors duration-300 ${
            isScrolled ? 'text-prius-black/55' : 'text-white/50'
          }`}>
            PARADOR
          </span>
        </button>

        {/* CENTER: Enlaces de navegación translúcidos y minimalistas */}
        <div className={`hidden md:flex items-center gap-10 border rounded-full px-8 py-3 transition-all duration-500 ${
          isScrolled 
            ? 'bg-prius-background/80 border-hairline' 
            : 'bg-white/5 backdrop-blur-md border-white/10'
        }`}>
          {['servicios', 'eventos', 'galeria', 'contacto'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className={`text-[11px] font-semibold tracking-[0.2em] uppercase cursor-pointer font-display transition-all duration-300 ${
                isScrolled 
                  ? 'text-prius-black/80 hover:text-[#D4A017]' 
                  : 'text-white/85 hover:text-gold'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* RIGHT: Botón CTA con Prius Gold oficial (#D4A017) */}
        <div className="hidden md:flex items-center z-50">
          <button 
            onClick={() => scrollToSection('contacto')}
            className="bg-[#D4A017] hover:bg-[#b88911] text-white px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer shadow-lg shadow-black/10"
          >
            SOLICITAR COTIZACIÓN
          </button>
        </div>

        {/* Botón de Menú Móvil */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className={`md:hidden p-2 rounded-full transition-all z-50 ${
            isScrolled 
              ? 'text-prius-black hover:bg-prius-black/5' 
              : 'text-white hover:bg-white/10'
          }`}
          aria-label="Abrir menú"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú Móvil Desplegable Translúcido */}
      {isOpen && (
        <div className={`absolute top-full left-0 w-full border-b py-8 px-6 md:hidden flex flex-col gap-6 animate-premium-fade z-45 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-2xl border-hairline' 
            : 'bg-black/95 backdrop-blur-xl border-white/10'
        }`}>
          {['servicios', 'eventos', 'galeria', 'contacto'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className={`text-left text-sm font-semibold tracking-widest uppercase py-1.5 transition-colors duration-300 font-display ${
                isScrolled ? 'text-prius-black hover:text-[#D4A017]' : 'text-white/90 hover:text-gold'
              }`}
            >
              {item}
            </button>
          ))}
          <button 
            onClick={() => scrollToSection('contacto')}
            className="w-full bg-[#D4A017] text-white py-4 rounded-lg text-xs font-bold uppercase tracking-widest text-center mt-4 transition-all cursor-pointer"
          >
            SOLICITAR COTIZACIÓN
          </button>
        </div>
      )}
    </nav>
  )
}