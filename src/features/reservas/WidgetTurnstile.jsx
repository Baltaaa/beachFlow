import { useEffect } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { SITE_KEY } from './turnstileConfig'

// Monta el widget y avisa cuándo está listo y cuándo se desmontó. La
// librería no expone eso por el ref: execute() y reset() sobre un widget que
// todavía no se renderizó solo loguean "Turnstile has not been loaded or
// container not found" y no hacen nada — la promesa del token quedaba colgada
// para siempre.
export default function WidgetTurnstile({ widgetRef, onListo, onDesmontado, onToken }) {
  useEffect(() => onDesmontado, [onDesmontado])
  return (
    <Turnstile
      ref={widgetRef}
      siteKey={SITE_KEY}
      options={{ size: 'invisible', execution: 'execute' }}
      onWidgetLoad={onListo}
      onSuccess={(token) => onToken(token)}
      onError={() => onToken(null)}
      onExpire={() => onToken(null)}
      onTimeout={() => onToken(null)}
    />
  )
}
