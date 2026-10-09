// Utilidades de fecha del flujo de reservas. Siempre zona horaria
// America/Argentina/Buenos_Aires, nunca la del navegador (mismo criterio
// que priusApp) — las columnas `date` puras se anclan a mediodía UTC antes
// de formatear, para no correrse un día.

const TZ = 'America/Argentina/Buenos_Aires'

export function hoyArgentinaISO() {
  const partes = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date())
  return partes // en-CA da yyyy-mm-dd
}

export function horaArgentinaActual() {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date()) // "HH:MM"
}

export function sumarDiasISO(iso, dias) {
  const d = new Date(`${iso}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + dias)
  return d.toISOString().slice(0, 10)
}

export function diferenciaDiasInclusive(desdeISO, hastaISO) {
  const a = new Date(`${desdeISO}T12:00:00Z`)
  const b = new Date(`${hastaISO}T12:00:00Z`)
  return Math.round((b - a) / 86400000) + 1
}

export function isoADate(iso) {
  if (!iso) return undefined
  return new Date(`${iso}T12:00:00`)
}

export function dateAIso(date) {
  if (!date) return null
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const FORMATO_CORTO = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: '2-digit', month: '2-digit', timeZone: 'UTC' })
const FORMATO_DIA_MES = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' })

export function resumenFechas(desdeISO, hastaISO) {
  if (!desdeISO) return ''
  if (!hastaISO || hastaISO === desdeISO) {
    const partes = FORMATO_CORTO.formatToParts(isoADate(desdeISO))
    const dia = partes.find((p) => p.type === 'weekday')?.value ?? ''
    const diaCap = dia.charAt(0).toUpperCase() + dia.slice(1)
    const ddmm = FORMATO_DIA_MES.format(isoADate(desdeISO))
    return `${diaCap} ${ddmm} · 1 día`
  }
  const dias = diferenciaDiasInclusive(desdeISO, hastaISO)
  return `${FORMATO_DIA_MES.format(isoADate(desdeISO))} al ${FORMATO_DIA_MES.format(isoADate(hastaISO))} · ${dias} días`
}

export function formatoPesos(monto) {
  if (monto == null) return null
  return `$ ${Math.round(monto).toLocaleString('es-AR')}`
}
