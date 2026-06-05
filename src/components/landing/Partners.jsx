export default function Partners() {
  const partners = [
    { name: "BNA", logo: "/images/logoBNA.svg", className: "brightness-0" },
    { name: "HAWKS SEGUROS", logo: "/images/logoHawk.svg", className: "[clip-path:inset(0_15px_0_0)] pr-4" },
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
      <div className="relative w-full overflow-hidden">
        <div className="flex whitespace-nowrap animate-scroll">
          <div className="flex items-center gap-24 md:gap-36 px-12 grayscale opacity-40">
            {[...partners, ...partners, ...partners, ...partners, ...partners].map((partner, i) => (
              <img 
                key={i} 
                src={partner.logo} 
                alt={partner.name} 
                className={`h-12 md:h-16 w-auto object-contain select-none pointer-events-none ${partner.className || ""}`}
              />
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-scroll {
          animation: scroll 100s linear infinite;
          width: max-content;
          display: flex;
        }
      `}</style>
    </section>
  )
}