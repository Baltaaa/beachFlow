export default function Hero() {
  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-20 bg-prius-background">
      <div className="max-w-[1440px] w-full grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
        <div className="md:col-span-6">
          <h1 className="text-[48px] md:text-[64px] font-normal leading-[1.1] tracking-[-0.04em] mb-6 max-w-xl">
            Experiencia premium en <span className="text-gold italic">Playa Grande</span>
          </h1>
          <p className="text-prius-black/60 text-lg max-w-lg mb-10 leading-relaxed">
            Redefinimos el descanso costero con una propuesta arquitectónica minimalista y servicios de exclusividad absoluta en el corazón de Mar del Plata.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-gold hover:bg-gold-hover px-8 py-4 rounded-sm font-medium text-[12px] uppercase tracking-widest transition-all">
              Descubrir Prius
            </button>
            <button className="border border-hairline bg-white hover:bg-prius-background px-8 py-4 rounded-sm font-medium text-[12px] uppercase tracking-widest transition-all">
              Ver Galería
            </button>
          </div>
        </div>
        <div className="md:col-span-6 grid grid-cols-2 gap-4 h-[500px] mt-12 md:mt-0">
          <div className="relative overflow-hidden rounded-lg border border-hairline">
            <img 
              alt="Ambiente Prius" 
              className="w-full h-full object-cover" 
              src="/images/prius1.webp" 
            />
          </div>
          <div className="relative overflow-hidden rounded-lg border border-hairline mt-12">
            <img 
              alt="Vista Mar Prius" 
              className="w-full h-full object-cover" 
              src="/images/prius2.webp" 
            />
          </div>
        </div>
      </div>
    </section>
  )
}