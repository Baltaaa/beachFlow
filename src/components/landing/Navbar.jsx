import { useState } from 'react'
import { Menu, X, LayoutGrid, Calendar, HelpCircle as HelpIcon } from 'lucide-react'

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
    <header className="fixed inset-x-0 z-50" style={{ top: '28px' }}>
      {/* Gradiente oscuro superior sutil para dar legibilidad */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-black/45 via-black/15 to-transparent opacity-100"></div>
      
      <div className="mx-auto w-full px-8 max-w-[1920px] flex h-16 items-center justify-between sm:grid sm:grid-cols-[1fr_auto_1fr]">
        
        {/* LEFT: Logo original en un botón ovalado glassmorphism */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="flex items-center rounded-full backdrop-blur-md transition-colors bg-white/15 h-10 justify-self-start px-4 cursor-pointer hover:bg-white/20"
        >
          <img 
            src="/logo-prius.png" 
            alt="Prius" 
            className="h-8 w-auto object-contain filter brightness-100"
          />
        </button>

        {/* CENTER: Menú de navegación translúcido integrado como píldora */}
        <nav className="flex items-center rounded-full backdrop-blur-md transition-colors bg-white/15 hidden h-10 justify-self-center p-1 sm:flex">
          <button
            onClick={() => scrollToSection('servicios')}
            className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-medium tracking-wider text-white/75 hover:bg-white/15 hover:text-white transition-all uppercase cursor-pointer"
          >
            <LayoutGrid size={12} className="text-white/60" /> Servicios
          </button>
          <button
            onClick={() => scrollToSection('eventos')}
            className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-medium tracking-wider text-white/75 hover:bg-white/15 hover:text-white transition-all uppercase cursor-pointer"
          >
            <Calendar size={12} className="text-white/60" /> Eventos
          </button>
          <button
            onClick={() => scrollToSection('contacto')}
            className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-medium tracking-wider text-white/75 hover:bg-white/15 hover:text-white transition-all uppercase cursor-pointer"
          >
            <HelpIcon size={12} className="text-white/60" /> Consultas
          </button>
        </nav>

        {/* RIGHT: Selector de Idioma + CTA Principal */}
        <div className="flex items-center gap-2 justify-self-end">
          <div className="relative hidden sm:block">
            <button 
              type="button" 
              className="inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[11px] font-medium backdrop-blur-md transition-colors bg-white/15 text-white/85 hover:text-white hover:bg-white/20 cursor-pointer"
            >
              <span className="text-[14px] leading-none">🇦🇷</span>
              <span className="uppercase">es</span>
            </button>
          </div>
          
          {/* Botón de Menú Móvil */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="flex items-center rounded-full backdrop-blur-md transition-colors bg-white/15 size-10 shrink-0 items-center justify-center sm:hidden text-white hover:bg-white/20 cursor-pointer"
            aria-label="Menu"
          >
            {isOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          <button 
            onClick={() => scrollToSection('contacto')}
            className="h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-white px-5 text-[11px] font-bold text-black hover:bg-white/90 hidden sm:inline-flex uppercase tracking-wider transition-colors"
          >
            COTIZAR ESTADÍA
          </button>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {isOpen && (
        <div className="absolute top-[72px] left-8 right-8 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl py-6 px-6 sm:hidden flex flex-col gap-5 animate-premium-fade z-40">
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
            COTIZAR ESTADÍA
          </button>
        </div>
      )}
    </header>
  )
}