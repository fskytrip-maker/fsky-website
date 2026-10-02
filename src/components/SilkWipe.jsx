import { useEffect, useRef } from 'react'
import { mountSilkWipe } from '../motion/silkWipe'
import './SilkWipe.css'

/**
 * Dark → sky-blue transition between Services and Contact, built from the Hero's
 * silk curves: glowing ribbons draw in across the screen, crossing one
 * another, then swell into white light until the screen is white
 * (src/motion/silkWipe.js). Motion only — with reduced motion it isn't
 * rendered at all (see the CSS), so the page simply cuts from dark to light.
 */
export default function SilkWipe() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return undefined
    return mountSilkWipe(ref.current)
  }, [])

  return (
    <div className="silk-wipe" ref={ref} aria-hidden="true">
      <div className="silk-wipe__stage">
        <canvas />
      </div>
    </div>
  )
}
