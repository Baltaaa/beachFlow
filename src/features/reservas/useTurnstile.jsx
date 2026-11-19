import { useCallback, useRef } from 'react'
import WidgetTurnstile from './WidgetTurnstile'
import { SITE_KEY } from './turnstileConfig'

// Sin site key no hay forma de conseguir un token válido — crear-reserva-
// publica y lead-reserva van a rechazar todo con captcha_invalido. Mejor
// mostrar "pausadas" de entrada que dejar completar los 6 pasos para
// fallar recién al final.
export const turnstileConfigurado = !!SITE_KEY

// Cuánto se espera a que el script cargue y el widget quede renderizado (al
// volver de Google la página arranca de cero y el script puede tardar).
const ESPERA_WIDGET_MS = 15000
// Cuánto se espera la respuesta del challenge una vez ejecutado.
const ESPERA_TOKEN_MS = 30000

// Widget invisible, montado una sola vez por ReservaFlow. El token es de un
// solo uso: cada llamada a obtenerToken() espera a que el widget esté
// montado, ejecuta el challenge, espera el resultado y resetea el widget para
// la próxima. Las llamadas se encolan (el lead del Paso 4 y la reserva del
// Paso 5 pueden pisarse). Nunca rechaza: sin token devuelve null y la Edge
// Function responde captcha_invalido, que el paso muestra como error.
export function useTurnstile() {
  const widgetRef = useRef(null)
  const listoRef = useRef(false)
  const esperandoListoRef = useRef([])
  const resolverTokenRef = useRef(null)
  const colaRef = useRef(Promise.resolve())

  const onListo = useCallback(() => {
    listoRef.current = true
    esperandoListoRef.current.splice(0).forEach((avisar) => avisar(true))
  }, [])

  const onDesmontado = useCallback(() => {
    listoRef.current = false
    resolverTokenRef.current?.(null)
  }, [])

  const onToken = useCallback((token) => {
    resolverTokenRef.current?.(token)
  }, [])

  const widget = (
    <WidgetTurnstile
      widgetRef={widgetRef}
      onListo={onListo}
      onDesmontado={onDesmontado}
      onToken={onToken}
    />
  )

  const esperarWidget = useCallback(() => {
    if (listoRef.current && widgetRef.current) return Promise.resolve(true)
    return new Promise((resolve) => {
      const avisar = (ok) => {
        clearTimeout(timer)
        resolve(ok)
      }
      const timer = setTimeout(() => {
        esperandoListoRef.current = esperandoListoRef.current.filter((x) => x !== avisar)
        resolve(false)
      }, ESPERA_WIDGET_MS)
      esperandoListoRef.current.push(avisar)
    })
  }, [])

  const ejecutar = useCallback(async () => {
    const listo = await esperarWidget()
    if (!listo || !widgetRef.current) {
      console.warn('[turnstile] el widget no se montó a tiempo: se sigue sin token')
      return null
    }
    try {
      return await new Promise((resolve) => {
        const timer = setTimeout(() => terminar(null), ESPERA_TOKEN_MS)
        function terminar(token) {
          clearTimeout(timer)
          resolverTokenRef.current = null
          resolve(token ?? null)
        }
        resolverTokenRef.current = terminar
        widgetRef.current.execute()
      })
    } finally {
      // Token de un solo uso: se resetea después de cada uso, siempre que
      // el widget siga montado.
      if (listoRef.current && widgetRef.current) widgetRef.current.reset()
    }
  }, [esperarWidget])

  const obtenerToken = useCallback(() => {
    const turno = colaRef.current.then(ejecutar)
    colaRef.current = turno.catch(() => {})
    return turno
  }, [ejecutar])

  return { widget, obtenerToken }
}
