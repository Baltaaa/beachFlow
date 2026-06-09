import { 
  Umbrella, Heart, ShoppingBag, Utensils, CreditCard, Wifi, Shield, Check
} from 'lucide-react'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center px-margin-mobile md:px-margin-desktop pt-32 pb-16 relative overflow-hidden bg-prius-black">
      {/* Imagen de fondo con overlay de alto contraste para garantizar legibilidad (WCAG 2.1 AA) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/hero-bg.png" 
          alt="Prius Playa Grande" 
          className="w-full h-full object-cover object-center opacity-40"
        />
        {/* Degradado sofisticado que se funde con el negro puro de la sección */}
        <div className="absolute inset-0 bg-gradient-to-r from-prius-black via-prius-black/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-prius-black via-transparent to-transparent" />
      </div>

      <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Columna Izquierda: Título y Propuesta de Valor */}
        <div className="lg:col-span-5 space-y-6 text-white">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-gold bg-white/5 px-3 py-1.5 rounded-sm border border-white/10">
            Playa Grande • Mar del Plata
          </span>
          <h1 className="text-[42px] sm:text-[56px] md:text-[68px] font-normal leading-[1.05] tracking-tight uppercase font-display">
            El arte del <br />
            <span className="font-serif italic text-gold">descanso</span>
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-md leading-relaxed font-light">
            Redefinimos la experiencia de costa bajo un concepto de minimalismo estructural. Un refugio exclusivo diseñado para quienes aprecian el silencio, el confort y el servicio impecable.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gold hover:bg-gold-hover text-prius-black px-8 py-4 rounded-sm font-bold text-[11px] uppercase tracking-[0.2em] transition-premium cursor-pointer"
            >
              Explorar Servicios
            </button>
            <button 
              onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-white/20 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-sm font-bold text-[11px] uppercase tracking-[0.2em] transition-premium"
            >
              Reservar
            </button>
          </div>
        </div>

        {/* Columna Derecha: Bento Grid Ultra-Moderno y Asimétrico */}
        <div className="lg:col-span-7 w-full flex justify-center lg:justify-end">
          {/* 
            Grid asimétrico:
            - En mobile: 2 columnas con gaps mínimos (8px) para evitar dispersión visual.
            - En desktop: 3 columnas con gaps elegantes (16px).
          */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 max-w-[680px] w-full">
            
            {/* 1. CARPAS DE DISEÑO (Tarjeta Principal - Ancla Visual) */}
            <div className="bg-prius-black/80 backdrop-blur-md rounded-lg p-4 sm:p-6 flex flex-col justify-between min-h-[190px] sm:min-h-[360px] col-span-2 sm:col-span-1 sm:row-span-2 border border-white/10 group transition-premium hover:border-gold/50">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gold">Santuario</span>
                  <Umbrella className="w-4 h-4 text-gold" />
                </div>
                <h3 className="text-base sm:text-lg font-normal text-white uppercase tracking-tight font-display">
                  Carpas <br className="hidden sm:inline" /> Premium
                </h3>
                <p className="text-[11px] text-white/50 leading-relaxed font-light">
                  Estructuras de diseño nórdico con reposeras ergonómicas y atención personalizada en la arena.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[9px] text-white/40">
                <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-gold" /> WiFi 100MB</span>
                <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-gold" /> Seguridad</span>
              </div>
            </div>

            {/* 2. MASAJES TERAPÉUTICOS (Pilar Ferrando) */}
            <div className="bg-prius-black/80 backdrop-blur-md rounded-lg p-4 sm:p-6 flex flex-col justify-between min-h-[150px] sm:min-h-[170px] col-span-1 sm:col-span-2 border border-white/10 group transition-premium hover:border-gold/50">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gold">Wellness</span>
                  <Heart className="w-4 h-4 text-gold" />
                </div>
                <h3 className="text-sm sm:text-base font-normal text-white uppercase tracking-tight font-display">
                  Masajes Terapéuticos
                </h3>
                <p className="text-[11px] text-white/50 leading-relaxed font-light line-clamp-2">
                  Sesiones exclusivas de relajación y bienestar con turnos programados a cargo de Pilar Ferrando.
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px]">
                <span className="text-gold font-bold uppercase tracking-wider">Turnos Exclusivos</span>
                <span className="text-white/40">Pilar Ferrando</span>
              </div>
            </div>

            {/* 3. ALQUILER DE EQUIPAMIENTO */}
            <div className="bg-prius-black/80 backdrop-blur-md rounded-lg p-4 sm:p-6 flex flex-col justify-between min-h-[190px] sm:min-h-[360px] col-span-1 sm:row-span-2 border border-white/10 group transition-premium hover:border-gold/50">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gold">Confort</span>
                  <ShoppingBag className="w-4 h-4 text-gold" />
                </div>
                <h3 className="text-sm sm:text-base font-normal text-white uppercase tracking-tight font-display">
                  Equipamiento
                </h3>
                <p className="text-[11px] text-white/50 leading-relaxed font-light">
                  Alquiler directo de reposeras adicionales, toallas premium y shampoo para su total comodidad.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/5">
                <div className="flex justify-between text-[9px] text-white/40">
                  <span>Reposeras</span>
                  <span className="text-gold font-bold">✓</span>
                </div>
                <div className="flex justify-between text-[9px] text-white/40">
                  <span>Toallas</span>
                  <span className="text-gold font-bold">✓</span>
                </div>
                <div className="flex justify-between text-[9px] text-white/40">
                  <span>Shampoo</span>
                  <span className="text-gold font-bold">✓</span>
                </div>
              </div>
            </div>

            {/* 4. GASTRONOMÍA DE MAR */}
            <div className="bg-prius-black/80 backdrop-blur-md rounded-lg p-4 sm:p-6 flex flex-col justify-between min-h-[150px] sm:min-h-[170px] col-span-1 sm:col-span-2 border border-white/10 group transition-premium hover:border-gold/50">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gold">Gastronomía</span>
                  <Utensils className="w-4 h-4 text-gold" />
                </div>
                <h3 className="text-sm sm:text-base font-normal text-white uppercase tracking-tight font-display">
                  Cocina de Mar
                </h3>
                <p className="text-[11px] text-white/50 leading-relaxed font-light line-clamp-2">
                  Platos sofisticados y coctelería de autor servidos directamente en su carpa o sombrilla.
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px]">
                <span className="text-gold font-bold uppercase tracking-wider">Servicio a la Arena</span>
                <span className="text-white/40">10:00 a 19:00 HS</span>
              </div>
            </div>

            {/* 5. MEMBRESÍA CLUB PRIUS */}
            <div className="bg-gold text-prius-black rounded-lg p-4 sm:p-6 flex flex-col justify-between min-h-[120px] sm:min-h-[170px] col-span-2 sm:col-span-1 border border-transparent group transition-premium hover:bg-gold-hover">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Membresía</span>
                  <h3 className="text-sm sm:text-base font-bold uppercase tracking-tight font-display">
                    Prius Club
                  </h3>
                </div>
                <CreditCard className="w-4 h-4 opacity-80" />
              </div>

              <div className="pt-4 border-t border-prius-black/10 flex justify-between items-end">
                <p className="text-[10px] opacity-70 leading-tight max-w-[110px] sm:max-w-none font-light">
                  Beneficios exclusivos y preventas de temporada.
                </p>
                <span className="text-[8px] font-bold tracking-widest uppercase shrink-0 bg-prius-black text-white px-1.5 py-0.5 rounded-sm">
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