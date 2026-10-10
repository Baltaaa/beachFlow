// Copias exactas de los esquemas zod reales de priusApp:
//   supabase/functions/crear-reserva-publica/index.ts (const Entrada)
//   supabase/functions/lead-reserva/index.ts (const Entrada)
// Verificado línea por línea el 2026-10-09. Corren en Deno del lado de
// priusApp, no se pueden importar directo desde este repo (Vite/browser) —
// mantener sincronizado a mano si cambia el lado de priusApp, mismo
// criterio que supabase/functions/_shared/parse.ts allá ("Espejo de
// src/lib/parse.ts — mantener sincronizado"). Solo se usa en el test de
// contrato (api.payload.test.js), nunca en código de producción.
import { z } from 'zod'

export const EntradaCrearReservaPublica = z.object({
  tipo_alquiler: z.enum(['dia', 'periodo']),
  desde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  cantidad_personas: z.number().int().min(1).max(30),
  tipo_unidad: z.enum(['carpa', 'sombrilla']),
  unidad_ids: z.array(z.string().uuid()).min(1).max(2),
  metodo_pago: z.enum(['efectivo', 'transferencia', 'mercado_pago', 'tarjeta_debito', 'tarjeta_credito']),
  cliente: z.object({
    nombre: z.string().min(1),
    apellido: z.string().min(1),
    telefono_e164: z.string().min(1),
    email: z.string().min(1),
    dni: z.string().nullable().optional(),
  }),
  lead_id: z.string().uuid().nullable().optional(),
  turnstile_token: z.string().optional().default(''),
})

export const EntradaLeadReserva = z.object({
  lead_id: z.string().uuid().nullable().optional(),
  nombre: z.string().min(1),
  telefono_e164: z.string().min(1),
  email: z.string().nullable().optional(),
  motivo: z.enum(['form_abandonado', 'grupo_grande', 'temporada', 'sin_disponibilidad']),
  mensaje: z.string().nullable().optional(),
  datos_form: z.record(z.unknown()).nullable().optional(),
  turnstile_token: z.string().optional().default(''),
})
