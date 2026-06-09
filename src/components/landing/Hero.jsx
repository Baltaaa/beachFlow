import { 
  Umbrella, Heart, ShoppingBag, Utensils, CreditCard, Wifi, Shield, Check
} from 'lucide-react'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center px-margin-mobile md:px-margin-desktop pt-32 pb-16 relative overflow-hidden bg-prius-background">
      {/* Imagen de fondo con mayor presencia y nitidez */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/hero-bg.png" 
          alt="Prius Playa Grande" 
          className="w-full h-full object-cover object-center opacity-60 transition-all duration-1000"
        />
        {/* Degradado solar asimétrico mezclado con el azul profundo #32486c */}
        <div className="absolute inset-0 bg-gradient-to-r from-prius-background via-prius-background/85 to-[#32486c]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#32486c]/25 via-transparent to-[#32486c]/15" />
      </div>

      <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Columna Izquierda: Título y Propuesta de Valor */}
        <div className="lg:col-span-5 space-y-6 text-prius-black">
          <span className="inline-block text-[10px] font-extralight uppercase tracking-[0.3em] text-prius-black/60 bg-white px-3 py-1.5 rounded-sm border border-hairline font-display">
            Playa Grande • Mar del Plata
          </span>
          <h1 className="text-[44px] sm:text-[58px] md:text-[68px] font-normal leading-[1.05] tracking-tight text-prius-black font-display uppercase">
            El arte del <br />
            <span className="text-gold">descanso</span>
          </h1>
          <p className="text-prius-black/60 text-sm sm:text-base max-w-md leading-relaxed font-light">
            Redefinimos la experiencia de costa bajo un concepto de minimalismo estructural. Un refugio exclusivo diseñado para quienes aprecian el silencio, el confort y el servicio impecable.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gold hover:bg-gold-hover text-prius-black px-8 py-4 rounded-sm font-extralight text-[11px] uppercase tracking-[0.2em] transition-premium cursor-pointer border border-transparent font-display"
            >
              Explorar Servicios
            </button>
            <button 
              onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-hairline bg-white hover:bg-prius-background text-prius-black px-8 py-4 rounded-sm font-extralight text-[11px] uppercase tracking-[0.2em] transition-premium font-display"
            >
              Reservar
            </button>
          </div>
        </div>

        {/* Columna Derecha: Bento Grid Claro, Cálido y Asimétrico */}
        <div className="lg:col-span-7 w-full flex justify-center lg:justify-end">
          {/* 
            Grid asimétrico optimizado de 3x3 en desktop:
            - En mobile: 2 columnas compactas con gaps de 8px.
            - En desktop: 3 columnas con gaps de 16px.
          */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 max-w-[680px] w-full">
            
            {/* 1. CARPAS DE DISEÑO (Columna 1 - Filas 1 y 2) */}
            <div className="bg-gradient-to-br from-white/95 to-neutral-100/70 backdrop-blur-md rounded-lg p-4 sm:p-6 flex flex-col justify-between min-h-[190px] sm:min-h-[360px] col-span-2 sm:col-span-1 sm:row-span-2 border border-hairline group transition-premium hover:border-gold">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-normal uppercase tracking-widest text-gold font-display">Santuario</span>
                  <Umbrella className="w-4 h-4 text-gold" />
                </div>
                <h3 className="text-base sm:text-lg font-extralight text-prius-black uppercase tracking-tight font-display">
                  Carpas
                </h3>
                <p className="text-[11px] text-prius-black/60 leading-relaxed font-light">
                  Estructuras de diseño nórdico con reposeras ergonómicas y atención personalizada en la arena.
                </p>
              </div>

              <div className="pt-4 border-t border-hairline flex justify-between items-center text-[9px] text-prius-black/40 font-display font-extralight">
                <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-gold" /> WiFi 100MB</span>
                <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-gold" /> Seguridad</span>
              </div>
            </div>

            {/* 2. MASAJES TERAPÉUTICOS (Fila 1 - Columnas 2 y 3) */}
            <div className="bg-gradient-to-br from-white/95 to-neutral-100/70 backdrop-blur-md rounded-lg p-4 sm:p-6 flex flex-col justify-between min-h-[150px] sm:min-h-[170px] col-span-2 sm:col-span-2 border border-hairline group transition-premium hover:border-gold">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-normal uppercase tracking-widest text-gold font-display">Wellness</span>
                  <Heart className="w-4 h-4 text-gold" />
                </div>
                <h3 className="text-base sm:text-lg font-extralight text-prius-black uppercase tracking-tight font-display">
                  Masajes Terapéuticos
                </h3>
                <p className="text-[11px] text-prius-black/60 leading-relaxed font-light line-clamp-2">
                  Sesiones exclusivas de relajación y bienestar con turnos programados a cargo de Pilar Ferrando.
                </p>
              </div>

              <div className="pt-2 border-t border-hairline flex items-center justify-between text-[9px] font-display font-extralight">
                <span className="text-gold uppercase tracking-wider font-normal">Turnos Exclusivos</span>
                <span className="text-prius-black/40">Pilar Ferrando</span>
              </div>
            </div>

            {/* 3. ALQUILER DE EQUIPAMIENTO (Columna 2 - Filas 2 y 3) */}
            <div className="bg-gradient-to-br from-white/95 to-neutral-100/70 backdrop-blur-md rounded-lg p-4 sm:p-6 flex flex-col justify-between min-h-[190px] sm:min-h-[360px] col-span-1 sm:row-span-2 border border-hairline group transition-premium hover:border-gold">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-normal uppercase tracking-widest text-gold font-display">Confort</span>
                  <ShoppingBag className="w-4 h-4 text-gold" />
                </div>
                <h3 className="text-base sm:text-lg font-extralight text-prius-black uppercase tracking-tight font-display">
                  Equipamiento
                </h3>
                <p className="text-[11px] text-prius-black/60 leading-relaxed font-light">
                  Alquiler directo de reposeras adicionales, toallas premium y shampoo para su total comodidad.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-hairline font-display font-extralight">
                <div className="flex justify-between text-[9px] text-prius-black/40">
                  <span>Reposeras</span>
                  <span className="text-gold">✓</span>
                </div>
                <div className="flex justify-between text-[9px] text-prius-black/40">
                  <span>Toallas</span>
                  <span className="text-gold">✓</span>
                </div>
                <div className="flex justify-between text-[9px] text-prius-black/40">
                  <span>Shampoo</span>
                  <span className="text-gold">✓</span>
                </div>
              </div>
            </div>

            {/* 4. GASTRONOMÍA DE MAR (Columna 3 - Filas 2 y 3) */}
            <div className="bg-gradient-to-br from-white/95 to-neutral-100/70 backdrop-blur-md rounded-lg p-4 sm:p-6 flex flex-col justify-between min-h-[190px] sm:min-h-[360px] col-span-1 sm:row-span-2 border border-hairline group transition-premium hover:border-gold">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-normal uppercase tracking-widest text-gold font-display">Gastronomía</span>
                  <Utensils className="w-4 h-4 text-gold" />
                </div>
                <h3 className="text-base sm:text-lg font-extralight text-prius-black uppercase tracking-tight font-display">
                  Cocina de Mar
                </h3>
                <p className="text-[11px] text-prius-black/60 leading-relaxed font-light">
                  Platos sofisticados y coctelería de autor servidos directamente en su carpa o sombrilla.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-hairline font-display font-extralight">
                <div className="flex justify-between text-[9px] text-prius-black/40">
                  <span>Tragos de Autor</span>
                  <span className="text-gold">✓</span>
                </div>
                <div className="flex justify-between text-[9px] text-prius-black/40">
                  <span>Pesca del Día</span>
                  <span className="text-gold">✓</span>
                </div>
                <div className="flex justify-between text-[9px] text-prius-black/40">
                  <span>Jugos Naturales</span>
                  <span className="text-gold">✓</span>
                </div>
              </div>
            </div>

            {/* 5. MEMBRESÍA CLUB PRIUS (Columna 1 - Fila 3) */}
            <div className="bg-gold text-prius-black rounded-lg p-4 sm:p-6 flex flex-col justify-between min-h-[120px] sm:min-h-[170px] col-span-2 sm:col-span-1 border border-transparent group transition-premium hover:bg-gold-hover">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[8px] font-normal uppercase tracking-widest opacity-60 font-display">Membresía</span>
                  <h3 className="text-base sm:text-lg font-extralight uppercase tracking-tight font-display">
                    Prius Club
                  </h3>
                </div>
                <CreditCard className="w-4 h-4 opacity-80" />
              </div>

              <div className="pt-4 border-t border-prius-black/10 flex justify-between items-end">
                <p className="text-[10px] opacity-70 leading-tight max-w-[160px] sm:max-w-none font-light">
                  Beneficios exclusivos y preventas de temporada.
                </p>
                <span className="text-[8px] font-extralight tracking-widest uppercase shrink-0 bg-prius-black text-white px-1.5 py-0.5 rounded-sm font-display">
                  GOLD
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}