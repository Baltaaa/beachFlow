import { Link } from 'react-router-dom'
import ChipCuenta from '../ChipCuenta'

const PILL_OSCURA = 'bg-white/10 border-white/15 text-white/85'

// Cabecera de las páginas fuera de la landing (/mi-cuenta y /r/:codigo):
// misma base negra, logo blanco y CTA dorado que el navbar de producción,
// sin la navegación por secciones (esas secciones viven en la landing).
export default function CabeceraPagina() {
  return (
    <header className="bg-neutral-950 border-b border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto h-16 md:h-20 px-5 md:px-8 flex items-center justify-between gap-4">
        <Link to="/" aria-label="Prius Playa Grande, ir al inicio" className="shrink-0">
          <img src="/images/prius-logo-white.png" alt="Prius Playa Grande" className="h-9 md:h-11 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-2.5 md:gap-3">
          <div className="md:hidden">
            <ChipCuenta variante="mobile" claseBoton={PILL_OSCURA} />
          </div>
          <div className="hidden md:block">
            <ChipCuenta variante="desktop" claseBoton={PILL_OSCURA} alinear="derecha" />
          </div>
          <Link
            to="/#contacto"
            className="h-9 2xl:h-10 inline-flex items-center justify-center whitespace-nowrap rounded-full px-5 2xl:px-7 text-[10px] 2xl:text-xs font-bold uppercase tracking-wider bg-gold text-prius-black hover:bg-gold-hover transition-colors shadow-lg font-display"
          >
            Reservá
          </Link>
        </div>
      </div>
    </header>
  )
}
