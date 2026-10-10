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

export const supabase = supabaseConfigurado ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null
