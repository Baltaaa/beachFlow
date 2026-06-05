export default function Partners() {
  const partners = [
    { name: "BNA", logo: "/images/logoBNA.svg", className: "brightness-0" },
    { name: "HAWKS SEGUROS", logo: "/images/logoHawk.svg", className: "brightness-0" },
    { name: "SANCOR SEGUROS", logo: "/images/logoSancor.svg" },
    { name: "MEDIFE", logo: "/images/logoMedife.svg" }
  ]

  // Triplicamos los elementos para garantizar que el ancho del track supere cualquier resolución de pantalla
  const repeatedPartners = [...partners, ...partners, ...partners]
  
  return (
    <section className="py-16 bg-white border-y border-hairline overflow-hidden">
      <div className="px-margin-mobile md:px-margin-desktop mb-8 text-center md:text-left">
        <span className="text-[11px] font-bold uppercase text-prius-black/40 tracking-[0.25em]">
          Socios Estratégicos
        </span>
      </div>
      <div className="relative w-full overflow-hidden flex">
        {/* Contenedor principal de animación sin gaps externos */}
        <div className="flex shrink-0 animate-scroll grayscale opacity-40">
          
          {/* Track 1 */}
          <div className="flex items-center shrink-0">
            {repeatedPartners.map((partner, i) => (
              <div key={`t1-${i}`} className="w-28 md:w-44 h-10 md:h-14 flex items-center justify-center shrink-0 mr-16 md:mr-28">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className={`max-h-full max-w-full object-contain select-none pointer-events-none ${partner.className || ""}`}
                />
              </div>
            ))}
          </div>

          {/* Track 2 (Exactamente idéntico para el loop perfecto) */}
          <div className="flex items-center shrink-0" aria-hidden="true">
            {repeatedPartners.map((partner, i) => (
              <div key={`t2-${i}`} className="w-28 md:w-44 h-10 md:h-14 flex items-center justify-center shrink-0 mr-16 md:mr-28">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className={`max-h-full max-w-full object-contain select-none pointer-events-none ${partner.className || ""}`}
                />
              </div>
            ))}
          </div>

        </div>
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  )
}