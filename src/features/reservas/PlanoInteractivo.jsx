import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import PlanoViewport from '../../components/plano/PlanoViewport'
import { MENSAJE_TOCAR_PARA_ACERCAR } from './mensajes'
import './plano-glass.css'

// Wrapper de zoom/pan/toque alrededor de src/components/plano/PlanoViewport
// (controlado 100% por props, sin estado propio — ver PORTABILIDAD.md). La
// lógica de encuadre y pan en desktop está adaptada de
// priusApp/src/pages/dev/PlanoPublicoPreview.jsx (misma base que
// Dashboard.jsx, simplificada). El agregado de esta carpeta es el gesto de
// pinch/pan táctil y la asistencia "tocá para acercar" en mobile — por
// diseño, ninguna de las dos vive dentro de src/components/plano/.
const PLANO_PAD = 24
// Alto real de CeldaPublica sin escalar (h-4.5 = 18px, el lado chico de la
// celda, que es el que manda para el mínimo táctil de 44px).
const CELDA_ALTO_BASE = 18
const UMBRAL_TOQUE_PX = 44

const round1 = (n) => Math.round(n * 10) / 10

export default function PlanoInteractivo({ children }) {
  const viewportRef = useRef(null)
  const contentRef = useRef(null)
  const sizesRef = useRef({ contW: 0, contH: 0, contentW: 0, contentH: 0 })
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, startX0: 0, startY0: 0 })
  const touchRef = useRef(null)

  const [fitScale, setFitScale] = useState(1)
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 })
  const [ready, setReady] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [mostrarAyudaZoom, setMostrarAyudaZoom] = useState(false)
  // Espejo en estado de sizesRef, solo para poder leerlo durante el render
  // (canPan) sin acceder a un ref ahí — los handlers siguen leyendo
  // sizesRef.current para tener el valor sincrónico más fresco posible.
  const [sizes, setSizes] = useState({ contW: 0, contH: 0, contentW: 0, contentH: 0 })

  const computeFit = (contW, contH, contentW, contentH) =>
    Math.min((contW - PLANO_PAD * 2) / contentW, (contH - PLANO_PAD * 2) / contentH)
  const centeredPos = (contW, contH, contentW, contentH, scale) => ({
    x: (contW - contentW * scale) / 2,
    y: (contH - contentH * scale) / 2,
  })
  const clampScale = (s) => Math.min(3, Math.max(fitScale * 0.5, s))
  const clampPan = (x, y, scale) => {
    const { contW, contH, contentW, contentH } = sizesRef.current
    const scaledW = contentW * scale
    const scaledH = contentH * scale
    const cx = scaledW <= contW ? (contW - scaledW) / 2 : Math.min(0, Math.max(contW - scaledW, x))
    const cy = scaledH <= contH ? (contH - scaledH) / 2 : Math.min(0, Math.max(contH - scaledH, y))
    return { x: cx, y: cy }
  }

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const content = contentRef.current
    if (!viewport || !content) return
    const aplicarEncuadre = () => {
      const contW = viewport.clientWidth
      const contH = viewport.clientHeight
      const contentW = content.offsetWidth
      const contentH = content.offsetHeight
      if (!contW || !contH || !contentW || !contentH) return
      sizesRef.current = { contW, contH, contentW, contentH }
      setSizes({ contW, contH, contentW, contentH })
      const fit = computeFit(contW, contH, contentW, contentH)
      setFitScale(fit)
      setTransform({ scale: fit, ...centeredPos(contW, contH, contentW, contentH, fit) })
      setReady(true)
    }
    aplicarEncuadre()
    const ro = new ResizeObserver(aplicarEncuadre)
    ro.observe(viewport)
    ro.observe(content)
    return () => ro.disconnect()
     
  }, [])

  function zoomFromBase(base, px, py, targetScale) {
    const scale = clampScale(targetScale)
    const contentX = (px - base.x) / base.scale
    const contentY = (py - base.y) / base.scale
    const nx = px - contentX * scale
    const ny = py - contentY * scale
    const { x, y } = clampPan(nx, ny, scale)
    setTransform({ scale, x, y })
  }

  const handleZoomIn = () => {
    const { contW, contH } = sizesRef.current
    zoomFromBase(transform, contW / 2, contH / 2, round1(transform.scale + 0.2))
  }
  const handleZoomOut = () => {
    const { contW, contH } = sizesRef.current
    zoomFromBase(transform, contW / 2, contH / 2, round1(transform.scale - 0.2))
  }
  const handleEncuadrar = () => {
    const { contW, contH, contentW, contentH } = sizesRef.current
    const fit = computeFit(contW, contH, contentW, contentH)
    setFitScale(fit)
    setTransform({ scale: fit, ...centeredPos(contW, contH, contentW, contentH, fit) })
  }

  // --- Desktop: drag con mouse + Ctrl+rueda ---
  const handleMapMouseDown = (e) => {
    const { contW, contH, contentW, contentH } = sizesRef.current
    if (contentW * transform.scale <= contW && contentH * transform.scale <= contH) return
    dragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, startX0: transform.x, startY0: transform.y }
    setIsDragging(true)
  }
  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.dragging) return
      const dx = e.clientX - dragRef.current.startX
      const dy = e.clientY - dragRef.current.startY
      setTransform((prev) => {
        const { x, y } = clampPan(dragRef.current.startX0 + dx, dragRef.current.startY0 + dy, prev.scale)
        return { ...prev, x, y }
      })
    }
    const onUp = () => {
      if (!dragRef.current.dragging) return
      dragRef.current.dragging = false
      setIsDragging(false)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
     
  }, [])
  const handleMapWheel = (e) => {
    if (!e.ctrlKey) return
    e.preventDefault()
    const rect = viewportRef.current.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    const delta = e.deltaY > 0 ? -0.2 : 0.2
    zoomFromBase(transform, px, py, round1(transform.scale + delta))
  }

  // --- Mobile: pinch con dos dedos + pan/tap con uno ---
  function distanciaToques(touches) {
    const [a, b] = touches
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
  }
  function puntoMedio(touches, rect) {
    const [a, b] = touches
    return { x: (a.clientX + b.clientX) / 2 - rect.left, y: (a.clientY + b.clientY) / 2 - rect.top }
  }

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const rect = viewportRef.current.getBoundingClientRect()
      touchRef.current = {
        modo: 'pinch',
        distanciaInicial: distanciaToques(e.touches),
        transformInicial: transform,
        punto: puntoMedio(e.touches, rect),
      }
    } else if (e.touches.length === 1) {
      const t = e.touches[0]
      touchRef.current = {
        modo: 'candidato',
        startX: t.clientX,
        startY: t.clientY,
        transformInicial: transform,
        inicio: { x: t.clientX, y: t.clientY, tiempo: Date.now() },
      }
    }
  }

  const handleTouchMove = (e) => {
    const estado = touchRef.current
    if (!estado) return
    if (estado.modo === 'pinch' && e.touches.length === 2) {
      e.preventDefault()
      const distancia = distanciaToques(e.touches)
      const factor = distancia / estado.distanciaInicial
      zoomFromBase(estado.transformInicial, estado.punto.x, estado.punto.y, estado.transformInicial.scale * factor)
      return
    }
    if ((estado.modo === 'candidato' || estado.modo === 'pan') && e.touches.length === 1) {
      const t = e.touches[0]
      const dx = t.clientX - estado.startX
      const dy = t.clientY - estado.startY
      if (estado.modo === 'candidato' && Math.hypot(dx, dy) > 8) {
        estado.modo = 'pan'
        setIsDragging(true)
      }
      if (estado.modo === 'pan') {
        e.preventDefault()
        setTransform((prev) => {
          const { x, y } = clampPan(estado.transformInicial.x + dx, estado.transformInicial.y + dy, prev.scale)
          return { ...prev, x, y }
        })
      }
    }
  }

  const handleTouchEnd = (e) => {
    const estado = touchRef.current
    touchRef.current = null
    if (!estado) return
    if (estado.modo === 'pan') {
      setIsDragging(false)
      return
    }
    if (estado.modo === 'candidato') {
      const transcurrido = Date.now() - estado.inicio.tiempo
      if (transcurrido >= 500) return // toque sostenido, no es un tap
      const rect = viewportRef.current.getBoundingClientRect()
      const px = estado.inicio.x - rect.left
      const py = estado.inicio.y - rect.top
      const altoCeldaEnPantalla = CELDA_ALTO_BASE * transform.scale
      if (altoCeldaEnPantalla < UMBRAL_TOQUE_PX) {
        // Zoom insuficiente: el toque acerca en vez de seleccionar — se
        // frena el click sintético para no disparar la selección debajo.
        e.preventDefault()
        setMostrarAyudaZoom(true)
        zoomFromBase(transform, px, py, clampScale(transform.scale * 1.8))
        setTimeout(() => setMostrarAyudaZoom(false), 1800)
      }
      // Si el zoom ya alcanza, no hacemos nada: se deja pasar el click
      // nativo del <button> de CeldaPublica, que maneja la selección.
    }
  }

  const canPan =
    sizes.contentW * transform.scale > sizes.contW ||
    sizes.contentH * transform.scale > sizes.contH

  return (
    <div className="absolute inset-0 bg-[#0F1A2C] rounded-3xl overflow-hidden flex flex-col">
      <PlanoViewport
        transform={transform}
        ready={ready}
        isDragging={isDragging}
        canPan={canPan}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onEncuadrar={handleEncuadrar}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMapMouseDown={handleMapMouseDown}
        onMapWheel={handleMapWheel}
        viewportRef={viewportRef}
        contentRef={contentRef}
      >
        {children}
      </PlanoViewport>

      {mostrarAyudaZoom && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full pointer-events-none z-30">
          {MENSAJE_TOCAR_PARA_ACERCAR}
        </div>
      )}
    </div>
  )
}
