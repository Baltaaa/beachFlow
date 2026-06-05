export default function Footer() {
  return (
    <footer className="bg-white px-margin-mobile md:px-margin-desktop py-20 border-t border-hairline">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12 border-b border-hairline pb-16">
        <div className="max-w-sm">
          <div className="flex items-center mb-6">
            <img alt="Logo Prius" className="h-28 md:h-32 w-auto object-contain" src="/logo-prius.png" />
          </div>
          <p className="text-prius-black/60 leading-relaxed text-sm">
            Excelencia costera en Playa Grande. Brindamos un refugio de paz y lujo en el punto más emblemático de Mar del Plata.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-16">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold uppercase text-gold tracking-widest">Navegación</span>
            <a href="#" className="text-sm hover:text-gold transition-colors">Inicio</a>
            <a href="#servicios" className="text-sm hover:text-gold transition-colors">Servicios</a>
            <a href="#galeria" className="text-sm hover:text-gold transition-colors">Galería</a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold uppercase text-gold tracking-widest">Redes</span>
            <a href="#" className="text-sm hover:text-gold transition-colors">Instagram</a>
            <a href="#" className="text-sm hover:text-gold transition-colors">Facebook</a>
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center pt-8 gap-4">
        <p className="text-[12px] text-prius-black/40">© 2025 Prius Playa Grande. Todos los derechos reservados.</p>
        <div className="text-center md:text-right">
          <p className="text-[10px] font-bold uppercase text-prius-black/40 mb-1">Ubicación</p>
          <p className="text-sm font-medium">Paseo Victoria Ocampo, Playa Grande</p>
        </div>
      </div>
    </footer>
  )
}