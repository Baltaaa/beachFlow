import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

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
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-hairline transition-all duration-300">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-28">
        <div className="flex items-center">
          <img alt="Prius Logo" className="h-20 md:h-24 w-auto object-contain" src="/logo-prius.png" />
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          {['servicios', 'recreacion', 'galeria', 'contacto'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className="text-[12px] font-medium tracking-widest text-prius-black/60 hover:text-prius-black transition-colors uppercase"
            >
              {item === 'recreacion' ? 'Recreación' : item}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link 
            to="/login" 
            className="text-[12px] font-medium tracking-widest uppercase hover:underline text-prius-black/80 hover:text-prius-black"
          >
            Acceso
          </Link>
          <button 
            onClick={() => scrollToSection('contacto')}
            className="bg-gold hover:bg-gold-hover px-6 py-3 rounded-sm font-medium text-[12px] uppercase tracking-wider transition-all border border-transparent"
          >
            Solicitar cotización
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 text-prius-black hover:bg-prius-background rounded-sm transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-hairline px-margin-mobile py-6 space-y-4 flex flex-col">
          {['servicios', 'recreacion', 'galeria', 'contacto'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className="text-left text-sm font-medium tracking-wider text-prius-black/80 hover:text-prius-black py-2 uppercase"
            >
              {item === 'recreacion' ? 'Recreación' : item}
            </button>
          ))}
          <div className="h-px bg-hairline my-2" />
          <Link 
            to="/login" 
            onClick={() => setIsOpen(false)}
            className="text-sm font-medium tracking-wider uppercase py-2 text-prius-black/80"
          >
            Acceso Administrador
          </Link>
          <button 
            onClick={() => scrollToSection('contacto')}
            className="w-full bg-gold hover:bg-gold-hover py-3 rounded-sm font-medium text-xs uppercase tracking-wider transition-all text-center"
          >
            Solicitar cotización
          </button>
        </div>
      )}
    </nav>
  )
}