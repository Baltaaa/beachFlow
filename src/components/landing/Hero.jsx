import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative w-full bg-white flex flex-col justify-end p-4">
      
      {/* Contenedor principal de proporción cinematográfica (estilo tarjeta de Norma) - configurado con py-8 */}
      <div className="relative mx-auto flex min-h-[85vh] w-full max-w-[1920px] flex-col overflow-hidden rounded-[28px] justify-between py-8 px-0">
        
        {/* Imagen de fondo de alta gama con oscurecimiento graduado */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src="/images/prius1.webp" 
            alt="Experiencia Prius Playa Grande" 
            className="w-full h-full object-cover object-center"
          />
          {/* Sutil overlay de mezcla */}
          <div className="absolute inset-0 bg-white/[0.08] mix-blend-overlay" />
          {/* Degradado oscuro para visibilidad perfecta de textos */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
        </div>

        {/* Espacio compacto superior para dar paso al Navbar */}
        <div className="h-14 sm:h-20 w-full shrink-0" />

        {/* SECCIÓN CENTRAL: Pegada más arriba para dejar libre el centro de la imagen */}
        <div className="mx-auto w-full px-6 sm:px-8 max-w-[1216px] relative z-10 pt-4 sm:pt-6 pb-12">
          
          {/* Badges horizontales - Ocultos en mobile/tablet (hidden), visibles solo en desktop (lg:flex) */}
          <div className="hidden lg:flex flex-wrap gap-2 mb-6">
            <span className="inline-flex select-none items-center whitespace-nowrap rounded-full bg-white/15 px-3.5 py-2 text-[11px] sm:text-[0.8125rem] font-medium text-white/85 backdrop-blur-md">
              Reserva sin cargo
            </span>
            <span className="inline-flex select-none items-center whitespace-nowrap rounded-full bg-white/15 px-3.5 py-2 text-[11px] sm:text-[0.8125rem] font-medium text-white/85 backdrop-blur-md">
              Temporada 2026/2027
            </span>
          </div>

          {/* Grilla principal */}
          <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            
            {/* Columna Izquierda: Titular un poco más chico */}
            <div>
              <h1 className="text-[28px] sm:text-[38px] md:text-[48px] lg:text-[52px] xl:text-[58px] font-bold leading-[1.05] tracking-[-0.03em] uppercase font-display text-white select-none text-balance">
                <span className="text-white/55">TU DESCANSO</span> <br />
                <span className="text-white/55">EN LA COSTA.</span> <br />
                <span className="text-gold">EN PRIUS.</span>
              </h1>
            </div>

            {/* Columna Derecha: Descripción y botones */}
            <div>
              <p className="max-w-[44ch] text-sm sm:text-base md:text-[1.1rem] leading-[1.5] font-medium text-white/80">
                Un refugio exclusivo en Playa Grande. Costa, silencio y servicio impecable — diseñado al detalle para su estadía ideal.
              </p>
              
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <button 
                  onClick={() => scrollToSection('contacto')}
                  className="inline-flex h-9 w-full sm:w-auto cursor-pointer items-center justify-center rounded-full bg-white px-5 text-[0.875rem] font-medium text-black transition-colors hover:bg-white/90 tracking-wider"
                >
                  Reservas
                </button>
                <button 
                  onClick={() => scrollToSection('servicios')}
                  className="inline-flex h-9 w-full sm:w-auto cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/10 px-4 text-[0.875rem] font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20 tracking-wider"
                >
                  Ver servicios
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* SECCIÓN INFERIOR: Botón informativo Prius Club sin padding en su contenedor */}
        <div className="mx-auto w-full max-w-[1216px] relative z-10 mt-auto p-0">
          <div style={{ transitionDelay: '240ms' }} className="transition-[opacity,filter,transform] duration-700 ease-in-out motion-reduce:transition-none opacity-100 blur-0 translate-y-0">
            <button
              onClick={() => scrollToSection('contacto')}
              className="group mx-auto flex w-fit max-w-full items-center gap-2.5 rounded-full border border-white/20 bg-white/10 py-1.5 pl-1.5 pr-3 backdrop-blur-md transition-colors hover:border-white/40 hover:bg-white/20 sm:pr-4 cursor-pointer"
            >
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[0.6875rem] font-semibold text-black">
                <Sparkles size={11} className="text-black shrink-0" strokeWidth={2.2} />
                Nuevo
              </span>
              <span className="truncate text-[0.8125rem] font-medium text-white/90 sm:text-[0.875rem] font-sans">
                Prius Club ya está disponible
              </span>
              <ArrowRight size={14} className="shrink-0 text-white/80 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}