import { LEYENDA_PLANO } from '../mensajes'

const MUESTRA = {
  libre: 'bg-white border border-[#E5E5E5]',
  ocupada: 'bg-black border border-black',
  elegida: 'bg-[#F2CA50] border border-[#F2CA50]',
  sugerida: 'bg-white border border-[#F2CA50] ring-1 ring-[#F2CA50]',
}

// Leyenda de los 4 estados. MarcoPlanoClaro no tiene slot para ella (pedido a
// priusApp): en amplia va a la derecha de la fila "Pasillo A · B · C", que
// está vacía; en compacta no entra en esa fila y va abajo, sobre el mapa.
export default function LeyendaPlano({ amplia }) {
  return (
    <div
      data-leyenda-plano
      aria-label="Referencias del plano"
      className={`pointer-events-none absolute z-10 flex items-center gap-x-3 gap-y-1 flex-wrap ${
        amplia
          ? 'top-3 right-3 h-[18px]'
          : 'bottom-3 left-3 right-3 justify-center gap-x-2.5 bg-white/90 rounded-xl px-2.5 py-1.5'
      }`}
    >
      {LEYENDA_PLANO.map((item) => (
        <span key={item.estado} className="flex items-center gap-1.5 text-[11px] leading-[14px] font-medium text-[#6B6B6B]">
          <span className={`w-3 h-2.5 rounded-[2px] ${MUESTRA[item.estado]}`} />
          {item.label}
        </span>
      ))}
    </div>
  )
}
