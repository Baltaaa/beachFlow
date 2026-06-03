import { Umbrella, Flower2, Waves, Trophy } from 'lucide-react'

const services = [
  {
    title: "Carpas Premium",
    desc: "Espacios de sombra premium con capacidad para 6 personas. Incluye mobiliario de diseño, reposeras de madera y atención personalizada de carperos.",
    icon: Umbrella,
    img: "/images/prius3.webp"
  },
  {
    title: "Spa & Bienestar",
    desc: "Circuito de aguas termales con saunas secos y húmedos, jacuzzi de hidromasaje, salas de relajación y gabinetes de masajes terapéuticos.",
    icon: Flower2,
    img: "/images/prius4.webp"
  },
  {
    title: "Piscinas Exclusivas",
    desc: "Piscina climatizada con vista panorámica al mar. Sectores diferenciados para adultos y niños con servicio de bar y seguridad permanente.",
    icon: Waves,
    img: "/images/prius5.webp"
  },
  {
    title: "Recreación & Deporte",
    desc: "Actividades deportivas diarias, club de niños con coordinadores especializados, gimnasio equipado y eventos exclusivos durante toda la temporada.",
    icon: Trophy,
    img: "/images/prius6.webp"
  }
]

export default function Services() {
  return (
    <section className="py-28 px-margin-mobile md:px-margin-desktop bg-prius-background" id="servicios">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-20 text-center md:text-left">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold bg-prius-black px-3 py-1.5 rounded-full">
            Servicios Exclusivos
          </span>
          <h2 className="text-[36px] md:text-[48px] font-normal tracking-tight mt-6 text-prius-black uppercase">
            Nuestra Propuesta de Costa
          </h2>
          <p className="text-prius-black/60 mt-4 max-w-xl text-sm md:text-base">
            Disfrutá de instalaciones diseñadas bajo un concepto de minimalismo estructural y confort absoluto.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <div 
              key={i} 
              className="bg-white border border-hairline rounded-lg p-8 flex flex-col group hover:border-gold transition-all duration-300"
            >
              <div className="mb-6 overflow-hidden rounded-md aspect-[4/3] border border-hairline relative">
                <img 
                  src={s.img} 
                  alt={s.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full border border-hairline">
                  <s.icon className="w-5 h-5 text-prius-black" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight mb-3 text-prius-black">{s.title}</h3>
              <p className="text-prius-black/60 text-xs md:text-sm leading-relaxed mb-6 flex-grow">
                {s.desc}
              </p>
              <button 
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[11px] font-bold text-prius-black hover:text-gold transition-colors uppercase tracking-widest text-left flex items-center gap-2"
              >
                Consultar Disponibilidad →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}