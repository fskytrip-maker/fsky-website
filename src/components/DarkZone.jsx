import { useEffect, useRef } from 'react'
import { mountParticles } from '../motion/particles'
import './DarkZone.css'

/**
 * The dark ground under Hero → About → Services: near-black under the Hero,
 * settling into the page's pure black, with light particles drifting up in
 * a sticky, screen-sized layer (src/motion/particles.js). The sections
 * inside let it show through.
 */
export default function DarkZone({ children }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return undefined
    return mountParticles(ref.current)
  }, [])

  return (
    <div className="dark-zone">
      <div className="dark-zone__backdrop" aria-hidden="true">
        <div className="dark-zone__sticky">
          <canvas className="dark-zone__particles" ref={ref} />
        </div>
      </div>
      {children}
    </div>
  )
}
