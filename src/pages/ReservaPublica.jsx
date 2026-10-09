import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Download, MapPin, Phone } from "lucide-react";
import QRCode from "qrcode";
import { consultarReserva } from "../features/reservas/api";
import { REGEX_CODIGO, URL_RESERVA } from "../lib/reservas-contrato";
import {
  BADGE_PRECONFIRMADA,
  BADGE_CONFIRMADA,
  MENSAJE_VENCIDA,
  MENSAJE_PRECONFIRMADA_PASO6,
  MENSAJE_RESERVA_NO_ENCONTRADA,
} from "../features/reservas/mensajes";
import { resumenFechas, formatoPesos } from "../features/reservas/fechas";

const TIPO_LABEL = { carpa: "Carpa", sombrilla: "Sombrilla" };
const MAPS_URL = "https://www.google.com/maps/place/?q=place_id:ChIJQaFra8rdhJURflMJm96GTPQ";
const WHATSAPP_URL = "https://wa.me/542235765482";

export default function ReservaPublica() {
  const { codigo } = useParams();
  const codigoValido = !!codigo && REGEX_CODIGO.test(codigo);
  const [estado, setEstado] = useState(codigoValido ? "cargando" : "no_encontrada"); // cargando | ok | no_encontrada
  const [reserva, setReserva] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);

  useEffect(() => {
    if (!codigoValido) return;
    let cancelado = false;
    consultarReserva(codigo)
      .then((data) => {
        if (cancelado) return;
        if (!data) {
          setEstado("no_encontrada");
          return;
        }
        setReserva(data);
        setEstado("ok");
      })
      .catch(() => {
        if (!cancelado) setEstado("no_encontrada");
      });
    return () => {
      cancelado = true;
    };
  }, [codigo, codigoValido]);

  useEffect(() => {
    if (estado !== "ok" || !codigo) return;
    QRCode.toDataURL(URL_RESERVA(codigo), { width: 320, margin: 1 }).then(setQrDataUrl);
  }, [estado, codigo]);

  return (
    <section className="min-h-screen bg-neutral-950 flex items-center justify-center px-margin-mobile md:px-margin-desktop py-16">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 md:p-8 text-center">
        <Link to="/" className="inline-block mb-6">
          <img src="/images/prius-icon.png" alt="Prius" className="h-10 mx-auto" />
        </Link>

        {estado === "cargando" && (
          <p className="text-prius-black/40 text-xs font-bold uppercase tracking-widest font-display py-10">
            Cargando…
          </p>
        )}

        {estado === "no_encontrada" && (
          <div className="py-8 space-y-4">
            <p className="text-prius-black/70 text-sm font-light">{MENSAJE_RESERVA_NO_ENCONTRADA}</p>
            <Link
              to="/"
              className="inline-flex h-9 items-center justify-center rounded-full bg-gold px-6 text-xs font-bold uppercase tracking-wider text-prius-black hover:bg-gold-hover transition-colors font-display"
            >
              Volver al inicio
            </Link>
          </div>
        )}

        {estado === "ok" && reserva && (
          <div className="space-y-5">
            <Badge estado={reserva.estado} />

            <p className="text-2xl font-bold text-prius-black font-display tracking-widest">{codigo}</p>

            {qrDataUrl && (
              <img src={qrDataUrl} alt={`QR de la reserva ${codigo}`} className="w-40 h-40 mx-auto" />
            )}

            {reserva.estado === "vencida" ? (
              <p className="text-xs text-prius-black/70 font-light leading-relaxed max-w-xs mx-auto">
                {MENSAJE_VENCIDA}
              </p>
            ) : (
              <p className="text-xs text-prius-black/70 font-light leading-relaxed max-w-xs mx-auto">
                {MENSAJE_PRECONFIRMADA_PASO6(
                  reserva.horaCorte ?? "12:00",
                  reserva.desde ? resumenFechas(reserva.desde, reserva.desde).split(" · ")[0] : "",
                )}
              </p>
            )}

            <div className="p-4 rounded-xl border border-hairline bg-neutral-50 space-y-2 text-left">
              {reserva.unidades?.length > 0 && (
                <Fila
                  label="Unidades"
                  valor={reserva.unidades.map((u) => `${TIPO_LABEL[u.tipo] || u.tipo} ${u.numero}`).join(" + ")}
                />
              )}
              {reserva.desde && <Fila label="Fechas" valor={resumenFechas(reserva.desde, reserva.hasta)} />}
              {reserva.personas != null && <Fila label="Personas" valor={reserva.personas} />}
              {reserva.monto != null && <Fila label="A abonar" valor={formatoPesos(reserva.monto)} />}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {qrDataUrl && (
                <a
                  href={qrDataUrl}
                  download={`prius-${codigo}.png`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-full border border-hairline text-xs font-bold uppercase tracking-wider text-prius-black hover:border-gold transition-colors font-display"
                >
                  <Download size={14} /> Descargar QR
                </a>
              )}
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-full border border-hairline text-xs font-bold uppercase tracking-wider text-prius-black hover:border-gold transition-colors font-display"
              >
                <MapPin size={14} /> Cómo llegar
              </a>
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 h-10 w-full rounded-full bg-gold text-xs font-bold uppercase tracking-wider text-prius-black hover:bg-gold-hover transition-colors font-display"
            >
              <Phone size={14} /> WhatsApp del balneario
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

function Badge({ estado }) {
  const texto = estado === "confirmada" ? BADGE_CONFIRMADA : estado === "vencida" ? "Vencida" : BADGE_PRECONFIRMADA;
  const clase =
    estado === "confirmada"
      ? "bg-green-100 text-green-700"
      : estado === "vencida"
        ? "bg-neutral-200 text-neutral-600"
        : "bg-gold/20 text-prius-black";
  return (
    <span className={`inline-block text-[10px] font-bold uppercase tracking-widest font-display px-3 py-1.5 rounded-full ${clase}`}>
      {texto}
    </span>
  );
}

function Fila({ label, valor }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-prius-black/50 font-light">{label}</span>
      <span className="font-bold text-prius-black">{valor}</span>
    </div>
  );
}
