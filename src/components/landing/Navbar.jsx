import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  return (
    <nav className="w-full bg-transparent px-6 md:px-12 py-6">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center">
        
        {/* LEFT: Wordmark con estrella dorada de Prius */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="flex flex-col items-start leading-none group text-left cursor-pointer z-50"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-gold text-xs animate-pulse">◆</span>
            <span className="text-xl font-bold tracking-[0.2em] uppercase font-display text-white group-hover:text-gold transition-colors duration-300">
              PRIUS
            </span>
          </div>
          <span className="text-[8px] tracking-[0.45em] uppercase text-white/50 pl-5 mt-1 font-sans">
            PARADOR
          </span>
        </button>

        {/* CENTER: Enlaces de navegación translúcidos y minimalistas */}
        <div className="hidden md:flex items-center gap-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-8 py-3">
          {['servicios', 'eventos', 'galeria', 'contacto'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className="text-[11px] font-medium tracking-[0.2em] text-white/85 hover:text-gold transition-all duration-300 uppercase cursor-pointer font-display"
            >
              {item}
            </button>
          ))}
        </div>

        {/* RIGHT: Botón CTA con Prius Gold oficial (#D4A017) y texto blanco */}
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
          className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-all z-50"
          aria-label="Abrir menú"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú Móvil Desplegable Translúcido */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 py-8 px-6 md:hidden flex flex-col gap-6 animate-premium-fade z-40">
          {['servicios', 'eventos', 'galeria', 'contacto'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className="text-left text-sm font-semibold tracking-widest text-white/90 hover:text-gold uppercase py-1.5 transition-colors duration-300 font-display"
            >
              {item}
            </button>
          ))}
          <button 
            onClick={() => scrollToSection('contacto')}
            className="w-full bg-[#D4A017] text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest text-center mt-4 transition-all cursor-pointer"
          >
            SOLICITAR COTIZACIÓN
          </button>
        </div>
      )}
    </nav>
  )
}