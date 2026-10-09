import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { obtenerDisponibilidad } from './api'
import { CANAL_DISPONIBILIDAD, EVENTO_CAMBIO } from '../../lib/reservas-contrato'

const DEBOUNCE_MS = 500

export function useDisponibilidad(desde, hasta) {
  const [unidades, setUnidades] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (!desde || !hasta) return

    let cancelado = false

    function recargar() {
      setCargando(true)
      obtenerDisponibilidad(desde, hasta)
        .then((data) => {
          if (!cancelado) setUnidades(data)
        })
        .catch((err) => {
          if (!cancelado) setError(err)
        })
        .finally(() => {
          if (!cancelado) setCargando(false)
        })
    }

    recargar()

    const canal = supabase
      .channel(CANAL_DISPONIBILIDAD)
      .on('broadcast', { event: EVENTO_CAMBIO }, () => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(recargar, DEBOUNCE_MS)
      })
      .subscribe()

    return () => {
      cancelado = true
      if (debounceRef.current) clearTimeout(debounceRef.current)
      supabase.removeChannel(canal)
    }
  }, [desde, hasta])

  return { unidades, cargando, error }
}
