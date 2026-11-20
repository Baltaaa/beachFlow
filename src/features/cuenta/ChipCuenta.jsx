import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, Ticket, UserRound } from 'lucide-react'
import { useCuentaCliente } from './useCuentaCliente'
import { iniciarSesionGoogle, urlDeEstaPagina } from './auth'
import { CUENTA_PENDIENTE_NAVBAR, avatarDe, nombreCompleto, nombreCorto, textoChip } from './datosCuenta'
import { hoyArgentinaISO } from '../reservas/fechas'

function Avatar({ src, nombre, tamano = 24 }) {
  const [fallo, setFallo] = useState(false)
  const estilo = { width: tamano, height: tamano }
  if (src && !fallo) {
    return (
      <img
        src={src}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setFallo(true)}
        className="rounded-full object-cover shrink-0"
        style={estilo}
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      className="rounded-full bg-gold text-prius-black font-bold flex items-center justify-center shrink-0 font-display"
      style={{ ...estilo, fontSize: Math.round(tamano * 0.45) }}
    >
      {(nombre || '?').charAt(0).toUpperCase()}
    </span>
  )
}

function PuntoAviso() {
  return (
    <span
      aria-hidden="true"
      data-punto-pendiente
      className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-gold ring-2 ring-white"
    />
  )
}

