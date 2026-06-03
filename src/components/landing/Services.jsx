import { Umbrella, Flower2, Waves, Trophy } from 'lucide-react'

const services = [
  {
    title: "Carpas Premium",
    desc: "Espacios de sombra premium con capacidad para 6 personas. Incluye mobiliario de diseño y atención personalizada.",
    icon: Umbrella,
    img: "/images/prius3.webp"
  },
  {
    title: "Spa & Bienestar",
    desc: "Circuito de aguas con saunas secos y húmedos, jacuzzi de hidromasaje y gabinetes de masajes terapéuticos.",
    icon: Flower2,
    img: "/images/prius4.webp"
  },
  {
    title: "Piscinas Exclusivas",
    desc: "Agua climatizada con vista panorámica. Sectores diferenciados para adultos y niños con seguridad permanente.",
    icon: Waves,
    img: "/images/prius5.webp"
  },
  {
    title: "Recreación & Deporte",
    desc: "Actividades deportivas, club de niños y eventos exclusivos durante toda la temporada de verano.",
    icon: Trophy,
    img: "/images/prius6.webp"
  }
]

export default function Services() {
  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop bg-prius-background" id="servicios">
      <div className="mb-16">
        <h2 className="text-[48px] font-normal tracking-tight mb-4">Nuestros Servicios</h2>
        <div className="h-1 w-24 bg-gold"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-hairline bg-white overflow-hidden">
        {services.map((s, i) => (
          <div key={i} className="p-10 border-r border-b border-hairline last:border-r-0 flex flex-col group hover:bg-prius-background transition-colors">
            <div className="mb-6 overflow-hidden rounded-sm aspect-video border border-hairline">
              <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <s.icon className="w-8 h-8 mb-6 text-prius-black" strokeWidth={1.5} />
            <h3 className="text-xl font-normal uppercase tracking-tighter mb-4">{s.title}</h3>
            <p className="text-prius-black/60 text-sm leading-relaxed mb-6 flex-grow">
              {s.desc}
            </p>
            <button className="text-[12px] font-medium text-prius-black opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
              Saber más →
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}