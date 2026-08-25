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
                  <svg className="w-3.5 h-3.5 fill-[#25D366]" viewBox="0 0 24 24">
                    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.758.459 3.474 1.33 4.982L2 22l5.176-1.332c1.458.796 3.097 1.215 4.832 1.216h.004c5.507 0 9.99-4.479 9.99-9.985 0-2.667-1.039-5.176-2.927-7.062A9.927 9.927 0 0 0 12.012 2zm0 18.334h-.003c-1.488 0-2.947-.4-4.218-1.155l-.302-.18-3.132.806.835-3.042-.198-.312a8.318 8.318 0 0 1-1.272-4.464c0-4.587 3.733-8.318 8.322-8.318 2.222 0 4.312.866 5.882 2.436a8.27 8.27 0 0 1 2.433 5.883c0 4.588-3.733 8.318-8.322 8.318zm4.562-6.229c-.25-.125-1.48-.73-1.71-.813-.23-.083-.397-.125-.563.125-.166.25-.646.813-.791.979-.145.166-.291.187-.541.062-.25-.125-1.056-.39-2.012-1.242-.744-.663-1.247-1.482-1.393-1.732-.146-.25-.015-.385.11-.51.112-.112.25-.291.375-.437.125-.146.166-.25.25-.417.083-.166.042-.312-.021-.437-.062-.125-.563-1.354-.771-1.854-.203-.488-.41-.422-.563-.43-.145-.007-.312-.01-.479-.01-.167 0-.437.062-.666.312-.229.25-.875.854-.875 2.083 0 1.229.896 2.417 1.021 2.583.125.167 1.763 2.693 4.272 3.776.597.258 1.063.412 1.426.528.599.19 1.144.163 1.575.099.481-.072 1.48-.604 1.688-1.188.208-.583.208-1.083.146-1.188-.063-.104-.229-.166-.479-.291z" />
                  </svg>
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
              <a
                href="https://www.google.com/maps/place/?q=place_id:ChIJQaFra8rdhJURflMJm96GTPQ"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-xs text-white/80 font-light leading-relaxed hover:text-gold transition-colors"
              >
                <MapPin size={15} className="text-gold shrink-0 mt-0.5" />
                <span>Balneario 7, Playa Grande, B7600 Mar del Plata</span>
              </a>
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

              </p>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                <p className="text-gold font-semibold uppercase text-[10px]">Abierto todos los dias</p>
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