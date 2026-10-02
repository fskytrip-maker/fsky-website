import { useEffect, useRef } from 'react'
import { gsap } from '../motion/gsap'
import './WriteTitle.css'

/**
 * Heading that writes itself in: once it is on screen (and fully faded in,
 * when it sits behind the silk transition), each letter's outline is drawn
 * one after another, then filled in. `text` may contain '\n'.
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
    const svgs = []

    el.classList.add('is-writing')

    const build = () => {
      chars.forEach((c) => {
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
        svgs.push(t)
      })
      gsap.set(svgs, { strokeDasharray: DASH, strokeDashoffset: DASH, fillOpacity: 0 })
    }

    const finish = () => {
      svgs.forEach((t) => t.parentNode?.remove())
      el.classList.remove('is-writing')
    }

    const run = () => {
      tl = gsap.timeline({ onComplete: finish })
      svgs.forEach((t, i) => {
        const at = i * 0.09
        tl.to(t, { strokeDashoffset: 0, duration: 0.55, ease: 'power1.inOut' }, at)
        tl.to(t, { fillOpacity: 1, duration: 0.3, ease: 'power2.out' }, at + 0.32)
      })
    }

    const waitVisible = () => {
      const visible = !fader || Number(getComputedStyle(fader).opacity) > 0.95
      if (visible) run()
      else raf = requestAnimationFrame(waitVisible)
    }

    build()
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        waitVisible()
      },
      { threshold: 0.4 },
    )
    io.observe(el)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      tl?.kill()
      finish()
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
