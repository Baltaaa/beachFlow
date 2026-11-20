import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Download, MapPin, Phone } from "lucide-react";
import { consultarReserva } from "../features/reservas/api";
import { useConfigReservas } from "../features/reservas/useConfigReservas";
import { REGEX_CODIGO } from "../lib/reservas-contrato";
import { MENSAJE_RESERVA_NO_ENCONTRADA } from "../features/reservas/mensajes";
import { resumenFechas, formatoPesos } from "../features/reservas/fechas";
import { useCuentaCliente } from "../features/cuenta/useCuentaCliente";
import { iniciarSesionGoogle, urlDeEstaPagina } from "../features/cuenta/auth";
import BotonGoogle from "../features/cuenta/BotonGoogle";
import CabeceraPagina from "../features/cuenta/pagina/CabeceraPagina";
import { BadgeReserva } from "../features/cuenta/pagina/estadoReserva";
import { textoEstadoReserva } from "../features/cuenta/datosCuenta";
import { useQrReserva } from "../features/cuenta/pagina/useQrReserva";

const TIPO_LABEL = { carpa: "Carpa", sombrilla: "Sombrilla" };
const MAPS_URL = "https://www.google.com/maps/place/?q=place_id:ChIJQaFra8rdhJURflMJm96GTPQ";
const WHATSAPP_URL = "https://wa.me/542235765482";
const BOTON_BORDE =
  "sm:flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-full border border-hairline text-xs font-bold uppercase tracking-wider text-prius-black hover:border-gold transition-colors font-display";

export const TEXTO_INGRESAR_RESERVAS = "Ingresá para ver todas tus reservas";

// /r/:codigo — la URL del QR y del link compartido.
// - Con sesión y la reserva en reservas_web de esa cuenta: redirige a
//   /mi-cuenta/reservas/<codigo> (ahí está todo, con su QR).
// - Sin sesión, o si no es suya: la página pública con datos mínimos
//   (consultar-reserva), con el branding de la landing y la invitación a
//   ingresar.
export default function ReservaPublica() {
  const { codigo } = useParams();
  const { sesion, cuenta, cargando: cargandoCuenta } = useCuentaCliente();
  const esMia = !!cuenta?.reservas_web?.some((r) => r.codigo === codigo);
  // Con sesión, se espera a saber si es suya antes de mostrar la pública
  // (si no, se vería un instante y después saltaría).
  const decidiendo = cargandoCuenta && (!sesion || !cuenta);

  if (sesion && esMia) return <Navigate to={`/mi-cuenta/reservas/${codigo}`} replace />;

  return (
    <div className="min-h-screen bg-prius-background font-sans text-prius-black">
      <CabeceraPagina />
      <section data-theme="dark" className="bg-neutral-950 text-white">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-8 pb-24 md:pt-10 md:pb-28 text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold font-display">Tu reserva</span>
          <h1 className="mt-2 text-[26px] md:text-[36px] leading-tight font-bold uppercase font-display">Prius Playa Grande</h1>
        </div>
      </section>
      <main className="px-5 md:px-8 pb-16 -mt-16 md:-mt-20">
        {decidiendo ? (
          <Tarjeta>
            <Cargando />
          </Tarjeta>
        ) : (
          <DetallePublico codigo={codigo} conSesion={!!sesion} />
        )}
      </main>
    </div>
  );
}

function Tarjeta({ children }) {
  return (
    <div
      data-reserva-publica
      className="w-full max-w-md mx-auto bg-white rounded-[28px] border border-hairline shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] p-6 md:p-8 text-center"
    >
      {children}
    </div>
  );
}

function Cargando() {
  return <p className="text-prius-black/40 text-xs font-bold uppercase tracking-widest font-display py-10">Cargando…</p>;
}

