import { useEffect, useRef } from 'react'
import { mountHeroSilk } from '../motion/silkCanvas'
import './HeroSilk.css'

/**
 * Decorative Hero background: glowing blue silk folds on two canvases
 * (soft glow + thin bright rim). All drawing, animation and pausing live in
 * src/motion/silkCanvas.js. It owns its own lifecycle (rather than going
 * through initMotion) because it must still draw a static frame under
 * prefers-reduced-motion, where the motion system never starts.
 */
export default function HeroSilk() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return undefined
    return mountHeroSilk(ref.current)
  }, [])

  return (
    <div className="hero-silk" ref={ref} aria-hidden="true">
      <canvas className="hero-silk__layer" data-silk-glow />
      <canvas className="hero-silk__layer" data-silk-rim />
    </div>
  )
}
