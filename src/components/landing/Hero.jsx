import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen bg-white flex flex-col justify-end p-3 md:p-4">
      
      {/* Contenedor Flotante del Hero con Bordes Redondeados (Inspirado en nor.ma) */}
      <div className="relative w-full h-[90vh] md:h-[94vh] min-h-[680px] rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col justify-between p-6 md:p-16">
        
        {/* Imagen de fondo premium con un overlay de contraste sutil y elegante */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src="/images/prius1.webp" 
            alt="Experiencia Prius Playa Grande" 
            className="w-full h-full object-cover object-center"
          />
          {/* Capa de overlay translúcida de alta gama */}
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* 1. SECCIÓN SUPERIOR: Badges de contexto integrados elegantemente */}
        <div className="relative z-10 flex flex-wrap gap-2.5 mt-20 md:mt-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] md:text-xs uppercase tracking-[0.2em] font-display text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            Reserva sin cargo
          </div>
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] md:text-xs uppercase tracking-[0.2em] font-display text-white/90">
            Temporada 2024–2025
          </div>
        </div>

        {/* 2. SECCIÓN CENTRAL: Grilla asimétrica con la tipografía monumental y márgenes exactos */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end my-auto w-full">
          
          {/* Bloque Izquierdo: Titular Gigante */}
          <div className="lg:col-span-7">
            <h1 className="text-[40px] sm:text-[56px] md:text-[76px] lg:text-[88px] xl:text-[96px] font-black leading-[0.95] tracking-tighter uppercase font-display text-white select-none">
              TU DESCANSO <br />
              <span className="text-gold">EN PRIUS.</span>
            </h1>
          </div>

          {/* Bloque Derecho: Micro-descripción y CTAs con colores oficiales corregidos */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:pl-6">
            <p className="text-white/90 text-sm sm:text-base md:text-[17px] leading-relaxed font-light max-w-sm">
              Un refugio exclusivo en Playa Grande. Costa, silencio y servicio impecable — todo en un lugar.
            </p>
            
            {/* Botones de acción estilo píldora */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => scrollToSection('contacto')}
                className="inline-flex items-center justify-center bg-white hover:bg-white/95 text-prius-black font-bold text-xs uppercase tracking-[0.15em] px-8 py-4 rounded-full transition-premium cursor-pointer shadow-lg"
              >
                RESERVAR
              </button>
              <button 
                onClick={() => scrollToSection('servicios')}
                className="inline-flex items-center justify-center bg-transparent hover:bg-white/10 text-white border-2 border-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-[0.15em] transition-premium"
              >
                VER SERVICIOS
              </button>
            </div>
          </div>

        </div>

        {/* 3. SECCIÓN INFERIOR: Pill de Novedad flotando perfectamente al pie */}
        <div className="relative z-10 flex justify-center w-full mt-4">
          <button
            onClick={() => scrollToSection('contacto')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md transition-premium border border-white/10 text-[9px] md:text-[11px] text-white tracking-[0.15em] uppercase font-display cursor-pointer"
          >
            <span className="bg-black/60 text-[8px] md:text-[10px] text-gold font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full">
              Nuevo
            </span>
            <span>Prius Club ya está disponible</span>
            <ArrowRight size={12} className="text-gold ml-1 animate-bounce-horizontal" />
          </button>
        </div>

      </div>
    </section>
  )
}