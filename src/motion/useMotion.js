import { useEffect } from 'react'
import { startLenis } from './lenis'
import { initMotion } from './initMotion'

const REDUCED = '(prefers-reduced-motion: reduce)'
const MOTION_CLASS = 'js-motion'

/** Called from main.jsx before first render so hidden states apply before paint. */
export function primeMotionClass() {
  const reduce = window.matchMedia(REDUCED).matches
  document.documentElement.classList.toggle(MOTION_CLASS, !reduce)
}

/**
 * Boots Lenis + GSAP for the page inside `rootRef`. With
 * prefers-reduced-motion the site stays fully static (no Lenis, no GSAP, no
 * hidden states) and reacts live if the setting changes.
 */
export function useMotion(rootRef) {
  useEffect(() => {
    const root = rootRef.current
    const mq = window.matchMedia(REDUCED)
    const html = document.documentElement
    let teardown = () => {}

    const setup = () => {
      teardown()
      teardown = () => {}
      if (mq.matches) {
        html.classList.remove(MOTION_CLASS)
        return
      }
      html.classList.add(MOTION_CLASS)
      try {
        const stopLenis = startLenis()
        const stopMotion = initMotion(root)
        teardown = () => {
          stopMotion()
          stopLenis()
        }
      } catch (error) {
        // Never leave content hidden if animation setup fails.
        console.error('[motion] disabled:', error)
        html.classList.remove(MOTION_CLASS)
      }
    }

    setup()
    mq.addEventListener('change', setup)
    return () => {
      mq.removeEventListener('change', setup)
      teardown()
    }
  }, [rootRef])
}
