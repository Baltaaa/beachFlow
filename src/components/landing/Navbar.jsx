import { Link } from 'react-router-dom'

export default function Navbar() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 bg-white/90 backdrop-blur-md border-b border-hairline transition-all duration-300">
      <div className="flex items-center gap-3">
        <img alt="Prius Logo" className="h-12 w-auto" src="/logo-prius.png" />
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

      <div className="flex items-center gap-4">
        <Link 
          to="/login" 
          className="hidden sm:block text-[12px] font-medium tracking-widest uppercase hover:underline"
        >
          Acceso
        </Link>
        <button 
          onClick={() => scrollToSection('contacto')}
          className="bg-gold hover:bg-gold-hover px-6 py-2.5 rounded-sm font-medium text-[12px] uppercase tracking-wider transition-all"
        >
          Solicitar cotización
        </button>
      </div>
    </nav>
  )
}