import { useReducer, useMemo } from 'react'

// Paso 1 es el existente de ContactSection (selección de servicio) — este
// flujo arranca en el Paso 2 ("PASO X DE 6" solo aplica a este flujo).
const ESTADO_INICIAL = {
  paso: 2,
  fechas: { desde: null, hasta: null, tipoAlquiler: null },
  personas: 1,
  unidades: { principal: null, sugerida: null },
  datos: { nombre: '', apellido: '', telefono: '', email: '', dni: '' },
  leadId: null,
  metodoPago: null,
  aceptaCondiciones: false,
  resultado: null,
  // idle | pausadas | grupo_grande | sin_tarifa | sin_lugar | consulta
  estado: 'idle',
  motivoConsulta: null,
}

function reservaFlowReducer(state, action) {
  switch (action.type) {
    case 'IR_A_PASO':
      return { ...state, paso: action.paso }
    case 'SIGUIENTE':
      return { ...state, paso: state.paso + 1 }
    case 'VOLVER':
      return { ...state, paso: Math.max(2, state.paso - 1) }
    case 'SET_FECHAS':
      return {
        ...state,
        fechas: { ...state.fechas, ...action.fechas },
        // cambiar fechas invalida la selección de unidades previa
        unidades: ESTADO_INICIAL.unidades,
      }
    case 'SET_PERSONAS':
      return { ...state, personas: Math.max(1, action.personas) }
    case 'SET_UNIDAD_PRINCIPAL':
      return {
        ...state,
        unidades: { principal: action.unidad, sugerida: null },
      }
    case 'SET_UNIDAD_SUGERIDA':
      return {
        ...state,
        unidades: { ...state.unidades, sugerida: action.unidad },
      }
    case 'QUITAR_UNIDADES':
      return { ...state, unidades: ESTADO_INICIAL.unidades }
    case 'SET_DATOS':
      return { ...state, datos: { ...state.datos, ...action.datos } }
    case 'SET_LEAD_ID':
      return { ...state, leadId: action.leadId }
    case 'SET_METODO_PAGO':
      return { ...state, metodoPago: action.metodo }
    case 'SET_ACEPTA_CONDICIONES':
      return { ...state, aceptaCondiciones: action.valor }
    case 'SET_RESULTADO':
      return { ...state, resultado: action.resultado, paso: 6 }
    case 'SET_ESTADO':
      return { ...state, estado: action.estado, motivoConsulta: action.motivo ?? null }
    case 'RESET':
      return ESTADO_INICIAL
    default:
      return state
  }
}

export function useReservaFlow() {
  const [state, dispatch] = useReducer(reservaFlowReducer, ESTADO_INICIAL)

  const actions = useMemo(
    () => ({
      irAPaso: (paso) => dispatch({ type: 'IR_A_PASO', paso }),
      siguiente: () => dispatch({ type: 'SIGUIENTE' }),
      volver: () => dispatch({ type: 'VOLVER' }),
      setFechas: (fechas) => dispatch({ type: 'SET_FECHAS', fechas }),
      setPersonas: (personas) => dispatch({ type: 'SET_PERSONAS', personas }),
      setUnidadPrincipal: (unidad) =>
        dispatch({ type: 'SET_UNIDAD_PRINCIPAL', unidad }),
      setUnidadSugerida: (unidad) =>
        dispatch({ type: 'SET_UNIDAD_SUGERIDA', unidad }),
      quitarUnidades: () => dispatch({ type: 'QUITAR_UNIDADES' }),
      setDatos: (datos) => dispatch({ type: 'SET_DATOS', datos }),
      setLeadId: (leadId) => dispatch({ type: 'SET_LEAD_ID', leadId }),
      setMetodoPago: (metodo) => dispatch({ type: 'SET_METODO_PAGO', metodo }),
      setAceptaCondiciones: (valor) =>
        dispatch({ type: 'SET_ACEPTA_CONDICIONES', valor }),
      setResultado: (resultado) =>
        dispatch({ type: 'SET_RESULTADO', resultado }),
      setEstado: (estado, motivo) =>
        dispatch({ type: 'SET_ESTADO', estado, motivo }),
      reset: () => dispatch({ type: 'RESET' }),
    }),
    [],
  )

  return { state, dispatch, actions }
}
