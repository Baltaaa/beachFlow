export default function Hero() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative mx-auto flex min-h-[86vh] max-w-[1920px] flex-col overflow-hidden rounded-[28px]">
        
        {/* Imagen Estelar de Fondo con Aspecto de Cobertura */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#3a3b3d]"></div>
        <img 
          src="/images/prius1.webp" 
          alt="Experiencia Prius" 
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
        />
        
        {/* Filtros de Gradiente Idénticos */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/25 to-transparent"></div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-black/10 mix-blend-multiply"></div>

        {/* CONTENIDO PRINCIPAL Y SUPERIOR */}
        <div className="mx-auto w-full px-6 sm:px-8 max-w-[1920px] relative z-10 pt-28 sm:pt-36">
          
          {/* Pills Superiores */}
          <div className="transition-[opacity,filter,transform] duration-700 ease-out opacity-100 blur-0 translate-y-0">
            <div className="hidden flex-wrap gap-2 sm:flex">
              <span className="inline-flex select-none items-center whitespace-nowrap rounded-full bg-white/15 px-3.5 py-2 text-[0.8125rem] font-medium text-white/80 backdrop-blur-md border border-white/5">
                Reserva sin cargo de carpa
              </span>
              <span className="inline-flex select-none items-center whitespace-nowrap rounded-full bg-white/15 px-3.5 py-2 text-[0.8125rem] font-medium text-white/80 backdrop-blur-md border border-white/5">
                Temporada 2024–2025
              </span>
            </div>
          </div>

          {/* Grilla de Título y Columna Derecha de Acción */}
          <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            
            {/* Título de Gran Impacto */}
            <div className="transition-[opacity,filter,transform] duration-700 ease-out opacity-100 blur-0 translate-y-0">
              <h1 className="text-[2.25rem] sm:text-[3.25rem] md:text-[4rem] lg:text-[4.75rem] xl:text-[5.5rem] font-bold leading-[1.02] tracking-[-0.03em] text-balance font-display">
                <span className="text-white/55">TU DESCANSO.</span>
                <br />
                <span className="text-gold">EN PRIUS.</span>
              </h1>
            </div>

            {/* Micro-descripción y CTAs */}
            <div className="transition-[opacity,filter,transform] duration-700 ease-out opacity-100 blur-0 translate-y-0">
              <div>
                <p className="max-w-[44ch] text-base sm:text-lg lg:text-xl font-medium leading-[1.5] text-white/80">
                  Un refugio exclusivo en Playa Grande. Costa, silencio y servicio impecable — todo en un lugar.
                </p>
                
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <button 
                    type="button" 
                    onClick={() => scrollToSection('contacto')}
                    className="inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-full bg-white px-5 text-[0.875rem] font-bold text-prius-black transition-colors hover:bg-white/90 sm:w-auto"
                  >
                    RESERVAR
                  </button>
                  <button 
                    onClick={() => scrollToSection('servicios')}
                    className="inline-flex h-9 w-full items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 text-[0.875rem] font-bold text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:w-auto"
                  >
                    VER SERVICIOS
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ANUNCIADOR INFERIOR PILL */}
        <div className="mx-auto w-full px-6 sm:px-8 max-w-[1920px] relative z-10 mt-auto pb-6 sm:pb-8">
          <div className="transition-[opacity,filter,transform] duration-700 ease-out opacity-100 blur-0 translate-y-0">
            <button 
              onClick={() => scrollToSection('contacto')}
              className="group mx-auto flex w-fit max-w-full items-center gap-2.5 rounded-full border border-white/20 bg-white/10 py-1.5 pl-1.5 pr-3 backdrop-blur-md transition-colors hover:border-white/40 hover:bg-white/20 sm:pr-4"
            >
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[0.6875rem] font-semibold text-prius-black font-display">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="12.5" rx="1.6"></rect>
                  <path d="M9 20h6M12 16.5V20"></path>
                </svg>
                Nuevo
              </span>
              <span className="truncate text-[0.8125rem] font-medium text-white/90 sm:text-[0.875rem] font-display">
                Prius Club ya está disponible
              </span>
              <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-white/80 transition-transform duration-300 group-hover:translate-x-0.5">
                <path d="M3 8h9M8.5 4l4 4-4 4"></path>
              </svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}