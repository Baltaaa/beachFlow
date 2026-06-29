import { ArrowUp, Instagram, MapPin, Mail, Phone } from 'lucide-react'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-neutral-950 text-white relative overflow-hidden border-t border-white/5 pt-28 pb-12">
      {/* Elementos decorativos abstractos de fondo */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Marca de agua tipográfica gigante de fondo al estilo de alta costura */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.02] text-[18vw] font-bold tracking-widest text-white leading-none font-display uppercase">
        PRIUS
      </div>

      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
        
        {/* Fila Principal de Navegación y Datos */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 pb-20 border-b border-white/10">
          
          {/* Columna de Marca (Ancho 5/12) */}
          <div className="lg:col-span-5 flex flex-col justify-between min-h-[220px]">
            <div>
              <img 
                alt="Logo Prius" 
                className="h-16 md:h-20 w-auto object-contain mb-8 filter brightness-100" 
                src="/images/prius-logo-white.png" 
              />
              <p className="text-white/60 text-sm leading-relaxed max-w-sm font-light">
                Excelencia costera en Playa Grande. Rediseñamos el concepto de confort y distinción frente al Atlántico.
              </p>
            </div>

            {/* Redes Sociales en Formato Píldora Minimalista */}
            <div className="flex gap-3 mt-8">
              <a 
                href="https://www.instagram.com/prius.playagrande/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-gold/50 bg-white/5 text-xs text-white/80 hover:text-gold transition-premium"
              >
                <Instagram size={13} />
                <span>Instagram</span>
              </a>
              <a 
                href="https://wa.me/542235765482" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-gold/50 bg-white/5 text-xs text-white/80 hover:text-gold transition-premium"
              >
                <Phone size={13} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Enlaces de Navegación Rápida (Ancho 3/12) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <span className="text-[10px] font-bold uppercase text-gold tracking-[0.2em] font-display">
              Secciones
            </span>
            <div className="flex flex-col gap-3.5">
              <a href="#" className="text-sm text-white/70 hover:text-gold transition-colors font-light">Inicio</a>
              <a href="#servicios" className="text-sm text-white/70 hover:text-gold transition-colors font-light">Servicios</a>
              <a href="#eventos" className="text-sm text-white/70 hover:text-gold transition-colors font-light">Eventos Privados</a>
              <a href="#galeria" className="text-sm text-white/70 hover:text-gold transition-colors font-light">Galería Visual</a>
              <a href="#contacto" className="text-sm text-white/70 hover:text-gold transition-colors font-light">Contacto</a>
            </div>
          </div>

          {/* Ubicación y Datos Oficiales (Ancho 4/12) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <span className="text-[10px] font-bold uppercase text-gold tracking-[0.2em] font-display">
              Ubicación Oficial
            </span>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-gold shrink-0 mt-0.5" />
                <p className="text-sm text-white/80 font-light leading-relaxed">
                  Balneario 7, Playa Grande, B7600 Mar del Plata, Provincia de Buenos Aires
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Mail size={15} className="text-gold shrink-0" />
                <a href="mailto:info@priusplayagrande.com" className="text-sm text-white/70 hover:text-gold transition-colors font-light">
                  info@priusplayagrande.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Fila de Derechos, Firma y Volver Arriba */}
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-white/40 text-xs">
          <div>
            <p className="font-light tracking-wide text-center md:text-left">
              © 2026 Prius Playa Grande. Todos los derechos reservados.
            </p>
          </div>

          {/* Crédito: Developed by balta (en minúsculas, dorado, sin fondo ni bordes, con redirección a Instagram) */}
          <div className="flex items-center gap-1 font-light tracking-wider">
            <span>developed by</span>
            <a 
              href="https://www.instagram.com/baltabruschetti" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gold font-normal tracking-widest uppercase text-[11px] hover:underline transition-all font-display lowercase"
            >
              balta
            </a>
          </div>

          {/* Botón Volver Arriba */}
          <div>
            <button 
              onClick={scrollToTop}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white/70 hover:text-gold transition-premium font-display group bg-white/5 border border-white/10 hover:border-gold/30 px-4 py-2.5 rounded-full"
            >
              Volver arriba 
              <ArrowUp size={12} className="transform group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  )
}