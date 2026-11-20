import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useCuentaCliente } from '../features/cuenta/useCuentaCliente'
import { iniciarSesionGoogle, urlDeEstaPagina } from '../features/cuenta/auth'
import { CUENTA_PENDIENTE_NAVBAR } from '../features/cuenta/datosCuenta'
import BotonGoogle from '../features/cuenta/BotonGoogle'
import CabeceraPagina from '../features/cuenta/pagina/CabeceraPagina'
import TarjetaQR from '../features/cuenta/pagina/TarjetaQR'
import { hoyArgentinaISO } from '../features/reservas/fechas'

const TABS = [
  { a: 'hoy', label: 'Hoy' },
  { a: 'unidad', label: 'Mi unidad' },
  { a: 'reservas', label: 'Reservas' },
  { a: 'pedidos', label: 'Pedidos' },
  { a: 'actividades', label: 'Actividades' },
]

// /mi-cuenta (Fase 6B, Tarea 5): la misma estructura de items que "Mis
// servicios" de Playapp con el branding de la landing. Tabs en la URL
// (/mi-cuenta/hoy, /unidad, /reservas, /pedidos, /actividades) y el detalle de
// cada reserva en /mi-cuenta/reservas/<codigo>.
//
// Datos: SOLO mi_cuenta() vía useCuentaCliente (el mismo store del navbar y
// del flujo de reserva), refrescado al entrar y al confirmar una reserva.
// Vínculo pendiente: solo sus reservas web y el aviso de recepción; nada del
// cliente existente.
export default function MiCuenta() {
  const { sesion, cuenta, cargando, refrescar } = useCuentaCliente()
  const userId = sesion?.user?.id ?? null
  const refrescadoRef = useRef(null)
  const hoy = hoyArgentinaISO()

  // Al entrar a la sección (una vez por usuario): la cuenta puede venir
  // cacheada de la landing y estar vieja.
  useEffect(() => {
    if (!userId || refrescadoRef.current === userId) return
    refrescadoRef.current = userId
    refrescar()
  }, [userId, refrescar])

  return (
    <div className="min-h-screen bg-prius-background font-sans text-prius-black">
      <CabeceraPagina />

      <section data-theme="dark" className="bg-neutral-950 text-white">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-8 pb-10 md:pt-12 md:pb-14">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold font-display">Mi cuenta</span>
          <h1 className="mt-3 text-[30px] leading-[1.1] md:text-[48px] font-bold uppercase font-display">
            Todo lo tuyo, en un lugar
          </h1>
          <p className="mt-3 text-sm md:text-base text-white/60 max-w-xl">
            Tus reservas, tu unidad y tus pedidos. Mostrá tu QR y listo.
          </p>
        </div>
      </section>

      <main className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 md:py-12">
        {!sesion && cargando ? (
          <Cargando />
        ) : !sesion ? (
          <Ingresar />
        ) : !cuenta ? (
          cargando ? <Cargando /> : <ErrorCuenta onReintentar={refrescar} />
        ) : (
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-[360px_minmax(0,1fr)] items-start">
            <div className="lg:sticky lg:top-6">
              <TarjetaQR cuenta={cuenta} sesion={sesion} hoy={hoy} />
            </div>
            <div className="min-w-0 space-y-5">
              {cuenta.vinculo === 'pendiente' && (
                <div data-aviso-pendiente className="flex items-start gap-2.5 rounded-2xl bg-gold/15 border border-gold/40 px-4 py-3">
                  <span aria-hidden="true" className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0" />
                  <p className="text-sm leading-snug text-prius-black/80">
                    {CUENTA_PENDIENTE_NAVBAR}. Mientras tanto, acá ves las reservas que hiciste con esta cuenta.
                  </p>
                </div>
              )}
              <nav
                aria-label="Secciones de tu cuenta"
                className="-mx-5 px-5 md:mx-0 md:px-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white border border-hairline">
                  {TABS.map((t) => (
                    <NavLink
                      key={t.a}
                      to={`/mi-cuenta/${t.a}`}
                      className={({ isActive }) =>
                        `h-9 md:h-10 px-4 md:px-5 inline-flex items-center rounded-full whitespace-nowrap text-[11px] font-bold uppercase tracking-wider font-display transition-colors ${
                          isActive ? 'bg-prius-black text-white' : 'text-prius-black/55 hover:text-prius-black'
                        }`
                      }
                    >
                      {t.label}
                    </NavLink>
                  ))}
                </div>
              </nav>
              <Outlet context={{ cuenta, sesion, hoy }} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function Cargando() {
  return (
    <div className="py-16 text-center text-xs font-bold uppercase tracking-widest text-prius-black/40 font-display">
      Cargando tu cuenta…
    </div>
  )
}

function Ingresar() {
  const [yendo, setYendo] = useState(false)
  async function ingresar() {
    setYendo(true)
    const { ok } = await iniciarSesionGoogle({ volverA: urlDeEstaPagina() })
    if (!ok) setYendo(false)
  }
  return (
    <div data-ingresar-cuenta className="max-w-md mx-auto bg-white rounded-[28px] border border-hairline p-8 text-center">
      <h2 className="text-xl font-bold uppercase tracking-wide text-prius-black font-display">Ingresá con Google</h2>
      <p className="mt-2 text-sm text-prius-black/60 leading-relaxed">
        Para ver tus reservas, tu unidad y el QR que mostrás en recepción.
      </p>
      <div className="mt-6">
        <BotonGoogle onClick={ingresar} cargando={yendo}>
          Continuar con Google
        </BotonGoogle>
      </div>
    </div>
  )
}

function ErrorCuenta({ onReintentar }) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-[28px] border border-hairline p-8 text-center">
      <p className="text-sm text-prius-black/70">No pudimos cargar tu cuenta.</p>
      <button
        type="button"
        onClick={onReintentar}
        className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-gold px-6 text-xs font-bold uppercase tracking-wider text-prius-black hover:bg-gold-hover transition-colors font-display cursor-pointer"
      >
        Reintentar
      </button>
    </div>
  )
}
