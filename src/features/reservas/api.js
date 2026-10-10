// Llamadas a las RPCs públicas y a las Edge Functions de priusApp con la
// anon key. priusApp es dueño del schema, las RLS y las Edge Functions —
// este archivo solo consume el contrato, nunca lo modifica.
//
// Los payloads de crear-reserva-publica y lead-reserva están alineados
// campo por campo contra los esquemas zod reales de priusApp
// (supabase/functions/{crear-reserva-publica,lead-reserva}/index.ts) y
// contra el jsonb que arman/devuelven crear_reserva_publica(),
// consultar_reserva_publica() y guardar_lead_reserva() en Postgres
// (verificado por introspección read-only vía MCP, 2026-10-09). Copias de
// esos esquemas para test en ./edgeFunctionsSchemas.js — mantener
// sincronizado a mano si cambia el lado de priusApp.
import { supabase } from '../../lib/supabase'
import { mensajeDeError } from './mensajes'

class ReservaApiError extends Error {
  constructor(codigo) {
    super(mensajeDeError(codigo))
    this.name = 'ReservaApiError'
    this.codigo = codigo
  }
}

function requerirSupabase() {
  if (!supabase) throw new ReservaApiError('interno')
  return supabase
}

export async function obtenerDisponibilidad(desde, hasta) {
  const { data, error } = await requerirSupabase().rpc('disponibilidad_publica', {
    p_desde: desde,
    p_hasta: hasta,
  })
  if (error) throw new ReservaApiError('interno')
  return data ?? []
}

export async function cotizar(tipoUnidad, tipoAlquiler, metodo, desde, hasta) {
  const { data, error } = await requerirSupabase().rpc('cotizar', {
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
  const { data, error } = await requerirSupabase().rpc('buscar_unidad_vecina', {
    p_unidad: unidadId,
    p_desde: desde,
    p_hasta: hasta,
  })
  if (error) throw new ReservaApiError('interno')
  return data ?? [] // [{ unidad_id, contigua }]
}

export async function obtenerConfigReservas() {
  const { data, error } = await requerirSupabase().from('config_reservas_publicas').select('*').single()
  if (error) throw new ReservaApiError('interno')
  return data
}

async function invocarFuncion(nombre, payload) {
  const { data, error } = await requerirSupabase().functions.invoke(nombre, {
    body: payload,
  })

  if (!error) {
    // crear_reserva_publica/consultar_reserva_publica/guardar_lead_reserva
    // siempre responden 200 con { ok:true|false, ... } — la Edge Function
    // reenvía tal cual lo que devuelve la RPC, incluidos los errores de
    // negocio (ver CLAUDE.md priusApp, "Edge Functions (Fase 2)").
    if (data?.ok === false) throw new ReservaApiError(data.error)
    return data
  }

  // Errores HTTP de verdad (400 datos_invalidos, 403 captcha_invalido, 429
  // rate_limited, 500 interno) — supabase-js los lanza en vez de
  // devolverlos en `data`. El body { ok:false, error, ... } viene en
  // error.context.
  let codigo = 'interno'
  try {
    const body = await error.context?.json()
    codigo = body?.error ?? codigo
  } catch {
    // body no parseable (ej. rate limit sin JSON) — se queda en 'interno'
  }
  throw new ReservaApiError(codigo)
}

// crear-reserva-publica — Entrada (zod) real:
// { tipo_alquiler, desde, hasta, cantidad_personas, tipo_unidad,
//   unidad_ids, metodo_pago, cliente: { nombre, apellido, telefono_e164,
//   email, dni? }, lead_id?, turnstile_token }
export function armarPayloadCrearReserva({
  tipoAlquiler,
  desde,
  hasta,
  personas,
  tipoUnidad,
  unidadIds,
  metodoPago,
  cliente,
  leadId,
  turnstileToken,
}) {
  return {
    tipo_alquiler: tipoAlquiler,
    desde,
    hasta,
    cantidad_personas: personas,
    tipo_unidad: tipoUnidad,
    unidad_ids: unidadIds,
    metodo_pago: metodoPago,
    cliente: {
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      telefono_e164: cliente.telefonoE164,
      email: cliente.email,
      dni: cliente.dni ?? null,
    },
    lead_id: leadId ?? null,
    // turnstile_token es string (no nullable) en el schema real — nunca
    // mandar null, si obtenerToken() falla cae en "".
    turnstile_token: turnstileToken ?? '',
  }
}

export function crearReservaPublica(args) {
  return invocarFuncion('crear-reserva-publica', armarPayloadCrearReserva(args))
}

// consultar-reserva acepta GET ?codigo= o POST { codigo } — acá se usa
// POST, sin Turnstile (la función no lo pide: "excepto consultar").
export function consultarReserva(codigo) {
  return invocarFuncion('consultar-reserva', { codigo })
}

// lead-reserva — Entrada (zod) real:
// { lead_id?, nombre, telefono_e164, email?, motivo, mensaje?,
//   datos_form?, turnstile_token }
// `motivo` NO incluye "contacto" (ese caso va siempre al form de n8n, no
// acá) — solo form_abandonado | grupo_grande | temporada | sin_disponibilidad.
export function armarPayloadLeadReserva({ leadId, nombre, telefonoE164, email, motivo, mensaje, datosForm, turnstileToken }) {
  return {
    lead_id: leadId ?? null,
    nombre,
    telefono_e164: telefonoE164,
    email: email ?? null,
    motivo,
    mensaje: mensaje ?? null,
    datos_form: datosForm ?? null,
    turnstile_token: turnstileToken ?? '',
  }
}

export function guardarLeadReserva(args) {
  return invocarFuncion('lead-reserva', armarPayloadLeadReserva(args))
}

export { ReservaApiError }
