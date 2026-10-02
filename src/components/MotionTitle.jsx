import { useEffect, useRef } from 'react'
import { gsap } from '../motion/gsap'
import './MotionTitle.css'

/**
 * Big section heading with an entrance: when it scrolls into view, random
 * sky-blue glyphs flicker in each letter's place and lock into the real
 * letters from left to right; once the last one has locked, a band of
 * sky-blue light runs across the whole heading.
 * `text` may contain '\n' for line breaks. Reduced motion: plain static text.
 */
const REDUCED = '(prefers-reduced-motion: reduce)'
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>'
const LOCK_START = 0.35 // s before the first letter locks
const LOCK_STEP = 0.07 // s between letters locking

export default function MotionTitle({ text }) {
  const ref = useRef(null)
  const lines = text.split('\n')

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia(REDUCED).matches) return undefined
    const chars = [...el.querySelectorAll('.mt-visual > .mt-line .mt-char')]
    const glow = el.querySelector('.mt-glow')

    // Fix every slot to its real letter's width so nothing shifts while the
    // glyphs flicker.
    chars.forEach((c) => {
      c.style.width = `${c.getBoundingClientRect().width}px`
      c.dataset.final = c.textContent
    })
    const letters = chars.filter((c) => c.dataset.final.trim())
    letters.forEach((c) => {
      c.textContent = ''
    })
    gsap.set(glow, { '--sweep': '-40%' })

    let raf = 0
    let sweep = null
    const settled = LOCK_START + (letters.length - 1) * LOCK_STEP

    const run = () => {
      sweep = gsap.to(glow, {
        '--sweep': '140%',
        duration: 1.5,
        ease: 'power2.inOut',
        delay: settled - 0.1,
      })
      const start = performance.now()
      const tick = (now) => {
        const t = (now - start) / 1000
        let done = true
        letters.forEach((c, i) => {
          if (t >= LOCK_START + i * LOCK_STEP) {
            c.textContent = c.dataset.final
            c.classList.remove('is-scrambling')
          } else {
            done = false
            if (t > i * 0.03) {
              c.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
              c.classList.add('is-scrambling')
            }
          }
        })
        if (!done) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        run()
      },
      { threshold: 0.5 },
    )
    io.observe(el)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      sweep?.kill()
      gsap.set(glow, { clearProps: '--sweep' })
      chars.forEach((c) => {
        c.textContent = c.dataset.final
        c.style.width = ''
        c.classList.remove('is-scrambling')
      })
    }
  }, [text])

  return (
    <span className="mt" ref={ref}>
      <span className="sr-only">{lines.join(' ')}</span>
      <span className="mt-visual" aria-hidden="true">
        {lines.map((line, i) => (
          <span className="mt-line" key={i}>
            {Array.from(line).map((ch, j) => (
              <span className="mt-char" key={j}>
                {ch === ' ' ? ' ' : ch}
              </span>
            ))}
          </span>
        ))}
        {/* A sky-blue copy of the text, revealed only inside the moving
            band of light (see .mt-glow's mask). */}
        <span className="mt-glow">
          {lines.map((line, i) => (
            <span className="mt-line" key={i}>
              {line}
            </span>
          ))}
        </span>
      </span>
    </span>
  )
}
