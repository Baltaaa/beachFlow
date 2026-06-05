export default function Partners() {
  const partners = [
    { name: "BNA", logo: "/images/logoBNA.svg", className: "brightness-0" },
    { name: "HAWKS SEGUROS", logo: "/images/logoHawk.svg", className: "brightness-0" },
    { name: "SANCOR SEGUROS", logo: "/images/logoSancor.svg" },
    { name: "MEDIFE", logo: "/images/logoMedife.svg" }
  ]
  
  return (
    <section className="py-16 bg-white border-y border-hairline overflow-hidden">
      <div className="px-margin-mobile md:px-margin-desktop mb-8 text-center md:text-left">
        <span className="text-[11px] font-bold uppercase text-prius-black/40 tracking-[0.25em]">
          Socios Estratégicos
        </span>
      </div>
      <div className="relative w-full overflow-hidden flex">
        {/* Contenedor 1 */}
        <div className="flex justify-center items-center min-w-full shrink-0 animate-scroll gap-16 md:gap-28 px-8 grayscale opacity-40">
          {partners.map((partner, i) => (
            <div key={`t1-${i}`} className="w-28 md:w-44 h-10 md:h-14 flex items-center justify-center shrink-0">
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className={`max-h-full max-w-full object-contain select-none pointer-events-none ${partner.className || ""}`}
              />
            </div>
          ))}
        </div>
        {/* Contenedor 2 (Idéntico para loop infinito perfecto) */}
        <div className="flex justify-center items-center min-w-full shrink-0 animate-scroll gap-16 md:gap-28 px-8 grayscale opacity-40" aria-hidden="true">
          {partners.map((partner, i) => (
            <div key={`t2-${i}`} className="w-28 md:w-44 h-10 md:h-14 flex items-center justify-center shrink-0">
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className={`max-h-full max-w-full object-contain select-none pointer-events-none ${partner.className || ""}`}
              />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
      `}</style>
    </section>
  )
}