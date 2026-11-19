import { useSyncExternalStore } from 'react'

// Mismo corte que MarcoPlanoClaro: variante "amplia" desde 768px, "compacta"
// por debajo.
const CONSULTA = '(min-width: 768px)'

function suscribir(avisar) {
  const mq = window.matchMedia(CONSULTA)
  mq.addEventListener('change', avisar)
  return () => mq.removeEventListener('change', avisar)
}

export function useEsAmplia() {
  return useSyncExternalStore(
    suscribir,
    () => window.matchMedia(CONSULTA).matches,
    () => true,
  )
}
