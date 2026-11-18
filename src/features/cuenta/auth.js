// Login con Google para clientes (Fase 5B). El proveedor y las Redirect URLs
// se configuran del lado de Supabase/priusApp; acá solo se dispara el flujo.
import { supabase } from '../../lib/supabase'
import { urlDeRetorno } from '../reservas/persistenciaFlow'

/**
 * Manda al cliente a Google. Si resuelve, el browser ya está navegando: no
 * hay que hacer nada más. Devuelve { ok:false } si ni siquiera pudo arrancar.
 *
 * `prompt: 'select_account'` para que "Cambiar cuenta" ofrezca de verdad el
 * selector en vez de reentrar con la sesión de Google que ya estaba abierta.
 */
export async function iniciarSesionGoogle() {
  if (!supabase) return { ok: false }
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // window.location.origin: anda igual en localhost, en la preview de
        // Cloudflare y en producción, sin hardcodear ninguna URL.
        redirectTo: urlDeRetorno(),
        queryParams: { prompt: 'select_account' },
      },
    })
    if (error) throw error
    return { ok: true }
  } catch (err) {
    console.error('[cuenta] signInWithOAuth falló:', err)
    return { ok: false }
  }
}

/** completar_cuenta(p) — alta/vínculo del cliente web. Devuelve el jsonb crudo. */
export async function completarCuenta({ nombre, apellido, telefonoE164, dni }) {
  if (!supabase) return { ok: false, error: 'interno' }
  const { data, error } = await supabase.rpc('completar_cuenta', {
    p: {
      nombre,
      apellido,
      telefono_e164: telefonoE164,
      dni: dni || null,
    },
  })
  if (error) {
    console.error('[cuenta] completar_cuenta() falló:', error)
    return { ok: false, error: 'interno' }
  }
  return data
}
