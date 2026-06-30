import { ArrowRight, Phone, Sparkles } from 'lucide-react'

export default function Events() {
  return (
    <section className="py-28 px-margin-mobile md:px-margin-desktop bg-neutral-950 text-white relative overflow-hidden border-t border-white/5" id="eventos">
      {/* Sutiles destellos de luz de fondo para dar profundidad (estilo Hero) */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1140px] mx-auto relative z-10">
        
        {/* Encabezado Editorial Alineado */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-gold mb-4 backdrop-blur-md">
              <Sparkles size={10} className="text-gold" />
              Espacio Exclusivo Renovado
            </span>
            <h2 className="text-[44px] md:text-[56px] font-bold tracking-tight leading-none text-white font-display uppercase">
              El salón<span className="text-gold">.</span>
            </h2>
            <p className="text-white/60 text-sm md:text-base font-light leading-relaxed max-w-md mt-4">
              La mítica esquina de Playa Grande se transforma. Un espacio premium totalmente privado, climatizado y disponible exclusivamente bajo reserva previa.
            </p>
          </div>
          <div>
            <a 
              href="https://wa.me/542235765482" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-gold transition-colors uppercase tracking-widest font-display"
            >
              Ver disponibilidad 
              <ArrowRight size={14} className="text-gold" />
            </a>
          </div>
        </div>

        {/* Grilla Asimétrica Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* COLUMNA IZQUIERDA: El Espacio Destacado (Ancho: 7/12) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 group">
              <img 
                src="/images/event1.webp" 
                alt="Salón de Eventos Prius" 
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-premium-slow"
              />
              {/* Badges flotantes en Glassmorphism (idénticos al Hero) */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-white/10">
                  Exclusivo
                </span>
                <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-white/10">
                  Climatizado
                </span>
              </div>
            </div>

            <div className="px-1">
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white font-display mb-3 uppercase">
                ¿Qué es Prius Eventos?
              </h3>
              <p className="text-white/60 text-xs md:text-sm font-light leading-relaxed mb-6 max-w-xl">
                Lo que antes fue el icónico espacio de Antares, hoy renace como un salón de eventos de alta gama frente al mar. Diseñado con una arquitectura minimalista, acústica controlada y vistas privilegiadas para que tu celebración sea única.
              </p>
              <a 
                href="https://wa.me/542235765482" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-gold hover:text-white transition-colors uppercase tracking-widest font-display"
              >
                Reservar fecha <ArrowRight size={12} className="text-gold" />
              </a>
            </div>
          </div>

          {/* COLUMNA DERECHA: Feed de Experiencias (Ancho: 5/12) */}
          <div className="lg:col-span-5 flex flex-col">
            
            {/* Item 1 */}
            <div className="flex gap-5 pb-6 mb-6 border-b border-white/10 group">
              <div className="w-24 h-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                <img 
                  src="/images/event2.webp" 
                  alt="Casamientos y Fiestas de 15" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-premium"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gold font-display">Sociales</span>
                  <span className="text-[9px] text-white/40 font-light">Día & Noche</span>
                </div>
                <h4 className="text-sm md:text-base font-bold text-white leading-snug mb-1 font-display uppercase">
                  Casamientos y Fiestas de 15
                </h4>
                <p className="text-[11px] text-white/50 font-light line-clamp-2">
                  Celebraciones mágicas con el Atlántico como testigo y un servicio gastronómico de primer nivel.
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex gap-5 pb-6 mb-6 border-b border-white/10 group">
              <div className="w-24 h-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                <img 
                  src="/images/event3.webp" 
                  alt="Eventos Corporativos" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-premium"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gold font-display">Corporativos</span>
                  <span className="text-[9px] text-white/40 font-light">A medida</span>
                </div>
                <h4 className="text-sm md:text-base font-bold text-white leading-snug mb-1 font-display uppercase">
                  Lanzamientos y Cenas
                </h4>
                <p className="text-[11px] text-white/50 font-light line-clamp-2">
                  El entorno ideal para potenciar tu marca, realizar conferencias o agasajar a tus clientes.
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex gap-5 pb-6 mb-6 border-b border-white/10 group">
              <div className="w-24 h-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                <img 
                  src="/images/event4.webp" 
                  alt="Cumpleaños y Aniversarios" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-premium"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gold font-display">Celebraciones</span>
                  <span className="text-[9px] text-white/40 font-light">Privado</span>
                </div>
                <h4 className="text-sm md:text-base font-bold text-white leading-snug mb-1 font-display uppercase">
                  Cumpleaños y Aniversarios
                </h4>
                <p className="text-[11px] text-white/50 font-light line-clamp-2">
                  Festejá tus momentos especiales en un ambiente reservado con la mejor coctelería de la costa.
                </p>
              </div>
            </div>

            {/* CTA de Contacto Directo en Glassmorphism */}
            <div className="mt-2 p-5 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between gap-4 backdrop-blur-md">
              <div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-white/40 block mb-0.5 font-display">Contacto Directo</span>
                <a 
                  href="https://wa.me/542235765482" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-white hover:text-gold transition-colors flex items-center gap-1.5 font-display"
                >
                  <Phone size={12} className="text-gold" /> 223 5765 482
                </a>
              </div>
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

      </div>
    </section>
  )
}