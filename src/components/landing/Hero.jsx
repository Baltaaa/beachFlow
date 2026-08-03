import { ArrowRight, Sparkles, Check, Umbrella, Calendar } from 'lucide-react'

export default function Hero() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <section className="relative w-full bg-white flex flex-col justify-end p-2 sm:p-4 min-h-screen">
      
      <div className="relative mx-auto flex min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-2rem)] w-full max-w-[1920px] 3xl:max-w-[2400px] flex-col overflow-hidden rounded-[24px] sm:rounded-[28px] 3xl:rounded-[36px]">
        
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <picture className="absolute inset-0 w-full h-full">
            <source media="(max-width: 768px)" srcSet="/images/bg-mobile.webp" />
            <source srcSet="/images/prius-home-desktop.jpg" />
            <img 
              src="/images/prius-home-desktop.jpg" 
              alt="Experiencia Prius Playa Grande" 
              className="w-full h-full object-cover object-center"
            />
          </picture>
          <div className="absolute inset-0 bg-white/[0.05] mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/65" />
        </div>

        <div className="mx-auto w-full px-6 sm:px-8 max-w-[1140px] 3xl:max-w-[1600px] relative z-10 pt-28 sm:pt-36 3xl:pt-48 mb-auto">
          
          <div className="hidden lg:flex flex-wrap gap-3 3xl:gap-4 mb-6 3xl:mb-8">
            <span className="inline-flex select-none items-center gap-1.5 whitespace-nowrap rounded-full border border-gold/30 bg-white/10 px-4 py-2 3xl:px-6 3xl:py-2.5 text-[11px] sm:text-[0.8125rem] 3xl:text-sm font-medium text-white backdrop-blur-md">
              <Check size={14} className="text-gold" strokeWidth={3} />
              Salón Privado Climatizado
            </span>
            <span className="inline-flex select-none items-center whitespace-nowrap rounded-full border border-white/10 bg-white/10 px-4 py-2 3xl:px-6 3xl:py-2.5 text-[11px] sm:text-[0.8125rem] 3xl:text-sm font-medium text-white/90 backdrop-blur-md">
              Eventos Corporativos & Sociales
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            
            <div>
              <h1 className="text-[32px] sm:text-[42px] md:text-[52px] lg:text-[58px] xl:text-[64px] 3xl:text-[76px] font-bold leading-[1.05] tracking-[-0.03em] uppercase font-display text-white select-none text-balance drop-shadow-sm">
                <span className="text-white/65">TU DESCANSO</span> <br />
                <span className="text-white/65">EN LA PLAYA.</span> <br />
                <span className="text-gold">EN PRIUS.</span>
              </h1>
            </div>

            <div className="flex flex-col justify-end">
              <p className="max-w-[44ch] text-sm sm:text-base md:text-[1.1rem] 3xl:text-[1.35rem] leading-[1.5] font-light tracking-wide text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] text-balance">
                Tu lugar en Playa Grande para que disfrutes el verano.<br />Prius, donde el primero, sos vos!
              </p>
              
              {/* Botones de Acción Premium con Glassmorphism */}
              <div className="mt-7 3xl:mt-10 flex flex-col sm:flex-row gap-3.5">
                
                {/* Botón Principal: Ver Balneario */}
                <button 
                  onClick={() => scrollToSection('servicios')}
                  className="group relative inline-flex items-center justify-between h-13 sm:h-12 w-full sm:w-auto cursor-pointer rounded-full bg-gold px-6 sm:px-7 text-xs sm:text-[11px] 3xl:text-xs font-bold uppercase tracking-[0.15em] text-prius-black transition-all duration-300 hover:bg-gold-hover hover:shadow-[0_0_25px_rgba(242,202,80,0.4)] active:scale-[0.98] font-display"
                >
                  <div className="flex items-center gap-2.5">
                    <Umbrella size={16} className="text-prius-black shrink-0" />
                    <span>VER BALNEARIO</span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-prius-black/10 flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0 ml-3">
                    <ArrowRight size={14} className="text-prius-black" />
                  </div>
                </button>

                {/* Botón Secundario: Salón de Eventos */}
                <button 
                  onClick={() => scrollToSection('eventos')}
                  className="group inline-flex items-center justify-between h-13 sm:h-12 w-full sm:w-auto cursor-pointer rounded-full bg-neutral-950/60 backdrop-blur-md border border-white/25 hover:border-gold/60 px-6 sm:px-7 text-xs sm:text-[11px] 3xl:text-xs font-bold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-neutral-900/80 active:scale-[0.98] font-display"
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar size={16} className="text-gold shrink-0" />
                    <span>SALÓN DE EVENTOS</span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0 ml-3">
                    <ArrowRight size={14} className="text-gold" />
                  </div>
                </button>

              </div>
            </div>

          </div>
        </div>

        <div className="mx-auto w-full px-6 sm:px-8 max-w-[1140px] 3xl:max-w-[1600px] relative z-10 mt-auto pb-6 sm:pb-8 shrink-0">
          <div className="transition-all duration-500 opacity-100">
            <button
              onClick={() => scrollToSection('eventos')}
              className="group mx-auto flex w-fit max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 py-1 pl-1 pr-3 backdrop-blur-md transition-colors hover:border-white/40 hover:bg-white/20 sm:py-1.5 sm:pl-1.5 sm:pr-4 3xl:px-6 cursor-pointer"
            >
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gold px-2.5 py-0.5 text-[10px] sm:text-[0.6875rem] 3xl:text-xs font-bold text-prius-black sm:gap-1.5 sm:px-3 sm:py-1">
                <Sparkles size={12} className="text-prius-black shrink-0" strokeWidth={2.2} />
                Nuevo
              </span>
              
              <span className="block sm:hidden text-[11px] font-medium text-white/90 font-sans">
                Espacio frente al mar
              </span>

              <span className="hidden sm:block text-[0.8125rem] sm:text-[0.875rem] 3xl:text-base font-medium text-white/90 font-sans">
                Descubrí nuestro exclusivo espacio de eventos privados
              </span>

              <ArrowRight size={14} className="shrink-0 text-white/80 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}