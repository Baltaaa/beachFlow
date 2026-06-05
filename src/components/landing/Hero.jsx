import { 
  Umbrella, Sparkles, CreditCard, MessageSquare, 
  Utensils, Bell, Calendar, Check, Shield, Wifi, Coffee
} from 'lucide-react'

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-margin-mobile md:px-margin-desktop pt-36 pb-20 bg-prius-background">
      <div className="max-w-[1440px] mx-auto w-full flex flex-col gap-16">
        
        {/* Fila Superior: Título y Descripción */}
        <div className="max-w-3xl space-y-6">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-prius-black/40 bg-white px-3 py-1.5 rounded-full border border-hairline">
            Playa Grande • Mar del Plata
          </span>
          <h1 className="text-[44px] sm:text-[56px] md:text-[72px] font-normal leading-[1.05] tracking-[-0.04em] text-prius-black uppercase">
            Experiencia premium en <span className="text-gold italic font-medium">Playa Grande</span>
          </h1>
          <p className="text-prius-black/60 text-base sm:text-lg max-w-2xl leading-relaxed">
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

        {/* Bento Grid de Alta Fidelidad (Estructura idéntica a la referencia) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. CARPAS DE DISEÑO (Izquierda Alta - spans 2 rows en desktop) */}
          <div className="bg-[#F5F3F0] rounded-[32px] p-8 flex flex-col justify-between min-h-[500px] md:row-span-2 relative overflow-hidden border border-hairline group">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-prius-black tracking-tight">Carpas de Diseño</h3>
              <p className="text-xs text-prius-black/60 leading-relaxed max-w-xs">
                Estructuras minimalistas con mobiliario premium, reposeras de madera y atención personalizada de carperos.
              </p>
            </div>

            {/* Mockup de Tarjeta de Reserva Flotante */}
            <div className="my-8 relative z-10 bg-white rounded-2xl p-4 shadow-sm border border-hairline max-w-[260px] mx-auto transform group-hover:scale-105 transition-transform duration-500">
              <div className="rounded-xl overflow-hidden h-32 mb-3 relative">
                <img src="/images/prius3.webp" alt="Carpas" className="w-full h-full object-cover" />
                <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-[8px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border border-hairline">
                  Sector A • Fila 1
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-prius-black/40">Unidad Seleccionada</p>
                  <p className="text-xs font-bold text-prius-black">Carpa Premium #12</p>
                </div>
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-green-600" />
                </div>
              </div>
            </div>

            {/* Barra de Servicios Inferior */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-hairline flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-prius-black/60" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-prius-black/60">WiFi 5G</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-prius-black/60" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-prius-black/60">Seguridad</span>
              </div>
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-prius-black/60" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-prius-black/60">Bar</span>
              </div>
            </div>
          </div>

          {/* 2. SPA & WELLNESS (Derecha Superior Ancha - spans 2 columns en desktop) */}
          <div className="bg-[#FCECE7] rounded-[32px] p-8 flex flex-col md:flex-row justify-between min-h-[280px] md:col-span-2 relative overflow-hidden border border-hairline group">
            <div className="space-y-4 max-w-xs flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-prius-black tracking-tight">Spa & Bienestar</h3>
                <p className="text-xs text-prius-black/60 leading-relaxed mt-2">
                  Circuito de aguas termales, saunas secos y húmedos, jacuzzi de hidromasaje y masajes terapéuticos frente al mar.
                </p>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-prius-black/40">
                Membresías de Temporada Disponibles
              </span>
            </div>

            {/* Mockup de Calendario de Turnos Flotante */}
            <div className="mt-6 md:mt-0 bg-white rounded-2xl p-5 shadow-sm border border-hairline w-full max-w-[280px] self-center transform group-hover:translate-y-[-4px] transition-transform duration-500">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-hairline">
                <Calendar className="w-4 h-4 text-gold" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-prius-black/60">Reservar Turno Spa</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-prius-black/60">Servicio</span>
                  <span className="font-bold">Masaje Descontracturante</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-prius-black/60">Fecha</span>
                  <span className="font-bold">Sábado, 20 Ene</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-prius-black/60">Horario</span>
                  <span className="font-bold text-gold">17:00 HS</span>
                </div>
              </div>
              <button className="w-full mt-4 py-2 bg-prius-black text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-gold hover:text-prius-black transition-colors">
                Confirmar Reserva
              </button>
            </div>
          </div>

          {/* 3. MEMBRESÍA CLUB PRIUS (Centro Izquierda - spans 1 column) */}
          <div className="bg-[#E2EBE0] rounded-[32px] p-8 flex flex-col justify-between min-h-[240px] relative overflow-hidden border border-hairline group">
            {/* Tarjeta de Crédito Premium Flotante */}
            <div className="bg-prius-black text-white rounded-xl p-4 shadow-md border border-white/10 w-full max-w-[200px] mx-auto transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[8px] font-bold uppercase tracking-widest text-gold">Prius Club</span>
                <CreditCard className="w-4 h-4 text-gold" />
              </div>
              <p className="text-xs font-bold tracking-widest mb-1">GOLD MEMBER</p>
              <p className="text-[8px] opacity-40">Nº 2025 8842 1109</p>
            </div>

            <div className="space-y-2 mt-4">
              <h3 className="text-lg font-bold text-prius-black tracking-tight">Membresía Club</h3>
              <p className="text-xs text-prius-black/60 leading-relaxed">
                Acceso exclusivo a beneficios, descuentos en gastronomía y preventas de temporada.
              </p>
            </div>
          </div>

          {/* 4. CONSERJERÍA DIGITAL (Centro Derecha Alta - spans 1 column, spans 2 rows en desktop) */}
          <div className="bg-[#FDF3D7] rounded-[32px] p-8 flex flex-col justify-between min-h-[400px] md:row-span-2 relative overflow-hidden border border-hairline group">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-prius-black tracking-tight">Conserjería</h3>
              <p className="text-xs text-prius-black/60 leading-relaxed">
                Solicitá servicios, comida y asistencia directamente desde tu reposera con nuestra app exclusiva.
              </p>
            </div>

            {/* Mockup de Chat Flotante */}
            <div className="my-6 space-y-3 max-w-[240px] mx-auto">
              <div className="bg-white rounded-2xl p-3 shadow-sm border border-hairline transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-500">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-prius-black/40">Carpero Juan</span>
                </div>
                <p className="text-[11px] text-prius-black/80 leading-tight">Su sombrilla #5 ya está lista y acondicionada. ¡Que disfrute el día! ☀️</p>
              </div>

              <div className="bg-prius-black text-white rounded-2xl p-3 shadow-sm border border-white/10 transform translate-x-2 group-hover:translate-x-0 transition-transform duration-500">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-gold" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gold">Bar Prius</span>
                </div>
                <p className="text-[11px] text-white/90 leading-tight">Su pedido de tragos y rabas está en camino a la carpa. 🍹</p>
              </div>
            </div>

            <span className="text-[9px] font-bold uppercase tracking-widest text-prius-black/40">
              Atención en Carpa 10:00 a 19:00
            </span>
          </div>

          {/* 5. GASTRONOMÍA DE MAR (Abajo Izquierda Ancha - spans 2 columns en desktop) */}
          <div className="bg-[#FBE3D5] rounded-[32px] p-8 flex flex-col md:flex-row justify-between min-h-[280px] md:col-span-2 relative overflow-hidden border border-hairline group">
            <div className="space-y-4 max-w-xs flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-prius-black tracking-tight">Gastronomía</h3>
                <p className="text-xs text-prius-black/60 leading-relaxed mt-2">
                  Disfrutá de nuestra propuesta gastronómica exclusiva con servicio directo a tu carpa o en nuestro deck frente al mar.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wider bg-white px-2.5 py-1 rounded-full border border-hairline">Tragos de Autor</span>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-white px-2.5 py-1 rounded-full border border-hairline">Pesca del Día</span>
              </div>
            </div>

            {/* Mockup de Menú Flotante */}
            <div className="mt-6 md:mt-0 bg-white rounded-2xl p-4 shadow-sm border border-hairline w-full max-w-[240px] self-center transform group-hover:scale-105 transition-transform duration-500">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-hairline">
                <Utensils className="w-3.5 h-3.5 text-gold" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-prius-black/60">Recomendados del Chef</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-medium">Rabas Crujientes</span>
                  <span className="text-[10px] font-bold text-gold">$14.500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-medium">Aperol Spritz</span>
                  <span className="text-[10px] font-bold text-gold">$6.200</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-medium">Pesca del Día Grillada</span>
                  <span className="text-[10px] font-bold text-gold">$18.900</span>
                </div>
              </div>
            </div>
          </div>

          {/* 6. UBICACIÓN EXCLUSIVA (Abajo Derecha - spans 1 column) */}
          <div className="bg-[#E1ECF4] rounded-[32px] p-8 flex flex-col justify-between min-h-[240px] relative overflow-hidden border border-hairline group">
            {/* Mockup de Notificación de iPhone */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-sm border border-hairline w-full max-w-[220px] mx-auto transform group-hover:translate-y-[-4px] transition-transform duration-500">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Bell className="w-3 h-3 text-gold" />
                  <span className="text-[8px] font-bold uppercase tracking-wider text-prius-black/40">Prius App</span>
                </div>
                <span className="text-[8px] text-prius-black/40">Ahora</span>
              </div>
              <p className="text-[10px] font-bold text-prius-black">¡Tu carpa te está esperando! 🌊</p>
              <p className="text-[9px] text-prius-black/60 leading-tight mt-0.5">El clima en Playa Grande está ideal para disfrutar del mar.</p>
            </div>

            <div className="space-y-2 mt-4">
              <h3 className="text-lg font-bold text-prius-black tracking-tight">Ubicación Única</h3>
              <p className="text-xs text-prius-black/60 leading-relaxed">
                Ubicados en el corazón de Playa Grande, Paseo Victoria Ocampo.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}