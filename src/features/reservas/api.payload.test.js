// Valida que los payloads que arma api.js pasan los esquemas zod reales de
// priusApp (copiados en ./edgeFunctionsSchemas.js) — así un cambio de campo
// en api.js que rompa el contrato se detecta acá, no en producción contra
// la Edge Function real.
import { describe, it, expect } from 'vitest'
import { armarPayloadCrearReserva, armarPayloadLeadReserva } from './api'
import { EntradaCrearReservaPublica, EntradaLeadReserva } from './edgeFunctionsSchemas'

describe('armarPayloadCrearReserva', () => {
  it('arma un payload que valida contra el schema real de crear-reserva-publica', () => {
    const payload = armarPayloadCrearReserva({
      tipoAlquiler: 'dia',
      desde: '2026-10-15',
      hasta: '2026-10-15',
      personas: 2,
      tipoUnidad: 'carpa',
      unidadIds: ['11111111-1111-1111-1111-111111111111'],
      metodoPago: 'efectivo',
      cliente: {
        nombre: 'Juan',
        apellido: 'Pérez',
        telefonoE164: '+5492235765482',
        email: 'juan@example.com',
        dni: '30123456',
      },
      leadId: null,
      turnstileToken: 'token-de-prueba',
    })

    expect(() => EntradaCrearReservaPublica.parse(payload)).not.toThrow()
    expect(payload).toEqual({
      tipo_alquiler: 'dia',
      desde: '2026-10-15',
      hasta: '2026-10-15',
      cantidad_personas: 2,
      tipo_unidad: 'carpa',
      unidad_ids: ['11111111-1111-1111-1111-111111111111'],
      metodo_pago: 'efectivo',
      cliente: {
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono_e164: '+5492235765482',
        email: 'juan@example.com',
        dni: '30123456',
      },
      lead_id: null,
      turnstile_token: 'token-de-prueba',
    })
  })

  it('acepta dni y lead_id ausentes, con dos unidades (grupo)', () => {
    const payload = armarPayloadCrearReserva({
      tipoAlquiler: 'periodo',
      desde: '2026-10-15',
      hasta: '2026-10-20',
      personas: 8,
      tipoUnidad: 'carpa',
      unidadIds: ['11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'],
      metodoPago: 'transferencia',
      cliente: { nombre: 'Ana', apellido: 'Gómez', telefonoE164: '+5492235765483', email: 'ana@example.com' },
      leadId: undefined,
      turnstileToken: undefined,
    })
    expect(() => EntradaCrearReservaPublica.parse(payload)).not.toThrow()
    expect(payload.cliente.dni).toBeNull() // dni ausente -> null, nunca undefined
    expect(payload.lead_id).toBeNull()
    // turnstile_token nunca null — el schema real lo pide string.
    expect(payload.turnstile_token).toBe('')
  })

  it('un tipo_unidad inválido falla el schema real', () => {
    const payload = armarPayloadCrearReserva({
      tipoAlquiler: 'dia',
      desde: '2026-10-15',
      hasta: '2026-10-15',
      personas: 1,
      tipoUnidad: 'cabina', // no habilitado para reserva pública
      unidadIds: ['11111111-1111-1111-1111-111111111111'],
      metodoPago: 'efectivo',
      cliente: { nombre: 'Juan', apellido: 'Pérez', telefonoE164: '+5492235765482', email: 'juan@example.com' },
      turnstileToken: 't',
    })
    expect(() => EntradaCrearReservaPublica.parse(payload)).toThrow()
  })
})

describe('armarPayloadLeadReserva', () => {
  it('arma un payload que valida contra el schema real de lead-reserva', () => {
    const payload = armarPayloadLeadReserva({
      leadId: null,
      nombre: 'Juan Pérez',
      telefonoE164: '+5492235765482',
      email: 'juan@example.com',
      motivo: 'form_abandonado',
      mensaje: null,
      datosForm: { fechas: { desde: '2026-10-15' }, personas: 2 },
      turnstileToken: 'token-de-prueba',
    })

    expect(() => EntradaLeadReserva.parse(payload)).not.toThrow()
    expect(payload).toEqual({
      lead_id: null,
      nombre: 'Juan Pérez',
      telefono_e164: '+5492235765482',
      email: 'juan@example.com',
      motivo: 'form_abandonado',
      mensaje: null,
      datos_form: { fechas: { desde: '2026-10-15' }, personas: 2 },
      turnstile_token: 'token-de-prueba',
    })
  })

  it('"contacto" no es un motivo válido acá — ese caso va siempre al form de n8n', () => {
    const payload = armarPayloadLeadReserva({
      nombre: 'Juan Pérez',
      telefonoE164: '+5492235765482',
      motivo: 'contacto',
      turnstileToken: 't',
    })
    expect(() => EntradaLeadReserva.parse(payload)).toThrow()
  })

  it('los 4 motivos reales del flujo de reserva pasan el schema', () => {
    for (const motivo of ['form_abandonado', 'grupo_grande', 'temporada', 'sin_disponibilidad']) {
      const payload = armarPayloadLeadReserva({
        nombre: 'Juan Pérez',
        telefonoE164: '+5492235765482',
        motivo,
        turnstileToken: 't',
      })
      expect(() => EntradaLeadReserva.parse(payload)).not.toThrow()
    }
  })
})
