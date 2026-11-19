import { useEffect, useRef } from 'react'

// Desplegable de las pills del header (fechas y personas). En desktop es un
// popover debajo de la pill; en mobile, una hoja desde abajo. Escape y click
// afuera lo cierran sin cerrar el marco: Escape se toma en captura y se marca
// con preventDefault, que PanelReserva respeta.
export default function Desplegable({ abierto, onCerrar, amplia, anclaRef, titulo, children }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!abierto) return
    function tecla(e) {
      if (e.key !== 'Escape') return
      e.preventDefault()
      onCerrar()
    }
    function afuera(e) {
      if (panelRef.current?.contains(e.target) || anclaRef?.current?.contains(e.target)) return
      onCerrar()
    }
    window.addEventListener('keydown', tecla, true)
    document.addEventListener('pointerdown', afuera, true)
    return () => {
      window.removeEventListener('keydown', tecla, true)
      document.removeEventListener('pointerdown', afuera, true)
    }
  }, [abierto, onCerrar, anclaRef])

  if (!abierto) return null

  if (amplia) {
    return (
      <div
        ref={panelRef}
        role="dialog"
        aria-label={titulo}
        className="absolute left-0 top-full mt-2 z-30 bg-white rounded-[20px] border border-[#E5E5E5] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.25)] p-4"
      >
        {children}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[1001] bg-black/30 flex items-end">
      <div
        ref={panelRef}
        role="dialog"
        aria-label={titulo}
        className="w-full max-h-[90dvh] overflow-y-auto bg-white rounded-t-[24px] px-4 pt-4 pb-[max(16px,env(safe-area-inset-bottom))]"
      >
        {children}
      </div>
    </div>
  )
}
