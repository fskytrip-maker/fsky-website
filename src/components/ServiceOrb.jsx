import { useEffect, useRef } from 'react'
import { mountOrb } from '../motion/orbCanvas'

/**
 * Decorative neon ring at the end of a Services row: still at rest, swirling
 * with sheets of light and sparks while its row (the nearest .service) is
 * hovered. Drawing lives in src/motion/orbCanvas.js.
 */
export default function ServiceOrb() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    return mountOrb(canvas, canvas.closest('.service'))
  }, [])

  return (
    <span className="service__orb" aria-hidden="true">
      <canvas ref={ref} />
    </span>
  )
}
