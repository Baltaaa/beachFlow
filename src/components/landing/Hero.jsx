import { ArrowRight } from 'lucide-react'
import Navbar from './Navbar'

export default function Hero() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative w-full bg-white flex flex-col justify-end p-4 md:p-6">
      
      {/* Contenedor Flotante de Proporción Cinematográfica (Estilo nor.ma) */}
      <div className="relative w-full h-[82vh] md:h-[86vh] min-h-[600px] rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col justify-between p-6 md:p-12">
        
        {/* Imagen de fondo premium de alta gama */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src="/images/prius1.webp" 
            alt="Experiencia Prius Playa Grande" 
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay de luz blanca suave para mayor viveza del fondo */}
          <div className="absolute inset-0 bg-white/[0.12] mix-blend-overlay" />
          {/* Gradiente oscuro inferior para un contraste de texto ideal */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/35" />
        </div>

        {/* NAVBAR INTEGRADO: Flotando perfectamente al tope de la tarjeta */}
        <div className="relative z-20 -mt-2 -mx-2 md:-mt-6">
          <Navbar />
        </div>

        {/* 2. SECCIÓN CENTRAL CENTRADA Y UNIDA HORIZONTALMENTE (Estilo nor.ma) */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto my-auto flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full">
            
            {/* Bloque Izquierdo: Etiquetas + H1 con padding e interlineado exacto */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="flex flex-wrap gap-2.5">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] md:text-[11px] uppercase tracking-[0.15em] font-display text-white">
                  Reserva sin cargo
                </div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] md:text-[11px] uppercase tracking-[0.15em] font-display text-white/95">
                  Temporada 2026/2027
                </div>
              </div>

              <h1 className="text-[38px] sm:text-[52px] md:text-[68px] lg:text-[76px] xl:text-[84px] font-black leading-[0.95] tracking-tighter uppercase font-display text-white select-none">
                TU DESCANSO <br />
                <span className="text-[#D4A017]">EN PRIUS.</span>
              </h1>
            </div>

            {/* Bloque Derecho: Micro-descripción y CTAs alineados a la perfección horizontal con el H1 */}
            <div className="lg:col-span-5 flex flex-col gap-6 lg:pl-10">
              <p className="text-white/90 text-sm sm:text-base leading-relaxed font-light max-w-md drop-shadow-sm">
                Un refugio exclusivo en Playa Grande. Costa, silencio y servicio impecable — todo en un lugar.
              </p>
              
              {/* Botones de acción minimalistas */}
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => scrollToSection('contacto')}
                  className="inline-flex items-center justify-center bg-white hover:bg-white/90 text-prius-black font-semibold text-xs uppercase tracking-[0.15em] px-8 py-3.5 rounded-full transition-all duration-300 cursor-pointer shadow-lg"
                >
                  RESERVAR
                </button>
                <button 
                  onClick={() => scrollToSection('servicios')}
                  className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3.5 rounded-full font-semibold text-xs uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer"
                >
                  VER SERVICIOS
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 3. SECCIÓN INFERIOR: Pill de Novedad perfectamente centrada al pie */}
        <div className="relative z-10 flex justify-center w-full mt-4">
          <button
            onClick={() => scrollToSection('contacto')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/25 hover:bg-white/30 backdrop-blur-md transition-all duration-300 border border-white/20 text-[9px] md:text-[11px] text-white tracking-[0.15em] uppercase font-display cursor-pointer"
          >
            <span className="bg-black/80 text-[8px] md:text-[10px] text-[#D4A017] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full">
              Nuevo
            </span>
            <span>Prius Club ya está disponible</span>
            <ArrowRight size={12} className="text-[#D4A017] ml-1" />
          </button>
        </div>

      </div>
    </section>
  )
}