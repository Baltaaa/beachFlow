import { useEffect, useState } from 'react'
import { Phone } from 'lucide-react'
import { cotizar, crearReservaPublica, ReservaApiError } from '../api'
import { telefonoE164 } from '../telefono'
import { resumenFechas, formatoPesos } from '../fechas'
import {
  MENSAJE_SUJETO_A_DISPONIBILIDAD,
  CHECKBOX_SUJETO_A_DISPONIBILIDAD,
  SESION_VENCIDA,
  mensajeDeError,
} from '../mensajes'
import PiePaso, { BotonSiguiente, BotonVolver } from '../marco/PiePaso'

const METODOS = [
  { id: 'efectivo', label: 'Efectivo' },
  { id: 'transferencia', label: 'Transferencia' },
  { id: 'mercado_pago', label: 'Mercado Pago' },
  { id: 'tarjeta_debito', label: 'Tarjeta de débito' },
  { id: 'tarjeta_credito', label: 'Tarjeta de crédito' },
]

const TIPO_LABEL = { carpa: 'Carpa', sombrilla: 'Sombrilla' }

export default function Paso5Confirmar({ config, state, actions, obtenerToken, onIrAConsulta, cuentaCliente }) {
  const [precios, setPrecios] = useState(null)
  const [metodoElegido, setMetodoElegido] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [errorOfreceConsulta, setErrorOfreceConsulta] = useState(false)

  // Cliente reconocido: los datos salen del vínculo de la cuenta, no del
  // form. El email nunca se manda — crear-reserva-publica lo toma del JWT —
  // pero nombre, apellido y teléfono siguen siendo obligatorios en el schema
  // zod de la Edge Function, también para un cliente existente (los ignora:
  // usa el cliente del vínculo).
  const clienteCuenta = cuentaCliente?.cuenta?.vinculo === 'confirmado' ? cuentaCliente.cuenta.cliente : null
  const nombreMostrado = [clienteCuenta?.nombre ?? state.datos.nombre, clienteCuenta?.apellido ?? state.datos.apellido]
    .filter(Boolean)
    .join(' ')

  const { principal, sugerida } = state.unidades
  const cantidadUnidades = 1 + (sugerida ? 1 : 0)
  const { desde, hasta, tipoAlquiler } = state.fechas

  useEffect(() => {
    let cancelado = false
    async function cargarPrecios() {
      const resultados = await Promise.all(
        METODOS.map(async (m) => {
          const precioUnitario = await cotizar(principal.tipo, tipoAlquiler, m.id, desde, hasta)
          return precioUnitario == null ? null : { ...m, precio: precioUnitario * cantidadUnidades }
        }),
      )
      if (cancelado) return
      const disponibles = resultados.filter(Boolean).sort((a, b) => a.precio - b.precio)
      setPrecios(disponibles)
      if (disponibles.length > 0) setMetodoElegido(disponibles[0].id)
    }
    cargarPrecios()
    return () => {
      cancelado = true
    }
  }, [principal, tipoAlquiler, desde, hasta, cantidadUnidades])

  async function handleConfirmar() {
    if (!state.aceptaCondiciones || !metodoElegido) return
    setEnviando(true)
    setErrorMsg('')
    try {
      const token = await obtenerToken()
      const resultado = await crearReservaPublica({
        tipoAlquiler,
        desde,
        hasta,
        personas: state.personas,
        tipoUnidad: principal.tipo,
        unidadIds: [principal, sugerida].filter(Boolean).map((u) => u.unidad_id),
        metodoPago: metodoElegido,
        cliente: {
          nombre: clienteCuenta?.nombre ?? state.datos.nombre,
          apellido: clienteCuenta?.apellido ?? state.datos.apellido,
          telefonoE164: telefonoE164(clienteCuenta?.telefono ?? state.datos.telefono),
          // El email sale siempre de la cuenta de Google del lado del
          // servidor; mandarlo acá no tendría efecto.
          email: null,
          dni: clienteCuenta ? null : state.datos.dni || null,
        },
        leadId: state.leadId,
        turnstileToken: token,
      })
      actions.setResultado(resultado)
    } catch (err) {
      const codigo = err instanceof ReservaApiError ? err.codigo : 'interno'
      if (codigo === 'unidad_no_disponible') {
        actions.quitarUnidades()
        actions.irAPaso(3)
        return
      }
      if (codigo === 'sin_tarifa') {
        actions.irAPaso(2)
        return
      }
      if (codigo === 'reservas_desactivadas') {
        actions.setEstado('pausadas')
        return
      }
      // 401 de crear-reserva-publica: la sesión venció o se cerró en otra
      // pestaña. Vuelve al Paso 4 a loguearse de nuevo, con todo el resto del
      // flow intacto.
      if (codigo === 'login_requerido') {
        actions.setAvisoSesion(SESION_VENCIDA)
        actions.irAPaso(4)
        return
      }
      setErrorOfreceConsulta(codigo === 'limite_por_telefono' || codigo === 'limite_por_cuenta')
      setErrorMsg(mensajeDeError(codigo))
    } finally {
      setEnviando(false)
    }
  }

  if (!principal) return null

  const unidadesTexto = [principal, sugerida].filter(Boolean).map((u) => `${TIPO_LABEL[u.tipo] || u.tipo} ${u.numero}`).join(' + ')
  const hora = config?.hora_corte_noshow?.slice(0, 5) ?? '12:00'

  return (
    <div className="space-y-4">
      <div className="text-center md:text-left">
        <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-prius-black font-display mb-0.5">
          Confirmá tu reserva
        </h3>
      </div>

      <div className="p-4 rounded-xl border border-hairline bg-neutral-50 space-y-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-prius-black/50 font-light">Unidades:</p>
            <p className="font-bold text-prius-black font-display">{unidadesTexto}</p>
          </div>
          <div>
            <p className="text-prius-black/50 font-light">Fechas:</p>
            <p className="font-bold text-prius-black">{resumenFechas(desde, hasta)}</p>
          </div>
          <div>
            <p className="text-prius-black/50 font-light">Personas:</p>
            <p className="font-bold text-prius-black">{state.personas}</p>
          </div>
          <div>
            <p className="text-prius-black/50 font-light">Contacto:</p>
            <p className="font-medium text-prius-black">{nombreMostrado}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-[9px] font-bold uppercase tracking-wider text-prius-black/50 font-display block">
          Elegí cómo vas a pagar
        </span>
        {precios === null ? (
          <p className="text-xs text-prius-black/40 font-light">Calculando precios…</p>
        ) : (
          precios.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMetodoElegido(m.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-left transition-colors ${
                metodoElegido === m.id ? 'border-gold bg-gold/10' : 'border-hairline hover:border-gold/50'
              }`}
            >
              <span className="text-xs font-bold text-prius-black font-display flex items-center gap-2">
                {m.label}
                {i === 0 && (
                  <span className="text-[8px] bg-gold text-prius-black px-1.5 py-0.5 rounded-full font-bold uppercase">
                    Mejor tarifa
                  </span>
                )}
              </span>
              <span className="text-xs font-bold text-prius-black">{formatoPesos(m.precio)}</span>
            </button>
          ))
        )}
      </div>

      <div className="bg-neutral-50 border border-hairline rounded-xl p-3.5 space-y-2.5">
        <p className="text-[11px] text-prius-black/70 font-light leading-relaxed">
          {MENSAJE_SUJETO_A_DISPONIBILIDAD(hora)}
        </p>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={state.aceptaCondiciones}
            onChange={(e) => actions.setAceptaCondiciones(e.target.checked)}
            className="mt-0.5 accent-gold"
          />
          <span className="text-[11px] text-prius-black/70 font-light">{CHECKBOX_SUJETO_A_DISPONIBILIDAD}</span>
        </label>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs leading-relaxed flex items-center justify-between gap-2">
          <span>{errorMsg}</span>
          {errorOfreceConsulta ? (
            <button
              type="button"
              onClick={() => onIrAConsulta('contacto')}
              className="shrink-0 font-bold uppercase tracking-wider"
            >
              Consultar →
            </button>
          ) : (
            <a
              href="https://wa.me/542235765482"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1 text-red-700 font-bold"
            >
              <Phone size={12} /> WhatsApp
            </a>
          )}
        </div>
      )}

      <PiePaso
        izquierda={<BotonVolver onClick={() => actions.volver()} disabled={enviando} />}
        derecha={
          <BotonSiguiente
            onClick={handleConfirmar}
            disabled={!state.aceptaCondiciones || !metodoElegido || enviando}
            icono={false}
          >
            {enviando ? 'Confirmando…' : 'Confirmar Reserva'}
          </BotonSiguiente>
        }
      />
    </div>
  )
}
