import { ArrowUp, Instagram, MapPin, Mail, Phone } from 'lucide-react'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="w-full bg-neutral-950 text-white relative z-10 overflow-hidden">
      
      {/* ========================================================= */}
      {/* BANDA 1: Foto aérea ampliada sobre la que se superpone la tarjeta */}
      {/* ========================================================= */}
      <div className="relative w-full h-[360px] sm:h-[480px] md:h-[580px] overflow-hidden select-none">
        <img
          src="/images/bg-footer.webp"
          alt="Vista Aérea Playa Grande"
          loading="lazy"
          className="w-full h-full object-cover object-center"
        />
        
        {/* Degradado suave superior para transición impecable */}
        <div className="absolute top-0 inset-x-0 h-16 sm:h-24 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />

        {/* Degradado de transición inferior hacia el fondo oscuro del footer */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-950/40 to-neutral-950 pointer-events-none" />

        {/* Floating Glassmorphism "Volver Arriba" Button - Alineado al contenedor global */}
        <div className="absolute bottom-8 left-0 right-0 z-20 px-4 sm:px-8">
          <div className="mx-auto w-full max-w-[1140px] 2xl:max-w-[1600px] 3xl:max-w-[1800px] flex justify-end">
            <button 
              onClick={scrollToTop}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white bg-neutral-950/70 hover:bg-gold hover:text-prius-black border border-white/20 backdrop-blur-md px-5 py-2.5 rounded-full transition-all duration-300 shadow-2xl cursor-pointer group"
            >
              <span>Volver arriba</span> 
              <ArrowUp size={14} className="transform group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BANDA 2: Información de Pie de Página (Fondo Oscuro)       */}
      {/* ========================================================= */}
      <div className="bg-neutral-950 pt-4 pb-12 px-4 sm:px-8 relative z-10">
        <div className="mx-auto w-full max-w-[1140px] 2xl:max-w-[1600px] 3xl:max-w-[1800px]">
          
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 mb-12">
            
            {/* Columna 1: Logo, Descripción y Redes */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <img 
                  alt="Logo Prius" 
                  className="h-12 md:h-14 w-auto object-contain mb-4 filter brightness-100" 
                  src="/images/prius-logo-white.png" 
                />
                <p className="text-white/60 text-xs leading-relaxed font-light max-w-xs">
                  Excelencia costera en Playa Grande. Rediseñamos el concepto de confort y distinción frente al Atlántico.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                <a 
                  href="https://www.instagram.com/prius.playagrande/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 hover:border-gold/50 bg-white/5 text-[11px] text-white/80 hover:text-gold transition-colors"
                >
                  <Instagram size={13} />
                  <span>Instagram</span>
                </a>
                <a 
                  href="https://wa.me/542235765482" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 hover:border-gold/50 bg-white/5 text-[11px] text-white/80 hover:text-gold transition-colors"
                >
                  <Phone size={13} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Columna 2: Secciones */}
            <div className="flex flex-col space-y-3">
              <span className="text-[10px] font-bold uppercase text-gold tracking-[0.2em] font-display block mb-1">
                Secciones
              </span>
              <a href="#" className="text-xs text-white/70 hover:text-gold transition-colors font-light">Inicio</a>
              <a href="#servicios" className="text-xs text-white/70 hover:text-gold transition-colors font-light">Playa & Servicios</a>
              <a href="#eventos" className="text-xs text-white/70 hover:text-gold transition-colors font-light">Eventos Privados</a>
              <a href="#testimonios" className="text-xs text-white/70 hover:text-gold transition-colors font-light">Opiniones</a>
              <a href="#contacto" className="text-xs text-white/70 hover:text-gold transition-colors font-light">Cotizador & Reservas</a>
            </div>

            {/* Columna 3: Ubicación Oficial */}
            <div className="flex flex-col space-y-3">
              <span className="text-[10px] font-bold uppercase text-gold tracking-[0.2em] font-display block mb-1">
                Ubicación Oficial
              </span>
              <div className="flex items-start gap-2.5 text-xs text-white/80 font-light leading-relaxed">
                <MapPin size={15} className="text-gold shrink-0 mt-0.5" />
                <span>Balneario 7, Playa Grande, B7600 Mar del Plata</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-white/80 font-light">
                <Mail size={14} className="text-gold shrink-0" />
                <a href="mailto:reservas@priusplayagrande.com.ar" className="hover:text-gold transition-colors">
                  reservas@priusplayagrande.com.ar
                </a>
              </div>
            </div>

            {/* Columna 4: Horarios & Temporada */}
            <div className="flex flex-col space-y-3">
              <span className="text-[10px] font-bold uppercase text-gold tracking-[0.2em] font-display block mb-1">
                Temporada & Horarios
              </span>
              <p className="text-xs text-white/70 font-light leading-relaxed">
                Abierto diariamente durante la temporada estival.
              </p>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                <p className="text-gold font-semibold uppercase text-[10px]">Atención Administrativa</p>
                <p className="text-white/80 font-light">9:00 hs — 19:00 hs</p>
              </div>
            </div>

          </div>

          {/* Bottom Bar: Copyright & Credits */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
            <p className="font-light tracking-wide text-center sm:text-left">
              © 2026 Prius Playa Grande. Todos los derechos reservados.
            </p>

            <div className="flex items-center gap-1.5 font-light tracking-wider">
              <span>developed by</span>
              <a 
                href="https://www.instagram.com/baltabruschetti" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gold font-semibold tracking-widest text-xs hover:underline transition-all lowercase"
              >
                balta
              </a>
            </div>
          </div>

        </div>
      </div>

    </footer>
  )
}