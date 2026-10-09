import { useEffect, useState } from 'react'
import { obtenerConfigReservas } from './api'

export function useConfigReservas() {
  const [config, setConfig] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelado = false

    obtenerConfigReservas()
      .then((data) => {
        if (!cancelado) setConfig(data)
      })
      .catch((err) => {
        if (!cancelado) setError(err)
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [])

  return { config, cargando, error }
}
