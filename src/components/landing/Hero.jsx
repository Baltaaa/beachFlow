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

        {/* SECCIÓN CENTRAL: Copia fiel de la distribución de Norma */}
        <div className="relative z-10 w-full max-w-[1320px] mx-auto my-auto pt-8 md:pt-12 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-center">
            
            {/* Columna Izquierda: Badges en la parte superior y Titular Gigante */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Badges horizontales idénticos a Norma */}
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[9px] uppercase tracking-[0.15em] font-display text-white">
                  Reserva sin cargo
                </div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[9px] uppercase tracking-[0.15em] font-display text-white">
                  Temporada 2026/2027
                </div>
              </div>

              {/* Titular estilizado con variaciones de opacidad y color exactas */}
              <h1 className="text-[34px] sm:text-[46px] md:text-[58px] lg:text-[62px] xl:text-[70px] font-bold leading-[1.04] tracking-tight uppercase font-display text-white select-none">
                TU DESCANSO <br />
                <span className="opacity-50">EN LA COSTA.</span> <br />
                <span className="text-gold">EN PRIUS.</span>
              </h1>
            </div>

            {/* Columna Derecha: Párrafo de descripción y botones alineados debajo */}
            <div className="lg:col-span-5 flex flex-col gap-5 lg:pl-4">
              <p className="text-white/85 text-sm sm:text-base leading-relaxed font-light max-w-md drop-shadow-sm">
                Un refugio exclusivo en Playa Grande. Costa, silencio y servicio impecable — diseñado al detalle para su estadía ideal.
              </p>
              
              {/* Botones de acción ovalados posicionados exactamente debajo de la descripción */}
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => scrollToSection('contacto')}
                  className="inline-flex items-center justify-center bg-white hover:bg-white/90 text-black font-bold text-[10px] uppercase tracking-[0.15em] px-8 py-3.5 rounded-full transition-all duration-300 cursor-pointer shadow-md"
                >
                  RESERVAR
                </button>
                <button 
                  onClick={() => scrollToSection('servicios')}
                  className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3.5 rounded-full font-semibold text-[10px] uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer"
                >
                  VER SERVICIOS
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* SECCIÓN INFERIOR: Botón informativo de Prius Club centrado al pie */}
        <div className="relative z-10 flex justify-center w-full mt-auto">
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