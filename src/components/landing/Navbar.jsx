import { useState } from 'react'
import { Menu, X, Info, HelpCircle, LayoutGrid, Calendar, HelpCircle as HelpIcon } from 'lucide-react'

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
    <nav className="w-full bg-transparent py-4 md:py-6">
      <div className="flex justify-between items-center w-full">
        
        {/* LEFT: Marca PRIUS en cápsula translúcida (igual a NORMA) */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 px-5 py-2 rounded-full cursor-pointer transition-all duration-300 z-50"
        >
          <span className="text-gold text-xs animate-pulse">◆</span>
          <span className="text-xs md:text-sm font-bold tracking-[0.25em] uppercase font-display text-white">
            PRIUS
          </span>
        </button>

        {/* CENTER: Menú de navegación translúcido con micro-íconos elegantes */}
        <div className="hidden md:flex items-center gap-6 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-6 py-2">
          <button
            onClick={() => scrollToSection('servicios')}
            className="flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-white/85 hover:text-white transition-all duration-300 uppercase cursor-pointer"
          >
            <LayoutGrid size={12} className="text-white/60" /> Servicos
          </button>
          <button
            onClick={() => scrollToSection('eventos')}
            className="flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-white/85 hover:text-white transition-all duration-300 uppercase cursor-pointer"
          >
            <Calendar size={12} className="text-white/60" /> Eventos
          </button>
          <button
            onClick={() => scrollToSection('contacto')}
            className="flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-white/85 hover:text-white transition-all duration-300 uppercase cursor-pointer"
          >
            <HelpIcon size={12} className="text-white/60" /> Consultas
          </button>
        </div>

        {/* RIGHT: CTA Blanco o Idioma + CTA */}
        <div className="hidden md:flex items-center gap-3 z-50">
          <div className="text-[11px] font-medium text-white/60 px-3 py-1.5 bg-white/5 border border-white/5 rounded-full hidden lg:block">
            🇦🇷 ES ▾
          </div>
          <button 
            onClick={() => scrollToSection('contacto')}
            className="bg-white hover:bg-white/95 text-black px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-md"
          >
            COTIZAR — 2026/2027
          </button>
        </div>

        {/* Botón de Menú Móvil */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 text-white bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 rounded-full transition-all z-50"
          aria-label="Abrir menú"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Menú Móvil Desplegable */}
      {isOpen && (
        <div className="absolute top-[80px] left-4 right-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl py-6 px-6 md:hidden flex flex-col gap-5 animate-premium-fade z-40">
          {['servicios', 'eventos', 'galeria', 'contacto'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className="text-left text-xs font-semibold tracking-widest text-white/90 hover:text-gold uppercase py-1 transition-colors duration-300 font-display"
            >
              {item}
            </button>
          ))}
          <button 
            onClick={() => scrollToSection('contacto')}
            className="w-full bg-white text-black py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-center mt-2 transition-all cursor-pointer"
          >
            COTIZAR
          </button>
        </div>
      )}
    </nav>
  )}