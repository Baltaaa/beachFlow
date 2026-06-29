import { Phone, ArrowRight } from 'lucide-react'

export default function Events() {
  return (
    <section className="py-20 px-margin-mobile md:px-margin-desktop bg-[#F5F5F3] text-prius-black relative overflow-hidden" id="eventos">
      {/* Elemento decorativo de fondo sutil */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1440px] mx-auto">
        
        {/* Estructura Bento Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* COLUMNA IZQUIERDA (Ancho: 5/12) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Bloque de Texto (Top-Left) - Sin bordes ni fondo, integrado como titular */}
            <div className="flex flex-col justify-center min-h-[220px] py-2">
              <span className="text-[9px] font-normal uppercase tracking-[0.25em] text-gold mb-3 block font-display">
                Eventos sociales y corporativos a medida
              </span>
              <h2 className="text-2xl md:text-3xl font-normal uppercase tracking-tight leading-tight mb-3 font-display text-prius-black">
                Tu espacio para eventos en <span className="text-gold">Prius</span>
              </h2>
              <p className="text-prius-black/60 text-xs leading-relaxed mb-6 font-light">
                La mítica esquina de Playa Grande se transforma. Lo que antes fue el icónico espacio de Antares, hoy renace como un salón de eventos premium totalmente privado y disponible exclusivamente bajo reserva previa.
              </p>
              <a 
                href="https://wa.me/542235765482" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-medium text-gold hover:text-prius-black transition-colors uppercase tracking-widest text-left font-display"
              >
                Consultar fechas disponibles <ArrowRight size={12} />
              </a>
            </div>

            {/* Tarjeta Grande (Bottom-Left) */}
            <div className="relative overflow-hidden rounded-lg border border-hairline group aspect-[16/10] lg:h-[260px] bg-white">
              <img 
                src="/images/event1.webp" 
                alt="Nuevo espacio de eventos Prius" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay de texto integrado y minimalista */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                <span className="text-[8px] font-normal uppercase tracking-widest text-gold mb-0.5 font-display">Salón Principal</span>
                <h4 className="text-xs font-extralight uppercase tracking-tight font-display text-white">Nuevo Espacio Climatizado</h4>
              </div>
            </div>

          </div>

          {/* COLUMNA DERECHA (Ancho: 7/12) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Tarjeta Ancha (Top-Right) */}
            <div className="relative overflow-hidden rounded-lg border border-hairline group h-[200px] bg-white">
              <img 
                src="/images/event2.webp" 
                alt="Cumpleaños, fiestas de 15, casamientos y corporativos" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay de texto integrado y minimalista */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                <span className="text-[8px] font-normal uppercase tracking-widest text-gold mb-0.5 font-display">Celebraciones</span>
                <h4 className="text-xs font-extralight uppercase tracking-tight font-display text-white">Cumpleaños, Fiestas de 15 y Casamientos</h4>
              </div>
            </div>

            {/* Fila de Dos Tarjetas Medianas (Bottom-Right) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Tarjeta Mediana 1 */}
              <div className="relative overflow-hidden rounded-lg border border-hairline group h-[220px] bg-white">
                <img 
                  src="/images/event3.webp" 
                  alt="De día o de noche, celebra como siempre soñaste" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Overlay de texto integrado y minimalista */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                  <span className="text-[8px] font-normal uppercase tracking-widest text-gold mb-0.5 font-display">Experiencias</span>
                  <h4 className="text-xs font-extralight uppercase tracking-tight font-display text-white">Celebraciones de Día y Noche</h4>
                </div>
              </div>

              {/* Tarjeta Mediana 2 */}
              <div className="relative overflow-hidden rounded-lg border border-hairline group h-[220px] bg-white">
                <img 
                  src="/images/event4.webp" 
                  alt="Contáctanos al 223 5765 482" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Overlay de texto integrado y minimalista */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                  <span className="text-[8px] font-normal uppercase tracking-widest text-gold mb-0.5 font-display">Contacto Directo</span>
                  <a 
                    href="https://wa.me/542235765482" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-extralight uppercase tracking-tight flex items-center gap-1.5 text-white hover:text-gold transition-colors font-display"
                  >
                    <Phone size={12} className="text-gold" /> 223 5765 482
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