// Cuenta del cliente en el navbar (Fase 6B, Tarea 4).
// - Sin sesión: "Ingresar" (Google, y vuelve a esta misma página).
// - Con sesión: chip con la foto de Google, el nombre y, si hoy tiene una
//   unidad vigente (prioridad temporada), "Balta · Carpa 133". En mobile y en
//   desktop angosto, solo la foto. Al tocarlo: Mi cuenta, Mis reservas y
//   Cerrar sesión.
// - Vínculo pendiente: punto de aviso y, en el menú, "Tu cuenta se confirma en
//   recepción". Nada del cliente existente.
// `claseBoton`: el dibujo del navbar en su estado actual (transparente,
// oscuro o claro), el mismo que el botón de al lado.
// `alinear`: de qué lado del chip se abre el menú en desktop ('izquierda' en
// el navbar de la landing, al lado del logo; 'derecha' en las páginas de
// cuenta, donde el chip va a la derecha).
export default function ChipCuenta({ variante = 'desktop', claseBoton = '', alinear = 'izquierda' }) {
  const { sesion, cuenta, cargando, cerrarSesion } = useCuentaCliente()
  const [abierto, setAbierto] = useState(false)
  // Mobile: el menú va fijo debajo del header, a lo ancho de la pantalla.
  const [topMenu, setTopMenu] = useState(0)
  const [yendo, setYendo] = useState(false)
  const raizRef = useRef(null)
  const mobile = variante === 'mobile'

  useEffect(() => {
    if (!abierto) return
    function afuera(e) {
      if (!raizRef.current?.contains(e.target)) setAbierto(false)
    }
    function tecla(e) {
      if (e.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('pointerdown', afuera)
    window.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('pointerdown', afuera)
      window.removeEventListener('keydown', tecla)
    }
  }, [abierto])

  // Mientras se lee la sesión guardada no se muestra nada (es inmediato):
  // así no aparece "Ingresar" un instante a alguien que ya entró.
  if (!sesion && cargando) return null

  if (!sesion) {
    async function ingresar() {
      setYendo(true)
      const { ok } = await iniciarSesionGoogle({ volverA: urlDeEstaPagina() })
      if (!ok) setYendo(false)
    }
    if (mobile) {
      return (
        <button
          type="button"
          onClick={ingresar}
          disabled={yendo}
          data-ingresar-navbar
          aria-label="Ingresar"
          title="Ingresar"
          className={`flex items-center justify-center size-9 rounded-full border cursor-pointer transition-colors duration-400 disabled:opacity-60 ${claseBoton}`}
        >
          <UserRound size={17} />
        </button>
      )
    }
    return (
      <button
        type="button"
        onClick={ingresar}
        disabled={yendo}
        data-ingresar-navbar
        aria-label="Ingresar"
        title="Ingresar con Google"
        className={`inline-flex items-center gap-2 rounded-full px-3 lg:px-4 py-2 text-[10px] 2xl:text-xs font-semibold transition-colors duration-400 cursor-pointer border disabled:opacity-60 ${claseBoton}`}
      >
        <UserRound size={14} className="shrink-0" />
        <span className="hidden lg:inline uppercase">Ingresar</span>
      </button>
    )
  }

  const pendiente = cuenta?.vinculo === 'pendiente'
  const avatar = avatarDe(sesion)
  const corto = nombreCorto(cuenta, sesion)
  const texto = textoChip(cuenta, sesion, hoyArgentinaISO())
  const email = cuenta?.email || sesion.user?.email || ''

  return (
    <div ref={raizRef} className="relative" data-cuenta-navbar>
      {mobile ? (
        <button
          type="button"
          onClick={(e) => {
            setTopMenu(Math.round(e.currentTarget.getBoundingClientRect().bottom + 12))
            setAbierto((v) => !v)
          }}
          aria-haspopup="menu"
          aria-expanded={abierto}
          aria-label={`Tu cuenta: ${texto}${pendiente ? ` (${CUENTA_PENDIENTE_NAVBAR})` : ''}`}
          className={`relative flex items-center justify-center size-9 rounded-full border cursor-pointer transition-colors duration-400 ${claseBoton}`}
        >
          <Avatar src={avatar} nombre={corto} tamano={28} />
          {pendiente && <PuntoAviso />}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={abierto}
          aria-label={`Tu cuenta: ${texto}${pendiente ? ` (${CUENTA_PENDIENTE_NAVBAR})` : ''}`}
          title={texto}
          className={`inline-flex items-center gap-2 rounded-full p-1 xl:pr-3.5 text-[10px] 2xl:text-xs font-semibold transition-colors duration-400 cursor-pointer border ${claseBoton}`}
        >
          <span className="relative shrink-0">
            <Avatar src={avatar} nombre={corto} tamano={24} />
            {pendiente && <PuntoAviso />}
          </span>
          <span data-texto-chip className="hidden xl:inline max-w-[140px] truncate">
            {texto}
          </span>
        </button>
      )}

      {abierto && (
        <div
          role="menu"
          aria-label="Tu cuenta"
          style={mobile ? { top: topMenu } : undefined}
          className={`z-[60] bg-white text-prius-black rounded-2xl border border-hairline shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] p-2 animate-premium-fade ${
            mobile ? 'fixed inset-x-4' : `absolute ${alinear === 'derecha' ? 'right-0' : 'left-0'} top-full mt-3 w-72`
          }`}
        >
          <div className="flex items-center gap-3 px-3 pt-2 pb-3">
            <span className="relative shrink-0">
              <Avatar src={avatar} nombre={corto} tamano={40} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{nombreCompleto(cuenta, sesion)}</p>
              <p className="text-xs text-prius-black/50 truncate">{email}</p>
            </div>
          </div>

          {pendiente && (
            <div className="mx-1 mb-2 flex items-start gap-2 rounded-xl bg-gold/15 border border-gold/40 px-3 py-2.5">
              <span aria-hidden="true" className="mt-1 w-2 h-2 rounded-full bg-gold shrink-0" />
              <p className="text-xs leading-snug text-prius-black/80">{CUENTA_PENDIENTE_NAVBAR}</p>
            </div>
          )}

          <div className="border-t border-hairline pt-1.5 flex flex-col">
            <Link
              role="menuitem"
              to="/mi-cuenta"
              onClick={() => setAbierto(false)}
              className="flex items-center gap-3 h-11 px-3 rounded-xl text-sm hover:bg-neutral-100 transition-colors"
            >
              <UserRound size={16} className="text-prius-black/60" /> Mi cuenta
            </Link>
            <Link
              role="menuitem"
              to="/mi-cuenta/reservas"
              onClick={() => setAbierto(false)}
              className="flex items-center gap-3 h-11 px-3 rounded-xl text-sm hover:bg-neutral-100 transition-colors"
            >
              <Ticket size={16} className="text-prius-black/60" /> Mis reservas
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setAbierto(false)
                cerrarSesion()
              }}
              className="flex items-center gap-3 h-11 px-3 rounded-xl text-sm text-left hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <LogOut size={16} className="text-prius-black/60" /> Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
