import { X } from 'lucide-react'
import { TITULOS_PASO, TOTAL_PASOS } from '../mensajes'

// Barra fina entre el header y el cuerpo: "Paso X de 6 · <nombre>" y el
// progreso dorado. En mobile lleva la X (el header compacto no tiene). Sin
// `paso` (reservas pausadas, cargando) queda solo el título y la X.
export default function BarraPaso({ paso, onCerrar = null, tituloCerrar = 'Cerrar' }) {
  return (
    <div data-barra-paso className="shrink-0 flex items-center gap-3 px-1">
      {paso ? (
      <div className="flex-1 min-w-0">
        <p className="text-[12px] leading-[16px] font-semibold text-[#6B6B6B] truncate">
          <span>Paso {paso} de {TOTAL_PASOS}</span>
          {TITULOS_PASO[paso] && (
            <>
              <span aria-hidden="true"> · </span>
              <span className="text-black">{TITULOS_PASO[paso]}</span>
            </>
          )}
        </p>
        <div className="mt-1.5 h-[3px] w-full rounded-full bg-[#F2F1EC] overflow-hidden">
          <div
            className="h-full rounded-full bg-gold transition-[width] duration-500"
            style={{ width: `${(paso / TOTAL_PASOS) * 100}%` }}
          />
        </div>
      </div>
      ) : (
        <p className="flex-1 min-w-0 text-[12px] leading-[16px] font-semibold text-black truncate">Reservá tu lugar</p>
      )}
      {onCerrar && (
        <button
          type="button"
          onClick={onCerrar}
          title={tituloCerrar}
          aria-label={tituloCerrar}
          className="w-11 h-11 -my-1.5 shrink-0 rounded-full flex items-center justify-center text-black hover:bg-[#F2F1EC] transition-colors"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      )}
    </div>
  )
}
