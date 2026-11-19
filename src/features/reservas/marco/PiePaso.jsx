import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNodoPie } from './contextoMarco'

// Botones del footer fijo del marco. El paso los declara donde los tiene (con
// su estado y sus handlers) y se dibujan en el footer por portal.
// `izquierda`: Volver o el resumen de la selección; `centro`: texto que solo
// entra en desktop; `derecha`: Siguiente / Confirmar.
export default function PiePaso({ izquierda = null, centro = null, derecha = null }) {
  const nodo = useNodoPie()
  const contenido = (
    <div className="w-full flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0 flex items-center justify-start">{izquierda}</div>
      {centro && (
        <div className="hidden md:block min-w-0 text-[13px] leading-[18px] font-semibold text-black truncate">
          {centro}
        </div>
      )}
      <div className="flex-1 min-w-0 flex items-center justify-end">{derecha}</div>
    </div>
  )
  // El nodo del footer existe desde el primer commit del marco (ref callback):
  // antes de eso no hay dónde dibujar.
  if (!nodo) return null
  return createPortal(contenido, nodo)
}

export function BotonVolver({ onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 h-11 px-1 text-xs font-bold uppercase tracking-wider text-prius-black/60 hover:text-prius-black disabled:opacity-40 transition-colors font-display cursor-pointer"
    >
      <ChevronLeft size={14} /> Volver
    </button>
  )
}

export function BotonSiguiente({ onClick, disabled = false, children = 'Siguiente', icono = true }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-11 md:h-10 items-center justify-center rounded-full bg-gold px-6 text-xs font-bold uppercase tracking-wider text-prius-black hover:bg-gold-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-display cursor-pointer gap-1.5 shadow-md shrink-0 whitespace-nowrap"
    >
      {children} {icono && <ChevronRight size={14} />}
    </button>
  )
}
