import { useRef } from 'react'
import Header from './components/Header'
import { useMotion } from './motion/useMotion'
import About from './sections/About'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import Hero from './sections/Hero'
import Process from './sections/Process'
import Profile from './sections/Profile'
import Services from './sections/Services'
import Works from './sections/Works'

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
        <Hero />
        <About />
        <Services />
        <Works />
        <Process />
        <Profile />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
