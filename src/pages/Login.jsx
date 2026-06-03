import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard")
    })
  }, [navigate])

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
        setError("Email o contraseña incorrectos")
        return
      }

      if (data?.user) {
        navigate("/dashboard")
      }
    } catch (err) {
      setError("Error de conexión. Verifica tu internet.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Panel izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-prius-black relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full border-[100px] border-gold rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <div className="relative z-10 text-center">
          <img src="/logo-prius.png" alt="Prius" className="h-32 w-auto mx-auto mb-8 brightness-0 invert" />
          <h1 className="text-4xl font-normal text-white mb-4 tracking-tight">
            Gestión de Experiencias <span className="text-gold italic">Prius</span>
          </h1>
          <p className="text-white/60 max-w-md mx-auto">
            Acceso exclusivo para el equipo de administración de Prius Playa Grande.
          </p>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-prius-black/40 hover:text-prius-black mb-12 transition-colors">
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>

          <div className="mb-10">
            <img src="/logo-prius.png" alt="Prius" className="h-12 w-auto mb-8 lg:hidden" />
            <h2 className="text-3xl font-normal text-prius-black mb-2 tracking-tight">
              Bienvenido
            </h2>
            <p className="text-prius-black/60">
              Ingresa tus credenciales de administrador
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-prius-black/40">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@priusplayagrande.com"
                required
                className="w-full h-12 px-4 border border-hairline rounded-sm focus:border-gold outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-prius-black/40">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                  className="w-full h-12 px-4 border border-hairline rounded-sm focus:border-gold outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-prius-black/40 hover:text-prius-black"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-sm">
                <p className="text-red-600 text-xs font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gold hover:bg-gold-hover text-prius-black font-bold text-xs uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ingresar al Sistema"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}