import { 
  Umbrella, Sparkles, CreditCard, MessageSquare, 
  Utensils, Bell, Calendar, Check, Shield, Wifi, Coffee
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
        <div className="absolute inset-0 bg-gradient-to-r from-prius-background via-prius-background/90 to-prius-background/40 md:to-prius-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-prius-background via-transparent to-transparent" />
      </div>

      <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Columna Izquierda: Título y Descripción */}
        <div className="lg:col-span-6 space-y-6 bg-prius-background/80 md:bg-transparent p-6 md:p-0 rounded-xl backdrop-blur-sm md:backdrop-blur-none border border-hairline/50 md:border-none">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-prius-black/40 bg-white px-3 py-1.5 rounded-full border border-hairline">
            Playa Grande • Mar del Plata
          </span>
          <h1 className="text-[40px] sm:text-[52px] md:text-[64px] font-normal leading-[1.1] tracking-[-0.04em] text-prius-black uppercase">
            Experiencia premium en <span className="text-gold italic font-medium">Playa Grande</span>
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

        {/* Columna Derecha: Bento Grid Compacto con Colores Prius */}
        <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[620px] w-full">
            
            {/* 1. CARPAS DE DISEÑO (Izquierda Alta - spans 2 rows) */}
            <div className="bg-white/95 backdrop-blur-md rounded-lg p-5 flex flex-col justify-between min-h-[340px] sm:col-span-1 sm:row-span-2 border border-hairline group">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-prius-black uppercase tracking-tight">Carpas</h3>
                <p className="text-[11px] text-prius-black/60 leading-relaxed">
                  Estructuras minimalistas con mobiliario premium y atención personalizada.
                </p>
              </div>

              {/* Mockup de Tarjeta de Reserva Flotante */}
              <div className="my-4 bg-prius-background rounded-md p-3 border border-hairline max-w-full mx-auto transform group-hover:scale-102 transition-transform duration-300">
                <div className="rounded-sm overflow-hidden h-20 mb-2 relative border border-hairline">
                  <img src="/images/prius3.webp" alt="Carpas" className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-wider text-prius-black/40">Unidad</p>
                    <p className="text-[10px] font-bold text-prius-black">Carpa #12</p>
                  </div>
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Barra de Servicios Inferior */}
              <div className="flex justify-between items-center pt-2 border-t border-hairline text-[9px] text-prius-black/40">
                <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /> WiFi</span>
                <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Seg.</span>
                <span className="flex items-center gap-1"><Coffee className="w-3 h-3" /> Bar</span>
              </div>
            </div>

            {/* 2. SPA & WELLNESS (Derecha Superior Ancha - spans 2 columns) */}
            <div className="bg-white/95 backdrop-blur-md rounded-lg p-5 flex flex-col sm:flex-row justify-between min-h-[160px] sm:col-span-2 sm:row-span-1 border border-hairline group">
              <div className="space-y-2 max-w-[180px] flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-prius-black uppercase tracking-tight">Spa & Relax</h3>
                  <p className="text-[11px] text-prius-black/60 leading-relaxed">
                    Circuito de aguas termales, saunas y masajes terapéuticos frente al mar.
                  </p>
                </div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-gold">
                  Membresías Disponibles
                </span>
              </div>

              {/* Mockup de Calendario de Turnos Flotante */}
              <div className="mt-3 sm:mt-0 bg-prius-background rounded-md p-3 border border-hairline w-full sm:max-w-[180px] self-center">
                <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-hairline">
                  <Calendar className="w-3 h-3 text-gold" />
                  <span className="text-[8px] font-bold uppercase tracking-wider text-prius-black/60">Turno Spa</span>
                </div>
                <div className="space-y-1 text-[9px]">
                  <div className="flex justify-between">
                    <span className="text-prius-black/60">Masaje</span>
                    <span className="font-bold">17:00 HS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. MEMBRESÍA CLUB PRIUS (Centro Izquierda - spans 1 column) */}
            <div className="bg-prius-black text-white rounded-lg p-5 flex flex-col justify-between min-h-[160px] sm:col-span-1 sm:row-span-1 border border-hairline group">
              {/* Tarjeta de Crédito Premium Flotante */}
              <div className="bg-white/10 rounded-md p-3 border border-white/10 w-full transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[7px] font-bold uppercase tracking-widest text-gold">Prius Club</span>
                  <CreditCard className="w-3 h-3 text-gold" />
                </div>
                <p className="text-[9px] font-bold tracking-widest">GOLD MEMBER</p>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-tight text-gold">Membresía</h3>
                <p className="text-[10px] text-white/60 leading-tight">
                  Beneficios exclusivos y preventas.
                </p>
              </div>
            </div>

            {/* 4. CONSERJERÍA DIGITAL (Centro Derecha Alta - spans 1 column, spans 2 rows) */}
            <div className="bg-white/95 backdrop-blur-md rounded-lg p-5 flex flex-col justify-between min-h-[340px] sm:col-span-1 sm:row-span-2 border border-hairline group">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-prius-black uppercase tracking-tight">Conserjería</h3>
                <p className="text-[11px] text-prius-black/60 leading-relaxed">
                  Solicitá servicios y gastronomía directamente desde tu reposera.
                </p>
              </div>

              {/* Mockup de Chat Flotante */}
              <div className="my-4 space-y-2 w-full">
                <div className="bg-prius-background rounded-md p-2 border border-hairline transform -translate-x-1 group-hover:translate-x-0 transition-transform duration-300">
                  <p className="text-[7px] font-bold uppercase tracking-wider text-prius-black/40">Carpero</p>
                  <p className="text-[9px] text-prius-black/80 leading-tight">Su sombrilla #5 ya está lista. ☀️</p>
                </div>

                <div className="bg-prius-black text-white rounded-md p-2 border border-white/10 transform translate-x-1 group-hover:translate-x-0 transition-transform duration-300">
                  <p className="text-[7px] font-bold uppercase tracking-wider text-gold">Bar Prius</p>
                  <p className="text-[9px] text-white/90 leading-tight">Pedido en camino. 🍹</p>
                </div>
              </div>

              <span className="text-[8px] font-bold uppercase tracking-widest text-prius-black/40">
                Atención 10:00 a 19:00
              </span>
            </div>

            {/* 5. GASTRONOMÍA DE MAR (Abajo Izquierda Ancha - spans 2 columns) */}
            <div className="bg-white/95 backdrop-blur-md rounded-lg p-5 flex flex-col sm:flex-row justify-between min-h-[160px] sm:col-span-2 sm:row-span-1 border border-hairline group">
              <div className="space-y-2 max-w-[180px] flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-prius-black uppercase tracking-tight">Gastronomía</h3>
                  <p className="text-[11px] text-prius-black/60 leading-relaxed">
                    Propuesta gastronomía exclusiva con servicio directo a tu carpa.
                  </p>
                </div>
                <div className="flex gap-1">
                  <span className="text-[8px] font-bold uppercase tracking-wider bg-prius-background px-2 py-0.5 rounded-full border border-hairline">Tragos</span>
                  <span className="text-[8px] font-bold uppercase tracking-wider bg-prius-background px-2 py-0.5 rounded-full border border-hairline">Pesca</span>
                </div>
              </div>

              {/* Mockup de Menú Flotante */}
              <div className="mt-3 sm:mt-0 bg-prius-background rounded-md p-3 border border-hairline w-full sm:max-w-[180px] self-center">
                <div className="flex items-center gap-1.5 mb-2 pb-1 border-b border-hairline">
                  <Utensils className="w-3 h-3 text-gold" />
                  <span className="text-[8px] font-bold uppercase tracking-wider text-prius-black/60">Recomendados</span>
                </div>
                <div className="space-y-1 text-[9px]">
                  <div className="flex justify-between">
                    <span>Rabas Crujientes</span>
                    <span className="font-bold text-gold">$14.500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aperol Spritz</span>
                    <span className="font-bold text-gold">$6.200</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}