// Cuenta del cliente web — fuente: mi_cuenta() en priusApp. Reutilizable
// fuera de reservas.
//
// No tiene nada específico del flujo de reserva a propósito: la futura
// sección de actividades, la carta del café y los pedidos desde la carpa por
// QR de unidad se cuelgan de este mismo hook.
//
// Contrato de mi_cuenta() (priusApp, Fase 5A), siempre jsonb:
//   { ok:true, vinculo:'ninguno',    email, nombre_google }
//   { ok:true, vinculo:'pendiente',  email }
//   { ok:true, vinculo:'confirmado', email, cliente:{nombre, apellido,
//       telefono, email, dni_cargado}, unidades_vigentes:[...],
//       reservas_web:[...] }
// Ojo: la RPC está revocada para `anon` (solo `authenticated`), así que
// llamarla sin sesión no devuelve 'login_requerido' sino un 42501 de
// Postgres. Por eso nunca se llama sin sesión.
import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'

export function useCuentaCliente() {
  const [sesion, setSesion] = useState(null)
  const [cuenta, setCuenta] = useState(null)
  const [cargando, setCargando] = useState(!!supabase)
  // user_id cuya cuenta ya está cacheada: evita repetir mi_cuenta() en cada
  // TOKEN_REFRESHED (el refresh del access token dispara onAuthStateChange).
  const cacheRef = useRef(null)

  useEffect(() => {
    if (!supabase) {
      setCargando(false)
      return
    }
    let vivo = true

    supabase.auth.getSession().then(({ data }) => {
      if (!vivo) return
      setSesion(data.session ?? null)
      if (!data.session) setCargando(false)
    })

    // Solo se actualiza el estado acá dentro: llamar a otra función async de
    // supabase dentro del callback puede trabar el lock interno de auth-js.
    // El fetch de la cuenta vive en el efecto de abajo.
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, nuevaSesion) => {
      if (!vivo) return
      setSesion(nuevaSesion ?? null)
      if (!nuevaSesion) {
        cacheRef.current = null
        setCuenta(null)
        setCargando(false)
      }
    })

    return () => {
      vivo = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const userId = sesion?.user?.id ?? null

  const traerCuenta = useCallback(async () => {
    if (!supabase || !userId) return null
    setCargando(true)
    try {
      const { data, error } = await supabase.rpc('mi_cuenta')
      if (error) throw error
      cacheRef.current = userId
      setCuenta(data)
      return data
    } catch (err) {
      console.error('[cuenta] mi_cuenta() falló:', err)
      cacheRef.current = null
      setCuenta(null)
      return null
    } finally {
      setCargando(false)
    }
  }, [userId])

  // Se dispara al iniciar sesión y cuando cambia de cuenta; cacheada mientras
  // dure la sesión.
  useEffect(() => {
    if (!userId || cacheRef.current === userId) return
    traerCuenta()
  }, [userId, traerCuenta])

  const cerrarSesion = useCallback(async () => {
    cacheRef.current = null
    setCuenta(null)
    if (supabase) await supabase.auth.signOut()
    setSesion(null)
  }, [])

  // completar_cuenta() ya devuelve el estado nuevo de la cuenta (mismo
  // contrato que mi_cuenta()): se usa tal cual como cuenta, se invalida lo
  // cacheado y se reemplaza con esa respuesta. Volver a pedir mi_cuenta()
  // acá no aporta nada y pasaba por "Cargando…" en el medio.
  const actualizarCuenta = useCallback(
    (nueva) => {
      cacheRef.current = null
      if (!nueva || nueva.ok === false) return
      cacheRef.current = userId
      setCuenta(nueva)
    },
    [userId],
  )

  return { sesion, cargando, cuenta, refrescar: traerCuenta, actualizarCuenta, cerrarSesion }
}
