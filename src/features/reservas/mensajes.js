// Textos del flujo de reservas públicas. Fuente de verdad: el prompt de la
// Fase 4B y el CLAUDE.md de priusApp (códigos de error de las Edge
// Functions). Ante la duda, menos texto — y nunca "garantizada",
// "asegurada" ni "confirmada" para una reserva que todavía no se pagó.

// Se activa en la Fase 5 (entrega de QR por email).
export const EMAIL_RESERVA_ACTIVO = false

export const MENSAJE_SUJETO_A_DISPONIBILIDAD = (hora) =>
  `Tu reserva queda preconfirmada y sujeta a disponibilidad hasta que abones en la recepción del balneario. Te guardamos el lugar hasta las ${hora} del primer día: si no llegás y abonás antes de esa hora, se libera.`

export const CHECKBOX_SUJETO_A_DISPONIBILIDAD =
  'Entiendo que mi reserva queda sujeta a disponibilidad hasta que realice el pago en el balneario.'

export const MENSAJE_PRECONFIRMADA_PASO6 = (hora, fechaInicio) =>
  `Reserva preconfirmada. Se confirma al abonar en recepción, hasta las ${hora} del ${fechaInicio}.`

export const BADGE_PRECONFIRMADA = 'Preconfirmada — pagás al llegar'
export const BADGE_CONFIRMADA = 'Confirmada'
export const MENSAJE_VENCIDA =
  'Esta reserva venció porque no se abonó a tiempo y el lugar se liberó. Podés hacer una nueva.'

export const MENSAJE_RESERVA_NO_ENCONTRADA = 'No encontramos esa reserva.'

export const MENSAJE_RESERVAS_PAUSADAS =
  'Las reservas online están pausadas por el momento. Escribinos por WhatsApp o dejanos tu consulta y te respondemos a la brevedad.'

export const MENSAJE_SIN_TARIFA =
  'Todavía no hay reservas online para esas fechas.'

export const MENSAJE_GRUPO_GRANDE =
  'Para grupos de este tamaño, coordinamos con vos directamente.'

export const MENSAJE_SIN_LUGAR = 'No quedan lugares para esas fechas.'

export const MENSAJE_SIN_VECINA =
  'No hay otra unidad libre para esas fechas.'

export const MENSAJE_UNIDAD_TOMADA = 'Alguien reservó esa unidad recién.'

export const MENSAJE_TOCAR_PARA_ACERCAR = 'Tocá para acercar'

export const AYUDA_EMAIL = 'Te enviamos tu código de reserva acá'

export const LINK_CONSULTA_TEMPORADA = '¿Temporada completa? Consultanos'

// Mensajes de negocio de las Edge Functions (crear-reserva-publica,
// consultar-reserva, lead-reserva). Códigos documentados en el CLAUDE.md de
// priusApp — no inventar ninguno nuevo desde este repo.
export const MENSAJES_ERROR = {
  reservas_desactivadas: MENSAJE_RESERVAS_PAUSADAS,
  tipo_no_habilitado: 'Ese tipo de alquiler no está disponible online para esas fechas.',
  fechas_invalidas: 'Las fechas elegidas no son válidas.',
  fuera_de_temporada: 'Esas fechas están fuera de temporada.',
  fuera_de_anticipacion: 'Esas fechas están demasiado lejos para reservar online.',
  corte_horario_hoy: 'Ya pasó el horario para reservar el día de hoy online.',
  capacidad_excedida: MENSAJE_GRUPO_GRANDE,
  unidades_invalidas: 'Esa selección ya no está disponible. Volvé a elegir en el plano.',
  unidad_no_disponible: 'Esa unidad se acaba de ocupar. Elegí otra en el plano.',
  sin_vecina_disponible: MENSAJE_SIN_VECINA,
  limite_por_telefono: 'Ya tenés el máximo de reservas activas con este teléfono.',
  sin_tarifa: MENSAJE_SIN_TARIFA,
  no_encontrada: MENSAJE_RESERVA_NO_ENCONTRADA,
  datos_invalidos: 'Revisá los datos ingresados.',
  captcha_invalido: 'No pudimos verificar que sos una persona. Probá de nuevo.',
  rate_limited: 'Probá de nuevo en unos minutos.',
  interno: 'Algo salió mal. Intentá de nuevo o escribinos directamente por WhatsApp.',
}

export function mensajeDeError(codigo) {
  return MENSAJES_ERROR[codigo] ?? MENSAJES_ERROR.interno
}
