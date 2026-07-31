export default function Partners() {
  const partners = [
    { name: "BNA", logo: "/images/logoBNA.svg", className: "brightness-0 opacity-80" },
    { name: "HAWK SEGUROS", logo: "/images/logoHawk.svg", className: "brightness-0 opacity-80" },
    { name: "SANCOR SEGUROS", logo: "/images/logoSancor.svg" },
    { name: "MEDIFE", logo: "/images/logoMedife.svg" }
  ]

  return (
    <section className="py-12 md:py-16 bg-white border-b border-hairline overflow-hidden select-none">
      <div className="max-w-[1920px] mx-auto px-margin-mobile md:px-margin-desktop mb-8">
        <div className="max-w-[1440px] mx-auto">
          <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-prius-black/40 block font-display">
            Socios Estratégicos
          </span>
        </div>
      </div>

      {/* Infinite marquee track */}
      <div className="relative w-full overflow-hidden flex">
        {/* Left & right fade gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-marquee grayscale opacity-60 hover:opacity-100 transition-opacity duration-300">
          {/* Duplicate set 1 */}
          <div className="flex items-center gap-12 md:gap-24 pr-12 md:pr-24">
            {partners.map((partner, i) => (
              <div key={`p1-${i}`} className="w-28 md:w-40 h-10 md:h-12 flex items-center justify-center shrink-0">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className={`max-h-full max-w-full object-contain pointer-events-none ${partner.className || ""}`}
                />
              </div>
            ))}
          </div>

          {/* Duplicate set 2 for seamless infinite slide */}
          <div className="flex items-center gap-12 md:gap-24 pr-12 md:pr-24" aria-hidden="true">
            {partners.map((partner, i) => (
              <div key={`p2-${i}`} className="w-28 md:w-40 h-10 md:h-12 flex items-center justify-center shrink-0">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className={`max-h-full max-w-full object-contain pointer-events-none ${partner.className || ""}`}
                />
              </div>
            ))}
          </div>

          {/* Duplicate set 3 for extra wide screens (4K) */}
          <div className="flex items-center gap-12 md:gap-24 pr-12 md:pr-24" aria-hidden="true">
            {partners.map((partner, i) => (
              <div key={`p3-${i}`} className="w-28 md:w-40 h-10 md:h-12 flex items-center justify-center shrink-0">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className={`max-h-full max-w-full object-contain pointer-events-none ${partner.className || ""}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        @media (min-width: 768px) {
          .animate-marquee {
            animation: marquee 45s linear infinite;
          }
        }
      `}</style>
    </section>
  )
}