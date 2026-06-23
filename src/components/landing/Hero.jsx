import { ArrowRight, Sparkles, Umbrella, Calendar, ShieldCheck } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-white md:bg-prius-background pt-24 pb-8 px-4 md:px-6 flex flex-col justify-center">
      
      {/* Contenedor Principal "Card Flotante" - Inspirado en nor.ma */}
      <div className="relative w-full max-w-[1440px] mx-auto min-h-[80vh] md:min-h-[680px] lg:h-[82vh] rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-16 border border-hairline bg-prius-black text-white">
        
        {/* Imagen de Fondo de Alta Calidad con Overlay Gradiente de Lujo */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src="/images/prius1.webp" 
            alt="Experiencia Premium Prius Playa Grande" 
            className="w-full h-full object-cover object-center opacity-55 scale-102 transform transition-all duration-1000"
          />
          {/* Capa de gradiente oscuro para legibilidad impecable de los textos blancos */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/80" />
        </div>

        {/* 1. SECCIÓN SUPERIOR: Pill Badges de Contexto */}
        <div className="relative z-10 flex flex-wrap gap-2 mb-8 md:mb-0">
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] md:text-xs uppercase tracking-widest font-display text-gold">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            Temporada 2026 Abierta
          </div>
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] md:text-xs uppercase tracking-widest font-display text-white/90">
            Playa Grande • Mar del Plata
          </div>
        </div>

        {/* 2. SECCIÓN CENTRAL: Disposición Asimétrica de Contenido (Estilo nor.ma) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end my-auto">
          
          {/* Lado Izquierdo: Titular Ultra-Bold de Gran Impacto */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-white/40 block">
                BALNEARIO EXCLUSIVO
              </span>
            </div>
            <h1 className="text-[36px] sm:text-[48px] md:text-[56px] lg:text-[68px] font-bold leading-[1.05] tracking-tight uppercase font-display max-w-2xl text-white">
              Redefiní tu verano. <br />
              <span className="text-gold">Confort absoluto.</span>
            </h1>
          </div>

          {/* Lado Derecho: Descripción Minimalista y CTAs Premium */}
          <div className="lg:col-span-5 space-y-6 lg:pl-6">
            <p className="text-white/85 text-xs sm:text-sm md:text-base leading-relaxed font-light max-w-md">
              Un santuario costero diseñado bajo un concepto de minimalismo estructural. Un refugio privado y exclusivo para quienes aprecian el silencio, el servicio impecable y la elegancia frente al mar.
            </p>
            
            {/* Botones de Acción Estilo Píldora */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <button 
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-prius-black px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-premium duration-300 font-display cursor-pointer shrink-0"
              >
                Reservar carpa
                <ArrowRight size={14} />
              </button>
              <button 
                onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-premium duration-300 font-display backdrop-blur-sm"
              >
                Ver servicios
              </button>
            </div>
          </div>

        </div>

        {/* 3. SECCIÓN INFERIOR: Badge Flotante Centrado de Novedad */}
        <div className="relative z-10 flex justify-center pt-8 md:pt-0">
          <button
            onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 transition-premium duration-300 border border-white/10 text-[9px] md:text-[11px] uppercase tracking-widest text-white/90 text-center font-display"
          >
            <Sparkles size={12} className="text-gold shrink-0" />
            <span>Preventa de temporada abierta con beneficios Prius Club</span>
            <ArrowRight size={10} className="text-gold ml-1 shrink-0" />
          </button>
        </div>

      </div>

      {/* Mini banner flotante inferior de descuento (Estilo nor.ma en la esquina inferior izquierda) */}
      <div className="hidden md:flex max-w-[1440px] mx-auto w-full px-6 mt-4">
        <div className="inline-flex items-center gap-2 bg-white border border-hairline px-4 py-2 rounded-full text-prius-black text-[10px] font-display uppercase tracking-wider shadow-sm">
          <span className="w-2 h-2 rounded-full bg-gold inline-block" />
          <span>Beneficios exclusivos pagando con tarjetas asociadas</span>
        </div>
      </div>

    </section>
  )
}