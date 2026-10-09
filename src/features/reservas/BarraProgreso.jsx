import { TOTAL_PASOS, TITULOS_PASO } from './mensajes'

export default function BarraProgreso({ paso }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[9px] 2xl:text-[10px] font-bold uppercase tracking-wider text-prius-black/40 font-display">
          Paso {paso} de {TOTAL_PASOS}
        </span>
        <span className="text-[9px] 2xl:text-[10px] font-bold uppercase tracking-wider text-prius-black font-display">
          {TITULOS_PASO[paso]}
        </span>
      </div>
      <div className="w-full h-[2px] bg-hairline rounded-full overflow-hidden">
        <div
          className="h-full bg-gold transition-all duration-500 rounded-full"
          style={{ width: `${(paso / TOTAL_PASOS) * 100}%` }}
        />
      </div>
    </div>
  )
}
