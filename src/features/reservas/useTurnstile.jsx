import { useCallback, useRef } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY

// Widget invisible/managed, montado una sola vez por ReservaFlow. El token
// es de un solo uso: cada llamada a obtenerToken() ejecuta el challenge,
// espera el resultado, y resetea el widget para la próxima vez.
export function useTurnstile() {
  const widgetRef = useRef(null)
  const resolverRef = useRef(null)

  const widget = (
    <Turnstile
      ref={widgetRef}
      siteKey={SITE_KEY}
      options={{ size: 'invisible', execution: 'execute' }}
      onSuccess={(token) => resolverRef.current?.(token)}
      onError={() => resolverRef.current?.(null)}
      onExpire={() => resolverRef.current?.(null)}
    />
  )

  const obtenerToken = useCallback(() => {
    return new Promise((resolve) => {
      resolverRef.current = resolve
      widgetRef.current?.execute()
    }).finally(() => {
      widgetRef.current?.reset()
    })
  }, [])

  return { widget, obtenerToken }
}
