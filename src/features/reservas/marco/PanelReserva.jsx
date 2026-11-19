import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './marco.css'

const ID_FUENTE = 'fuente-manrope-panel-reserva'
const URL_FUENTE = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap'

// Manrope solo para el overlay: se pide la primera vez que se abre.
function cargarManrope() {
  if (document.getElementById(ID_FUENTE)) return
  const link = document.createElement('link')
  link.id = ID_FUENTE
  link.rel = 'stylesheet'
  link.href = URL_FUENTE
  document.head.appendChild(link)
}

// Mientras el overlay está abierto la página de fondo no scrollea. Se traba
// html y body (iOS ignora solo body) y se compensa el ancho de la barra de
// scroll para que la landing no salte. La posición de scroll no se toca.
function useBodyLock() {
  useLayoutEffect(() => {
    const html = document.documentElement
    const body = document.body
    const previo = {
      html: html.style.overflow,
      body: body.style.overflow,
      padding: body.style.paddingRight,
    }
    const anchoBarra = window.innerWidth - html.clientWidth
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    if (anchoBarra > 0) body.style.paddingRight = `${anchoBarra}px`
    return () => {
      html.style.overflow = previo.html
      body.style.overflow = previo.body
      body.style.paddingRight = previo.padding
    }
  }, [])
}

// El resto de la página queda inerte (sin foco ni lector de pantalla) mientras
// el overlay, que vive en un portal fuera de #root, está abierto.
function useFondoInerte() {
  useLayoutEffect(() => {
    const raiz = document.getElementById('root')
    if (!raiz) return
    const previo = raiz.inert
    raiz.inert = true
    return () => {
      raiz.inert = previo
    }
  }, [])
}

// Overlay del flujo de reserva (Fase 6B). Desktop: hoja blanca centrada de
// tamaño FIJO (90vw × 88dvh, con máximo), la misma en todos los pasos.
// Mobile: pantalla completa con safe areas. Se cierra con la X, Escape o click
// afuera; si `pedirConfirmacion`, primero pregunta dentro de la hoja.
// `children(solicitarCierre)`: el marco necesita el mismo cierre para su X.
export default function PanelReserva({ pedirConfirmacion = false, onCerrar, children }) {
  const [confirmando, setConfirmando] = useState(false)
  const hojaRef = useRef(null)
  const botonQuedarseRef = useRef(null)

  useBodyLock()
  useFondoInerte()
  useEffect(cargarManrope, [])

  const solicitarCierre = useCallback(() => {
    if (pedirConfirmacion) setConfirmando(true)
    else onCerrar()
  }, [pedirConfirmacion, onCerrar])

  useEffect(() => {
    function tecla(e) {
      // Un desplegable abierto (fechas, personas) ya lo atendió.
      if (e.key !== 'Escape' || e.defaultPrevented) return
      if (confirmando) setConfirmando(false)
      else solicitarCierre()
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [confirmando, solicitarCierre])

  useEffect(() => {
    if (confirmando) botonQuedarseRef.current?.focus()
  }, [confirmando])

  // El foco entra a la hoja al abrir y vuelve a donde estaba al cerrar.
  useEffect(() => {
    const anterior = document.activeElement
    hojaRef.current?.focus({ preventScroll: true })
    return () => {
      if (anterior instanceof HTMLElement) anterior.focus({ preventScroll: true })
    }
  }, [])

  return createPortal(
    <div
      className="panel-reserva panel-reserva-fondo fixed inset-0 z-[999] bg-black/30 backdrop-blur-sm flex items-center justify-center overscroll-contain"
      onClick={solicitarCierre}
    >
      <div
        ref={hojaRef}
        role="dialog"
        aria-modal="true"
        aria-label="Reservá tu lugar"
        tabIndex={-1}
        data-panel-reserva
        onClick={(e) => e.stopPropagation()}
        className="panel-reserva-hoja panel-reserva-entrar relative bg-white text-black overflow-hidden flex flex-col outline-none w-full h-dvh rounded-none md:w-[90vw] md:max-w-[1440px] md:h-[88dvh] md:max-h-[920px] md:rounded-[24px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]"
      >
        {children(solicitarCierre)}

        {confirmando && (
          <div className="absolute inset-0 z-40 bg-white/70 backdrop-blur-[2px] flex items-center justify-center p-6">
            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="titulo-salir-reserva"
              className="w-full max-w-sm bg-white rounded-[24px] border border-[#E5E5E5] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.25)] p-6"
            >
              <p id="titulo-salir-reserva" className="text-base font-bold text-black">
                ¿Salir de la reserva?
              </p>
              <p className="mt-1.5 text-[13px] leading-[19px] text-[#6B6B6B]">
                Se pierden las fechas y el lugar que elegiste.
              </p>
              <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <button
                  type="button"
                  onClick={onCerrar}
                  className="h-11 px-5 rounded-full text-[13px] font-semibold text-[#6B6B6B] hover:text-black transition-colors"
                >
                  Salir
                </button>
                <button
                  ref={botonQuedarseRef}
                  type="button"
                  onClick={() => setConfirmando(false)}
                  className="h-11 px-5 rounded-full bg-black text-white text-[13px] font-semibold"
                >
                  Seguir reservando
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
