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
        <div className="flex justify-around items-center min-w-full shrink-0 animate-scroll gap-12 md:gap-24 px-6 grayscale opacity-40">
          {partners.map((partner, i) => (
            <img 
              key={`t1-${i}`} 
              src={partner.logo} 
              alt={partner.name} 
              className={`h-12 md:h-16 w-auto object-contain select-none pointer-events-none ${partner.className || ""}`}
            />
          ))}
        </div>
        {/* Contenedor 2 (Idéntico para loop infinito perfecto) */}
        <div className="flex justify-around items-center min-w-full shrink-0 animate-scroll gap-12 md:gap-24 px-6 grayscale opacity-40" aria-hidden="true">
          {partners.map((partner, i) => (
            <img 
              key={`t2-${i}`} 
              src={partner.logo} 
              alt={partner.name} 
              className={`h-12 md:h-16 w-auto object-contain select-none pointer-events-none ${partner.className || ""}`}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </section>
  )
}