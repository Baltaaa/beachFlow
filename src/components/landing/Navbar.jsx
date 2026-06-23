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
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-500 px-margin-mobile md:px-margin-desktop pt-4 md:pt-6">
      {/* Contenedor alineado perfectamente con los márgenes globales de la app */}
      <div className="max-w-[1440px] mx-auto w-full">
        <div className={`flex justify-between items-center transition-all duration-500 ${
          isScrolled 
            ? 'bg-prius-black/90 backdrop-blur-lg border border-white/10 rounded-full px-4 md:px-6 py-2.5 shadow-lg' 
            : 'bg-transparent py-2'
        }`}>
          
          {/* LOGO: Conservando sus colores originales de marca */}
          <div className={`transition-all duration-500 ${
            isScrolled 
              ? '' 
              : 'bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-5 py-2'
          }`}>
            <a href="#" className="flex items-center">
              <img 
                alt="Prius Logo" 
                className="h-8 md:h-9 w-auto object-contain" 
                src="/logo-prius.png" 
              />
            </a>
          </div>
          
          {/* ENLACES: Estilo nor.ma en cápsula translúcida */}
          <div className="hidden md:flex items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-8 py-2.5 gap-8">
            {['servicios', 'eventos', 'galeria', 'contacto'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-[10px] font-semibold tracking-[0.25em] text-white/70 hover:text-white transition-colors duration-300 uppercase font-display"
              >
                {item}
              </button>
            ))}
          </div>

          {/* BOTÓN CTA */}
          <div className="hidden md:flex items-center">
            <button 
              onClick={() => scrollToSection('contacto')}
              className="bg-white hover:bg-white/90 text-prius-black px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-300 font-display cursor-pointer shadow-sm"
            >
              Solicitar cotización
            </button>
          </div>

          {/* Botón de Menú Móvil */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden p-2.5 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-full transition-all"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Dropdown Móvil */}
        <div className={`md:hidden bg-prius-black/95 backdrop-blur-lg border border-white/10 rounded-2xl mt-3 transition-all duration-500 overflow-hidden ${
          isOpen ? 'max-h-[320px] p-6 opacity-100' : 'max-h-0 p-0 opacity-0 pointer-events-none'
        }`}>
          <div className="flex flex-col space-y-4">
            {['servicios', 'eventos', 'galeria', 'contacto'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-left text-[11px] font-semibold tracking-[0.2em] text-white/80 hover:text-white py-2 uppercase font-display transition-colors duration-300"
              >
                {item}
              </button>
            ))}
            <div className="h-px bg-white/10 my-2" />
            <button 
              onClick={() => scrollToSection('contacto')}
              className="w-full bg-white text-prius-black py-3.5 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] transition-all text-center font-display cursor-pointer"
            >
              Solicitar cotización
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}