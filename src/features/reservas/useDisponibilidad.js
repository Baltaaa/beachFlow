import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { obtenerDisponibilidad } from './api'
import { CANAL_DISPONIBILIDAD, EVENTO_CAMBIO } from '../../lib/reservas-contrato'

const DEBOUNCE_MS = 500
const RESPALDO_MS = 60_000
// Volver a la pestaña dispara `focus` y `visibilitychange` juntos: uno solo.
const FOCO_MIN_MS = 1500

// Ocupación del plano siempre en vivo (Fase 6B, Tarea 3):
// - disponibilidad_publica para el rango del header;
// - Broadcast `disponibilidad` / `cambio` con debounce de 500 ms;
// - al volver el foco a la pestaña, y cada 60 s como respaldo;
// - `refrescar()` (botón ↻ del marco) fuerza la consulta.
//
// `cargando` es solo la primera carga (todavía no hay ningún dato): el marco
// cambia el mapa por "Cargando plano…" y lo desmonta. Los refrescos y los
// cambios de fecha dejan el mapa como está y prenden `refrescando`.
// `rango` ("desde|hasta") es el rango al que pertenecen las `unidades`
// mostradas: mientras no coincide con el del header, los datos son viejos.
// `activo`: fuera del plano no se consulta ni se escucha nada.
export function useDisponibilidad(desde, hasta, { activo = true } = {}) {
  const [datos, setDatos] = useState({ unidades: [], rango: null })
  const [refrescando, setRefrescando] = useState(false)
  const [error, setError] = useState(null)
  const recargarRef = useRef(null)

  useEffect(() => {
    if (!activo || !desde || !hasta || !supabase) return

    let cancelado = false
    let ultimo = 0
    let enCurso = 0
    let ultimoFoco = 0
    let debounce = null
    const rango = `${desde}|${hasta}`

    async function recargar() {
      const pedido = ++ultimo
      enCurso++
      setRefrescando(true)
      try {
        const data = await obtenerDisponibilidad(desde, hasta)
        // Solo la respuesta del último pedido: una vieja que llega tarde no
        // pisa a una nueva.
        if (!cancelado && pedido === ultimo) {
          setDatos({ unidades: data, rango })
          setError(null)
        }
      } catch (err) {
        if (!cancelado && pedido === ultimo) setError(err)
      } finally {
        enCurso--
        if (!cancelado && enCurso === 0) setRefrescando(false)
      }
    }
    recargarRef.current = recargar

    recargar()

    const canal = supabase
      .channel(CANAL_DISPONIBILIDAD)
      .on('broadcast', { event: EVENTO_CAMBIO }, () => {
        clearTimeout(debounce)
        debounce = setTimeout(recargar, DEBOUNCE_MS)
      })
      .subscribe()

    function alVolver() {
      if (document.visibilityState !== 'visible') return
      const ahora = Date.now()
      if (ahora - ultimoFoco < FOCO_MIN_MS) return
      ultimoFoco = ahora
      recargar()
    }
    window.addEventListener('focus', alVolver)
    document.addEventListener('visibilitychange', alVolver)
    const respaldo = setInterval(() => {
      if (document.visibilityState === 'visible') recargar()
    }, RESPALDO_MS)

    return () => {
      cancelado = true
      recargarRef.current = null
      clearTimeout(debounce)
      clearInterval(respaldo)
      window.removeEventListener('focus', alVolver)
      document.removeEventListener('visibilitychange', alVolver)
      supabase.removeChannel(canal)
      setRefrescando(false)
    }
  }, [activo, desde, hasta])

  const refrescar = useCallback(() => recargarRef.current?.(), [])

  return {
    unidades: datos.unidades,
    rango: datos.rango,
    cargando: activo && datos.rango === null && !error,
    refrescando,
    error,
    refrescar,
  }
}
