import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative w-full h-[92vh] md:h-[95vh] min-h-[600px] md:min-h-[750px] bg-white md:bg-prius-background px-margin-mobile md:px-margin-desktop pt-24 md:pt-28 pb-4 flex flex-col justify-center">
      
      {/* Contenedor Principal "Frame" que emula la grilla arquitectónica de nor.ma */}
      <div className="relative w-full h-full max-w-[1440px] mx-auto rounded-[16px] md:rounded-[24px] overflow-hidden flex flex-col justify-between p-6 md:p-12 lg:p-16 border border-hairline bg-prius-black text-white">
        
        {/* Imagen de Fondo Ultra-Protagonista de Alta Fidelidad */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src="/images/prius1.webp" 
            alt="Experiencia Premium Prius Playa Grande" 
            className="w-full h-full object-cover object-center opacity-60 scale-100 transform transition-transform duration-[1200ms] ease-out"
          />
          {/* Overlay de gradiente con color exacto de nor.ma para dar atmósfera premium */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />
        </div>

        {/* 1. SECCIÓN SUPERIOR: Badge de Ubicación y Estado Minimalista */}
        <div className="relative z-10 flex justify-between items-start w-full">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-display text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
            <span>Temporada 2026</span>
          </div>
          <span className="hidden md:inline-block text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 font-display">
            Playa Grande, Mar del Plata
          </span>
        </div>

        {/* 2. SECCIÓN CENTRAL / INFERIOR: Disposición de Contenido Asimétrica */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mt-auto">
          
          {/* Lado Izquierdo: Titular Principal Gigante (Estética nor.ma) */}
          <div className="lg:col-span-8">
            <h1 className="text-[36px] sm:text-[52px] md:text-[64px] lg:text-[76px] font-bold leading-[0.95] tracking-tight uppercase font-display max-w-3xl text-white">
              Redefiní tu verano. <br />
              <span className="text-gold">Confort absoluto.</span>
            </h1>
          </div>

          {/* Lado Derecho: Descripción Minimalista y CTAs de Alta Gama */}
          <div className="lg:col-span-4 space-y-5 lg:pl-4">
            <p className="text-white/80 text-xs md:text-sm leading-relaxed font-light max-w-sm">
              Un santuario costero diseñado bajo un concepto de minimalismo estructural. Un refugio privado y exclusivo para quienes aprecian el silencio, el servicio impecable y la elegancia frente al mar.
            </p>
            
            {/* Botones de Acción Estilo Píldora de nor.ma */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button 
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-prius-black px-7 py-3.5 rounded-full font-bold text-[11px] uppercase tracking-widest transition-premium duration-300 font-display cursor-pointer"
              >
                Reservar carpa
                <ArrowRight size={13} />
              </button>
              <button 
                onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 px-7 py-3.5 rounded-full font-bold text-[11px] uppercase tracking-widest transition-premium duration-300 font-display backdrop-blur-sm cursor-pointer"
              >
                Ver servicios
              </button>
            </div>
          </div>

        </div>

      </div>

    </section>
  )
}