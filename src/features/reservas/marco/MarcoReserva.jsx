import { useState } from 'react'
import { X } from 'lucide-react'
import { ContextoPieMarco } from './contextoMarco'

// Marco fijo del flujo de reserva (Fase 6B).
//
// PROVISORIO hasta la 6A.1 de priusApp: MarcoPlanoClaro (src/components/plano,
// copia exacta, no se edita acá) todavía no tiene lugar para la barra del
// paso, el footer ni un cuerpo que no sea el mapa. Este componente dibuja el
// mismo header (mismas clases que MarcoPlanoClaro en f1a031a) y expone las
// props que va a tener el de la 6A.1 (`barra`, `pie`, cuerpo por children),
// así el reemplazo es cambiar este import por MarcoPlanoClaro y borrar el
// archivo.
//
// amplia (≥768px): [logo] [selectorFecha] [Todo | Carpas | Sombrillas] ... [X]
// compacta (<768px): fila [selectorFecha] [chips] con scroll horizontal; la X
// va en la barra del paso.
const CARD = 'bg-white rounded-[24px]'

// Mismo dibujo que ChipsTipo de MarcoPlanoClaro (no se exporta de ahí).
function ChipsTipo({ valor, onChange, deshabilitados = false }) {
  const opciones = [
    { value: null, label: 'Todo' },
    { value: 'carpas', label: 'Carpas' },
    { value: 'sombrillas', label: 'Sombrillas' },
  ]
  return (
    <div
      role="group"
      aria-label="Filtrar el plano por tipo de unidad"
      className={`inline-flex items-center gap-1 p-1 rounded-full bg-[#F2F1EC] shrink-0 ${deshabilitados ? 'opacity-50' : ''}`}
    >
      {opciones.map((o) => {
        const activa = (valor ?? null) === o.value
        return (
          <button
            key={String(o.value)}
            type="button"
            aria-pressed={activa}
            disabled={deshabilitados}
            onClick={() => onChange?.(o.value)}
            className={`h-11 md:h-8 min-h-0 px-4 rounded-full text-[13px] leading-[18px] font-medium transition-colors disabled:cursor-default ${
              activa ? 'bg-black text-white' : 'text-[#6B6B6B] hover:text-black disabled:hover:text-[#6B6B6B]'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

export default function MarcoReserva({
  variante = 'amplia',
  logo = null,
  selectorFecha = null,
  tipo = null,
  onTipo,
  chipsDeshabilitados = false,
  onCerrar,
  tituloCerrar = 'Cerrar',
  barra = null,
  aviso = null,
  children,
}) {
  const [nodoPie, setNodoPie] = useState(null)
  const chips = <ChipsTipo valor={tipo} onChange={onTipo} deshabilitados={chipsDeshabilitados} />

  const header =
    variante === 'compacta' ? (
      <div className="shrink-0 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {selectorFecha}
        {chips}
      </div>
    ) : (
      <div className={`${CARD} p-3 shrink-0`}>
        <div className="flex items-center gap-4">
          {logo}
          {selectorFecha}
          {chips}
          {onCerrar && (
            <button
              type="button"
              onClick={onCerrar}
              title={tituloCerrar}
              aria-label={tituloCerrar}
              className="ml-auto w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-black hover:bg-[#F2F1EC] transition-colors"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    )

  return (
    <div data-marco-reserva className={`flex-1 min-h-0 flex flex-col ${variante === 'compacta' ? 'gap-2' : 'gap-2.5'}`}>
      {header}
      {barra}
      <section data-cuerpo-marco className={`${CARD} flex-1 min-h-0 min-w-0 relative overflow-hidden flex flex-col border border-[#EDEDED]`}>
        {aviso}
        <ContextoPieMarco.Provider value={nodoPie}>{children}</ContextoPieMarco.Provider>
      </section>
      <div
        ref={setNodoPie}
        data-pie-marco
        className="shrink-0 h-16 flex items-center border-t border-[#EDEDED] px-1"
      />
    </div>
  )
}