function DetallePublico({ codigo, conSesion }) {
  const codigoValido = !!codigo && REGEX_CODIGO.test(codigo);
  const [resultado, setResultado] = useState({ codigo: null, reserva: null });
  // consultar_reserva_publica() no devuelve hora_corte_noshow — se pide
  // aparte para el texto del bloque "sujeta a disponibilidad".
  const { config } = useConfigReservas();
  const qr = useQrReserva(resultado.reserva ? codigo : null);

  useEffect(() => {
    if (!codigoValido) return;
    let cancelado = false;
    consultarReserva(codigo)
      .then((data) => {
        if (!cancelado) setResultado({ codigo, reserva: data ?? null });
      })
      .catch(() => {
        if (!cancelado) setResultado({ codigo, reserva: null });
      });
    return () => {
      cancelado = true;
    };
  }, [codigo, codigoValido]);

  const estado = !codigoValido ? "no_encontrada" : resultado.codigo !== codigo ? "cargando" : resultado.reserva ? "ok" : "no_encontrada";
  const reserva = resultado.reserva;
  const explicacion = textoEstadoReserva(reserva, config);

  return (
    <div className="space-y-4">
      <Tarjeta>
        {estado === "cargando" && <Cargando />}

        {estado === "no_encontrada" && (
          <div className="py-8 space-y-4">
            <p className="text-prius-black/70 text-sm">{MENSAJE_RESERVA_NO_ENCONTRADA}</p>
            <Link
              to="/"
              className="inline-flex h-10 items-center justify-center rounded-full bg-gold px-6 text-xs font-bold uppercase tracking-wider text-prius-black hover:bg-gold-hover transition-colors font-display"
            >
              Volver al inicio
            </Link>
          </div>
        )}

        {estado === "ok" && reserva && (
          <div className="space-y-5">
            <BadgeReserva estado={reserva.estado} />
            <p className="text-2xl font-bold text-prius-black font-display tracking-widest">{codigo}</p>
            <div className="mx-auto w-fit rounded-2xl p-2 border border-hairline">
              {qr ? (
                <img src={qr} alt={`QR de la reserva ${codigo}`} className="w-44 h-44" />
              ) : (
                <div className="w-44 h-44 bg-neutral-100 rounded-xl animate-pulse" />
              )}
            </div>
            {reserva.titular && <p className="text-sm text-prius-black/60">{reserva.titular}</p>}
            {explicacion && <p className="text-sm text-prius-black/70 leading-relaxed max-w-xs mx-auto">{explicacion}</p>}

            <div className="rounded-2xl border border-hairline bg-prius-background px-4 py-1 text-left">
              {reserva.unidades?.length > 0 && (
                <Fila
                  label="Unidades"
                  valor={reserva.unidades.map((u) => `${TIPO_LABEL[u.tipo] || u.tipo} ${u.numero}`).join(" + ")}
                />
              )}
              {reserva.desde && <Fila label="Fechas" valor={resumenFechas(reserva.desde, reserva.hasta)} />}
              {reserva.cantidad_personas != null && <Fila label="Personas" valor={reserva.cantidad_personas} />}
              {reserva.saldo != null && reserva.saldo > 0 && <Fila label="A abonar" valor={formatoPesos(reserva.saldo)} />}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {qr && (
                <a href={qr} download={`prius-${codigo}.png`} className={BOTON_BORDE}>
                  <Download size={14} /> Descargar QR
                </a>
              )}
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className={BOTON_BORDE}>
                <MapPin size={14} /> Cómo llegar
              </a>
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 h-10 w-full rounded-full bg-gold text-xs font-bold uppercase tracking-wider text-prius-black hover:bg-gold-hover transition-colors font-display shadow-md"
            >
              <Phone size={14} /> WhatsApp del balneario
            </a>
          </div>
        )}
      </Tarjeta>

      <InvitacionCuenta conSesion={conSesion} />
    </div>
  );
}

// Debajo de la tarjeta: sin sesión, ingresar (vuelve a esta misma URL y, si
// la reserva es suya, termina en /mi-cuenta); con sesión de otra cuenta, sus
// propias reservas.
function InvitacionCuenta({ conSesion }) {
  const [yendo, setYendo] = useState(false);
  async function ingresar() {
    setYendo(true);
    const { ok } = await iniciarSesionGoogle({ volverA: urlDeEstaPagina() });
    if (!ok) setYendo(false);
  }
  return (
    <div data-invitacion-cuenta className="w-full max-w-md mx-auto rounded-[24px] border border-hairline bg-white/60 px-6 py-5 text-center">
      {conSesion ? (
        <Link
          to="/mi-cuenta/reservas"
          className="text-xs font-bold uppercase tracking-wider text-prius-black hover:text-gold transition-colors font-display"
        >
          Ver mis reservas →
        </Link>
      ) : (
        <>
          <p className="text-sm font-semibold text-prius-black">{TEXTO_INGRESAR_RESERVAS}</p>
          <div className="mt-3">
            <BotonGoogle onClick={ingresar} cargando={yendo}>
              Ingresar con Google
            </BotonGoogle>
          </div>
        </>
      )}
    </div>
  );
}

function Fila({ label, valor }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 text-sm border-b border-hairline last:border-0">
      <span className="text-prius-black/50">{label}</span>
      <span className="font-semibold text-prius-black text-right">{valor}</span>
    </div>
  );
}
