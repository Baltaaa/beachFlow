import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-white md:bg-prius-background pt-4 md:pt-6 pb-6 px-margin-mobile md:px-margin-desktop flex flex-col justify-center">
      
      {/* Contenedor Principal "Card Flotante" de Gran Altura */}
      <div className="relative w-full max-w-[1440px] mx-auto min-h-[85vh] lg:min-h-[90vh] rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-16 border border-hairline bg-prius-black text-white">
        
        {/* Imagen de Fondo Ultra-Protagonista con Overlay Suave */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src="/images/prius1.webp" 
            alt="Experiencia Premium Prius Playa Grande" 
            className="w-full h-full object-cover object-center opacity-65 scale-102 transform transition-all duration-1000"
          />
          {/* Capa de gradiente oscuro premium de nor.ma */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/80" />
        </div>

        {/* 1. SECCIÓN SUPERIOR: Espacio de resguardo para el Navbar */}
        <div className="h-16 md:h-20" />

        {/* 2. SECCIÓN CENTRAL: Disposición Asimétrica de Contenido (Estilo nor.ma) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end my-auto pt-8">
          
          {/* Lado Izquierdo: Titular Gigante */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-gold/90 block">
                BALNEARIO EXCLUSIVO • MAR DEL PLATA
              </span>
            </div>
            <h1 className="text-[34px] sm:text-[46px] md:text-[54px] lg:text-[64px] font-bold leading-[1.05] tracking-tight uppercase font-display max-w-2xl text-white">
              Redefiní tu verano. <br />
              <span className="text-gold">Confort absoluto.</span>
            </h1>
          </div>

          {/* Lado Derecho: Descripción y CTAs Minimalistas */}
          <div className="lg:col-span-5 space-y-6 lg:pl-6">
            <p className="text-white/85 text-xs sm:text-sm leading-relaxed font-light max-w-md">
              Un santuario costero diseñado bajo un concepto de minimalismo estructural. Un refugio privado y exclusivo para quienes aprecian el silencio, el servicio impecable y la elegancia frente al mar.
            </p>
            
            {/* Botones de Acción Estilo Píldora Redondeados */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <button 
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-prius-black px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 font-display cursor-pointer shrink-0 shadow-md"
              >
                Reservar carpa
                <ArrowRight size={14} />
              </button>
              <button 
                onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 font-display backdrop-blur-sm"
              >
                Ver servicios
              </button>
            </div>
          </div>

        </div>

        {/* 3. SECCIÓN INFERIOR: Novedad y Beneficios */}
        <div className="relative z-10 flex justify-center pt-8">
          <button
            onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 transition-all duration-300 border border-white/10 text-[9px] md:text-[10px] uppercase tracking-widest text-white/90 text-center font-display backdrop-blur-sm"
          >
            <Sparkles size={12} className="text-gold shrink-0" />
            <span>Preventa de temporada abierta con beneficios Prius Club</span>
            <ArrowRight size={10} className="text-gold ml-1 shrink-0" />
          </button>
        </div>

      </div>

      {/* Banner flotante inferior de descuento fuera de la tarjeta */}
      <div className="hidden md:flex max-w-[1440px] mx-auto w-full px-6 mt-4">
        <div className="inline-flex items-center gap-2 bg-white border border-hairline px-4 py-2 rounded-full text-prius-black text-[10px] font-display uppercase tracking-wider shadow-sm">
          <span className="w-2 h-2 rounded-full bg-gold inline-block" />
          <span>Beneficios exclusivos pagando con tarjetas asociadas</span>
        </div>
      </div>

    </section>
  )
}