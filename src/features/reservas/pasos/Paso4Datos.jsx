import { useCallback, useEffect, useRef, useState } from 'react'
import { LogOut } from 'lucide-react'
import { guardarLeadReserva } from '../api'
import { telefonoValido, telefonoE164, telefonoLegible } from '../telefono'
import { iniciarSesionGoogle, completarCuenta } from '../../cuenta/auth'
import BotonGoogle from '../../cuenta/BotonGoogle'
import {
  LOGIN_TITULO,
  LOGIN_EXPLICACION,
  LOGIN_USO_DATOS,
  LOGIN_BOTON,
  LOGIN_ERROR,
  CUENTA_CONECTADO,
  CUENTA_CAMBIAR,
  CUENTA_BIENVENIDA,
  CUENTA_UNIDAD_VIGENTE,
  CUENTA_DATO_MAL,
  CUENTA_PENDIENTE,
  CUENTA_NINGUNO_TITULO,
  CUENTA_NINGUNO_BAJADA,
  CUENTA_EMAIL_FIJO,
  CUENTA_NO_VINCULADA,
  mensajeDeError,
} from '../mensajes'
import PiePaso, { BotonSiguiente, BotonVolver } from '../marco/PiePaso'

const WHATSAPP = 'https://wa.me/542235765482'
const TIPO_LABEL = { carpa: 'Carpa', sombrilla: 'Sombrilla' }

function validarDni(dni) {
  return dni.trim() === '' || /^\d{7,8}$/.test(dni.trim())
}

// "Juan Pérez García" → { nombre: "Juan", apellido: "Pérez García" }
function partirNombreGoogle(completo) {
  const partes = (completo ?? '').trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return { nombre: '', apellido: '' }
  return { nombre: partes[0], apellido: partes.slice(1).join(' ') }
}

function textoUnidades(unidades) {
  return (unidades ?? [])
    .map((u) => `${TIPO_LABEL[u.tipo] || u.tipo} ${u.numero}`)
    .join(' + ')
}

