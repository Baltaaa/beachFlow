import { ArrowRight } from 'lucide-react'

export default function Hero() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen bg-white flex flex-col justify-end px-3 pb-3 pt-[100px] md:pt-0">
      
      {/* Absolute background image layer with light white overlay for high visual presence */}
      <div className="relative w-full h-[88vh] md:h-[92vh] min-h-[640px] rounded-2xl overflow-hidden flex flex-col justify-between p-6 md:p-12">
        
        {/* Highlighted Beach Club Star Image */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src="/images/prius1.webp" 
            alt="Experiencia Prius Playa Grande" 
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle light overlay to assist readable white/gold text without killing the photo vibrancy */}
          <div className="absolute inset-0 bg-white/[0.15] mix-blend-overlay" />
          {/* Edge shadow gradient for perfect contrast of lower texts */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
        </div>

        {/* 1. TOP-LEFT area: Side-by-side pill badges */}
        <div className="relative z-10 flex flex-wrap gap-2.5 mt-4 md:mt-20">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/20 text-xs md:text-sm text-white font-medium font-display uppercase tracking-wider">
            Reserva sin cargo
          </div>
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/20 text-xs md:text-sm text-white font-medium font-display uppercase tracking-wider">
            Temporada 2024–2025
          </div>
        </div>

        {/* 2. CENTER CONTENT: Asymmetric grid matching nor.ma layout perfectly */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end my-auto w-full">
          
          {/* Left block: Huge massive typography */}
          <div className="lg:col-span-7">
            <h1 className="text-[44px] sm:text-[60px] md:text-[80px] lg:text-[90px] xl:text-[96px] font-black leading-[0.95] tracking-tight uppercase font-display text-white select-none drop-shadow-sm">
              TU DESCANSO <br />
              <span className="text-[#D4A017]">EN PRIUS.</span>
            </h1>
          </div>

          {/* Right block: Micro descriptive summary + side-by-side buttons */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:pl-10">
            <p className="text-white text-sm sm:text-base md:text-[17px] leading-relaxed font-normal max-w-sm drop-shadow-sm">
              Un refugio exclusivo en Playa Grande. Costa, silencio y servicio impecable — todo en un lugar.
            </p>
            
            {/* Action buttons side-by-side */}
            <div className="flex gap-3">
              <button 
                onClick={() => scrollToSection('contacto')}
                className="inline-flex items-center justify-center bg-white hover:bg-white/95 text-black font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full transition-all duration-300 cursor-pointer shadow-md"
              >
                RESERVAR
              </button>
              <button 
                onClick={() => scrollToSection('servicios')}
                className="inline-flex items-center justify-center bg-transparent hover:bg-white/10 text-white border-2 border-white px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300"
              >
                VER SERVICIOS
              </button>
            </div>
          </div>

        </div>

        {/* 3. BOTTOM-CENTER area: Absolute bottom pill badge */}
        <div className="relative z-10 flex justify-center w-full mt-4">
          <button
            onClick={() => scrollToSection('contacto')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 border border-white/20 text-xs text-white tracking-wide font-display cursor-pointer"
          >
            <span className="bg-black/80 text-[10px] text-white font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              Nuevo
            </span>
            <span>Prius Club ya está disponible</span>
            <ArrowRight size={14} className="text-[#D4A017] ml-1" />
          </button>
        </div>

      </div>
    </section>
  )
}