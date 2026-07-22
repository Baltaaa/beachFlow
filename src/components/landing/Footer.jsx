import { ArrowUp, Instagram, MapPin, Mail, Phone } from 'lucide-react'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-neutral-950 text-white relative overflow-hidden min-h-screen flex flex-col justify-between pt-24 pb-12">
      {/* Imagen de fondo con colores vivos */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img 
          src="/images/bg-footer.webp" 
          alt="Fondo Costa" 
          className="w-full h-full object-cover opacity-90"
        />
        {/* Sutil overlay de mezcla */}
        <div className="absolute inset-0 bg-white/[0.02] mix-blend-overlay" />
        {/* Degradados en los extremos para suavizar la transición con las secciones adyacentes */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-neutral-950 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent" />
      </div>

      {/* Elementos decorativos abstractos de fondo */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[140px] pointer-events-none z-10" />
      <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none z-10" />

      {/* Contenedor de contenido principal */}
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop relative z-20 w-full my-auto flex flex-col justify-center gap-8">
        
        {/* Tarjeta Principal de Información (Vidrio Esmerilado) */}
        <div className="bg-neutral-950/75 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Columna de Marca (Ancho 5/12) */}
            <div className="lg:col-span-5 flex flex-col justify-between min-h-[200px]">
              <div>
                <img 
                  alt="Logo Prius" 
                  className="h-16 md:h-20 w-auto object-contain mb-6 filter brightness-100" 
                  src="/images/prius-logo-white.png" 
                />
                <p className="text-white/70 text-sm leading-relaxed max-w-sm font-light">
                  Excelencia costera en Playa Grande. Rediseñamos el concepto de confort y distinción frente al Atlántico.
                </p>
              </div>

              {/* Redes Sociales en Formato Píldora Minimalista */}
              <div className="flex flex-wrap gap-3 mt-6">
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
                <a href="#" className="text-sm text-white/80 hover:text-gold transition-colors font-light">Inicio</a>
                <a href="#servicios" className="text-sm text-white/80 hover:text-gold transition-colors font-light">Playa & Servicios</a>
                <a href="#eventos" className="text-sm text-white/80 hover:text-gold transition-colors font-light">Eventos Privados</a>
                <a href="#contacto" className="text-sm text-white/80 hover:text-gold transition-colors font-light">Contacto</a>
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
                  <p className="text-sm text-white/90 font-light leading-relaxed">
                    Balneario 7, Playa Grande, B7600 Mar del Plata, Provincia de Buenos Aires
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Mail size={15} className="text-gold shrink-0" />
                  <a href="mailto:reservas@priusplayagrande.com.ar" className="text-sm text-white/80 hover:text-gold transition-colors font-light">
                    reservas@priusplayagrande.com.ar
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Barra de Derechos, Firma y Volver Arriba (Vidrio Esmerilado) */}
        <div className="bg-neutral-950/75 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 text-white/60 text-xs shadow-lg">
          <div>
            <p className="font-light tracking-wide text-center md:text-left">
              © 2026 Prius Playa Grande. Todos los derechos reservados.
            </p>
          </div>

          {/* Crédito: Developed by balta */}
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
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white/80 hover:text-gold transition-premium font-display group bg-white/5 border border-white/10 hover:border-gold/30 px-4 py-2 rounded-full"
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