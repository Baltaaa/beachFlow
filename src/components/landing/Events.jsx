import { Phone, ArrowRight } from 'lucide-react'

export default function Events() {
  return (
    <section className="py-28 px-margin-mobile md:px-margin-desktop bg-prius-black text-white relative overflow-hidden" id="eventos">
      {/* Elemento decorativo de fondo sutil */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1440px] mx-auto">
        
        {/* Estructura Bento Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* COLUMNA IZQUIERDA (Ancho: 5/12) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Bloque de Texto (Top-Left) */}
            <div className="p-8 md:p-10 bg-white/[0.02] rounded-lg border border-white/10 flex flex-col justify-center min-h-[260px] backdrop-blur-sm">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold mb-4 block">
                Eventos sociales y corporativos a medida
              </span>
              <h2 className="text-3xl md:text-4xl font-normal uppercase tracking-tight leading-tight mb-4">
                Tu espacio para eventos <span className="text-gold italic">frente al mar</span>
              </h2>
              <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-8">
                La mítica esquina de Playa Grande se transforma. Lo que antes fue el icónico espacio de Antares, hoy renace como un salón de eventos premium totalmente privado y disponible exclusivamente bajo reserva previa.
              </p>
              <a 
                href="https://wa.me/542235765482" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[11px] font-bold text-gold hover:text-white transition-colors uppercase tracking-widest text-left"
              >
                Consultar fechas disponibles <ArrowRight size={14} />
              </a>
            </div>

            {/* Tarjeta Grande (Bottom-Left) */}
            <div className="relative overflow-hidden rounded-lg border border-white/10 group aspect-[4/3] lg:h-[340px] bg-white/5">
              <img 
                src="/images/event1.webp" 
                alt="Nuevo espacio de eventos Prius" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay de texto integrado y minimalista */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <span className="text-[9px] font-bold uppercase tracking-widest text-gold mb-1">Salón Principal</span>
                <h4 className="text-sm font-medium uppercase tracking-tight">Nuevo Espacio Climatizado</h4>
              </div>
            </div>

          </div>

          {/* COLUMNA DERECHA (Ancho: 7/12) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Tarjeta Ancha (Top-Right) */}
            <div className="relative overflow-hidden rounded-lg border border-white/10 group h-[260px] bg-white/5">
              <img 
                src="/images/event2.webp" 
                alt="Cumpleaños, fiestas de 15, casamientos y corporativos" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay de texto integrado y minimalista */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <span className="text-[9px] font-bold uppercase tracking-widest text-gold mb-1">Celebraciones</span>
                <h4 className="text-sm font-medium uppercase tracking-tight">Cumpleaños, Fiestas de 15 y Casamientos</h4>
              </div>
            </div>

            {/* Fila de Dos Tarjetas Medianas (Bottom-Right) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Tarjeta Mediana 1 */}
              <div className="relative overflow-hidden rounded-lg border border-white/10 group h-[300px] bg-white/5">
                <img 
                  src="/images/event3.webp" 
                  alt="De día o de noche, celebra como siempre soñaste" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Overlay de texto integrado y minimalista */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gold mb-1">Experiencias</span>
                  <h4 className="text-sm font-medium uppercase tracking-tight">Celebraciones de Día y Noche</h4>
                </div>
              </div>

              {/* Tarjeta Mediana 2 */}
              <div className="relative overflow-hidden rounded-lg border border-white/10 group h-[300px] bg-white/5">
                <img 
                  src="/images/event4.webp" 
                  alt="Contáctanos al 223 5765 482" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Overlay de texto integrado y minimalista */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gold mb-1">Contacto Directo</span>
                  <a 
                    href="https://wa.me/542235765482" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-medium uppercase tracking-tight flex items-center gap-1.5 hover:text-gold transition-colors"
                  >
                    <Phone size={14} className="text-gold" /> 223 5765 482
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}