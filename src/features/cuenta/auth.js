// Login con Google para clientes (Fase 5B). El proveedor y las Redirect URLs
// se configuran del lado de Supabase/priusApp; acá solo se dispara el flujo.
import { supabase } from '../../lib/supabase'
import { urlDeRetorno } from '../reservas/persistenciaFlow'

/**
 * La página actual, para volver a ella después de Google (navbar, Fase 6B).
 * Sin fragmento ni restos de una vuelta de OAuth anterior.
 */
export function urlDeEstaPagina() {
  const url = new URL(window.location.href)
  for (const clave of ['reserva', 'error', 'error_code', 'error_description', 'code']) url.searchParams.delete(clave)
  const query = url.searchParams.toString()
  return `${url.origin}${url.pathname}${query ? `?${query}` : ''}`
}

/**
 * Manda al cliente a Google. Si resuelve, el browser ya está navegando: no
 * hay que hacer nada más. Devuelve { ok:false } si ni siquiera pudo arrancar.
 *
 * `volverA`: a dónde vuelve. Default: el flujo de reserva
 * (`/?reserva=continuar`); el navbar pasa `urlDeEstaPagina()`. Tiene que estar
 * en las Redirect URLs de Supabase (`<origen>/**`); si no, Supabase vuelve a
 * la Site URL.
 *
 * `prompt: 'select_account'` para que "Cambiar cuenta" ofrezca de verdad el
 * selector en vez de reentrar con la sesión de Google que ya estaba abierta.
 */
export async function iniciarSesionGoogle({ volverA } = {}) {
  if (!supabase) return { ok: false }
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // window.location.origin: anda igual en localhost, en la preview de
        // Cloudflare y en producción, sin hardcodear ninguna URL.
        redirectTo: volverA ?? urlDeRetorno(),
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
  try {
    const { data, error } = await supabase.rpc('completar_cuenta', {
      p: {
        nombre,
        apellido,
        telefono_e164: telefonoE164,
        dni: dni || null,
      },
    })
    if (error) throw error
    return data ?? { ok: false, error: 'interno' }
  } catch (err) {
    console.error('[cuenta] completar_cuenta() falló:', err)
    return { ok: false, error: 'interno' }
  }
}
