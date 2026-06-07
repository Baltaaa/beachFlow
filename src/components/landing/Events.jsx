import { Phone, ArrowRight } from 'lucide-react'

export default function Events() {
  return (
    <section className="py-28 px-margin-mobile md:px-margin-desktop bg-prius-background" id="eventos">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Contenedor Principal Bento Grid con Fondo Oscuro Premium */}
        <div className="bg-prius-black rounded-xl p-6 md:p-12 border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* COLUMNA IZQUIERDA (Ancho: 5/12) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Bloque de Texto (Top-Left) */}
            <div className="p-6 md:p-8 bg-white/5 rounded-lg border border-white/10 flex flex-col justify-center min-h-[220px]">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold mb-4 block">
                Eventos sociales y corporativos a medida
              </span>
              <h2 className="text-2xl md:text-3xl font-normal text-white uppercase tracking-tight leading-tight mb-4">
                Tu espacio para eventos <span className="text-gold italic">frente al mar</span>
              </h2>
              <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-6">
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
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              {/* Badge Blanco Flotante */}
              <div className="absolute bottom-6 left-6 bg-white p-4 rounded-sm border border-hairline max-w-[85%] shadow-lg">
                <h4 className="text-xs font-bold uppercase tracking-wider text-prius-black mb-1">Nuevo Espacio</h4>
                <p className="text-[10px] text-prius-black/60 leading-tight">Salón premium totalmente privado y climatizado.</p>
              </div>
            </div>

          </div>

          {/* COLUMNA DERECHA (Ancho: 7/12) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Tarjeta Ancha (Top-Right) */}
            <div className="relative overflow-hidden rounded-lg border border-white/10 group h-[240px] bg-white/5">
              <img 
                src="/images/event2.webp" 
                alt="Cumpleaños, fiestas de 15, casamientos y corporativos" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              {/* Badge Blanco Flotante */}
              <div className="absolute bottom-6 left-6 bg-white p-4 rounded-sm border border-hairline max-w-[85%] shadow-lg">
                <h4 className="text-xs font-bold uppercase tracking-wider text-prius-black mb-1">Celebraciones</h4>
                <p className="text-[10px] text-prius-black/60 leading-tight">Cumpleaños, fiestas de 15, casamientos y corporativos.</p>
              </div>
            </div>

            {/* Fila de Dos Tarjetas Medianas (Bottom-Right) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Tarjeta Mediana 1 */}
              <div className="relative overflow-hidden rounded-lg border border-white/10 group h-[280px] bg-white/5">
                <img 
                  src="/images/event3.webp" 
                  alt="De día o de noche, celebra como siempre soñaste" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                {/* Badge Blanco Flotante */}
                <div className="absolute bottom-6 left-6 bg-white p-4 rounded-sm border border-hairline max-w-[85%] shadow-lg">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-prius-black mb-1">Experiencias</h4>
                  <p className="text-[10px] text-prius-black/60 leading-tight">De día o de noche, celebra como siempre soñaste.</p>
                </div>
              </div>

              {/* Tarjeta Mediana 2 */}
              <div className="relative overflow-hidden rounded-lg border border-white/10 group h-[280px] bg-white/5">
                <img 
                  src="/images/event4.webp" 
                  alt="Contáctanos al 223 5765 482" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                {/* Badge Blanco Flotante */}
                <div className="absolute bottom-6 left-6 bg-white p-4 rounded-sm border border-hairline max-w-[85%] shadow-lg w-[calc(100%-48px)]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-prius-black mb-1">Contacto Directo</h4>
                  <a 
                    href="https://wa.me/542235765482" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-gold font-bold uppercase tracking-wider flex items-center gap-1 mt-1 hover:underline"
                  >
                    <Phone size={12} /> 223 5765 482
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