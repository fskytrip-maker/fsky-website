import { useEffect, useRef } from 'react'
import { gsap } from '../motion/gsap'
import './WriteTitle.css'

/**
 * Heading that writes itself in: each time it comes on screen (and has
 * faded in, when it sits behind the silk transition), each letter's outline
 * is drawn one after another, then filled in. `text` may contain '\n'.
 *
 * Each letter gets its own small SVG copy (outline-drawn via stroke dashes)
 * laid exactly over the real letter, which stays hidden until it is done;
 * afterwards the SVGs are removed and only the real text remains.
 * Reduced motion: plain static text.
 */
const REDUCED = '(prefers-reduced-motion: reduce)'
const DASH = 2400 // longer than any letter's outline at display sizes
const SVG = 'http://www.w3.org/2000/svg'

export default function WriteTitle({ text }) {
  const ref = useRef(null)
  const lines = text.split('\n')

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia(REDUCED).matches) return undefined
    const chars = [...el.querySelectorAll('.wt-char')].filter((c) => c.textContent.trim())
    // Behind the silk transition the section's content fades in; wait for it.
    const fader = el.closest('.container')
    let raf = 0
    let tl = null
    let svgs = []
    let state = 'idle' // idle (ready, hidden) | writing | done

    // Lay an SVG copy over every letter and hide the real ones.
    const build = () => {
      svgs = chars.map((c) => {
        const baseline = c.querySelector('.wt-base').offsetTop
        const svg = document.createElementNS(SVG, 'svg')
        svg.setAttribute('class', 'wt-svg')
        svg.setAttribute('aria-hidden', 'true')
        const t = document.createElementNS(SVG, 'text')
        t.setAttribute('x', '0')
        t.setAttribute('y', String(baseline))
        t.textContent = c.dataset.char
        svg.appendChild(t)
        c.appendChild(svg)
        return t
      })
      gsap.set(svgs, { strokeDasharray: DASH, strokeDashoffset: DASH, fillOpacity: 0 })
      el.classList.add('is-writing')
      state = 'idle'
    }

    // Back to the plain text.
    const clear = () => {
      svgs.forEach((t) => t.parentNode?.remove())
      svgs = []
      el.classList.remove('is-writing')
    }

    const run = () => {
      state = 'writing'
      tl = gsap.timeline({
        onComplete: () => {
          clear()
          state = 'done'
        },
      })
      svgs.forEach((t, i) => {
        const at = i * 0.09
        tl.to(t, { strokeDashoffset: 0, duration: 0.55, ease: 'power1.inOut' }, at)
        tl.to(t, { fillOpacity: 1, duration: 0.3, ease: 'power2.out' }, at + 0.32)
      })
    }

    // Behind the silk transition the content fades in; wait until it shows.
    const waitVisible = () => {
      const visible = !fader || Number(getComputedStyle(fader).opacity) > 0.95
      if (visible) run()
      else raf = requestAnimationFrame(waitVisible)
    }

    // Writes in every time it comes into view; once it has left the screen
    // completely it is reset, ready to write in again.
    build()
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.4) {
          if (state === 'idle') {
            cancelAnimationFrame(raf)
            waitVisible()
          }
        } else if (!entry.isIntersecting && state !== 'idle') {
          cancelAnimationFrame(raf)
          tl?.kill()
          clear()
          build()
        }
      },
      { threshold: [0, 0.4] },
    )
    io.observe(el)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      tl?.kill()
      clear()
    }
  }, [text])

  return (
    <span className="wt" ref={ref}>
      <span className="sr-only">{lines.join(' ')}</span>
      <span aria-hidden="true">
        {lines.map((line, i) => (
          <span className="wt-line" key={i}>
            {Array.from(line).map((ch, j) => (
              <span className="wt-char" key={j} data-char={ch}>
                {ch === ' ' ? ' ' : ch}
                {/* Zero-size marker sitting on the baseline (for the SVG). */}
                <i className="wt-base" />
              </span>
            ))}
          </span>
        ))}
      </span>
    </span>
  )
}
