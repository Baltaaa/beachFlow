import { ArrowRight } from 'lucide-react'

export default function Hero() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative w-full bg-white flex flex-col justify-end p-4">
      
      {/* Contenedor principal de proporción cinematográfica (estilo tarjeta de Norma) */}
      <div className="relative mx-auto flex min-h-[84vh] w-full max-w-[1920px] flex-col overflow-hidden rounded-[28px] justify-between p-6 md:p-12">
        
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

        {/* Espacio para compensar el Navbar flotante superior */}
        <div className="h-20 w-full" />

        {/* SECCIÓN CENTRAL: Réplica exacta de la distribución, márgenes y grilla de Norma */}
        <div className="mx-auto w-full px-6 sm:px-8 max-w-[1320px] relative z-10 pt-28 sm:pt-36 pb-12">
          
          {/* Badges horizontales alineados arriba del titular */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex select-none items-center whitespace-nowrap rounded-full bg-white/15 px-3.5 py-2 text-[11px] sm:text-[0.8125rem] font-medium text-white/85 backdrop-blur-md">
              Reserva sin cargo
            </span>
            <span className="inline-flex select-none items-center whitespace-nowrap rounded-full bg-white/15 px-3.5 py-2 text-[11px] sm:text-[0.8125rem] font-medium text-white/85 backdrop-blur-md">
              Temporada 2026/2027
            </span>
          </div>

          {/* Grilla principal con las proporciones exactas de Norma */}
          <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            
            {/* Columna Izquierda: Titular principal con opacidad graduada */}
            <div>
              <h1 className="text-[34px] sm:text-[46px] md:text-[58px] lg:text-[62px] xl:text-[70px] font-bold leading-[1.02] tracking-[-0.03em] uppercase font-display text-white select-none text-balance">
                <span className="text-white/55">TU DESCANSO</span> <br />
                <span className="text-white/55">EN LA COSTA.</span> <br />
                <span className="text-gold">EN PRIUS.</span>
              </h1>
            </div>

            {/* Columna Derecha: Párrafo descriptivo y CTAs integrados */}
            <div>
              <p className="max-w-[44ch] text-sm sm:text-base md:text-[1.1rem] leading-[1.5] font-medium text-white/80">
                Un refugio exclusivo en Playa Grande. Costa, silencio y servicio impecable — diseñado al detalle para su estadía ideal.
              </p>
              
              {/* Botones de acción ovalados con los mismos espaciados */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <button 
                  onClick={() => scrollToSection('contacto')}
                  className="inline-flex h-9 w-full sm:w-auto cursor-pointer items-center justify-center rounded-full bg-white px-4 text-[0.875rem] font-medium text-black transition-colors hover:bg-white/90"
                >
                  RESERVAR ESTADÍA
                </button>
                <button 
                  onClick={() => scrollToSection('servicios')}
                  className="inline-flex h-9 w-full sm:w-auto cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/10 px-4 text-[0.875rem] font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
                >
                  VER SERVICIOS
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* SECCIÓN INFERIOR: Botón informativo de Prius Club centrado al pie */}
        <div className="relative z-10 flex justify-center w-full mt-auto pb-4">
          <button
            onClick={() => scrollToSection('contacto')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all duration-300 border border-white/15 text-[10px] text-white tracking-[0.15em] uppercase font-display cursor-pointer"
          >
            <span className="bg-white text-black text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full">
              Nuevo
            </span>
            <span>Prius Club ya está disponible</span>
            <ArrowRight size={12} className="text-white ml-1" />
          </button>
        </div>

      </div>
    </section>
  )
}