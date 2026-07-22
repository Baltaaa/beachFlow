import { ArrowRight, Phone, Sparkles } from 'lucide-react'

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
    <section className="min-h-screen flex flex-col justify-center py-20 px-margin-mobile md:px-margin-desktop bg-white relative overflow-hidden border-t border-hairline" id="eventos">
      
      {/* Sutiles destellos de luz dorada de fondo para el contraste de marca */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-[1140px] mx-auto relative z-10 w-full flex flex-col gap-12">
        
        {/* Encabezado de Sección */}
        <div className="text-center md:text-left">
          <span className="text-[9px] font-normal uppercase tracking-[0.3em] text-prius-black/40 block mb-1 font-display">
            Espacios Exclusivos
          </span>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-prius-black uppercase font-display leading-none">
            Eventos con <span className="text-gold">Sello Prius</span>
          </h2>
        </div>

        {/* HERO PRINCIPAL CENTRADO DE EVENTOS */}
        <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden border border-hairline bg-neutral-950 group flex flex-col justify-center items-center text-center p-6 sm:p-12 shadow-sm">
          {/* Imagen de fondo del Hero de Eventos */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/event1.webp" 
              alt="Salón de Eventos Prius" 
              className="w-full h-full object-cover group-hover:scale-[1.01] transition-premium-slow opacity-50"
            />
            {/* Gradientes oscuros para legibilidad superior */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-neutral-950/70" />
          </div>

          {/* Contenido flotante dentro del Hero */}
          <div className="relative z-10 max-w-2xl flex flex-col items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-gold mb-1 backdrop-blur-md">
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

        {/* RECUADROS INFERIORES: Grilla de 3 Experiencias con fondo estilo Header Fixed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {eventTypes.map((event, idx) => (
            <div 
              key={idx}
              className="bg-white/90 border border-neutral-200/40 backdrop-blur-md shadow-sm rounded-xl overflow-hidden group hover:border-gold transition-premium flex flex-col h-full"
            >
              {/* Contenedor de Imagen */}
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 border-b border-hairline">
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
                  <span className="text-[9px] text-prius-black/40 uppercase tracking-widest font-display mb-1 block">
                    {event.time}
                  </span>
                  <h3 className="text-sm md:text-base font-bold text-prius-black leading-snug mb-2 font-display uppercase">
                    {event.title}
                  </h3>
                  <p className="text-[11px] text-prius-black/70 font-light leading-relaxed">
                    {event.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA DE CONTACTO DIRECTO INTEGRADO AL PIE con fondo estilo Header Fixed */}
        <div className="p-5 bg-white/90 border border-neutral-200/40 backdrop-blur-md shadow-sm rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="p-2.5 bg-gold/10 rounded-full border border-gold/20 text-gold">
              <Phone size={14} />
            </div>
            <div>
              <span className="text-[8px] font-bold uppercase tracking-widest text-prius-black/40 block mb-0.5 font-display">Contacto Directo</span>
              <a 
                href="https://wa.me/542235765482" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-prius-black hover:text-gold transition-colors font-display"
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
              className="inline-flex items-center gap-1.5 text-[10px] font-bold text-prius-black hover:text-gold transition-colors uppercase tracking-widest font-display"
            >
              Consultar disponibilidad <ArrowRight size={12} className="text-gold" />
            </a>
            <a 
              href="https://wa.me/542235765482" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gold hover:bg-gold-hover text-prius-black text-[10px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition-colors font-display shadow-sm"
            >
              Consultar
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}