export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-margin-mobile md:px-margin-desktop pt-32 pb-20 bg-prius-background">
      <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-8">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-prius-black/40 bg-white px-3 py-1.5 rounded-full border border-hairline">
            Playa Grande • Mar del Plata
          </span>
          <h1 className="text-[40px] sm:text-[52px] md:text-[64px] font-normal leading-[1.1] tracking-[-0.04em] text-prius-black">
            Experiencia premium en <span className="text-gold italic font-medium">Playa Grande</span>
          </h1>
          <p className="text-prius-black/60 text-base sm:text-lg max-w-lg leading-relaxed">
            Redefinimos el descanso costero con una propuesta arquitectónica minimalista y servicios de exclusividad absoluta en el punto más emblemático de la costa.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gold hover:bg-gold-hover px-8 py-4 rounded-sm font-bold text-[11px] uppercase tracking-widest transition-all border border-transparent"
            >
              Descubrir Prius
            </button>
            <button 
              onClick={() => document.getElementById('galeria')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-hairline bg-white hover:bg-prius-background px-8 py-4 rounded-sm font-bold text-[11px] uppercase tracking-widest transition-all"
            >
              Ver Galería
            </button>
          </div>
        </div>

        {/* Bento Grid de Imágenes Premium */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4 h-[450px] sm:h-[550px] md:h-[600px]">
          <div className="relative overflow-hidden rounded-lg border border-hairline col-span-1 row-span-2">
            <img
              alt="Ambiente Prius"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              src="/images/prius1.webp"
            />
          </div>
          <div className="relative overflow-hidden rounded-lg border border-hairline col-span-1 row-span-1">
            <img
              alt="Vista Mar Prius"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              src="/images/prius2.webp"
            />
          </div>
          <div className="relative overflow-hidden rounded-lg border border-hairline col-span-1 row-span-2 hidden sm:block">
            <img
              alt="Detalle Prius"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              src="/images/prius3.webp"
            />
          </div>
          <div className="relative overflow-hidden rounded-lg border border-hairline col-span-1 row-span-1">
            <img
              alt="Exterior Prius"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              src="/images/prius4.webp"
            />
          </div>
          <div className="relative overflow-hidden rounded-lg border border-hairline col-span-1 row-span-1">
            <img
              alt="Piscina Prius"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              src="/images/prius5.webp"
            />
          </div>
          <div className="relative overflow-hidden rounded-lg border border-hairline col-span-1 row-span-1 hidden sm:block">
            <img
              alt="Spa Prius"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              src="/images/prius6.webp"
            />
          </div>
        </div>
      </div>
    </section>
  )
}