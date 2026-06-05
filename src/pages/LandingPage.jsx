import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Partners from '../components/landing/Partners'
import Services from '../components/landing/Services'
import Events from '../components/landing/Events'
import Gallery from '../components/landing/Gallery'
import Testimonials from '../components/landing/Testimonials'
import Contact from '../components/landing/Contact'
import Footer from '../components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-prius-black selection:bg-gold selection:text-prius-black">
      <Navbar />
      <main>
        <Hero />
        <Partners />
        <Services />
        <Events />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}