export default function Contact() {
  return (
    <section className="py-28 px-margin-mobile md:px-margin-desktop bg-white relative overflow-hidden" id="contacto">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none pointer-events-none">
        <span className="text-[20rem] md:text-[40rem] font-black tracking-tighter">PRIUS</span>
      </div>
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Encabezado de la Sección */}
        <div className="mb-12 text-center md:text-left">
          <span className="text-[9px] font-normal uppercase tracking-[0.3em] text-prius-black/40 block mb-1 font-display">
            Reservas & Consultas
          </span>
          <h2 className="text-2xl md:text-3xl font-normal tracking-tight text-prius-black uppercase font-display leading-none">
            Contactate con <span className="text-gold">nuestro equipo</span>
          </h2>
        </div>

        <div className="bg-prius-background rounded-xl overflow-hidden border border-hairline">
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-2 bg-prius-black p-8 md:p-12 text-white flex flex-col justify-between min-h-[400px]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold block mb-4">Contacto Exclusivo</span>
                <h2 className="text-2xl md:text-3xl font-normal mb-6 leading-tight uppercase">Hablemos de su próxima estadía</h2>
                <p className="text-xs md:text-sm opacity-60 font-light mb-12 leading-relaxed">Nuestro equipo de atención personalizada está listo para diseñar su experience perfecta en Playa Grande.</p>
              </div>
              <div className="space-y-6 text-xs md:text-sm border-t border-white/10 pt-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gold mb-1">Teléfono</p>
                  <p className="font-medium">+54 223 123-4567</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gold mb-1">Email</p>
                  <p className="font-medium break-all">info@priusplayagrande.com</p>
                </div>
              </div>
            </div>
            <form className="md:col-span-3 p-8 md:p-12 bg-white flex flex-col justify-between min-h-[400px]">
              <div className="space-y-6">
                <div className="relative">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-prius-black/40 block mb-2">Nombre Completo</label>
                  <input type="text" className="w-full border-b border-hairline py-2 focus:border-gold outline-none transition-colors text-sm" placeholder="Ej. Juan Pérez" />
                </div>
                <div className="relative">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-prius-black/40 block mb-2">Correo Electrónico</label>
                  <input type="email" className="w-full border-b border-hairline py-2 focus:border-gold outline-none transition-colors text-sm" placeholder="ejemplo@mail.com" />
                </div>
                <div className="relative">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-prius-black/40 block mb-2">Asunto de Interés</label>
                  <select className="w-full border-b border-hairline py-2 focus:border-gold outline-none bg-transparent text-sm">
                    <option>Alquiler de carpa</option>
                    <option>Alquiler de sombrilla</option>
                    <option>Eventos Corporativos</option>
                  </select>
                </div>
              </div>
              <button className="w-full bg-gold hover:bg-gold-hover text-prius-black py-4 rounded-sm font-extralight text-[11px] uppercase tracking-[0.2em] transition-premium cursor-pointer border border-transparent font-display mt-8">
                Enviar Solicitud
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}