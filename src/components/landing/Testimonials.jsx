import { Star } from 'lucide-react'

const testimonials = [
  {
    name: "Juan Sebastián G.",
    text: "Excelente servicio y atención. Sin duda la mejor playa de Mar del Plata por su exclusividad y diseño.",
    initials: "JS"
  },
  {
    name: "María Andrea L.",
    text: "Instalaciones de primer nivel. El spa es un sueño y la piscina climatizada tiene una vista increíble.",
    initials: "MA"
  },
  {
    name: "Ricardo C.",
    text: "Arquitectura minimalista que respeta el entorno. Un refugio de paz total en medio de la ciudad.",
    initials: "RC"
  }
]

export default function Testimonials() {
  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop bg-white">
      <div className="text-center mb-16">
        <h2 className="text-[32px] font-normal uppercase tracking-tight mb-4">Lo que dicen nuestros clientes</h2>
        <div className="flex justify-center items-center gap-2">
          <div className="flex text-gold">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
          </div>
          <span className="text-[12px] font-medium text-prius-black/60 uppercase tracking-widest">
            4.9 / 5 basados en 500+ reseñas
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
        {testimonials.map((t, i) => (
          <div key={i} className="p-8 bg-prius-background border border-hairline rounded-lg">
            <p className="text-lg italic mb-6 leading-relaxed">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white border border-hairline flex items-center justify-center font-bold text-xs">
                {t.initials}
              </div>
              <span className="text-[12px] font-bold uppercase tracking-wider">{t.name}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}