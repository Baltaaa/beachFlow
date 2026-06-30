import { useState, useEffect } from 'react'
import { Menu, X, LayoutGrid, Calendar, HelpCircle as HelpIcon } from 'lucide-react'

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
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  // Estilos dinámicos del contenedor general del HEADER
  const headerBackgroundClass = !isScrolled
    ? 'top-[28px] w-full max-w-[1952px] px-4'
    : 'top-0 w-full max-w-full px-6 sm:px-8 py-1'

  // Estilos de los textos de navegación (Optimizados para contrastar con el vidrio marino)
  const textColorClass = 'text-white/85 hover:text-gold transition-colors duration-300'
  const textIconColor = 'text-white/60'

  // Cápsula de navegación central (Estilo Glassmorphism Premium)
  const navPillBackground = !isScrolled
    ? 'bg-white/15 border border-white/5 backdrop-blur-md'
    : 'bg-white/10 text-white border border-white/10 backdrop-blur-md'

  // Cápsula de Selector de Idioma
  const languageButtonClass = 'bg-white/10 text-white/85 hover:bg-white/20 border border-white/5 backdrop-blur-md'

  // Cápsula de Menú Móvil
  const menuButtonClass = 'bg-white/10 text-white hover:bg-white/20 border border-white/5 backdrop-blur-md'

  return (
    <>
      {/* CAPA DE DESENFOQUE PROGRESIVO EXTENDIDO (180px) CON GRADIENTE AZUL MARINO SUAVE */}
      <div 
        aria-hidden="true" 
        className={`fixed top-0 left-0 right-0 h-[180px] pointer-events-none z-40 transition-all duration-700 ease-in-out ${
          isScrolled 
            ? 'opacity-100' 
            : 'opacity-0 invisible'
        }`}
        style={{
          // Gradiente extendido con más paradas intermedias para un desvanecimiento ultra-suave
          background: 'linear-gradient(to bottom, rgba(16, 37, 70, 0.55) 0%, rgba(16, 37, 70, 0.4) 30%, rgba(16, 37, 70, 0.2) 60%, rgba(16, 37, 70, 0.05) 85%, rgba(16, 37, 70, 0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0.3) 75%, rgba(0,0,0,0) 100%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0.3) 75%, rgba(0,0,0,0) 100%)',
          backdropFilter: isScrolled ? 'blur(64px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(64px)' : 'none',
        }}
      />

      {/* Sutil gradiente oscuro inicial para el Hero */}
      <div 
        aria-hidden="true" 
        className={`pointer-events-none fixed inset-x-0 top-0 z-40 h-32 bg-gradient-to-b from-black/50 to-transparent transition-all duration-500 ${
          isScrolled ? 'opacity-0 invisible' : 'opacity-100'
        }`}
      />

      <header 
        className={`fixed z-50 transition-all duration-500 ease-in-out left-0 right-0 mx-auto ${headerBackgroundClass}`}
      >
        {/* Contenedor interno */}
        <div className={`mx-auto w-full px-6 sm:px-8 max-w-[1040px] flex items-center justify-between sm:grid sm:grid-cols-[1fr_auto_1fr] transition-all duration-500 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}>
          
          {/* LEFT: Logo interactivo */}
          <div className="justify-self-start flex items-center">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className="bg-transparent px-0 inline-flex h-9 items-center justify-center rounded-full transition-all duration-500 cursor-pointer"
            >
              <img 
                src="/favicon-512x512.png" 
                alt="Prius Monograma" 
                className={`w-auto object-contain transition-all duration-500 ${
                  isScrolled ? 'h-[34px] md:h-[38px]' : 'h-[44px] md:h-[50px]'
                }`}
              />
            </button>
          </div>

          {/* CENTER: Menú de navegación dinámico */}
          <nav className={`flex items-center rounded-full transition-all duration-500 hidden h-9 justify-self-center p-1 sm:flex ${navPillBackground}`}>
            <button
              onClick={() => scrollToSection('servicios')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[10px] font-medium tracking-wider uppercase cursor-pointer ${textColorClass}`}
            >
              <LayoutGrid size={11} className={textIconColor} /> Servicios
            </button>
            <button
              onClick={() => scrollToSection('eventos')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[10px] font-medium tracking-wider uppercase cursor-pointer ${textColorClass}`}
            >
              <Calendar size={11} className={textIconColor} /> Eventos
            </button>
            <button
              onClick={() => scrollToSection('contacto')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[10px] font-medium tracking-wider uppercase cursor-pointer ${textColorClass}`}
            >
              <HelpIcon size={11} className={textIconColor} /> Consultas
            </button>
          </nav>

          {/* RIGHT: Selector de Idioma + CTA Principal */}
          <div className="flex items-center gap-2 justify-self-end">
            <div className="relative hidden sm:block">
              <button 
                type="button" 
                className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[10px] font-medium transition-all duration-500 cursor-pointer ${languageButtonClass}`}
              >
                <span className="text-[12px] leading-none">🇦🇷</span>
                <span className="uppercase">es</span>
              </button>
            </div>
            
            {/* Botón de Menú Móvil */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className={`flex items-center rounded-full transition-all duration-500 size-9 shrink-0 justify-center sm:hidden cursor-pointer ${menuButtonClass}`}
              aria-label="Menu"
            >
              {isOpen ? <X size={15} /> : <Menu size={15} />}
            </button>

            <button 
              onClick={() => scrollToSection('contacto')}
              className="h-9 cursor-pointer items-center justify-center whitespace-nowrap rounded-full px-4 text-[10px] font-bold hidden sm:inline-flex uppercase tracking-wider transition-all duration-500 bg-gold text-prius-black hover:bg-gold-hover shadow-sm"
            >
              COTIZAR ESTADÍA
            </button>
          </div>
        </div>

        {/* Menú Móvil Desplegable */}
        {isOpen && (
          <div className={`absolute left-6 right-6 border border-white/10 rounded-2xl py-6 px-6 sm:hidden flex flex-col gap-5 animate-premium-fade z-40 transition-all duration-500 bg-neutral-950/95 backdrop-blur-xl text-white ${
            isScrolled ? 'top-[56px]' : 'top-[64px]'
          }`}>
            {['servicios', 'eventos', 'galeria', 'contacto'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-left text-xs font-semibold tracking-widest uppercase py-1 transition-colors duration-300 font-display text-white/90 hover:text-gold"
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('contacto')}
              className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-widest text-center mt-2 transition-all cursor-pointer bg-gold text-prius-black hover:bg-gold-hover"
            >
              COTIZAR ESTADÍA
            </button>
          </div>
        )}
      </header>
    </>
  )
}