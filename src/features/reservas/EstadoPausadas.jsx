import { Phone } from 'lucide-react'
import { MENSAJE_RESERVAS_PAUSADAS } from './mensajes'

export default function EstadoPausadas({ onIrAConsulta }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 animate-premium-fade">
      <h3 className="text-lg font-bold uppercase tracking-wider text-prius-black mb-2 font-display">
        Reservas Online Pausadas
      </h3>
      <p className="text-prius-black/70 text-xs max-w-md leading-relaxed font-light mb-6">
        {MENSAJE_RESERVAS_PAUSADAS}
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <a
          href="https://wa.me/542235765482"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-gold px-6 text-xs font-bold uppercase tracking-wider text-prius-black hover:bg-gold-hover transition-colors font-display cursor-pointer shadow-md"
        >
          <Phone size={14} /> WhatsApp
        </a>
        <button
          type="button"
          onClick={onIrAConsulta}
          className="text-xs font-bold tracking-widest uppercase text-prius-black/60 hover:text-prius-black transition-colors font-display cursor-pointer"
        >
          Dejar mi consulta →
        </button>
      </div>
    </div>
  )
}
