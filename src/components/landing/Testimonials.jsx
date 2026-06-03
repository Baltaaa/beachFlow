import { Star } from 'lucide-react'

const testimonials = [
  {
    name: "Juan Sebastián G.",
    text: "Excelente servicio y atención. Sin duda la mejor playa de Mar del Plata por su exclusividad, diseño minimalista y la tranquilidad que se respira.",
    time: "Hace 2 semanas",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    verified: true
  },
  {
    name: "María Andrea L.",
    text: "Instalaciones de primer nivel. El spa es un sueño y la piscina climatizada tiene una vista increíble al mar. Muy recomendado para ir en familia.",
    time: "Hace 1 mes",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    verified: true
  },
  {
    name: "Ricardo C.",
    text: "Arquitectura minimalista que respeta el entorno. Un refugio de paz total en medio de la ciudad. La atención de los carperos es impecable.",
    time: "Hace 3 semanas",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    verified: true
  }
]

export default function Testimonials() {
  return (
    <section className="py-28 px-margin-mobile md:px-margin-desktop bg-prius-background">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-hairline mb-6">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
              alt="Google Logo" 
              className="w-4 h-4" 
            />
            <span className="text-[11px] font-bold uppercase tracking-wider text-prius-black/60">
              Google Reviews
            </span>
          </div>
          <h2 className="text-[32px] md:text-[40px] font-normal uppercase tracking-tight mb-4 text-prius-black">
            Opiniones de nuestros clientes
          </h2>
          <div className="flex justify-center items-center gap-3">
            <div className="flex text-gold">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" stroke="none" />)}
            </div>
            <span className="text-sm font-bold text-prius-black/80">
              4.9 / 5 basados en 542 reseñas
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="p-8 bg-white border border-hairline rounded-lg flex flex-col justify-between hover:border-gold transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <img 
                      src={t.avatar} 
                      alt={t.name} 
                      className="w-10 h-10 rounded-full object-cover border border-hairline" 
                    />
                    <div>
                      <h4 className="text-sm font-bold text-prius-black flex items-center gap-1.5">
                        {t.name}
                        {t.verified && (
                          <span className="w-3.5 h-3.5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[8px]" title="Usuario verificado">
                            ✓
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-prius-black/40">{t.time}</p>
                    </div>
                  </div>
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                    alt="Google" 
                    className="w-4 h-4 opacity-60" 
                  />
                </div>
                <div className="flex text-gold mb-4">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} size={14} fill="currentColor" stroke="none" />
                  ))}
                </div>
                <p className="text-prius-black/70 text-sm leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}