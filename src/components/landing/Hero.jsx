import { Umbrella, ShieldCheck, Sparkles, Compass } from 'lucide-react'

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-margin-mobile md:px-margin-desktop pt-36 pb-20 bg-prius-background">
      <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-8">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-prius-black/40 bg-white px-3 py-1.5 rounded-full border border-hairline">
            Playa Grande • Mar del Plata
          </span>
          <h1 className="text-[40px] sm:text-[52px] md:text-[64px] font-normal leading-[1.1] tracking-[-0.04em] text-prius-black">
            Experiencia premium en <span className="text-gold italic font-medium">Playa Grande</span>
          </h1>
          <p className="text-prius-black/60 text-base sm:text-lg max-w-lg leading-relaxed">
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

        {/* Bento Grid de Experiencias Premium (Estilo de Cajas de Referencia) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Caja 1: Carpas Premium (Grande) */}
          <div className="bg-white border border-hairline rounded-xl p-6 flex flex-col justify-between h-[280px] relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-20 group-hover:opacity-30 transition-opacity">
              <img src="/images/prius3.webp" alt="Carpas" className="w-full h-full object-cover object-left" />
            </div>
            <div className="space-y-4 relative z-10">
              <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center border border-gold/20">
                <Umbrella className="w-5 h-5 text-prius-black" />
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-gold bg-prius-black px-2 py-1 rounded-full">Exclusivo</span>
                <h3 className="text-xl font-bold uppercase tracking-tight mt-2 text-prius-black">Carpas de Diseño</h3>
              </div>
              <p className="text-xs text-prius-black/60 max-w-[200px] leading-relaxed">
                Estructuras minimalistas con mobiliario premium y atención personalizada.
              </p>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-prius-black/40 group-hover:text-prius-black transition-colors">
              Capacidad 6 personas →
            </div>
          </div>

          {/* Caja 2: Seguridad & Privacidad */}
          <div className="bg-prius-black text-white border border-hairline rounded-xl p-6 flex flex-col justify-between h-[280px] relative overflow-hidden group">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
                <ShieldCheck className="w-5 h-5 text-gold" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-white">Privacidad Absoluta</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Acceso controlado, seguridad permanente y un entorno diseñado para tu tranquilidad total.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Monitoreo 24/7</span>
            </div>
          </div>

          {/* Caja 3: Spa & Wellness */}
          <div className="bg-white border border-hairline rounded-xl p-6 flex flex-col justify-between h-[240px] group">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center border border-gold/20">
                <Sparkles className="w-5 h-5 text-prius-black" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-prius-black">Spa & Bienestar</h3>
              <p className="text-xs text-prius-black/60 leading-relaxed">
                Saunas, masajes y circuito de aguas termales frente al mar.
              </p>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-gold">Membresías Disponibles</span>
          </div>

          {/* Caja 4: Ubicación Única */}
          <div className="bg-white border border-hairline rounded-xl p-6 flex flex-col justify-between h-[240px] relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 group-hover:scale-105 transition-transform duration-700">
              <img src="/images/prius1.webp" alt="Playa Grande" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-4 relative z-10">
              <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center border border-gold/20">
                <Compass className="w-5 h-5 text-prius-black" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-prius-black">Ubicación Premium</h3>
              <p className="text-xs text-prius-black/60 leading-relaxed">
                En el corazón de Playa Grande, con el mejor amanecer de la costa.
              </p>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-prius-black/40 relative z-10">Paseo Victoria Ocampo</span>
          </div>

        </div>
      </div>
    </section>
  )
}