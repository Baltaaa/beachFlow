import { Umbrella, Shield, Waves, Heart, Sparkles, ArrowRight } from 'lucide-react'

const services = [
  {
    title: "Carpas & Sombrillas",
    subtitle: "Santuario de sombra",
    desc: "Refugio privado de diseño nórdico frente al Atlántico. Equipado con reposeras ergonómicas de alta gama y atención personalizada de carperos.",
    icon: Umbrella,
    img: "/images/prius6.webp"
  },
  {
    title: "Pileta & Solárium",
    subtitle: "Horizonte infinito",
    desc: "Espejo de agua climatizada diseñado para fundirse con el mar. Solárium de madera noble con servicio de coctelería premium.",
    icon: Waves,
    img: "/images/prius4.webp"
  },
  {
    title: "Masajes & Wellness",
    subtitle: "Bienestar de mar",
    desc: "Revitalice cuerpo y mente en nuestro oasis de relajación con terapeutas certificados y tratamientos de aromaterapia.",
    icon: Heart,
    img: "/images/prius3.webp"
  },
  {
    title: "Cabinas & Lockers",
    subtitle: "Privacidad resguardada",
    desc: "Vestuarios de diseño minimalista, duchas con control térmico y lockers de alta seguridad para su total tranquilidad.",
    icon: Shield,
    img: "/images/prius2.webp"
  },
  {
    title: "Recreación & Club",
    subtitle: "Experiencias que inspiran",
    desc: "Yoga al amanecer, clínicas de surf y talleres recreativos coordinados por profesionales para enriquecer su estadía.",
    icon: Sparkles,
    img: "/images/prius5.webp"
  }
]

export default function Services() {
  const scrollToContact = () => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="py-16 px-margin-mobile md:px-margin-desktop bg-prius-background border-t border-hairline" id="servicios">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Encabezado ultra-elegante y compacto */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-xl">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.3em] text-prius-black/40 block mb-1 font-display">
              Estilo de Vida Prius
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-prius-black uppercase font-display leading-none">
              Servicios de <span className="text-gold">Exclusividad</span> Absoluta
            </h2>
          </div>
          <p className="text-prius-black/60 text-xs max-w-xs leading-relaxed">
            Minimalismo estructural y confort absoluto diseñado al detalle para una experiencia costera única.
          </p>
        </div>

        {/* Grid Uniforme y Ultra-Compacto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {services.map((s, i) => (
            <div 
              key={i} 
              className="bg-white border border-hairline rounded-lg overflow-hidden flex flex-col justify-between group hover:border-gold transition-premium"
            >
              {/* Contenedor de Imagen Pequeña y Fija */}
              <div className="relative h-32 overflow-hidden bg-prius-background border-b border-hairline">
                <img 
                  src={s.img} 
                  alt={s.title} 
                  className="w-full h-full object-cover group-hover:scale-102 transition-premium-slow" 
                />
                <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md p-1.5 rounded-full border border-hairline z-10">
                  <s.icon className="w-3.5 h-3.5 text-prius-black" strokeWidth={1.5} />
                </div>
              </div>

              {/* Textos y Acción */}
              <div className="p-4 flex flex-col justify-between flex-1 bg-white">
                <div>
                  <span className="text-[8px] font-extrabold uppercase tracking-wider text-gold block mb-0.5 font-display">
                    {s.subtitle}
                  </span>
                  <h3 className="text-sm font-extrabold uppercase tracking-tight mb-1.5 text-prius-black font-display">
                    {s.title}
                  </h3>
                  <p className="text-prius-black/60 text-[11px] leading-relaxed mb-4 font-light line-clamp-3">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-hairline">
                  <button 
                    onClick={scrollToContact}
                    className="text-[8px] font-extrabold text-prius-black hover:text-gold transition-colors uppercase tracking-widest text-left flex items-center gap-1 group/btn font-display"
                  >
                    Consultar 
                    <ArrowRight size={8} className="transform group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}