import { useEffect, useRef } from 'react'
import { contact } from '../data/site'
import { mountSkyWipe } from '../motion/skyWipe'
import './SkyWipe.css'

/**
 * Dark → sky-blue transition between Services and Contact: light blooms in
 * the middle, streams of glowing particles flow across, the dark clears into
 * the sky and a chapter card for Contact — its lead, character by character,
 * then the same line in English — comes and goes
 * (src/motion/skyWipe.js). Motion only — with reduced motion it isn't
 * rendered at all (see the CSS), so the page simply cuts from dark to light.
 */
export default function SkyWipe() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return undefined
    return mountSkyWipe(ref.current)
  }, [])

  return (
    <div className="sky-wipe" ref={ref} aria-hidden="true">
      <div className="sky-wipe__stage">
        <canvas />
        <div className="sky-wipe__chapter">
          <p className="sky-wipe__chapter-title">
            {[...contact.lead].map((char, i) => (
              <span key={i} className="sky-wipe__char">
                {char}
              </span>
            ))}
          </p>
          <p className="sky-wipe__chapter-en">{contact.leadEn}</p>
        </div>
      </div>
    </div>
  )
}
