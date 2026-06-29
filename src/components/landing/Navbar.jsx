import { useState, useEffect } from 'react'
import { Menu, X, LayoutGrid, Calendar, HelpCircle as HelpIcon } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeTheme, setActiveTheme] = useState('dark') // 'dark' por defecto (Hero tiene fondo oscuro)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      
      // Si estamos muy arriba, mantenemos el estado transparente/Hero original
      if (scrollY < 80) {
        setIsScrolled(false)
        setActiveTheme('dark')
        return
      }

      setIsScrolled(true)

      // Secciones y sus respectivos temas de fondo
      const sections = [
        { id: 'partners', theme: 'light' },
        { id: 'servicios', theme: 'light' },
        { id: 'eventos', theme: 'dark' },
        { id: 'galeria', theme: 'light' },
        { id: 'testimonios', theme: 'light' },
        { id: 'contacto', theme: 'light' }
      ]

      let detectedTheme = 'light' // fallback por defecto
      const checkY = scrollY + 80 // Altura de escaneo (cerca del navbar)

      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          const absoluteTop = rect.top + window.scrollY
          const absoluteBottom = absoluteTop + rect.height

          if (checkY >= absoluteTop && checkY <= absoluteBottom) {
            detectedTheme = section.theme
            break
          }
        }
      }

      setActiveTheme(detectedTheme)
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

  // Estilos dinámicos del contenedor general del HEADER (Siempre transparente)
  const headerBackgroundClass = !isScrolled
    ? 'top-[28px] w-full max-w-[1952px] px-4'
    : 'top-0 w-full max-w-full px-6 sm:px-8 py-1'

  // Estilos del logo (Siempre transparente, sin bordes ni sombras)
  const logoButtonClass = 'bg-transparent px-0'

  // Estilos de los textos de navegación
  const textColorClass = !isScrolled
    ? 'text-white/75 hover:text-gold'
    : activeTheme === 'light'
      ? 'text-prius-black/75 hover:text-gold'
      : 'text-white/75 hover:text-gold'

  const textIconColor = !isScrolled
    ? 'text-white/60'
    : activeTheme === 'light'
      ? 'text-prius-black/60'
      : 'text-white/60'

  // Cápsula de navegación central
  const navPillBackground = !isScrolled
    ? 'bg-white/15'
    : activeTheme === 'light'
      ? 'bg-white text-prius-black shadow-sm border border-hairline/65'
      : 'bg-white/10 text-white border border-white/5'

  // Cápsula de Selector de Idioma
  const languageButtonClass = !isScrolled
    ? 'bg-white/15 text-white/85 hover:bg-white/20'
    : activeTheme === 'light'
      ? 'bg-neutral-100 text-prius-black/90 hover:bg-neutral-200 border border-hairline/20'
      : 'bg-white/10 text-white/85 hover:bg-white/20 border border-white/5'

  // Cápsula de Menú Móvil
  const menuButtonClass = !isScrolled
    ? 'bg-white/15 text-white hover:bg-white/20'
    : activeTheme === 'light'
      ? 'bg-neutral-100 text-prius-black hover:bg-neutral-200 border border-hairline/20'
      : 'bg-white/10 text-white hover:bg-white/20 border border-white/5'

  return (
    <>
      {/* CAPA DE DESENFOQUE PROGRESIVO FIJO ULTRA-INTENSO CON GRADIENTE #13263D */}
      <div 
        aria-hidden="true" 
        className={`fixed top-0 left-0 right-0 h-[130px] pointer-events-none z-40 transition-all duration-700 ease-in-out ${
          isScrolled 
            ? 'opacity-100 backdrop-blur-[40px]' 
            : 'opacity-0 backdrop-blur-none invisible'
        }`}
        style={{
          background: 'linear-gradient(to bottom, rgba(19, 38, 61, 0.45) 0%, rgba(19, 38, 61, 0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0) 100%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Sutil gradiente oscuro inicial para el Hero (Ahora FIJO en top-0 para que comience en el borde superior absoluto) */}
      <div 
        aria-hidden="true" 
        className={`pointer-events-none fixed inset-x-0 top-0 z-40 h-32 bg-gradient-to-b from-black/40 to-transparent transition-all duration-500 ${
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
          
          {/* LEFT: Logo interactivo (La P dorada en cápsula minimalista) */}
          <div className="justify-self-start flex items-center">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className={`inline-flex h-9 items-center justify-center rounded-full transition-all duration-500 cursor-pointer ${logoButtonClass}`}
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
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[10px] font-medium tracking-wider transition-all uppercase cursor-pointer ${textColorClass}`}
            >
              <LayoutGrid size={11} className={textIconColor} /> Servicios
            </button>
            <button
              onClick={() => scrollToSection('eventos')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[10px] font-medium tracking-wider transition-all uppercase cursor-pointer ${textColorClass}`}
            >
              <Calendar size={11} className={textIconColor} /> Eventos
            </button>
            <button
              onClick={() => scrollToSection('contacto')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[10px] font-medium tracking-wider transition-all uppercase cursor-pointer ${textColorClass}`}
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
          <div className={`absolute left-6 right-6 border border-hairline rounded-2xl py-6 px-6 sm:hidden flex flex-col gap-5 animate-premium-fade z-40 transition-all duration-500 bg-white/95 backdrop-blur-xl text-black ${
            isScrolled ? 'top-[56px]' : 'top-[64px]'
          }`}>
            {['servicios', 'eventos', 'galeria', 'contacto'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-left text-xs font-semibold tracking-widest uppercase py-1 transition-colors duration-300 font-display text-black/90 hover:text-gold"
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