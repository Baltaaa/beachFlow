import { parsePhoneNumberFromString } from 'libphonenumber-js'

// crear-reserva-publica y lead-reserva piden telefono_e164 ya en formato
// E.164 (ej. "+5492235765482") — nunca el string tal cual lo tipeó el
// cliente.
export function telefonoValido(raw) {
  return !!parsePhoneNumberFromString(raw ?? '', 'AR')?.isValid()
}

export function telefonoE164(raw) {
  const parsed = parsePhoneNumberFromString(raw ?? '', 'AR')
  return parsed?.isValid() ? parsed.number : null
}
