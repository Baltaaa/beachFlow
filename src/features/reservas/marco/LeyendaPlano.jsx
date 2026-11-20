import { LEYENDA_PLANO } from '../mensajes'

const MUESTRA = {
  libre: 'bg-white border border-[#E5E5E5]',
  ocupada: 'bg-black border border-black',
  elegida: 'bg-[#F2CA50] border border-[#F2CA50]',
  sugerida: 'bg-white border border-[#F2CA50] ring-1 ring-[#F2CA50]',
}

// Leyenda de los 4 estados. Va en el slot `leyenda` de MarcoPlanoClaro
// (priusApp 6A.2): en la fila "Pasillo A · B · C", a la derecha, en el flujo
// del layout (no flota sobre el mapa). En amplia, una sola línea; en compacta
// la fila es angosta y va en 2×2 para no cortar el rótulo de pasillos.
export default function LeyendaPlano({ amplia }) {
  return (
    <div
      data-leyenda-plano
      aria-label="Referencias del plano"
      className={`shrink-0 pointer-events-none ${
        amplia ? 'flex items-center gap-x-3 h-[18px]' : 'grid grid-cols-2 gap-x-2.5 gap-y-1'
      }`}
    >
      {LEYENDA_PLANO.map((item) => (
        <span key={item.estado} className="flex items-center gap-1.5 text-[11px] leading-[14px] font-medium text-[#6B6B6B] whitespace-nowrap">
          <span className={`shrink-0 w-3 h-2.5 rounded-[2px] ${MUESTRA[item.estado]}`} />
          {item.label}
        </span>
      ))}
    </div>
  )
}
