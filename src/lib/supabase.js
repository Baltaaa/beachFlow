import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigurado = !!SUPABASE_URL && !!SUPABASE_ANON_KEY

if (!supabaseConfigurado) {
  // createClient() tira una excepción sincrónica si falta la URL — y como
  // este módulo se importa desde ContactSection (que siempre se renderiza
  // en la landing), esa excepción rompía toda la página, no solo el
  // cotizador. Nunca llamar a createClient() sin las dos env vars.
  console.error(
    '[reservas] Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. El flujo de reservas queda deshabilitado; el resto de la landing sigue funcionando.',
  )
}

// Fase 5B: login de clientes con Google.
// - persistSession / detectSessionInUrl ya eran el default de auth-js, pero
//   van explícitos porque de ellos depende que la sesión sobreviva al
//   redirect de OAuth y que el callback se procese al volver a la landing.
// - flowType 'pkce' NO es el default ('implicit'): sin esto el token viajaría
//   en el fragmento de la URL en vez de intercambiarse por un code verifier.
export const supabase = supabaseConfigurado
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  : null
