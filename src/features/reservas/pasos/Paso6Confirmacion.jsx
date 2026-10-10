import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Download, MessageCircle } from 'lucide-react'
import { URL_RESERVA } from '../../../lib/reservas-contrato'
import { MENSAJE_PRECONFIRMADA_PASO6, EMAIL_RESERVA_ACTIVO } from '../mensajes'
import { formatoPesos } from '../fechas'

export default function Paso6Confirmacion({ config, state }) {
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const canvasRef = useRef(null)
  const { resultado } = state
  const codigo = resultado?.codigo

  useEffect(() => {
    if (!codigo) return
    QRCode.toDataURL(URL_RESERVA(codigo), { width: 320, margin: 1 }).then(setQrDataUrl)
  }, [codigo])

  async function handleDescargar() {
    if (!codigo) return
    const qr = await QRCode.toCanvas(document.createElement('canvas'), URL_RESERVA(codigo), {
      width: 320,
      margin: 1,
    })
    const canvas = canvasRef.current
    canvas.width = 320
    canvas.height = 380
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(qr, 0, 0, 320, 320)
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 20px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(codigo, canvas.width / 2, 360)

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `prius-${codigo}.png`
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  if (!codigo) return null

  const hora = config?.hora_corte_noshow?.slice(0, 5) ?? '12:00'
  const urlReserva = URL_RESERVA(codigo)
  const linkWhatsapp = `https://wa.me/?text=${encodeURIComponent(`Mi reserva en Prius Playa Grande: ${urlReserva}`)}`

  return (
    <div className="flex flex-col items-center text-center py-4 animate-premium-fade">
      <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold flex items-center justify-center mb-4 text-prius-black">
        ✓
      </div>
      <h4 className="text-lg font-bold uppercase tracking-wider text-prius-black mb-1 font-display">
        ¡Reserva Preconfirmada!
      </h4>
      <p className="text-2xl font-bold text-prius-black font-display tracking-widest mb-3">{codigo}</p>

      {qrDataUrl && <img src={qrDataUrl} alt={`QR de la reserva ${codigo}`} className="w-40 h-40 mb-3" />}
      <canvas ref={canvasRef} className="hidden" />

      <p className="text-prius-black/70 text-xs max-w-md leading-relaxed font-light mb-5">
        {MENSAJE_PRECONFIRMADA_PASO6(hora, state.fechas.desde)}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mb-5">
        <button
          type="button"
          onClick={handleDescargar}
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-full border border-hairline text-xs font-bold uppercase tracking-wider text-prius-black hover:border-gold transition-colors font-display cursor-pointer"
        >
          <Download size={14} /> Descargar QR
        </button>
        <a
          href={linkWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-full bg-gold text-xs font-bold uppercase tracking-wider text-prius-black hover:bg-gold-hover transition-colors font-display cursor-pointer"
        >
          <MessageCircle size={14} /> Compartir
        </a>
      </div>

      {EMAIL_RESERVA_ACTIVO && (
        <p className="text-[10px] text-prius-black/40 font-light mb-3">
          También te lo enviamos a {state.datos.email}
        </p>
      )}

      {resultado?.total != null && (
        <div className="p-3 rounded-xl border border-hairline bg-neutral-50 text-xs w-full max-w-xs">
          <span className="text-prius-black/50 font-light">A abonar: </span>
          <span className="font-bold text-prius-black">{formatoPesos(resultado.total)}</span>
        </div>
      )}
    </div>
  )
}
