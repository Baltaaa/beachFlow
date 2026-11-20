import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { URL_RESERVA } from '../../../lib/reservas-contrato'

// QR de una reserva web: la URL pública https://…/r/<codigo>, sin datos
// sensibles (el mismo que se escanea en recepción). Devuelve un data URL PNG.
export function useQrReserva(codigo, ancho = 320) {
  const [qr, setQr] = useState({ codigo: null, url: null })
  useEffect(() => {
    if (!codigo) return
    let vivo = true
    QRCode.toDataURL(URL_RESERVA(codigo), { width: ancho, margin: 1 }).then((url) => {
      if (vivo) setQr({ codigo, url })
    })
    return () => {
      vivo = false
    }
  }, [codigo, ancho])
  return qr.codigo === codigo ? qr.url : null
}
