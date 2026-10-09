// Llamadas a las RPCs públicas y a las Edge Functions de priusApp con la
// anon key. priusApp es dueño del schema, las RLS y las Edge Functions —
// este archivo solo consume el contrato, nunca lo modifica.
import { supabase } from '../../lib/supabase'
import { mensajeDeError } from './mensajes'

class ReservaApiError extends Error {
  constructor(codigo) {
    super(mensajeDeError(codigo))
    this.name = 'ReservaApiError'
    this.codigo = codigo
  }
}

export async function obtenerDisponibilidad(desde, hasta) {
  const { data, error } = await supabase.rpc('disponibilidad_publica', {
    p_desde: desde,
    p_hasta: hasta,
  })
  if (error) throw new ReservaApiError('interno')
  return data ?? []
}

export async function cotizar(tipoUnidad, tipoAlquiler, metodo, desde, hasta) {
  const { data, error } = await supabase.rpc('cotizar', {
    p_tipo_unidad: tipoUnidad,
    p_tipo_alquiler: tipoAlquiler,
    p_metodo: metodo,
    p_desde: desde,
    p_hasta: hasta,
  })
  if (error) throw new ReservaApiError('interno')
  return data // number | null
}

export async function buscarUnidadVecina(unidadId, desde, hasta) {
  const { data, error } = await supabase.rpc('buscar_unidad_vecina', {
    p_unidad: unidadId,
    p_desde: desde,
    p_hasta: hasta,
  })
  if (error) throw new ReservaApiError('interno')
  return data ?? [] // [{ unidad_id, contigua }]
}

export async function obtenerConfigReservas() {
  const { data, error } = await supabase
    .from('config_reservas_publicas')
    .select('*')
    .single()
  if (error) throw new ReservaApiError('interno')
  return data
}

async function invocarFuncion(nombre, payload) {
  const { data, error } = await supabase.functions.invoke(nombre, {
    body: payload,
  })

  if (!error) {
    if (data?.ok === false) throw new ReservaApiError(data.error)
    return data
  }

  // supabase-js lanza error en cualquier respuesta no-2xx (400/403/429/500).
  // El body con { ok:false, error, mensaje } viene en error.context.
  let codigo = 'interno'
  try {
    const body = await error.context?.json()
    codigo = body?.error ?? codigo
  } catch {
    // body no parseable (ej. rate limit sin JSON) — se queda en 'interno'
  }
  throw new ReservaApiError(codigo)
}

export function crearReservaPublica(payload) {
  return invocarFuncion('crear-reserva-publica', payload)
}

export function consultarReserva(codigo) {
  return invocarFuncion('consultar-reserva', { codigo })
}

export function guardarLeadReserva(payload) {
  return invocarFuncion('lead-reserva', payload)
}

export { ReservaApiError }
