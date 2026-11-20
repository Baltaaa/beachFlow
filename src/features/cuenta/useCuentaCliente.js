// Cuenta del cliente web — fuente: mi_cuenta() en priusApp. Reutilizable
// fuera de reservas.
//
// Fase 6B: un solo store para toda la app (navbar, flujo de reserva y
// /mi-cuenta usan la misma sesión y la misma cuenta). Una sola suscripción a
// auth y un solo mi_cuenta() por usuario: lo que refresca uno lo ven todos.
//
// Contrato de mi_cuenta() (priusApp, Fase 5A + 6A.1), siempre jsonb:
//   { ok:true, vinculo:'ninguno',    email, nombre_google, reservas_web:[...] }
//   { ok:true, vinculo:'pendiente',  email, reservas_web:[...] }
//   { ok:true, vinculo:'confirmado', email, cliente:{nombre, apellido,
//       telefono, email, dni_cargado}, unidades_vigentes:[...],
//       reservas_web:[...] }
// reservas_web es siempre de ESTA cuenta (codigos_reserva.user_id), nunca del
// cliente vinculado. unidades_vigentes solo con vínculo confirmado.
// Ojo: la RPC está revocada para `anon` (solo `authenticated`), así que
// llamarla sin sesión no devuelve 'login_requerido' sino un 42501 de
// Postgres. Por eso nunca se llama sin sesión.
import { useSyncExternalStore } from 'react'
import { supabase } from '../../lib/supabase'

let estado = { sesion: null, cuenta: null, cargando: !!supabase }
const oyentes = new Set()
let iniciado = false
// user_id cuya cuenta está cargada (o pidiéndose): evita repetir mi_cuenta()
// en cada TOKEN_REFRESHED (el refresh del access token dispara
// onAuthStateChange).
let cacheUserId = null
let pedido = null
// Invalida respuestas que llegan tarde (cerró sesión, cambió de cuenta o
// completar_cuenta() ya trajo la cuenta nueva).
let generacion = 0

function actualizar(parcial) {
  estado = { ...estado, ...parcial }
  oyentes.forEach((avisar) => avisar())
}

function aplicarSesion(sesion) {
  const userId = sesion?.user?.id ?? null
  if (!userId) {
    cacheUserId = null
    pedido = null
    generacion++
    actualizar({ sesion: null, cuenta: null, cargando: false })
    return
  }
  if (cacheUserId === userId) {
    actualizar({ sesion })
    return
  }
  actualizar({ sesion, cuenta: null, cargando: true })
  // Fuera del callback de auth: llamar a otra función async de supabase ahí
  // adentro puede trabar el lock interno de auth-js.
  setTimeout(traerCuenta, 0)
}

function iniciar() {
  if (iniciado || !supabase) return
  iniciado = true
  supabase.auth.getSession().then(({ data }) => aplicarSesion(data.session ?? null))
  supabase.auth.onAuthStateChange((_evento, nuevaSesion) => aplicarSesion(nuevaSesion ?? null))
}

function suscribir(avisar) {
  oyentes.add(avisar)
  iniciar()
  return () => oyentes.delete(avisar)
}

const leer = () => estado

async function traerCuenta() {
  const userId = estado.sesion?.user?.id ?? null
  if (!supabase || !userId) return null
  if (pedido && cacheUserId === userId) return pedido
  cacheUserId = userId
  const gen = ++generacion
  actualizar({ cargando: true })
  pedido = (async () => {
    try {
      const { data, error } = await supabase.rpc('mi_cuenta')
      if (error) throw error
      if (gen === generacion) actualizar({ cuenta: data, cargando: false })
      return data
    } catch (err) {
      console.error('[cuenta] mi_cuenta() falló:', err)
      if (gen === generacion) {
        cacheUserId = null
        actualizar({ cuenta: null, cargando: false })
      }
      return null
    } finally {
      if (gen === generacion) pedido = null
    }
  })()
  return pedido
}

/** Vuelve a pedir mi_cuenta() aunque esté cacheada. */
function refrescar() {
  if (!pedido) cacheUserId = null
  return traerCuenta()
}

// completar_cuenta() ya devuelve el estado nuevo de la cuenta (mismo
// contrato que mi_cuenta()): se usa tal cual como cuenta, se invalida lo
// cacheado y se reemplaza con esa respuesta. Volver a pedir mi_cuenta() acá
// no aporta nada y pasaba por "Cargando…" en el medio.
function actualizarCuenta(nueva) {
  generacion++
  pedido = null
  cacheUserId = null
  if (!nueva || nueva.ok === false) return
  cacheUserId = estado.sesion?.user?.id ?? null
  actualizar({ cuenta: nueva, cargando: false })
}

async function cerrarSesion() {
  cacheUserId = null
  pedido = null
  generacion++
  actualizar({ cuenta: null })
  if (supabase) await supabase.auth.signOut()
  actualizar({ sesion: null, cargando: false })
}

export function useCuentaCliente() {
  const { sesion, cuenta, cargando } = useSyncExternalStore(suscribir, leer, leer)
  return { sesion, cargando, cuenta, refrescar, actualizarCuenta, cerrarSesion }
}
