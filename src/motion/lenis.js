// Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis
// always agree on the scroll position (the pattern recommended by both libs).
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap, ScrollTrigger } from './gsap'

let lenis = null

/** Start smooth scrolling. Returns a function that fully tears it down. */
export function startLenis() {
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    // Touch devices keep native momentum scrolling (Lenis default), which is
    // both smoother and cheaper on mobile.
    smoothWheel: true,
  })

  lenis.on('scroll', ScrollTrigger.update)

  const tick = (time) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    gsap.ticker.lagSmoothing(500, 33)
    lenis?.destroy()
    lenis = null
  }
}

export const getLenis = () => lenis

/** Smooth-scroll to a section by id (Lenis if active, native otherwise). */
export function scrollToId(id) {
  const target = document.getElementById(id)
  if (!target) return
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4 })
    return
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

/** Freeze / unfreeze page scrolling (used by the mobile menu). */
export function setScrollLocked(locked) {
  document.documentElement.classList.toggle('is-scroll-locked', locked)
  if (!lenis) return
  if (locked) lenis.stop()
  else lenis.start()
}