export default function Paso4Datos({ state, actions, obtenerToken, cuentaCliente }) {
  const { sesion, cargando, cuenta, actualizarCuenta, cerrarSesion } = cuentaCliente
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [yendoAGoogle, setYendoAGoogle] = useState(false)
  const [guardandoCuenta, setGuardandoCuenta] = useState(false)
  const datos = state.datos
  const vinculo = cuenta?.vinculo
  const cliente = cuenta?.cliente

  // Un solo lead por sesión del flow: el disparador ahora es tener sesión
  // (con el email ya verificado por Google y el token del usuario), no el
  // blur del teléfono.
  const leadDisparadoRef = useRef(false)
  const prefillRef = useRef(false)

  async function irAGoogle() {
    setErrorGeneral('')
    actions.setAvisoSesion(null)
    setYendoAGoogle(true)
    // Primero el estado completo del flow en sessionStorage: el redirect
    // recarga la página entera.
    actions.persistirAntesDeLogin(state)
    const { ok } = await iniciarSesionGoogle()
    if (!ok) {
      setYendoAGoogle(false)
      setErrorGeneral(LOGIN_ERROR)
    }
  }

  async function cambiarCuenta() {
    actions.persistirAntesDeLogin(state)
    await cerrarSesion()
    await irAGoogle()
  }

  // Cliente reconocido: sus datos son los de la reserva. La web no los edita
  // nunca (regla D5 de priusApp), solo los copia al flow para el resumen y
  // para el payload que sigue pidiendo nombre/apellido/teléfono.
  useEffect(() => {
    if (vinculo !== 'confirmado' || !cliente) return
    actions.setDatos({
      nombre: cliente.nombre ?? '',
      apellido: cliente.apellido ?? '',
      telefono: cliente.telefono ?? '',
      email: cuenta.email ?? '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vinculo, cliente])

  // Cuenta nueva: nombre y apellido precargados de Google si vinieron.
  useEffect(() => {
    if (vinculo !== 'ninguno' || prefillRef.current) return
    prefillRef.current = true
    const sugerido = partirNombreGoogle(cuenta?.nombre_google)
    actions.setDatos({
      nombre: datos.nombre || sugerido.nombre,
      apellido: datos.apellido || sugerido.apellido,
      email: cuenta?.email ?? '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vinculo])

  const dispararLead = useCallback(async () => {
    if (leadDisparadoRef.current) return
    const nombre = `${datos.nombre} ${datos.apellido}`.trim()
    const e164 = telefonoE164(datos.telefono)
    if (!nombre || !e164) return
    leadDisparadoRef.current = true
    try {
      const token = await obtenerToken()
      const resultado = await guardarLeadReserva({
        leadId: state.leadId,
        nombre,
        telefonoE164: e164,
        // El email lo pisa lead-reserva con el de la cuenta de Google.
        email: cuenta?.email ?? null,
        motivo: 'form_abandonado',
        datosForm: {
          fechas: state.fechas,
          personas: state.personas,
          unidades: [state.unidades.principal, state.unidades.sugerida]
            .filter(Boolean)
            .map((u) => u.unidad_id),
          tipo: state.unidades.principal?.tipo,
        },
        turnstileToken: token,
      })
      if (resultado?.lead_id) actions.setLeadId(resultado.lead_id)
    } catch {
      // guardado de lead silencioso — no bloquea el flujo del cliente
      leadDisparadoRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datos.nombre, datos.apellido, datos.telefono, cuenta, state.leadId])

  useEffect(() => {
    if (!sesion || !cuenta) return
    dispararLead()
  }, [sesion, cuenta, dispararLead])

  function handleChange(campo, valor) {
    actions.setDatos({ [campo]: valor })
    if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: undefined }))
  }

  async function handleAltaCuenta() {
    const nuevosErrores = {}
    if (!datos.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio.'
    if (!datos.apellido.trim()) nuevosErrores.apellido = 'El apellido es obligatorio.'
    if (!datos.telefono.trim()) nuevosErrores.telefono = 'El teléfono es obligatorio.'
    else if (!telefonoValido(datos.telefono)) nuevosErrores.telefono = 'Formato de teléfono no válido.'
    if (!validarDni(datos.dni)) nuevosErrores.dni = 'El DNI debe tener 7 u 8 dígitos.'
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    setGuardandoCuenta(true)
    setErrorGeneral('')
    try {
      const resultado = await completarCuenta({
        nombre: datos.nombre.trim(),
        apellido: datos.apellido.trim(),
        telefonoE164: telefonoE164(datos.telefono),
        dni: datos.dni.trim(),
      })
      // Sin respuesta utilizable (error de red/RPC ya mapeado a 'interno').
      if (!resultado || resultado.ok === false) {
        const codigo = resultado?.error ?? 'interno'
        if (codigo === 'datos_invalidos' && resultado?.campos) {
          setErrores({
            nombre: resultado.campos.nombre,
            apellido: resultado.campos.apellido,
            telefono: resultado.campos.telefono_e164,
            dni: resultado.campos.dni,
          })
        }
        // Siempre un texto visible: rate_limited y cuenta_personal traen su
        // propio `mensaje`; el resto sale de mensajes.js.
        setErrorGeneral(resultado?.mensaje ?? mensajeDeError(codigo))
        return
      }
      // completar_cuenta() devuelve el estado nuevo con la misma forma que
      // mi_cuenta(): se usa directo como cuenta, sin volver a pedirla (eso
      // pasaba por "Cargando…" y podía redibujar el mismo form).
      if (resultado.vinculo === 'ninguno') {
        setErrorGeneral(CUENTA_NO_VINCULADA)
        return
      }
      actualizarCuenta(resultado)
    } finally {
      setGuardandoCuenta(false)
    }
  }

  const volver = <BotonVolver onClick={() => actions.volver()} />

  function botonContinuar(onClick, { disabled = false, texto = 'Continuar' } = {}) {
    return (
      <BotonSiguiente onClick={onClick} disabled={disabled}>
        {texto}
      </BotonSiguiente>
    )
  }

  const avisos = (
    <>
      {state.avisoSesion && (
        <div className="bg-neutral-50 border border-hairline rounded-xl px-4 py-2.5">
          <span className="text-xs text-prius-black/70 font-light">{state.avisoSesion}</span>
        </div>
      )}
      {errorGeneral && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs leading-relaxed">
          {errorGeneral}
        </div>
      )}
    </>
  )

  // ── Cargando la sesión / la cuenta ──────────────────────────────────────
  if (cargando) {
    return (
      <div className="py-16 flex items-center justify-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-prius-black/30 font-display">
          Cargando…
        </span>
      </div>
    )
  }

  // ── Sin sesión: login obligatorio, sin campos a la vista ────────────────
  if (!sesion) {
    return (
      <div className="space-y-4">
        <div className="text-center md:text-left">
          <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-prius-black font-display mb-0.5">
            {LOGIN_TITULO}
          </h3>
          <p className="text-prius-black/50 text-xs font-light">{LOGIN_EXPLICACION}</p>
        </div>

        {avisos}

        <div className="flex flex-col items-center gap-2.5 py-6">
          <BotonGoogle onClick={irAGoogle} cargando={yendoAGoogle}>
            {LOGIN_BOTON}
          </BotonGoogle>
          <p className="text-[10px] text-prius-black/40 font-light text-center max-w-xs">
            {LOGIN_USO_DATOS}
          </p>
        </div>

        <PiePaso izquierda={volver} />
      </div>
    )
  }

  const barraCuenta = (
    <div className="flex items-center justify-between gap-3 flex-wrap text-[10px] font-light text-prius-black/50 border border-hairline rounded-xl px-3 py-2 bg-neutral-50">
      <span className="truncate">{CUENTA_CONECTADO(cuenta?.email ?? sesion.user?.email ?? '')}</span>
      <button
        type="button"
        onClick={cambiarCuenta}
        className="shrink-0 inline-flex items-center gap-1 font-bold uppercase tracking-wider text-prius-black/60 hover:text-gold transition-colors font-display cursor-pointer"
      >
        <LogOut size={11} /> {CUENTA_CAMBIAR}
      </button>
    </div>
  )

  // ── Cliente reconocido ──────────────────────────────────────────────────
  if (vinculo === 'confirmado' && cliente) {
    const unidades = textoUnidades(cuenta.unidades_vigentes)
    return (
      <div className="space-y-4">
        {barraCuenta}
        {avisos}

        <div className="p-4 rounded-2xl border border-gold/50 bg-gold/10 space-y-3">
          <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-prius-black font-display">
            {CUENTA_BIENVENIDA(cliente.nombre)}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <Dato label="Nombre" valor={`${cliente.nombre ?? ''} ${cliente.apellido ?? ''}`.trim()} />
            <Dato label="Teléfono" valor={telefonoLegible(cliente.telefono)} />
            <Dato label="Email" valor={cliente.email ?? cuenta.email} />
          </div>
          {unidades && (
            <p className="text-xs font-bold text-prius-black font-display pt-1 border-t border-gold/30">
              {CUENTA_UNIDAD_VIGENTE(unidades)}
            </p>
          )}
        </div>

        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-[10px] font-light text-prius-black/40 hover:text-gold transition-colors underline underline-offset-2"
        >
          {CUENTA_DATO_MAL}
        </a>

        <PiePaso izquierda={volver} derecha={botonContinuar(() => actions.siguiente())} />
      </div>
    )
  }

  // ── Vínculo pendiente de confirmar en recepción ─────────────────────────
  if (vinculo === 'pendiente') {
    return (
      <div className="space-y-4">
        {barraCuenta}
        {avisos}

        <div className="p-4 rounded-2xl border border-hairline bg-neutral-50">
          <p className="text-xs text-prius-black/70 font-light leading-relaxed">{CUENTA_PENDIENTE}</p>
        </div>

        <PiePaso izquierda={volver} derecha={botonContinuar(() => actions.siguiente())} />
      </div>
    )
  }

  // ── Cuenta nueva: alta con los datos del form ───────────────────────────
  return (
    <div className="space-y-4">
      {barraCuenta}

      <div className="text-center md:text-left">
        <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-prius-black font-display mb-0.5">
          {CUENTA_NINGUNO_TITULO}
        </h3>
        <p className="text-prius-black/50 text-xs font-light">{CUENTA_NINGUNO_BAJADA}</p>
      </div>

      {avisos}

      <div className="space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Campo label="Nombre" error={errores.nombre}>
            <input
              type="text"
              value={datos.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              className={inputClass(!!errores.nombre)}
            />
          </Campo>
          <Campo label="Apellido" error={errores.apellido}>
            <input
              type="text"
              value={datos.apellido}
              onChange={(e) => handleChange('apellido', e.target.value)}
              className={inputClass(!!errores.apellido)}
            />
          </Campo>
        </div>

        <Campo label="Teléfono / WhatsApp" error={errores.telefono}>
          <input
            type="tel"
            value={datos.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            placeholder="Ej. +54 223 576 5482"
            className={inputClass(!!errores.telefono)}
          />
        </Campo>

        <Campo label="Correo electrónico" ayuda={CUENTA_EMAIL_FIJO}>
          <input
            type="email"
            value={cuenta?.email ?? ''}
            readOnly
            disabled
            className={`${inputClass(false)} text-prius-black/50 cursor-not-allowed`}
          />
        </Campo>

        <Campo label="DNI (opcional)" error={errores.dni}>
          <input
            type="text"
            inputMode="numeric"
            value={datos.dni}
            onChange={(e) => handleChange('dni', e.target.value)}
            placeholder="Ej. 30123456"
            className={inputClass(!!errores.dni)}
          />
        </Campo>
      </div>

      <PiePaso
        izquierda={volver}
        derecha={botonContinuar(handleAltaCuenta, {
          disabled: guardandoCuenta,
          texto: guardandoCuenta ? 'Guardando…' : 'Continuar',
        })}
      />
    </div>
  )
}

function Dato({ label, valor }) {
  if (!valor) return null
  return (
    <div>
      <p className="text-[9px] tracking-wider text-prius-black/50 uppercase font-bold font-display">{label}</p>
      <p className="text-xs text-prius-black font-medium break-words">{valor}</p>
    </div>
  )
}

function Campo({ label, error, ayuda, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[9px] tracking-wider text-prius-black/60 uppercase font-bold font-display">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-500 font-light mt-0.5">{error}</p>
      ) : ayuda ? (
        <p className="text-[10px] text-prius-black/40 font-light mt-0.5">{ayuda}</p>
      ) : null}
    </div>
  )
}

function inputClass(hasError) {
  return [
    'w-full px-2 py-2 bg-transparent border-b text-xs text-prius-black placeholder-prius-black/30 font-light',
    'focus:outline-none focus:border-gold transition-colors duration-300',
    hasError ? 'border-red-400' : 'border-hairline',
  ].join(' ')
}
