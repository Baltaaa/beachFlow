export default function Contact() {
  return (
    <section className="py-32 px-margin-mobile md:px-margin-desktop bg-prius-background relative overflow-hidden" id="contacto">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
        <span className="text-[20rem] md:text-[40rem] font-black tracking-tighter">PRIUS</span>
      </div>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-white rounded-xl overflow-hidden border border-hairline">
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-2 bg-prius-black p-12 text-white flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-normal mb-6 leading-tight uppercase">Hablemos de su próxima estadía</h2>
                <p className="text-sm opacity-60 font-light mb-12">Nuestro equipo de atención personalizada está listo para diseñar su experiencia perfecta en Playa Grande.</p>
              </div>
              <div className="space-y-4 text-sm">
                <p className="flex items-center gap-4"><span className="text-gold">TEL</span> +54 223 123-4567</p>
                <p className="flex items-center gap-4"><span className="text-gold">MAIL</span> info@priusplayagrande.com</p>
              </div>
            </div>
            <form className="md:col-span-3 p-12 space-y-8">
              <div className="space-y-6">
                <div className="relative">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-prius-black/40 block mb-2">Nombre Completo</label>
                  <input type="text" className="w-full border-b border-hairline py-2 focus:border-gold outline-none transition-colors" />
                </div>
                <div className="relative">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-prius-black/40 block mb-2">Correo Electrónico</label>
                  <input type="email" className="w-full border-b border-hairline py-2 focus:border-gold outline-none transition-colors" />
                </div>
                <div className="relative">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-prius-black/40 block mb-2">Asunto de Interés</label>
                  <select className="w-full border-b border-hairline py-2 focus:border-gold outline-none bg-transparent">
                    <option>Alquiler de Carpas</option>
                    <option>Membresía Spa</option>
                    <option>Eventos Corporativos</option>
                  </select>
                </div>
              </div>
              <button className="w-full bg-gold hover:bg-gold-hover py-5 rounded-sm font-bold text-[12px] uppercase tracking-[0.2em] transition-all">
                Enviar Solicitud
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}