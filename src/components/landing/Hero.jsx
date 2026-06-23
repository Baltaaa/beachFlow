import { ArrowRight } from 'lucide-react'
import Navbar from './Navbar'

export default function Hero() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative w-full bg-white flex flex-col justify-end p-4">
      
      {/* Contenedor Flotante de Proporción Cinematográfica con estructura idéntica a nor.ma */}
      <div className="relative mx-auto flex min-h-[84vh] w-full max-w-[1920px] flex-col overflow-hidden rounded-[28px] justify-between p-6 md:p-12">
        
        {/* Imagen de fondo premium de alta gama */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src="/images/prius1.webp" 
            alt="Experiencia Prius Playa Grande" 
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay de luz blanca suave para mayor viveza del fondo */}
          <div className="absolute inset-0 bg-white/[0.12] mix-blend-overlay" />
          {/* Gradiente oscuro inferior para un contraste de texto ideal */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        </div>

        {/* NAVBAR INTEGRADO: Ajustado perfectamente al mismo ancho que el contenido de abajo */}
        <div className="relative z-20 w-full max-w-[1320px] mx-auto">
          <Navbar />
        </div>

        {/* 2. SECCIÓN CENTRAL: Perfectamente centrada, simétrica, alineada de punta a punta con el Navbar */}
        <div className="relative z-10 w-full max-w-[1320px] mx-auto my-auto pt-6 md:pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Columna Izquierda: Etiquetas + Gran Titular */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex flex-wrap gap-2.5">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-[0.15em] font-display text-white">
                  Reserva sin cargo
                </div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-[0.15em] font-display text-white">
                  Temporada 2026/2027
                </div>
              </div>

              <h1 className="text-[34px] sm:text-[48px] md:text-[62px] lg:text-[66px] xl:text-[76px] font-bold leading-[1.02] tracking-tight uppercase font-display text-white select-none">
                TU DESCANSO <br />
                <span className="text-[#D4A017]">EN PRIUS.</span>
              </h1>
            </div>

            {/* Columna Derecha: Microdescripción + Botones perfectamente alineados */}
            <div className="lg:col-span-5 flex flex-col gap-6 lg:pl-12">
              <p className="text-white/90 text-sm sm:text-base leading-relaxed font-light max-w-md drop-shadow-sm">
                Un refugio exclusivo en Playa Grande. Costa, silencio y servicio impecable — todo en un lugar.
              </p>
              
              {/* Botones de acción alineados en fila y con formas ovaladas idénticas a NORMA */}
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => scrollToSection('contacto')}
                  className="inline-flex items-center justify-center bg-white hover:bg-white/90 text-black font-bold text-xs uppercase tracking-[0.15em] px-8 py-3.5 rounded-full transition-all duration-300 cursor-pointer shadow-lg"
                >
                  RESERVAR
                </button>
                <button 
                  onClick={() => scrollToSection('servicios')}
                  className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3.5 rounded-full font-semibold text-xs uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer"
                >
                  VER SERVICIOS
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 3. SECCIÓN INFERIOR: Pill de Novedad perfectamente centrada al pie */}
        <div className="relative z-10 flex justify-center w-full mt-4">
          <button
            onClick={() => scrollToSection('contacto')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all duration-300 border border-white/15 text-[10px] text-white tracking-[0.15em] uppercase font-display cursor-pointer"
          >
            <span className="bg-white text-black text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full">
              Nuevo
            </span>
            <span>Prius Club ya está disponible</span>
            <ArrowRight size={12} className="text-white ml-1" />
          </button>
        </div>

      </div>
    </section>
  )
}