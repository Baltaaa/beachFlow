import { createContext, useContext } from 'react'

// Nodo del footer fijo del marco (Fase 6B). Cada paso declara sus botones con
// <PiePaso> y se dibujan ahí por portal, así el footer queda siempre en el
// mismo lugar y del mismo alto aunque el cuerpo scrollee.
export const ContextoPieMarco = createContext(null)

export function useNodoPie() {
  return useContext(ContextoPieMarco)
}
