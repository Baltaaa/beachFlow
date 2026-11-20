import { describe, expect, it } from 'vitest'
import {
  TIPO_ALQUILER_LABEL,
  avatarDe,
  etiquetaUnidad,
  etiquetaUnidades,
  nombreCompleto,
  nombreCorto,
  reservaParaQR,
  reservasDeHoy,
  textoChip,
  unidadDeHoy,
  unidadParaTarjeta,
  unidadesDeHoy,
} from './datosCuenta'

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

describe('/mi-cuenta', () => {
  const HOY = '2026-12-10'
  const r = (codigo, estado, desde, hasta, unidades = [{ tipo: 'carpa', numero: 19 }]) => ({
    codigo, estado, desde, hasta, unidades, total: 1000, saldo: 1000,
  })

  it('QR: la reserva activa en curso hoy, o la próxima; nunca vencidas ni pasadas', () => {
    const reservas = [
      r('PRIUS-AAAAAA', 'preconfirmada', '2026-12-20', '2026-12-20'),
      r('PRIUS-BBBBBB', 'confirmada', '2026-12-09', '2026-12-11'),
      r('PRIUS-CCCCCC', 'vencida', '2026-12-10', '2026-12-10'),
      r('PRIUS-DDDDDD', 'preconfirmada', '2026-12-01', '2026-12-02'),
    ]
    expect(reservaParaQR(reservas, HOY).codigo).toBe('PRIUS-BBBBBB')
    expect(reservaParaQR(reservas.slice(0, 1), HOY).codigo).toBe('PRIUS-AAAAAA')
    expect(reservaParaQR(reservas.slice(2), HOY)).toBeNull()
    expect(reservaParaQR(undefined, HOY)).toBeNull()
  })

  it('Hoy: reservas web de hoy y unidades vigentes que no repiten una reserva web', () => {
    const hoy = reservasDeHoy([r('PRIUS-BBBBBB', 'confirmada', HOY, HOY), r('PRIUS-CCCCCC', 'cancelada', HOY, HOY)], HOY)
    expect(hoy.map((x) => x.codigo)).toEqual(['PRIUS-BBBBBB'])
    const unidades = [
      { tipo: 'carpa', numero: 19, tipo_alquiler: 'dia', desde: HOY, hasta: HOY },
      { tipo: 'sombrilla', numero: 4, tipo_alquiler: 'dia', desde: HOY, hasta: HOY },
      { tipo: 'carpa', numero: 133, tipo_alquiler: 'temporada', desde: '2026-12-01', hasta: '2027-03-31' },
      { tipo: 'carpa', numero: 7, tipo_alquiler: 'periodo', desde: '2027-01-05', hasta: '2027-01-10' },
    ]
    expect(unidadesDeHoy(unidades, HOY, hoy).map(etiquetaUnidad)).toEqual(['Carpa 133', 'Sombrilla 4'])
  })

  it('tarjeta sin QR: solo confirmado, hoy primero y temporada antes que el resto', () => {
    const temporada = { tipo: 'carpa', numero: 133, tipo_alquiler: 'temporada', desde: '2027-01-01', hasta: '2027-03-31' }
    const futura = { tipo: 'sombrilla', numero: 4, tipo_alquiler: 'periodo', desde: '2026-12-20', hasta: '2026-12-22' }
    const deHoy = { tipo: 'sombrilla', numero: 9, tipo_alquiler: 'dia', desde: HOY, hasta: HOY }
    const cuenta = (unidades) => ({ vinculo: 'confirmado', unidades_vigentes: unidades })
    expect(unidadParaTarjeta(cuenta([futura, temporada]), HOY)).toBe(temporada)
    expect(unidadParaTarjeta(cuenta([temporada, deHoy]), HOY)).toBe(deHoy)
    expect(unidadParaTarjeta(cuenta([]), HOY)).toBeNull()
    expect(unidadParaTarjeta({ vinculo: 'pendiente', unidades_vigentes: [deHoy] }, HOY)).toBeNull()
  })

  it('etiquetas', () => {
    expect(etiquetaUnidades([{ tipo: 'carpa', numero: 19 }, { tipo: 'carpa', numero: 20 }])).toBe('Carpa 19 + Carpa 20')
    expect(TIPO_ALQUILER_LABEL.temporada).toBe('Temporada')
  })
})
