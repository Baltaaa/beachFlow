import { Umbrella, Shield, Waves, Heart, Sparkles, ArrowRight } from 'lucide-react'

const services = [
  {
    title: "Carpas y Sombrillas Premium",
    subtitle: "El santuario de sombra perfecto",
    desc: "Un refugio privado de diseño nórdico frente al Atlántico. Equipado con reposeras ergonómicas de alta gama, mesas auxiliares de madera noble y textiles con protección UV certificada. Incluye atención personalizada de carperos y conserjería digital exclusiva directo a su sombra.",
    icon: Umbrella,
    img: "/images/prius6.webp",
    gridClass: "md:col-span-2 md:row-span-2 min-h-[360px]"
  },
  {
    title: "Pileta & Solárium Exclusivo",
    subtitle: "Horizonte infinito y relax templado",
    desc: "Un espejo de agua climatizada diseñado para fundirse con el mar. Relájese en nuestro solárium de madera noble con servicio de coctelería premium, reposeras acolchadas y toallas de algodón egipcio siempre a su disposición.",
    icon: Waves,
    img: "/images/prius4.webp",
    gridClass: "md:col-span-1 md:row-span-1 min-h-[220px]"
  },
  {
    title: "Masajes & Wellness",
    subtitle: "Bienestar frente al mar",
    desc: "Revitalice cuerpo y mente en nuestro oasis de relajación. Sesiones personalizadas con terapeutas certificados, masajes descontracturantes con aceites orgánicos y tratamientos de aromaterapia con el murmullo de las olas de fondo.",
    icon: Heart,
    img: "/images/prius3.webp",
    gridClass: "md:col-span-1 md:row-span-1 min-h-[220px]"
  },
  {
    title: "Cabinas Privadas & Lockers",
    subtitle: "Su privacidad totalmente resguardada",
    desc: "Vestuarios de diseño minimalista, duchas con control térmico y lockers de alta seguridad integrados. El espacio perfecto para cambiarse con absoluta comodidad, discreción y total tranquilidad durante su jornada de playa.",
    icon: Shield,
    img: "/images/prius2.webp",
    gridClass: "md:col-span-1 md:row-span-1 min-h-[220px]"
  },
  {
    title: "Recreación & Club de Mar",
    subtitle: "Experiencias que inspiran",
    desc: "Una agenda diaria diseñada para enriquecer su estadía. Desde yoga al amanecer y clínicas de surf hasta talleres recreativos para niños coordinados por profesionales bilingües. El equilibrio ideal entre descanso y entretenimiento selecto.",
    icon: Sparkles,
    img: "/images/prius5.webp",
    gridClass: "md:col-span-2 md:row-span-1 min-h-[220px]"
  }
]

export default function Services() {
  const scrollToContact = () => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="py-20 px-margin-mobile md:px-margin-desktop bg-prius-background border-t border-hairline" id="servicios">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Encabezado ultra-elegante y depurado */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-prius-black/40 block mb-2 font-display">
              Estilo de Vida Prius
            </span>
            <h2 className="text-[32px] md:text-[44px] font-normal tracking-tight text-prius-black uppercase font-display leading-none">
              Servicios de <span className="text-gold italic font-serif">Exclusividad</span> Absoluta
            </h2>
          </div>
          <p className="text-prius-black/60 text-xs md:text-sm max-w-md leading-relaxed">
            Hemos redefinido la experiencia costera combinando el minimalismo estructural con una propuesta integral de confort, descanso y bienestar diseñado al detalle.
          </p>
        </div>

        {/* Bento Grid Asimétrico y Premium - Más compacto */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <div 
              key={i} 
              className={`bg-white border border-hairline rounded-lg overflow-hidden flex flex-col justify-between group hover:border-gold transition-premium ${s.gridClass}`}
            >
              {/* Contenedor de Imagen con Altura Reducida */}
              <div className="relative overflow-hidden aspect-[16/8] md:aspect-auto flex-1 max-h-[180px] md:max-h-none border-b border-hairline bg-prius-background">
                <img 
                  src={s.img} 
                  alt={s.title} 
                  className="w-full h-full object-cover group-hover:scale-102 transition-premium-slow" 
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-2 rounded-full border border-hairline z-10">
                  <s.icon className="w-3.5 h-3.5 text-prius-black" strokeWidth={1.5} />
                </div>
                
                {/* Gradiente sutil integrado para el Bento de mayor tamaño */}
                {s.gridClass.includes("md:row-span-2") && (
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60 pointer-events-none" />
                )}
              </div>

              {/* Textos y Acción */}
              <div className="p-5 md:p-6 flex flex-col justify-between bg-white">
                <div>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-gold block mb-1 font-display">
                    {s.subtitle}
                  </span>
                  <h3 className="text-base md:text-lg font-normal uppercase tracking-tight mb-2 text-prius-black font-display">
                    {s.title}
                  </h3>
                  <p className="text-prius-black/60 text-[11px] md:text-xs leading-relaxed mb-4 font-light">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-hairline flex justify-between items-center">
                  <button 
                    onClick={scrollToContact}
                    className="text-[9px] font-bold text-prius-black hover:text-gold transition-colors uppercase tracking-widest text-left flex items-center gap-1.5 group/btn font-display"
                  >
                    Consultar disponibilidad 
                    <ArrowRight size={10} className="transform group-hover/btn:translate-x-1 transition-transform" />
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