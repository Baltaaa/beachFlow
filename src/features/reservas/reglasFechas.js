// Reglas de qué fechas se pueden reservar online. Las usan el Paso 2 ("Fechas
// y personas", solo la primera vez) y el selector de fechas del header del
// marco (Fase 6B), así las dos entradas validan exactamente igual.
import { useMemo } from 'react'
import { cotizar } from './api'
import { dateAIso, horaArgentinaActual, hoyArgentinaISO, sumarDiasISO } from './fechas'
import { MENSAJE_SIN_TARIFA } from './mensajes'

/** Hoy, el máximo según anticipación y el matcher de días deshabilitados. */
export function useRestriccionesFechas(config) {
  const hoyISO = hoyArgentinaISO()
  const horaActual = horaArgentinaActual()
  const corteHoyPasado = !!config && horaActual >= config.hora_corte_noshow.slice(0, 5)
  const maxFechaISO = config ? sumarDiasISO(hoyISO, config.dias_anticipacion_max) : null

  const isoDeshabilitado = useMemo(() => {
    return (iso) => {
      if (iso < hoyISO) return true
      if (iso === hoyISO && corteHoyPasado) return true
      if (maxFechaISO && iso > maxFechaISO) return true
      return false
    }
  }, [hoyISO, corteHoyPasado, maxFechaISO])

  const disabledMatcher = useMemo(() => (date) => isoDeshabilitado(dateAIso(date)), [isoDeshabilitado])

  return { hoyISO, isoDeshabilitado, disabledMatcher }
}

/** Rango de DayPicker ({from, to}) → fechas del flow. null si no hay rango. */
export function fechasDeRango(rango) {
  if (!rango?.from) return null
  const desde = dateAIso(rango.from)
  const hasta = dateAIso(rango.to ?? rango.from)
  return { desde, hasta, tipoAlquiler: desde === hasta ? 'dia' : 'periodo' }
}

/** Texto de error si el tipo de alquiler no está habilitado online. */
export function errorTipoAlquiler(config, tipo) {
  if (config?.tipos_alquiler_web?.includes(tipo)) return null
  return tipo === 'periodo'
    ? 'El alquiler por período no está disponible por ahora. Elegí un solo día.'
    : 'El alquiler por día no está disponible por ahora.'
}

/**
 * Valida un rango completo antes de aplicarlo: tipo habilitado y que haya
 * tarifa para carpa o sombrilla. Devuelve el texto de error o null.
 */
export async function validarFechas(config, { desde, hasta, tipoAlquiler }) {
  const errorTipo = errorTipoAlquiler(config, tipoAlquiler)
  if (errorTipo) return errorTipo
  const [precioCarpa, precioSombrilla] = await Promise.all([
    cotizar('carpa', tipoAlquiler, 'efectivo', desde, hasta),
    cotizar('sombrilla', tipoAlquiler, 'efectivo', desde, hasta),
  ])
  if (precioCarpa == null && precioSombrilla == null) return MENSAJE_SIN_TARIFA
  return null
}
