import { Calendar, Users, ShieldCheck, Sparkles } from 'lucide-react'

export default function Events() {
  return (
    <section className="py-28 px-margin-mobile md:px-margin-desktop bg-white relative overflow-hidden" id="eventos">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Encabezado de Sección */}
        <div className="mb-20 text-center md:text-left">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-prius-black/40 bg-prius-background px-3 py-1.5 rounded-full border border-hairline">
            Espacios Exclusivos
          </span>
          <h2 className="text-[36px] md:text-[48px] font-normal tracking-tight mt-6 text-prius-black uppercase">
            Salón de Eventos <span className="text-gold italic font-medium">Prius</span>
          </h2>
          <p className="text-prius-black/60 mt-4 max-w-2xl text-sm md:text-base">
            La mítica esquina de Playa Grande se transforma. Lo que antes fue el icónico espacio de Antares, hoy renace como un salón de eventos premium totalmente privado y disponible exclusivamente bajo reserva previa.
          </p>
        </div>

        {/* Contenido Innovador: Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Columna Izquierda: Atributos y Propuesta */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold uppercase tracking-tight text-prius-black">
                Un nuevo concepto de celebración frente al mar
              </h3>
              <p className="text-prius-black/60 text-sm leading-relaxed">
                Diseñado para eventos corporativos, lanzamientos de marca y celebraciones sociales de alta gama. Nuestro salón combina la mejor vista panorámica de Playa Grande con una infraestructura acústica, gastronómica y de climatización de vanguardia.
              </p>
            </div>

            {/* Grid de Características */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-hairline">
              <div className="flex gap-3">
                <div className="p-2 bg-prius-background rounded-sm border border-hairline h-fit">
                  <Users className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-prius-black">Capacidad Flexible</h4>
                  <p className="text-[11px] text-prius-black/60 mt-1">Desde cocktails íntimos de 50 personas hasta banquetes de 200 invitados.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-prius-background rounded-sm border border-hairline h-fit">
                  <Calendar className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-prius-black">Reserva Exclusiva</h4>
                  <p className="text-[11px] text-prius-black/60 mt-1">Bloqueo total del salón para garantizar absoluta privacidad y seguridad.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-prius-background rounded-sm border border-hairline h-fit">
                  <Sparkles className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-prius-black">Catering de Autor</h4>
                  <p className="text-[11px] text-prius-black/60 mt-1">Menús personalizados diseñados por reconocidos chefs de la costa atlántica.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-prius-background rounded-sm border border-hairline h-fit">
                  <ShieldCheck className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-prius-black">Servicio Integral</h4>
                  <p className="text-[11px] text-prius-black/60 mt-1">Coordinador de evento dedicado, sonido profesional e iluminación ambiental.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-prius-black hover:bg-gold hover:text-prius-black text-white px-8 py-4 rounded-sm font-bold text-[11px] uppercase tracking-widest transition-all w-full sm:w-auto"
              >
                Reservar Fecha & Cotizar
              </button>
            </div>
          </div>

          {/* Columna Derecha: Composición de Fotos Innovadora (Bento-style visual) */}
          <div className="lg:col-span-7 grid grid-cols-12 gap-4 h-[480px]">
            {/* Foto Principal */}
            <div className="col-span-8 h-full rounded-lg overflow-hidden border border-hairline relative group">
              <img 
                src="/images/prius13.webp" 
                alt="Salón de Eventos Prius" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-sm border border-hairline">
                <span className="text-[9px] font-bold uppercase tracking-wider text-prius-black">Vista Principal del Salón</span>
              </div>
            </div>

            {/* Dos Fotos Secundarias Apiladas */}
            <div className="col-span-4 flex flex-col gap-4 h-full">
              <div className="h-1/2 rounded-lg overflow-hidden border border-hairline relative group">
                <img 
                  src="/images/prius14.webp" 
                  alt="Detalle Evento Nocturno" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-sm border border-hairline">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-prius-black">Ambientación</span>
                </div>
              </div>
              <div className="h-1/2 rounded-lg overflow-hidden border border-hairline relative group">
                <img 
                  src="/images/prius7.webp" 
                  alt="Cocktail frente al mar" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-sm border border-hairline">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-prius-black">Cocktails</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}