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
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent px-6 md:px-10 py-5">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center">
        
        {/* LEFT: Wordmark with golden icon and PARADOR subtitle */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="flex flex-col items-start leading-none group text-left cursor-pointer"
        >
          <div className="flex items-center gap-1">
            <span className="text-[#D4A017] text-[10px] animate-pulse">◆</span>
            <span className="text-xl font-black tracking-[0.15em] uppercase font-display text-white group-hover:text-[#D4A017] transition-colors duration-300">
              PRIUS
            </span>
          </div>
          <span className="text-[8px] tracking-[0.4em] uppercase text-white/50 pl-4 mt-0.5">
            PARADOR
          </span>
        </button>

        {/* CENTER: Nav links (Desktop only) */}
        <div className="hidden md:flex items-center gap-8">
          {['servicios', 'eventos', 'galeria', 'contacto'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className="text-xs font-medium tracking-widest text-white/90 hover:text-[#D4A017] transition-all duration-300 uppercase cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>

        {/* RIGHT: CTA Button (Desktop only) */}
        <div className="hidden md:flex items-center">
          <button 
            onClick={() => scrollToSection('contacto')}
            className="bg-[#D4A017] hover:bg-[#b88911] text-white px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
          >
            SOLICITAR COTIZACIÓN
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-all"
          aria-label="Abrir menú"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu with transparent dark background */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-lg border-b border-white/10 py-6 px-6 md:hidden flex flex-col gap-5 animate-premium-fade z-50">
          {['servicios', 'eventos', 'galeria', 'contacto'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className="text-left text-sm font-semibold tracking-widest text-white hover:text-[#D4A017] uppercase py-1 transition-colors duration-300"
            >
              {item}
            </button>
          ))}
          <button 
            onClick={() => scrollToSection('contacto')}
            className="w-full bg-[#D4A017] text-white py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-center mt-2 transition-all cursor-pointer"
          >
            SOLICITAR COTIZACIÓN
          </button>
        </div>
      )}
    </nav>
  )
}