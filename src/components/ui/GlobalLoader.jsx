import React, { useEffect, useState } from "react"

export default function GlobalLoader({ message = "Cargando experiencia Prius" }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Incremento orgánico y fluido
        const remaining = 100 - prev
        const increment = Math.max(1, Math.floor(Math.random() * (remaining * 0.2)))
        return prev + increment
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-prius-black z-[9999] flex flex-col items-center justify-center p-6 select-none animate-premium-fade">
      <div className="relative flex flex-col items-center max-w-xs w-full text-center space-y-8">
        {/* Logo con animación de pulso suave */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <img 
            src="/logo-prius.png" 
            alt="Prius" 
            className="w-full h-full object-contain brightness-0 invert animate-pulse duration-[2000ms]"
          />
        </div>

        {/* Mensaje y barra de progreso */}
        <div className="w-full space-y-3">
          <p className="text-[10px] font-extralight uppercase tracking-[0.3em] text-gold font-display">
            {message}
          </p>
          
          {/* Contenedor de la barra (1px hairline border) */}
          <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gold transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-[9px] font-extralight text-white/40 font-mono">
            {progress}%
          </p>
        </div>
      </div>
    </div>
  )
}