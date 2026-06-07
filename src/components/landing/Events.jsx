import { Calendar, Users, ShieldCheck, Sparkles, Phone } from 'lucide-react'

export default function Events() {
  const eventImages = [
    {
      src: "/images/event1.webp",
      alt: "Nuevo espacio de eventos Prius",
      title: "Nuevo Espacio"
    },
    {
      src: "/images/event2.webp",
      alt: "Cumpleaños, fiestas de 15, casamientos y corporativos",
      title: "Celebraciones"
    },
    {
      src: "/images/event3.webp",
      alt: "De día o de noche, celebra como siempre soñaste",
      title: "Experiencias"
    },
    {
      src: "/images/event4.webp",
      alt: "Contáctanos al 223 5765 482",
      title: "Contacto Directo"
    }
  ]

  return (
    <section className="py-28 px-margin-mobile md:px-margin-desktop bg-white relative overflow-hidden" id="eventos">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Encabezado de Sección */}
        <div className="mb-20 text-center md:text-left">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold bg-prius-black px-3 py-1.5 rounded-full">
            Eventos sociales y corporativos a medida, frente al mar
          </span>
          <h2 className="text-[36px] md:text-[48px] font-normal tracking-tight mt-6 text-prius-black uppercase">
            Tu espacio para eventos frente al mar
          </h2>
          <p className="text-prius-black/60 mt-4 max-w-3xl text-sm md:text-base">
            La mítica esquina de Playa Grande se transforma. Lo que antes fue el icónico espacio de Antares, hoy renace como un salón de eventos premium totalmente privado y disponible exclusivamente bajo reserva previa.
          </p>
        </div>

        {/* Grid de Imágenes de Eventos (Flyers Verticales Premium) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {eventImages.map((img, idx) => (
            <div 
              key={idx} 
              className="relative overflow-hidden rounded-lg border border-hairline group bg-prius-background aspect-[3/4] shadow-sm hover:border-gold transition-all duration-500"
            >
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-prius-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white text-xs font-bold uppercase tracking-widest bg-prius-black/80 px-3 py-1.5 rounded-sm border border-white/10">
                  {img.title}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Información y Atributos */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-12 border-t border-hairline">
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl font-bold uppercase tracking-tight text-prius-black">
              Planificá tu próximo acontecimiento con nosotros
            </h3>
            <p className="text-prius-black/60 text-sm leading-relaxed">
              Diseñado para eventos corporativos, lanzamientos de marca, casamientos, fiestas de 15 y cumpleaños. Nuestro salón combina la mejor vista panorámica de Playa Grande con una infraestructura acústica, gastronómica y de climatización de vanguardia.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://wa.me/542235765482" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gold hover:bg-gold-hover text-prius-black px-8 py-4 rounded-sm font-bold text-[11px] uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Contactar por WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex gap-3 p-4 bg-prius-background rounded-lg border border-hairline">
              <div className="p-2 bg-white rounded-sm border border-hairline h-fit">
                <Users className="w-4 h-4 text-gold" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-prius-black">Capacidad Flexible</h4>
                <p className="text-[11px] text-prius-black/60 mt-1">Desde cocktails íntimos de 50 personas hasta banquetes de 200 invitados.</p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-prius-background rounded-lg border border-hairline">
              <div className="p-2 bg-white rounded-sm border border-hairline h-fit">
                <Calendar className="w-4 h-4 text-gold" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-prius-black">Reserva Exclusiva</h4>
                <p className="text-[11px] text-prius-black/60 mt-1">Bloqueo total del salón para garantizar absoluta privacidad y seguridad.</p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-prius-background rounded-lg border border-hairline">
              <div className="p-2 bg-white rounded-sm border border-hairline h-fit">
                <Sparkles className="w-4 h-4 text-gold" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-prius-black">Catering de Autor</h4>
                <p className="text-[11px] text-prius-black/60 mt-1">Menús personalizados diseñados por reconocidos chefs de la costa atlántica.</p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-prius-background rounded-lg border border-hairline">
              <div className="p-2 bg-white rounded-sm border border-hairline h-fit">
                <ShieldCheck className="w-4 h-4 text-gold" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-prius-black">Servicio Integral</h4>
                <p className="text-[11px] text-prius-black/60 mt-1">Coordinador de evento dedicado, sonido profesional e iluminación ambiental.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}