import { useEffect } from 'react'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Partners from '../components/landing/Partners'
import Services from '../components/landing/Services'
import Events from '../components/landing/Events'
import Gallery from '../components/landing/Gallery'
import Testimonials from '../components/landing/Testimonials'
import ContactSection from '../components/ContactSection'
import Footer from '../components/landing/Footer'

export default function LandingPage() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15, // Gatilla cuando el 15% del elemento es visible
    }

    const handleIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target) // Una vez animado, deja de observarlo
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, observerOptions)
    
    // Captura todas las secciones con la clase reveal
    const revealElements = document.querySelectorAll('.reveal')
    revealElements.forEach((el) => observer.observe(el))

    return () => {
      revealElements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans text-prius-black selection:bg-gold selection:text-prius-black">
      <Navbar />
      <main className="overflow-hidden">
        {/* El Hero ya inicia animado directamente para dar feedback inmediato */}
        <Hero />
        
        <div className="reveal">
          <Partners />
        </div>
        <div className="reveal">
          <Services />
        </div>
        <div className="reveal">
          <Events />
        </div>
        <div className="reveal">
          <Gallery />
        </div>
        <div className="reveal">
          <Testimonials />
        </div>
        <div className="reveal">
          <ContactSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}