export default function Gallery() {
  const images = [7, 8, 9, 10, 11, 12, 13, 14]
  
  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop bg-white" id="galeria">
      <div className="mb-16">
        <h2 className="text-[48px] font-normal tracking-tight mb-4 uppercase">Galería de Experiencias</h2>
        <p className="text-prius-black/60 max-w-2xl">Viví momentos inolvidables en las mejores instalaciones de Playa Grande.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((num) => (
          <div key={num} className="aspect-[3/4] overflow-hidden rounded-lg border border-hairline">
            <img 
              alt={`Galería Prius ${num}`} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
              src={`/images/prius${num}.webp`} 
            />
          </div>
        ))}
      </div>
    </section>
  )
}