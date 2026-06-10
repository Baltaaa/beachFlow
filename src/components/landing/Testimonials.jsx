import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react'

const testimonials = [
  {
    name: "Valeria Moretto",
    text: "Balneario súper cómodo, con vestuarios y baños muy limpios e instalaciones impecables. La mayor y mejor inversión: su personal. Desde Marcelo en administración hasta Ciro, Pablo, Balta, Jony y la guardavidas, siempre con predisposición y una sonrisa. ¡Experiencia al cliente de otro nivel!",
    time: "Hace 4 meses",
    rating: 5,
    sub: "3 opiniones · 1 foto",
    avatarLetter: "V",
    avatarBg: "bg-blue-600 text-white",
    verified: true
  },
  {
    name: "Juan Ludueña",
    text: "Si venís a Mar del Plata y querés Playa Grande, no dudes: Prius es el parador ideal. Excelente servicio desde administración, Marcelo un genio, muy amable y respetuoso. Baños y duchas de lujo, y tienen Antares al frente. ¡Lo mejor!",
    time: "Hace 4 meses",
    rating: 5,
    sub: "12 opiniones",
    avatarLetter: "J",
    avatarBg: "bg-green-600 text-white",
    verified: true
  },
  {
    name: "Marisol Marchessi",
    text: "Somos clientes hace 5 años. Quiero destacar esta temporada 2026 la atención excelente de los carperos: Jony, Pablo, Baltazar, Ciro. ¡Gracias! Los esperamos de vuelta en carpa 33.",
    time: "Hace 5 meses",
    rating: 5,
    sub: "2 opiniones",
    avatarLetter: "M",
    avatarBg: "bg-red-500 text-white",
    verified: true
  },
  {
    name: "Gustavo Rodriguez",
    text: "Un lugar para disfrutar con una carpa cómoda, pileta y vestuarios limpios, y una buena atención. Un combo para sentirte cómodo y tranquilo, como deben ser las vacaciones.",
    time: "Hace 5 meses",
    rating: 5,
    sub: "Local Guide · 709 op.",
    avatarLetter: "G",
    avatarBg: "bg-purple-600 text-white",
    verified: true
  },
  {
    name: "Agus .-",
    text: "Veraneamos en el balneario hace años, nos encanta el ambiente familiar y la atención personalizada. Estuvimos el fin de semana del 20 de noviembre y encontramos espacios renovados que quedaron hermosos.",
    time: "Hace 6 meses",
    rating: 5,
    sub: "4 opiniones",
    avatarLetter: "A",
    avatarBg: "bg-amber-500 text-white",
    verified: true
  },
  {
    name: "María Yasmin Mancuso",
    text: "¡Me encantó! Alquilé una sombrilla por un día y la pasé genial. El personal es muy amable, especialmente Marcelo de administración. El balneario es práctico y limpio, lo recomiendo.",
    time: "Hace 3 meses",
    rating: 5,
    sub: "Local Guide · 34 op.",
    avatarLetter: "M",
    avatarBg: "bg-emerald-600 text-white",
    verified: true
  }
]

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  return (
    <section className="py-28 px-margin-mobile md:px-margin-desktop bg-prius-background border-t border-hairline">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Encabezado */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-hairline mb-6">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
              alt="Google Logo" 
              className="w-4 h-4" 
            />
            <span className="text-[11px] font-bold uppercase tracking-wider text-prius-black/60 font-display">
              Google Reviews
            </span>
          </div>
          <h2 className="text-[32px] md:text-[40px] font-normal uppercase tracking-tight mb-4 text-prius-black font-display">
            Opiniones de nuestros clientes
          </h2>
          <div className="flex justify-center items-center gap-3">
            <div className="flex text-gold">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" stroke="none" />)}
            </div>
            <span className="text-sm font-bold text-prius-black/80 font-display">
              4.8 / 5 basados en reseñas reales
            </span>
          </div>
        </div>

        {/* Vista Mobile: Slider de una reseña */}
        <div className="block md:hidden relative max-w-md mx-auto px-4">
          <div className="overflow-hidden relative min-h-[320px] flex items-center">
            <div className="w-full p-8 bg-white border border-hairline rounded-lg flex flex-col justify-between min-h-[280px] transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${testimonials[activeIndex].avatarBg}`}>
                      {testimonials[activeIndex].avatarLetter}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-prius-black flex items-center gap-1.5 font-display">
                        {testimonials[activeIndex].name}
                        {testimonials[activeIndex].verified && (
                          <span className="w-3.5 h-3.5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[8px]" title="Usuario verificado">
                            ✓
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-prius-black/40">{testimonials[activeIndex].sub} · {testimonials[activeIndex].time}</p>
                    </div>
                  </div>
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                    alt="Google" 
                    className="w-4 h-4 opacity-60" 
                  />
                </div>
                <div className="flex text-gold mb-4">
                  {[...Array(testimonials[activeIndex].rating)].map((_, idx) => (
                    <Star key={idx} size={14} fill="currentColor" stroke="none" />
                  ))}
                </div>
                <p className="text-prius-black/70 text-xs leading-relaxed italic">
                  "{testimonials[activeIndex].text}"
                </p>
              </div>
            </div>
          </div>

          {/* Controles del Slider Mobile */}
          <div className="flex justify-between items-center mt-6 px-2">
            <button 
              onClick={handlePrev}
              className="p-2.5 bg-white border border-hairline rounded-full hover:bg-prius-background transition-colors"
              aria-label="Anterior reseña"
            >
              <ChevronLeft size={16} className="text-prius-black" />
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${idx === activeIndex ? 'bg-gold w-4' : 'bg-prius-black/20'}`}
                  aria-label={`Ir a reseña ${idx + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={handleNext}
              className="p-2.5 bg-white border border-hairline rounded-full hover:bg-prius-background transition-colors"
              aria-label="Siguiente reseña"
            >
              <ChevronRight size={16} className="text-prius-black" />
            </button>
          </div>
        </div>

        {/* Vista Desktop: Grid de todas las reseñas */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1200px] mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="p-8 bg-white border border-hairline rounded-lg flex flex-col justify-between hover:border-gold transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${t.avatarBg}`}>
                      {t.avatarLetter}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-prius-black flex items-center gap-1.5 font-display">
                        {t.name}
                        {t.verified && (
                          <span className="w-3.5 h-3.5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[8px]" title="Usuario verificado">
                            ✓
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-prius-black/40">{t.sub} · {t.time}</p>
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
                <p className="text-prius-black/70 text-xs leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Botón Ver Más en Google */}
        <div className="text-center mt-16">
          <a 
            href="https://www.google.com/search?q=Balneario+Prius+Playa+Grande+Opiniones" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white hover:bg-prius-background text-prius-black border border-hairline px-8 py-4 rounded-sm font-extralight text-[11px] uppercase tracking-[0.2em] transition-premium font-display"
          >
            Ver más opiniones en Google
            <ArrowUpRight size={14} className="text-gold" />
          </a>
        </div>

      </div>
    </section>
  )
}