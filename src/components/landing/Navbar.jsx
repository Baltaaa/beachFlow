import { useState, useEffect } from 'react'
import { 
  Menu, 
  X, 
  LayoutGrid, 
  Calendar, 
  MessageSquare,
  ArrowRight,
  Phone,
  Instagram,
  MapPin
} from 'lucide-react'

const SECTIONS = [
  { id: 'servicios', label: 'Playa & Servicios', num: '01', icon: LayoutGrid },
  { id: 'eventos', label: 'Salón de Eventos', num: '02', icon: Calendar },
  { id: 'testimonios', label: 'Opiniones', num: '03', icon: MessageSquare },
]

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
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const scrollToSection = (id) => {
    setIsOpen(false)
    setTimeout(() => {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 150)
  }

  const headerBackgroundClass = !isScrolled
    ? 'top-[20px] sm:top-[32px] w-full max-w-[1952px] 2xl:max-w-[2200px] px-4'
    : 'top-0 w-full max-w-full px-4 sm:px-6 py-2 bg-neutral-950/85 backdrop-blur-md'

  const textColorClass = 'text-white/90 hover:text-gold transition-colors duration-300'
  const textIconColor = 'text-gold'

  const navPillBackground = 'bg-white/10 border border-white/15 backdrop-blur-md'
  const contactButtonClass = 'bg-white/10 text-white hover:bg-white/20 border border-white/15 backdrop-blur-md'
  const menuButtonClass = 'bg-white/10 text-white hover:bg-white/20 border border-white/15 backdrop-blur-md'

  return (
    <>
      <header 
        className={`fixed z-50 transition-all duration-500 ease-in-out left-0 right-0 mx-auto ${headerBackgroundClass}`}
      >
        <div className={`mx-auto w-full px-4 sm:px-8 max-w-[1140px] 2xl:max-w-[1600px] 3xl:max-w-[1800px] relative flex items-center justify-between gap-4 transition-all duration-500 ${
          isScrolled ? 'h-12 sm:h-14 2xl:h-16' : 'h-[72px] 2xl:h-[84px]'
        }`}>
          
          <div className="flex items-center shrink-0">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className="bg-transparent px-0 inline-flex h-9 items-center justify-center rounded-full transition-all duration-500 cursor-pointer"
            >
              <img 
                src="/images/prius-logo-white.png" 
                alt="Prius Playa Grande" 
                className={`w-auto object-contain transition-all duration-500 ${
                  isScrolled ? 'h-[36px] md:h-[40px] 2xl:h-[48px]' : 'h-[48px] md:h-[58px] 2xl:h-[68px]'
                }`}
              />
            </button>
          </div>

          <nav className={`hidden lg:flex items-center rounded-full transition-all duration-500 h-9 2xl:h-10 p-0.5 absolute left-1/2 -translate-x-1/2 ${navPillBackground}`}>
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 2xl:px-5 py-1 text-[9px] 2xl:text-xs font-semibold tracking-wider uppercase cursor-pointer transition-all ${textColorClass}`}
                >
                  <Icon size={12} className={`${textIconColor} shrink-0`} />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5 shrink-0 justify-self-end">
            <a 
              href="https://wa.me/542235765482"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:inline-flex h-9 2xl:h-10 items-center gap-2 rounded-full px-4 2xl:px-5 text-[10px] 2xl:text-xs font-semibold transition-all duration-500 cursor-pointer ${contactButtonClass}`}
            >
              <svg className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.758.459 3.474 1.33 4.982L2 22l5.176-1.332c1.458.796 3.097 1.215 4.832 1.216h.004c5.507 0 9.99-4.479 9.99-9.985 0-2.667-1.039-5.176-2.927-7.062A9.927 9.927 0 0 0 12.012 2zm0 18.334h-.003c-1.488 0-2.947-.4-4.218-1.155l-.302-.18-3.132.806.835-3.042-.198-.312a8.318 8.318 0 0 1-1.272-4.464c0-4.587 3.733-8.318 8.322-8.318 2.222 0 4.312.866 5.882 2.436a8.27 8.27 0 0 1 2.433 5.883c0 4.588-3.733 8.318-8.322 8.318zm4.562-6.229c-.25-.125-1.48-.73-1.71-.813-.23-.083-.397-.125-.563.125-.166.25-.646.813-.791.979-.145.166-.291.187-.541.062-.25-.125-1.056-.39-2.012-1.242-.744-.663-1.247-1.482-1.393-1.732-.146-.25-.015-.385.11-.51.112-.112.25-.291.375-.437.125-.146.166-.25.25-.417.083-.166.042-.312-.021-.437-.062-.125-.563-1.354-.771-1.854-.203-.488-.41-.422-.563-.43-.145-.007-.312-.01-.479-.01-.167 0-.437.062-.666.312-.229.25-.875.854-.875 2.083 0 1.229.896 2.417 1.021 2.583.125.167 1.763 2.693 4.272 3.776.597.258 1.063.412 1.426.528.599.19 1.144.163 1.575.099.481-.072 1.48-.604 1.688-1.188.208-.583.208-1.083.146-1.188-.063-.104-.229-.166-.479-.291z" />
              </svg>
              <span className="uppercase">Contacto</span>
            </a>
            
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className={`flex items-center rounded-full transition-all duration-500 size-9 2xl:size-10 shrink-0 justify-center lg:hidden cursor-pointer ${menuButtonClass}`}
              aria-label="Menu"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <button 
              onClick={() => scrollToSection('contacto')}
              className="h-9 2xl:h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-full px-5 2xl:px-7 text-[10px] 2xl:text-xs font-bold hidden sm:inline-flex uppercase tracking-wider transition-all duration-500 bg-gold text-prius-black hover:bg-gold-hover shadow-md font-display"
            >
              RESERVÁ
            </button>
          </div>
        </div>
      </header>

      {/* Modern Mobile Fullscreen Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-neutral-950/98 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-10 animate-premium-fade lg:hidden overflow-y-auto">
          
          {/* Header en el overlay movil */}
          <div className="flex items-center justify-between pt-2 pb-6 border-b border-white/10 shrink-0">
            <img 
              src="/images/prius-logo-white.png" 
              alt="Prius Playa Grande" 
              className="h-10 w-auto object-contain"
            />
            <button 
              onClick={() => setIsOpen(false)}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-gold hover:text-prius-black text-white border border-white/20 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg"
              aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
          </div>

          {/* Secciones del Menú Principal */}
          <div className="py-8 my-auto flex flex-col space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold font-display block mb-2">
              Navegación
            </span>
            
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className="group flex items-center justify-between py-3.5 px-4 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] hover:border-gold/40 transition-all duration-300 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gold font-display tracking-widest">{sec.num}</span>
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className="text-gold/80 group-hover:text-gold transition-colors" />
                      <span className="text-base sm:text-lg font-bold uppercase tracking-wider text-white group-hover:text-gold font-display transition-colors">
                        {sec.label}
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-white/40 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>

          {/* Acciones principales e Información de Contacto al pie */}
          <div className="space-y-4 pt-6 border-t border-white/10 shrink-0">
            <button 
              onClick={() => scrollToSection('contacto')}
              className="w-full py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-center transition-all cursor-pointer bg-gold text-prius-black hover:bg-gold-hover shadow-xl font-display flex items-center justify-center gap-2"
            >
              <span>RESERVÁ TU LUGAR</span>
              <ArrowRight size={16} />
            </button>

            <a 
              href="https://wa.me/542235765482" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer bg-white/5 text-white hover:bg-white/15 border border-white/10 font-display"
            >
              <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.758.459 3.474 1.33 4.982L2 22l5.176-1.332c1.458.796 3.097 1.215 4.832 1.216h.004c5.507 0 9.99-4.479 9.99-9.985 0-2.667-1.039-5.176-2.927-7.062A9.927 9.927 0 0 0 12.012 2zm0 18.334h-.003c-1.488 0-2.947-.4-4.218-1.155l-.302-.18-3.132.806.835-3.042-.198-.312a8.318 8.318 0 0 1-1.272-4.464c0-4.587 3.733-8.318 8.322-8.318 2.222 0 4.312.866 5.882 2.436a8.27 8.27 0 0 1 2.433 5.883c0 4.588-3.733 8.318-8.322 8.318zm4.562-6.229c-.25-.125-1.48-.73-1.71-.813-.23-.083-.397-.125-.563.125-.166.25-.646.813-.791.979-.145.166-.291.187-.541.062-.25-.125-1.056-.39-2.012-1.242-.744-.663-1.247-1.482-1.393-1.732-.146-.25-.015-.385.11-.51.112-.112.25-.291.375-.437.125-.146.166-.25.25-.417.083-.166.042-.312-.021-.437-.062-.125-.563-1.354-.771-1.854-.203-.488-.41-.422-.563-.43-.145-.007-.312-.01-.479-.01-.167 0-.437.062-.666.312-.229.25-.875.854-.875 2.083 0 1.229.896 2.417 1.021 2.583.125.167 1.763 2.693 4.272 3.776.597.258 1.063.412 1.426.528.599.19 1.144.163 1.575.099.481-.072 1.48-.604 1.688-1.188.208-.583.208-1.083.146-1.188-.063-.104-.229-.166-.479-.291z" />
              </svg>
              <span>CONTACTAR POR WHATSAPP</span>
            </a>

            <div className="flex items-center justify-between text-[11px] text-white/50 pt-2 font-light">
              <div className="flex items-center gap-1.5">
                <MapPin size={12} className="text-gold" />
                <span>Balneario 7, Playa Grande</span>
              </div>
              <a 
                href="https://www.instagram.com/prius.playagrande/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-gold flex items-center gap-1 transition-colors"
              >
                <Instagram size={12} />
                <span>@prius.playagrande</span>
              </a>
            </div>
          </div>

        </div>
      )}
    </>
  )
}