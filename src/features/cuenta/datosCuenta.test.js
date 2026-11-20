import { describe, expect, it } from 'vitest'
import { avatarDe, nombreCompleto, nombreCorto, textoChip, unidadDeHoy } from './datosCuenta'

const sesion = {
  user: {
    email: 'balta@example.com',
    user_metadata: { full_name: 'Baltasar Bruschetti', avatar_url: 'https://lh3.googleusercontent.com/a/x' },
  },
}
const HOY = '2027-01-10'
const temporada = { tipo: 'carpa', numero: 133, tipo_alquiler: 'temporada', desde: '2026-12-01', hasta: '2027-03-15' }
const diaHoy = { tipo: 'sombrilla', numero: 12, tipo_alquiler: 'dia', desde: HOY, hasta: HOY }
const futura = { tipo: 'carpa', numero: 40, tipo_alquiler: 'dia', desde: '2027-01-20', hasta: '2027-01-20' }

const confirmado = (unidades) => ({
  ok: true,
  vinculo: 'confirmado',
  email: 'balta@example.com',
  cliente: { nombre: 'Balta', apellido: 'Bruschetti' },
  unidades_vigentes: unidades,
  reservas_web: [],
})

describe('unidadDeHoy', () => {
  it('prioriza la temporada sobre otra unidad del mismo día', () => {
    expect(unidadDeHoy([diaHoy, temporada], HOY)).toBe(temporada)
  })
  it('sin temporada, cualquier tipo vigente hoy', () => {
    expect(unidadDeHoy([futura, diaHoy], HOY)).toBe(diaHoy)
  })
  it('una reserva futura no cuenta como de hoy', () => {
    expect(unidadDeHoy([futura], HOY)).toBeNull()
    expect(unidadDeHoy(undefined, HOY)).toBeNull()
  })
})

describe('textoChip', () => {
  it('confirmado con unidad hoy: "Balta · Carpa 133"', () => {
    expect(textoChip(confirmado([temporada]), sesion, HOY)).toBe('Balta · Carpa 133')
  })
  it('confirmado sin unidad hoy: solo el nombre', () => {
    expect(textoChip(confirmado([futura]), sesion, HOY)).toBe('Balta')
  })
  it('pendiente: nombre de Google, nunca una unidad', () => {
    const pendiente = { ok: true, vinculo: 'pendiente', email: 'balta@example.com', unidades_vigentes: [temporada] }
    expect(textoChip(pendiente, sesion, HOY)).toBe('Baltasar')
  })
  it('sin nombre de Google: la parte local del email', () => {
    expect(nombreCorto(null, { user: { email: 'lu@example.com', user_metadata: {} } })).toBe('lu')
  })
})

describe('avatar y nombre completo', () => {
  it('avatar_url o picture', () => {
    expect(avatarDe(sesion)).toBe('https://lh3.googleusercontent.com/a/x')
    expect(avatarDe({ user: { user_metadata: { picture: 'p' } } })).toBe('p')
    expect(avatarDe(null)).toBeNull()
  })
  it('confirmado: nombre y apellido del cliente; si no, el de Google', () => {
    expect(nombreCompleto(confirmado([]), sesion)).toBe('Balta Bruschetti')
    expect(nombreCompleto({ vinculo: 'ninguno' }, sesion)).toBe('Baltasar Bruschetti')
  })
})
