import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { guardarLeadReserva } from '../api'
import { AYUDA_EMAIL } from '../mensajes'

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}
function validarDni(dni) {
  return dni.trim() === '' || /^\d{7,8}$/.test(dni.trim())
}
function validarTelefono(telefono) {
  const parsed = parsePhoneNumberFromString(telefono, 'AR')
  return !!parsed?.isValid()
}

export default function Paso4Datos({ state, actions, obtenerToken }) {
  const [errores, setErrores] = useState({})
  const [enviandoLead, setEnviandoLead] = useState(false)
  const datos = state.datos

  function handleChange(campo, valor) {
    actions.setDatos({ [campo]: valor })
    if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: undefined }))
  }

  async function handleTelefonoBlur() {
    const telefono = datos.telefono.trim()
    if (!telefono) return
    if (!validarTelefono(telefono)) {
      setErrores((prev) => ({ ...prev, telefono: 'Formato de teléfono no válido.' }))
      return
    }
    setEnviandoLead(true)
    try {
      const token = await obtenerToken()
      const resultado = await guardarLeadReserva({
        leadId: state.leadId,
        nombre: `${datos.nombre} ${datos.apellido}`.trim(),
        telefono,
        email: datos.email || undefined,
        motivo: 'form_abandonado',
        datosForm: {
          fechas: state.fechas,
          personas: state.personas,
          unidades: [state.unidades.principal, state.unidades.sugerida].filter(Boolean).map((u) => u.unidad_id),
          tipo: state.unidades.principal?.tipo,
        },
        turnstileToken: token,
      })
      if (resultado?.leadId) actions.setLeadId(resultado.leadId)
    } catch {
      // guardado de lead silencioso — no bloquea el flujo del cliente
    } finally {
      setEnviandoLead(false)
    }
  }

  function validar() {
    const nuevosErrores = {}
    if (!datos.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio.'
    if (!datos.apellido.trim()) nuevosErrores.apellido = 'El apellido es obligatorio.'
    if (!datos.telefono.trim()) nuevosErrores.telefono = 'El teléfono es obligatorio.'
    else if (!validarTelefono(datos.telefono)) nuevosErrores.telefono = 'Formato de teléfono no válido.'
    if (!datos.email.trim()) nuevosErrores.email = 'El email es obligatorio.'
    else if (!validarEmail(datos.email)) nuevosErrores.email = 'El email no es válido.'
    if (!validarDni(datos.dni)) nuevosErrores.dni = 'El DNI debe tener 7 u 8 dígitos.'
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  function handleSiguiente() {
    if (validar()) actions.siguiente()
  }

  return (
    <div className="space-y-4">
      <div className="text-center md:text-left">
        <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-prius-black font-display mb-0.5">
          Tus datos de contacto
        </h3>
        <p className="text-prius-black/50 text-xs font-light">
          Los necesitamos para confirmar tu lugar y mandarte el código.
        </p>
      </div>

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
            onBlur={handleTelefonoBlur}
            placeholder="Ej. +54 223 576 5482"
            className={inputClass(!!errores.telefono)}
          />
        </Campo>

        <Campo label="Correo electrónico" error={errores.email} ayuda={AYUDA_EMAIL}>
          <input
            type="email"
            value={datos.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="ejemplo@mail.com"
            className={inputClass(!!errores.email)}
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

      {enviandoLead && (
        <p className="text-[10px] text-prius-black/30 font-light text-center">Guardando…</p>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-hairline mt-6">
        <button
          type="button"
          onClick={() => actions.volver()}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-prius-black/60 hover:text-prius-black transition-colors font-display cursor-pointer"
        >
          <ChevronLeft size={14} /> Volver
        </button>
        <button
          type="button"
          onClick={handleSiguiente}
          className="inline-flex h-9 md:h-10 items-center justify-center rounded-full bg-gold px-6 text-xs font-bold uppercase tracking-wider text-prius-black hover:bg-gold-hover transition-colors font-display cursor-pointer gap-1.5 shadow-md"
        >
          Siguiente <ChevronRight size={14} />
        </button>
      </div>
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
