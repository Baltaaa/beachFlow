import { Umbrella, Home, Shield, Waves, Trophy, Calendar, MessageCircle, Sun } from 'lucide-react'

const services = [
  {
    title: "Carpas y Sombrillas",
    desc: "Espacios de sombra premium con diseño minimalista. Cada unidad está pensada para tu comodidad total, con mobiliario ergonómico y atención personalizada 24hs.",
    icon: Umbrella,
    img: "/images/prius1.webp"
  },
  {
    title: "Cabinas y Lockers",
    desc: "Espacios privados para tu descanso y almacenamiento seguro. Cabinas climatizadas y lockers de alta seguridad para tu comodidad absoluta.",
    icon: Shield,
    img: "/images/prius2.webp"
  },
  {
    title: "Masajes Terapéuticos",
    desc: "Experiencias de relajación total con nuestros expertos. Masajes de punta, duchas de vapor y tratamientos de bienestar diseñados para tu recuperación.",
    icon: MessageCircle,
    img: "/images/prius3.webp"
  },
  {
    title: "Pileta con Solarium",
    desc: "Piscina climatizada con solarium privado. Acceso exclusivo con toallas de alta gama y zona de relax con sombreado selectivo.",
    icon: Waves,
    img: "/images/prius4.webp"
  },
  {
    title: "Recreación y Actividades",
    desc: "Programación diaria de actividades recreativas. Deporte, cultura y entretenimiento para toda la familia con coordinadores certificados.",
    icon: Trophy,
    img: "/images/prius5.webp"
  }
]

export default function Services() {
  return (
    <section className="py-28 px-margin-mobile md:px-margin-desktop bg-prius-background" id="servicios">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-20 text-center md:text-left">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold bg-prius-black px-3 py-1.5 rounded-full">
            Experiencias Únicas
          </span>
          <h2 className="text-[36px] md:text-[48px] font-normal tracking-tight mt-6 text-prius-black uppercase">
            Nuestras <span className="font-serif italic text-gold">Servicios</span>
          </h2>
          <p className="text-prius-black/60 mt-4 max-w-xl text-sm md:text-base mx-auto md:mx-0">
            Cada detalle está pensado para tu experiencia perfecta. Descanso, bienestar y diversión bajo el sol de Playa Grande.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {services.map((s, i) => (
            <div 
              key={i} 
              className="bg-white border border-hairline rounded-lg p-6 flex flex-col group hover:border-gold transition-all duration-300 transform hover:-translate-y-1"
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
              <h3 className="text-lg font-bold uppercase tracking-tight mb-3 text-prius-black font-display">{s.title}</h3>
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