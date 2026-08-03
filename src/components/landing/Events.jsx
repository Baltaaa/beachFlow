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
      img: "/images/event1.png",
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

  const scrollToContact = () => {
    const element = document.getElementById('contacto')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <section className="min-h-screen flex flex-col justify-center pt-20 pb-24 3xl:pt-32 3xl:pb-36 px-margin-mobile md:px-margin-desktop bg-neutral-950 text-white relative overflow-hidden" id="eventos">
      
      <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-gold/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[160px] pointer-events-none z-0" />

      <div className="max-w-[1920px] 3xl:max-w-[2200px] mx-auto w-full relative z-10">
        <div className="max-w-[1240px] 3xl:max-w-[1800px] mx-auto flex flex-col gap-10 3xl:gap-16">
          
          <div className="text-center md:text-left">
            <span className="text-[9px] md:text-[10px] 3xl:text-xs font-bold uppercase tracking-[0.3em] text-gold block mb-1 font-display">
              Espacios Exclusivos
            </span>
            <h2 className="text-3xl md:text-5xl 3xl:text-7xl font-normal tracking-tight text-white uppercase font-display leading-tight">
              Eventos con <span className="text-gold font-bold">Sello Prius</span>
            </h2>
          </div>

          {/* HERO SALÓN CARD - Fotografía de fondo optimizada con alta luminosidad */}
          <div className="relative w-full min-h-[420px] sm:min-h-[480px] 3xl:min-h-[580px] rounded-3xl 3xl:rounded-[36px] overflow-hidden border border-gold/30 bg-neutral-900 group flex flex-col justify-between p-7 sm:p-12 3xl:p-20 shadow-2xl transition-all duration-500">
            
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img 
                src="/images/event1.png" 
                alt="Salón de Eventos Prius" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
              />
              {/* Degradados suaves para asegurar legibilidad manteniendo la fotografía totalmente visible */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-950/30 to-transparent" />
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 bg-neutral-950/70 border border-gold/40 px-3.5 py-1.5 3xl:px-6 3xl:py-2.5 rounded-full text-[9px] md:text-[10px] 3xl:text-xs font-bold uppercase tracking-wider text-gold backdrop-blur-md shadow-md">
                <Sparkles size={13} className="text-gold" strokeWidth={2.5} />
                Espacio Exclusivo Renovado
              </span>
              <span className="hidden sm:inline-block text-[10px] 3xl:text-xs uppercase tracking-widest text-white/80 font-display drop-shadow-sm">
                Playa Grande, Mar del Plata
              </span>
            </div>

            <div className="relative z-10 max-w-2xl my-6">
              <h2 className="text-[36px] sm:text-[52px] md:text-[62px] 3xl:text-[84px] font-bold tracking-tight leading-none text-white font-display uppercase drop-shadow-md mb-3">
                El Salón<span className="text-gold">.</span>
              </h2>
              <p className="text-white/95 text-xs sm:text-sm md:text-base 3xl:text-xl font-light leading-relaxed max-w-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                La mítica esquina de Playa Grande se transforma. Un espacio premium totalmente privado, climatizado y disponible exclusivamente bajo reserva previa frente al Atlántico.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-5 border-t border-white/20">
              <button 
                onClick={scrollToContact}
                className="bg-gold hover:bg-gold-hover text-prius-black text-xs 3xl:text-sm font-bold uppercase tracking-wider px-7 3xl:px-10 py-3.5 3xl:py-4 rounded-full transition-all duration-300 font-display shadow-lg shadow-gold/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Consultar Disponibilidad</span>
                <ArrowRight size={15} />
              </button>

              <a 
                href="https://wa.me/542235765482" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-neutral-950/60 hover:bg-neutral-950/80 text-white border border-white/30 px-6 3xl:px-9 py-3.5 3xl:py-4 rounded-full text-xs 3xl:text-sm font-semibold uppercase tracking-wider transition-all backdrop-blur-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone size={15} className="text-gold" />
                <span>WhatsApp Directo</span>
              </a>
            </div>
          </div>

          <div className="w-full h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent my-1" />

          {/* 3 CATEGORY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 3xl:gap-8">
            {eventTypes.map((event, idx) => (
              <div 
                key={idx}
                className="bg-neutral-900/90 border border-white/10 backdrop-blur-md rounded-2xl 3xl:rounded-3xl overflow-hidden group hover:border-gold/60 hover:shadow-xl hover:shadow-gold/5 transition-all duration-300 flex flex-col justify-between h-full"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950 border-b border-white/10">
                  <img 
                    src={event.img} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="bg-neutral-950/85 backdrop-blur-md text-gold text-[8px] 3xl:text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-gold/30">
                      {event.badge}
                    </span>
                  </div>
                </div>

                <div className="p-6 3xl:p-8 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[9px] 3xl:text-xs text-white/40 uppercase tracking-widest font-display mb-1 block">
                      {event.time}
                    </span>
                    <h3 className="text-base md:text-lg 3xl:text-xl font-bold text-white leading-snug mb-2 font-display uppercase">
                      {event.title}
                    </h3>
                    <p className="text-xs 3xl:text-sm text-white/70 font-light leading-relaxed">
                      {event.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={scrollToContact}
                      className="text-[10px] 3xl:text-xs font-bold text-gold hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1.5 font-display cursor-pointer"
                    >
                      <span>Cotizar evento</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}