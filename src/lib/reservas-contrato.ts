// Contrato con la DB compartida. Fuente de verdad: CLAUDE.md de priusApp.
// No modificar sin cambiar primero priusApp.
//
// Firmas confirmadas por introspección read-only vía MCP de Supabase
// (list_tables + pg_proc) contra el proyecto oslbsnwccchdxmbjhhcg (2026-10-08).
// No existe `generate_typescript_types` en este MCP (scope limitado a
// features=database,docs, sin el grupo "development"), así que estos tipos
// están escritos a mano a partir del schema real en vez de derivarse de un
// src/types/supabase.ts generado.

export type TipoUnidad = 'carpa' | 'sombrilla' | 'cabina' | 'locker'
export type TipoAlquilerWeb = 'dia' | 'periodo' | 'temporada'
export type MetodoPago =
  | 'efectivo'
  | 'transferencia'
  | 'mercado_pago'
  | 'tarjeta_debito'
  | 'tarjeta_credito'

// disponibilidad_publica(p_desde date, p_hasta date)
//   RETURNS TABLE(unidad_id uuid, numero integer, tipo text, fila integer,
//                 orden integer, capacidad integer, bloqueada boolean)
export type UnidadDisponible = {
  unidad_id: string
  numero: number
  tipo: TipoUnidad
  fila: number
  orden: number
  capacidad: number
  bloqueada: boolean
}

// cotizar(p_tipo_unidad text, p_tipo_alquiler text, p_metodo text,
//         p_desde date, p_hasta date) RETURNS numeric
// Devuelve null si no hay tarifa cargada para esa combinación/fechas.
export type CotizarArgs = {
  p_tipo_unidad: TipoUnidad
  p_tipo_alquiler: TipoAlquilerWeb
  p_metodo: MetodoPago
  p_desde: string
  p_hasta: string
}
export type CotizarResult = number | null

// buscar_unidad_vecina(p_unidad uuid, p_desde date, p_hasta date)
//   RETURNS TABLE(unidad_id uuid, contigua boolean)
// Ojo: NO devuelve los datos completos de la unidad (fila/orden/capacidad/etc),
// solo el id y si es contigua. Para mostrarla en el plano hay que cruzarla con
// el resultado ya cargado de disponibilidad_publica.
export type UnidadVecina = {
  unidad_id: string
  contigua: boolean
}

// config_reservas_publicas (tabla singleton, pk id=true)
export type ConfigReservasPublicas = {
  id: true
  activo: boolean
  tipos_alquiler_web: TipoAlquilerWeb[]
  hora_corte_noshow: string
  max_unidades_por_reserva: number
  max_reservas_activas_por_telefono: number
  dias_anticipacion_max: number
  updated_at: string
}

// leads — anon hoy NO tiene select/insert (confirmado por smoke test); el
// insert real pasa por n8n con otra credencial. Tipo de referencia para
// cuando priusApp habilite el camino correcto (RPC o Edge Function).
export type EstadoLead = 'nuevo' | 'contactado' | 'convertido' | 'descartado'
export type MotivoLead =
  | 'contacto'
  | 'form_abandonado'
  | 'grupo_grande'
  | 'temporada'
  | 'sin_disponibilidad'

export type Lead = {
  id: string
  created_at: string
  nombre: string
  telefono: string
  email: string
  asunto: string
  mensaje: string | null
  origen: string | null
  estado: EstadoLead
  notas_crm: string | null
  motivo: MotivoLead
  datos_form: Record<string, unknown> | null
}

export const CANAL_DISPONIBILIDAD = 'disponibilidad'
export const EVENTO_CAMBIO = 'cambio'

export const REGEX_CODIGO = /^PRIUS-[A-HJ-NP-Z2-9]{6}$/

export const URL_RESERVA = (codigo: string) =>
  `https://priusplayagrande.com.ar/r/${codigo}`
