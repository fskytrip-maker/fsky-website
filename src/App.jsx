import { useRef } from 'react'
import SilkWipe from './components/SilkWipe'
import Header from './components/Header'
import SilkZone from './components/SilkZone'
import SkyZone from './components/SkyZone'
import { useMotion } from './motion/useMotion'
import About from './sections/About'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import Hero from './sections/Hero'
import Services from './sections/Services'

// Section order = page order. Each section is self-contained (component + css
// + data), so any one of them can be redesigned or swapped independently.
export default function App() {
  const rootRef = useRef(null)
  useMotion(rootRef)

  return (
    <div ref={rootRef}>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <Header />
      <main>
        <SilkZone>
          <Hero />
          <About />
          <Services />
        </SilkZone>
        <SilkWipe />
        {/* Contact + footer share one sky-blue ground. The footer sits inside
            it (and so inside <main>) so the ground can run on unbroken. */}
        <SkyZone>
          <Contact />
          <Footer />
        </SkyZone>
      </main>
    </div>
  )
}
