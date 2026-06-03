export default function Partners() {
  const partners = ["BBVA", "HAWKS SEGUROS", "SANCOR SEGUROS", "MEDIFE"]
  
  return (
    <section className="py-12 bg-white border-y border-hairline overflow-hidden">
      <div className="px-margin-mobile md:px-margin-desktop mb-6">
        <span className="text-[12px] font-medium uppercase text-prius-black/40 tracking-[0.2em]">
          Socios Estratégicos
        </span>
      </div>
      <div className="relative w-full">
        <div className="flex whitespace-nowrap animate-scroll">
          <div className="flex items-center gap-20 md:gap-32 px-10 grayscale opacity-50 hover:opacity-100 transition-opacity">
            {[...partners, ...partners, ...partners, ...partners].map((partner, i) => (
              <span key={i} className="text-2xl font-extrabold tracking-tighter text-prius-black">
                {partner}
              </span>
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
          animation: scroll 60s linear infinite;
          width: max-content;
        }
      `}</style>
    </section>
  )
}