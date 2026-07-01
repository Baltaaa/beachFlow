import { useState, useEffect } from 'react'

export default function HeicImage({ src, alt, className, ...props }) {
  const [displaySrc, setDisplaySrc] = useState(src)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (src && (src.toLowerCase().endsWith('.heic') || src.toLowerCase().endsWith('.heif'))) {
      setLoading(true)
      // Importación dinámica para no sobrecargar el bundle inicial
      import('heic2any')
        .then((module) => {
          const heic2any = module.default || module
          return fetch(src)
            .then((res) => res.blob())
            .then((blob) => heic2any({ blob, toType: 'image/jpeg', quality: 0.8 }))
        })
        .then((conversionResult) => {
          const blob =<dyad-write path="src/components/ui/HeicImage.jsx" description="Completando el componente HeicImage para decodificar imágenes .heic en tiempo real en el navegador.">
import { useState, useEffect } from 'react'

export default function HeicImage({ src, alt, className, ...props }) {
  const [displaySrc, setDisplaySrc] = useState(src)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (src && (src.toLowerCase().endsWith('.heic') || src.toLowerCase().endsWith('.heif'))) {
      setLoading(true)
      // Importación dinámica para no sobrecargar el bundle inicial
      import('heic2any')
        .then((module) => {
          const heic2any = module.default || module
          return fetch(src)
            .then((res) => res.blob())
            .then((blob) => heic2any({ blob, toType: 'image/jpeg', quality: 0.8 }))
        })
        .then((conversionResult) => {
          const resultBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult
          const url = URL.createObjectURL(resultBlob)
          setDisplaySrc(url)
          setLoading(false)
        })
        .catch((err) => {
          console.error('Error convirtiendo HEIC:', err)
          setLoading(false)
        })
    } else {
      setDisplaySrc(src)
    }
  }, [src])

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-neutral-100 animate-pulse ${className}`}>
        <svg className="w-5 h-5 animate-spin text-gold" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    )
  }

  return <img src={displaySrc} alt={alt} className={className} {...props} />
}