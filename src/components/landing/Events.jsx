import { ArrowRight, Phone, Sparkles, Check } from 'lucide-react'

export default function Events() {
  const eventTypes = [
    {
      img: "/images/event2.webp",
      badge: "Sociales",
      time: "Día & Noche",
      title: "Casamientos y Fiestas de 15",
      desc: "Celebraciones mágicas con el Atlántico como testigo y un servicio gastronómico de primer nivel."
    },
    {
      img: "/images/event1.webp",
      badge: "Corporativos",
      time: "A medida",
      title: "Lanzamientos y Cenas",
      desc: "El entorno ideal para potenciar tu marca, realizar conferencias o agasajar a tus clientes."
    },
    {
      img: "/images/event4.webp",
      badge: "Celebraciones",
      time: "Privado",
      title: "Cumpleaños y Aniversarios",
      desc: "Festejá tus momentos especiales en un ambiente reservado con la mejor coctelería de la costa."
    }
  ]

  return (
    <section className="min-h-screen flex flex-col justify-center py-20 px-margin-mobile md:px-margin-desktop text-white relative overflow-hidden bg-gradient-to-b from-[#F9F9F9] via-[#69bad1] to-[#69bad1]" id="eventos">
      
      {/* Sutiles destellos de luz minimalistas */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-white/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-[1140px] mx-auto relative z-10 w-full flex flex-col gap-12">
        
        {/* HERO PRINCIPAL CENTRADO DE EVENTOS */}
        <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden border border-white/20 bg-neutral-950/60 backdrop-blur-md group flex flex-col justify-center items-center text-center p-6 sm:p-12 shadow-sm">
          {/* Imagen de fondo del Hero de Eventos */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/event1.webp" 
              alt="Salón de Eventos Prius" 
              className="w-full h-full object-cover group-hover:scale-[1.01] transition-premium-slow opacity-60"
            />
            {/* Gradientes oscuros para legibilidad superior */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/40 to-neutral-950/70" />
          </div>

          {/* Contenido flotante dentro del Hero */}
          <div className="relative z-10 max-w-2xl flex flex-col items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/25 px-3.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-gold mb-1 backdrop-blur-md">
              <Sparkles size={10} className="text-gold" strokeWidth={2.5} />
              Espacio Exclusivo Renovado
            </span>
            <h2 className="text-[36px] sm:text-[56px] md:text-[64px] font-bold tracking-tight leading-none text-white font-display uppercase drop-shadow-md">
              El salón<span className="text-gold">.</span>
            </h2>
            <p className="text-white/90 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-lg drop-shadow-sm text-balance">
              La mítica esquina de Playa Grande se transforma. Un espacio premium totalmente privado, climatizado y disponible exclusivamente bajo reserva previa frente al Atlántico.
            </p>
          </div>
        </div>

        {/* RECUADROS INFERIORES: Grilla de 3 Experiencias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {eventTypes.map((event, idx) => (
            <div 
              key={idx}
              className="bg-neutral-950/70 backdrop-blur-md border border-white/15 rounded-xl overflow-hidden group hover:border-gold/40 transition-premium flex flex-col h-full shadow-sm"
            >
              {/* Contenedor de Imagen */}
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950/30 border-b border-white/10">
                <img 
                  src={event.img} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-premium"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="bg-neutral-950/80 backdrop-blur-sm text-white text-[8px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/15">
                    {event.badge}
                  </span>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-[9px] text-white/50 uppercase tracking-widest font-display mb-1 block">
                    {event.time}
                  </span>
                  <h3 className="text-sm md:text-base font-bold text-white leading-snug mb-2 font-display uppercase">
                    {event.title}
                  </h3>
                  <p className="text-[11px] text-white/70 font-light leading-relaxed">
                    {event.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA DE CONTACTO DIRECTO INTEGRADO AL PIE */}
        <div className="p-5 bg-neutral-950/70 rounded-xl border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="p-2.5 bg-white/10 rounded-full border border-white/10 text-gold">
              <Phone size={14} />
            </div>
            <div>
              <span className="text-[8px] font-bold uppercase tracking-widest text-white/50 block mb-0.5 font-display">Contacto Directo</span>
              <a 
                href="https://wa.me/542235765482" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-white hover:text-gold transition-colors font-display"
              >
                +54 223 576 5482
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://wa.me/542235765482" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white hover:text-gold transition-colors uppercase tracking-widest font-display"
            >
              Consultar disponibilidad <ArrowRight size={12} className="text-gold" />
            </a>
            <a 
              href="https://wa.me/542235765482" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gold hover:bg-gold-hover text-prius-black text-[10px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition-colors font-display shadow-md"
            >
              Consultar
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}