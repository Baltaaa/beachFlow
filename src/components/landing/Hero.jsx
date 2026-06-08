import { 
  Umbrella, Sparkles, CreditCard, MessageSquare, 
  Utensils, Calendar, Check, Shield, Wifi, Coffee, Heart, ShoppingBag
} from 'lucide-react'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center px-margin-mobile md:px-margin-desktop pt-32 pb-16 relative overflow-hidden bg-prius-background">
      {/* Imagen de fondo nítida con overlay degradado para no invadir la información */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/hero-bg.png" 
          alt="Prius Playa Grande" 
          className="w-full h-full object-cover object-center"
        />
        {/* Overlay degradado sofisticado: más opaco a la izquierda para el texto, y suave en el resto */}
        <div className="absolute inset-0 bg-gradient-to-r from-prius-background via-prius-background/95 to-prius-background/40 md:to-prius-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-prius-background via-transparent to-transparent" />
      </div>

      <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Columna Izquierda: Título y Descripción */}
        <div className="lg:col-span-6 space-y-6 bg-prius-background/80 md:bg-transparent p-6 md:p-0 rounded-xl backdrop-blur-sm md:backdrop-blur-none border border-hairline/50 md:border-none">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-prius-black/40 bg-white px-3 py-1.5 rounded-full border border-hairline">
            Playa Grande • Mar del Plata
          </span>
          <h1 className="text-[40px] sm:text-[52px] md:text-[64px] font-normal leading-[1.1] tracking-[-0.04em] text-prius-black uppercase">
            Experiencia premium en <span className="font-serif italic text-gold">Prius</span>
          </h1>
          <p className="text-prius-black/60 text-sm sm:text-base max-w-xl leading-relaxed">
            Redefinimos el descanso costero con una propuesta arquitectónica minimalista y servicios de exclusividad absoluta en el punto más emblemático de la costa.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gold hover:bg-gold-hover px-8 py-4 rounded-sm font-bold text-[11px] uppercase tracking-widest transition-all border border-transparent"
            >
              Descubrir Prius
            </button>
            <button 
              onClick={() => document.getElementById('galeria')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-hairline bg-white hover:bg-prius-background px-8 py-4 rounded-sm font-bold text-[11px] uppercase tracking-widest transition-all"
            >
              Ver Galería
            </button>
          </div>
        </div>

        {/* Columna Derecha: Bento Grid Compacto y Moderno (Adaptado a Mobile en 2 columnas) */}
        <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 max-w-[620px] w-full">
            
            {/* 1. CARPAS DE DISEÑO (Vertical en Desktop, Compacto en Mobile) */}
            <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 sm:p-5 flex flex-col justify-between min-h-[180px] sm:min-h-[340px] col-span-1 sm:row-span-2 border border-hairline group transition-premium hover:border-gold">
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-prius-black uppercase tracking-tight font-display">Carpas</h3>
                  <Umbrella className="w-3.5 h-3.5 text-gold sm:hidden" />
                </div>
                <p className="text-[10px] sm:text-[11px] text-prius-black/60 leading-tight sm:leading-relaxed">
                  Estructuras minimalistas con mobiliario premium y atención personalizada.
                </p>
              </div>

              {/* Mini Mockup de Reserva */}
              <div className="hidden sm:block my-3 bg-prius-background rounded-md p-2.5 border border-hairline max-w-full mx-auto transform group-hover:scale-102 transition-transform duration-300">
                <div className="rounded-sm overflow-hidden h-16 mb-2 relative border border-hairline">
                  <img src="/images/prius12.webp" alt="Carpas" className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[7px] font-bold uppercase tracking-wider text-prius-black/40">Unidad</p>
                    <p className="text-[9px] font-bold text-prius-black">Carpa #12</p>
                  </div>
                  <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1.5 border-t border-hairline text-[8px] sm:text-[9px] text-prius-black/40">
                <span className="flex items-center gap-1"><Wifi className="w-2.5 h-2.5" /> WiFi</span>
                <span className="flex items-center gap-1"><Shield className="w-2.5 h-2.5" /> Seg.</span>
              </div>
            </div>

            {/* 2. MASAJES TERAPÉUTICOS (Ancho en Desktop, Compacto en Mobile) */}
            <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 sm:p-5 flex flex-col justify-between min-h-[180px] sm:min-h-[160px] col-span-1 sm:col-span-2 border border-hairline group transition-premium hover:border-gold">
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-prius-black uppercase tracking-tight font-display">Masajes</h3>
                  <Heart className="w-3.5 h-3.5 text-gold" />
                </div>
                <p className="text-[10px] sm:text-[11px] text-prius-black/60 leading-tight sm:leading-relaxed">
                  Sesiones terapéuticas y relajantes con turnos programados a cargo de Pilar Ferrando.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-hairline">
                <span className="text-[8px] font-bold uppercase tracking-widest text-gold">
                  Turnos Disponibles
                </span>
                <span className="text-[8px] sm:text-[9px] text-prius-black/40 font-medium">Pilar Ferrando</span>
              </div>
            </div>

            {/* 3. ALQUILER DE EQUIPAMIENTO (Vertical en Desktop, Compacto en Mobile) */}
            <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 sm:p-5 flex flex-col justify-between min-h-[180px] sm:min-h-[340px] col-span-1 sm:row-span-2 border border-hairline group transition-premium hover:border-gold">
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-prius-black uppercase tracking-tight font-display">Alquileres</h3>
                  <ShoppingBag className="w-3.5 h-3.5 text-gold sm:hidden" />
                </div>
                <p className="text-[10px] sm:text-[11px] text-prius-black/60 leading-tight sm:leading-relaxed">
                  Alquiler directo de reposeras adicionales, toallas premium y shampoo para su comodidad.
                </p>
              </div>

              {/* Mini Lista de Alquileres */}
              <div className="hidden sm:block my-3 bg-prius-background rounded-md p-2.5 border border-hairline space-y-1.5">
                <div className="flex justify-between text-[8px] text-prius-black/60">
                  <span>Reposera Extra</span>
                  <span className="font-bold text-prius-black">Disponible</span>
                </div>
                <div className="flex justify-between text-[8px] text-prius-black/60">
                  <span>Toallas Premium</span>
                  <span className="font-bold text-prius-black">Disponible</span>
                </div>
                <div className="flex justify-between text-[8px] text-prius-black/60">
                  <span>Shampoo & Care</span>
                  <span className="font-bold text-prius-black">Disponible</span>
                </div>
              </div>

              <span className="text-[8px] font-bold uppercase tracking-widest text-prius-black/40">
                Solicitar a Carperos
              </span>
            </div>

            {/* 4. GASTRONOMÍA DE MAR (Ancho en Desktop, Compacto en Mobile) */}
            <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 sm:p-5 flex flex-col justify-between min-h-[180px] sm:min-h-[160px] col-span-1 sm:col-span-2 border border-hairline group transition-premium hover:border-gold">
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-prius-black uppercase tracking-tight font-display">Gastronomía</h3>
                  <Utensils className="w-3.5 h-3.5 text-gold" />
                </div>
                <p className="text-[10px] sm:text-[11px] text-prius-black/60 leading-tight sm:leading-relaxed">
                  Exclusiva propuesta de cocina de mar con servicio directo a su carpa o sombrilla.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-hairline">
                <span className="text-[8px] font-bold uppercase tracking-widest text-gold">
                  Servicio a la Carpa
                </span>
                <span className="text-[8px] sm:text-[9px] text-prius-black/40 font-medium">10:00 a 19:00 HS</span>
              </div>
            </div>

            {/* 5. MEMBRESÍA CLUB PRIUS (Ancho completo en Mobile, 1 columna en Desktop) */}
            <div className="bg-prius-black text-white rounded-lg p-4 sm:p-5 flex flex-col justify-between min-h-[120px] sm:min-h-[160px] col-span-2 sm:col-span-1 border border-hairline group transition-premium hover:border-gold">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-[7px] font-bold uppercase tracking-widest text-gold">Prius Club</span>
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-tight text-white font-display">Membresía</h3>
                </div>
                <CreditCard className="w-4 h-4 text-gold" />
              </div>

              <div className="flex justify-between items-end pt-2">
                <p className="text-[9px] text-white/60 leading-tight max-w-[120px] sm:max-w-none">
                  Beneficios exclusivos y preventas de temporada.
                </p>
                <span className="text-[8px] font-bold tracking-widest text-gold uppercase shrink-0">GOLD MEMBER</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}