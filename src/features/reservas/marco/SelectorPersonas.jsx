import { useCallback, useRef, useState } from 'react'
import { Minus, Plus, Users } from 'lucide-react'
import Desplegable from './Desplegable'

// Pill de personas al lado del selector de fechas (mismo dibujo). El número se
// arma en el desplegable y se aplica con "Aplicar": las reglas de capacidad,
// vecina y grupo grande corren recién ahí (ReservaFlow / Paso 3), no en cada
// toque de + o −.
export default function SelectorPersonas({ personas, bloqueado = false, amplia, onCambiar }) {
  const [abierto, setAbierto] = useState(false)
  const [valor, setValor] = useState(personas)
  const anclaRef = useRef(null)
  const cerrar = useCallback(() => setAbierto(false), [])

  function abrir() {
    if (bloqueado) return
    setValor(personas)
    setAbierto((v) => !v)
  }

  function aplicar() {
    if (valor !== personas) onCambiar(valor)
    cerrar()
  }

  const boton = 'w-11 h-11 rounded-full border border-[#E5E5E5] flex items-center justify-center text-black disabled:opacity-30 hover:border-black/30 transition-colors'

  return (
    <div ref={anclaRef} className="relative shrink-0">
      <button
        type="button"
        onClick={abrir}
        disabled={bloqueado}
        aria-haspopup="dialog"
        aria-expanded={abierto}
        aria-label={`${personas} persona${personas === 1 ? '' : 's'}. Cambiar`}
        className={`h-10 px-3.5 rounded-full bg-black/[0.06] flex items-center gap-1.5 text-[13px] leading-[18px] font-semibold text-black whitespace-nowrap hover:bg-black/[0.1] disabled:hover:bg-black/[0.06] disabled:cursor-default transition-colors ${bloqueado ? 'opacity-60' : ''}`}
      >
        <Users size={15} className="shrink-0" />
        {personas}
        <span className={amplia ? '' : 'sr-only'}>{personas === 1 ? ' persona' : ' personas'}</span>
      </button>

      <Desplegable abierto={abierto} onCerrar={cerrar} amplia={amplia} anclaRef={anclaRef} titulo="Cantidad de personas">
        <p className="text-[13px] leading-[18px] font-semibold text-black mb-3">¿Cuántas personas son?</p>
        <div className="flex items-center justify-center gap-5 py-1">
          <button type="button" onClick={() => setValor((v) => Math.max(1, v - 1))} disabled={valor <= 1} className={boton} aria-label="Una persona menos">
            <Minus size={16} />
          </button>
          <span className="w-8 text-center text-xl font-bold text-black tabular-nums" aria-live="polite">{valor}</span>
          <button type="button" onClick={() => setValor((v) => v + 1)} className={boton} aria-label="Una persona más">
            <Plus size={16} />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2 min-w-[240px]">
          <button type="button" onClick={cerrar} className="h-10 px-4 rounded-full text-[13px] font-semibold text-[#6B6B6B] hover:text-black transition-colors">
            Cancelar
          </button>
          <button type="button" onClick={aplicar} className="h-10 px-5 rounded-full bg-black text-white text-[13px] font-semibold">
            Aplicar
          </button>
        </div>
      </Desplegable>
    </div>
  )
}
