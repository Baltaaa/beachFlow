import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Eye, EyeOff, Loader2 } from "lucide-react"

// Logo Component inline
function BeachFlowLogo({ size = "default", showText = true, className = "" }) {
  const sizes = {
    small: { width: 84, height: 58, text: "text-lg" },
    default: { width: 64, height: 44, text: "text-2xl" },
    large: { width: 84, height: 58, text: "text-3xl" },
    xl: { width: 110, height: 76, text: "text-4xl" },
  }
  
  const { width, height, text: textSize } = sizes[size] || sizes.default
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 120 80" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="aquaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5BC0EB" />
            <stop offset="50%" stopColor="#3AA7D6" />
            <stop offset="100%" stopColor="#2E8BC0" />
          </linearGradient>
          <linearGradient id="splashGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3AA7D6" />
            <stop offset="100%" stopColor="#7DD3F0" />
          </linearGradient>
        </defs>
        <path 
          d="M4 22 Q8 22, 12 38 Q16 54, 22 54 Q28 54, 32 38 Q36 22, 42 22 Q48 22, 52 38 Q56 54, 62 54 Q66 54, 68 46 Q70 38, 74 34"
          stroke="url(#aquaGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path 
          d="M68 42 Q76 32, 82 28 Q90 22, 96 26 Q102 30, 100 38 Q98 46, 90 52 Q82 58, 74 56 Q70 54, 68 50"
          fill="url(#aquaGradient)"
        />
        <path d="M72 44 Q80 36, 88 34" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" fill="none" />
        <path d="M94 18 Q98 12, 102 14 Q106 16, 104 22 Q102 28, 96 28 Q90 28, 92 22 Q93 19, 94 18" fill="url(#splashGradient)" />
        <path d="M102 26 Q106 22, 110 24 Q114 26, 112 32 Q110 38, 104 36 Q100 34, 102 28 Z" fill="url(#aquaGradient)" />
        <path d="M108 14 Q111 10, 114 12 Q117 14, 115 18 Q113 22, 109 20 Q106 18, 108 14" fill="url(#splashGradient)" />
        <ellipse cx="112" cy="8" rx="3" ry="4" fill="#5BC0EB" />
        <path d="M96 20 Q98 18, 100 19" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" fill="none" />
        <path d="M106 28 Q108 26, 109 27" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.7" fill="none" />
        <circle cx="86" cy="20" r="2" fill="#7DD3F0" />
        <circle cx="116" cy="18" r="1.5" fill="#5BC0EB" />
        <circle cx="90" cy="14" r="1.5" fill="#5BC0EB" opacity="0.8" />
      </svg>
      
      {showText && (
        <div className="flex flex-col leading-none">
          <span 
            className={`font-semibold tracking-tight ${textSize}`}
            style={{ 
              fontFamily: "'Space Grotesk', sans-serif",
              backgroundImage: 'linear-gradient(135deg, #5BC0EB 0%, #2E8BC0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            BeachFlow
          </span>
          <span className="text-[10px] text-slate-100 tracking-[0.2em] uppercase mt-1">
            Mar del Plata
          </span>
        </div>
      )}
    </div>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Email o contrasena incorrectos")
        } else {
          setError("Error al iniciar sesion. Intenta nuevamente.")
        }
        return
      }

      if (data?.user) {
        navigate("/dashboard")
      }
    } catch (err) {
      setError("Error de conexion. Verifica tu internet.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-beach-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 70 Q25 60 50 70 T100 70 V100 H0 Z" fill="currentColor" className="text-beach-secondary" />
            <path d="M0 80 Q25 70 50 80 T100 80 V100 H0 Z" fill="currentColor" className="text-beach-primary" />
          </svg>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-center">
          <BeachFlowLogo size="xl" className="mb-8" />
          
          <h1 className="text-4xl font-thin text-slate-300 mb-4 leading-tight font-display ">
            Gestiona tu balneario<br />de forma simple
          </h1>
          
          
          
          <div className="mt-12 flex gap-4">
            <div className="w-16 h-16 rounded-xl bg-beach-primary/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-beach-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
            </div>
            <div className="w-16 h-16 rounded-xl bg-beach-secondary/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-beach-secondary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
            </div>
            <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-beach-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10 flex justify-center">
          
            <BeachFlowLogo size="large" />
          </div>

          <div className="mb-8 lg:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-beach-dark mb-2 font-display">
              Bienvenido
            </h2>
            <p className="text-beach-text text-base sm:text-lg">
              Ingresa tus credenciales de administrador
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-beach-dark">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tubalneario.com"
                required
                autoComplete="email"
                className="w-full h-14 px-4 text-lg rounded-xl border-2 border-gray-200 bg-white text-beach-dark placeholder:text-beach-text/50 focus:outline-none focus:border-beach-aqua focus:ring-2 focus:ring-beach-aqua/20 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-beach-dark">
                Contrasena
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                  autoComplete="current-password"
                  className="w-full h-14 px-4 pr-12 text-lg rounded-xl border-2 border-gray-200 bg-white text-beach-dark placeholder:text-beach-text/50 focus:outline-none focus:border-beach-aqua focus:ring-2 focus:ring-beach-aqua/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-beach-text hover:text-beach-dark transition-colors p-1"
                  aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-beach-primary/10 border border-beach-primary/20">
                <p className="text-beach-primary text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-beach-primary text-white text-lg font-semibold rounded-xl hover:bg-beach-primary/90 focus:outline-none focus:ring-4 focus:ring-beach-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Ingresar al Sistema"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-beach-text">
            Sistema exclusivo para administradores.
            <br />
            Contacta a soporte si necesitas acceso.
          </p>
        </div>
      </div>
    </div>
  )
}
