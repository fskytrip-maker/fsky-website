// Light particles behind Hero → About → Services (DarkZone): many tiny
// sky-blue points that rise slowly, sway a little and breathe in brightness,
// a few larger ones carrying a soft glow. Brighter toward the bottom, where
// the light is. One 2D canvas, no WebGL, no CSS filters or masks.
//
// The canvas is a screen-sized window onto the zone: the field scrolls with
// the page (it repeats every screen) and fades out over the zone's last part.
// Positions are a pure function of the clock, so nothing ever accumulates.
//
// Runs on gsap.ticker (capped at 30fps), and only while on screen, the tab is
// visible and reduced motion is off. Otherwise a single static frame is
// drawn. The clock only advances while running, so resuming never jumps.
import { gsap } from './gsap'

const REDUCED = '(prefers-reduced-motion: reduce)'
const FPS = 30
const START_TIME = 8 // seconds in, so the first frame isn't a "rest" pose
const MAX_DPR = 1.5
const COUNT = { wide: 90, tall: 45 }
const END_FADE = 0.6 // fades out over the zone's last this-many screens

// Small seeded PRNG (mulberry32): the same field on every load and resize.
function rng(seed) {
  let s = seed
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeParticles(count) {
  const r = rng(7)
  return Array.from({ length: count }, () => {
    const big = r() < 0.12
    return {
      x: r(),
      y: r(),
      rise: 0.006 + r() * 0.018, // fraction of the height per second
      sway: 0.004 + r() * 0.012,
      swayF: 0.2 + r() * 0.4,
      size: big ? 2.2 + r() * 1.4 : 0.7 + r() * 1, // core radius, CSS px
      alpha: big ? 0.55 + r() * 0.3 : 0.25 + r() * 0.45,
      twinkle: 0.4 + r() * 0.9,
      phase: r() * Math.PI * 2,
    }
  })
}

// One soft dot, rendered once and stamped for every particle (far cheaper
// than building a gradient per particle per frame).
function makeSprite() {
  const c = document.createElement('canvas')
  c.width = 64
  c.height = 64
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  // The brand sky blue (--accent, #72d3f9), paler at the very core.
  grd.addColorStop(0, 'rgba(220, 246, 255, 1)')
  grd.addColorStop(0.16, 'rgba(114, 211, 249, 0.95)')
  grd.addColorStop(0.42, 'rgba(114, 211, 249, 0.28)')
  grd.addColorStop(1, 'rgba(114, 211, 249, 0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  return c
}

export function mountParticles(canvas) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}
  const zone = canvas.closest('.dark-zone')
  const reduced = window.matchMedia(REDUCED)
  const sprite = makeSprite()
  let w = 0
  let h = 0
  let dpr = 1
  let zoneH = 0
  let offset = 0 // px of the zone scrolled above the canvas's top edge
  let particles = []
  let clock = START_TIME
  let acc = 0
  let frame = 0
  let inView = true
  let running = false

  const readOffset = () =>
    zone ? canvas.getBoundingClientRect().top - zone.getBoundingClientRect().top : 0

  function draw(t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    // Near the zone's end the whole field fades, down to nothing at the end.
    const fadeLen = END_FADE * window.innerHeight
    const end = zoneH - offset // the zone's end, in canvas px
    for (const p of particles) {
      // Rise, wrapping from just below the bottom to just above the top; the
      // fade at both ends hides the wrap. The field scrolls with the page.
      const y = ((((p.y - p.rise * t - offset / h) % 1.1) + 1.1) % 1.1) - 0.05
      const x = p.x + p.sway * Math.sin(t * p.swayF + p.phase)
      const edge = Math.max(0, Math.min(1, (y + 0.05) / 0.12, (1.05 - y) / 0.12))
      const depth = 0.55 + 0.45 * y // brighter toward the bottom
      const breathe = 0.65 + 0.35 * Math.sin(t * p.twinkle + p.phase)
      const tail = Math.max(0, Math.min(1, (end - y * h) / fadeLen))
      const a = p.alpha * edge * depth * breathe * tail
      if (a <= 0.01) continue
      const d = p.size * 6
      ctx.globalAlpha = a
      ctx.drawImage(sprite, x * w - d / 2, y * h - d / 2, d, d)
    }
    ctx.globalAlpha = 1
  }

  function resize() {
    const r = canvas.getBoundingClientRect()
    w = Math.max(1, Math.round(r.width))
    h = Math.max(1, Math.round(r.height))
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    zoneH = zone ? zone.offsetHeight : h
    const count = w >= h ? COUNT.wide : COUNT.tall
    if (particles.length !== count) particles = makeParticles(count)
    offset = readOffset()
    draw(clock)
  }

  // gsap.ticker hands deltaTime in ms; only time spent running is counted.
  function tick(_time, deltaTime) {
    acc += Math.min(deltaTime / 1000, 0.1)
    if (acc < 1 / FPS) return
    clock += acc
    acc = 0
    offset = readOffset()
    draw(clock)
  }

  function sync() {
    const next = inView && !document.hidden && !reduced.matches
    if (next === running) return
    running = next
    acc = 0
    if (running) gsap.ticker.add(tick)
    else {
      gsap.ticker.remove(tick)
      draw(clock) // leave a complete static frame in place
    }
  }

  // Scrolling redraws at once, so the field moves in step with the content.
  function onScroll() {
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      const next = readOffset()
      if (next === offset) return
      offset = next
      draw(clock)
    })
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  if (zone) ro.observe(zone)
  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    sync()
  })
  io.observe(canvas)
  document.addEventListener('visibilitychange', sync)
  reduced.addEventListener('change', sync)
  resize()
  sync()

  return () => {
    gsap.ticker.remove(tick)
    cancelAnimationFrame(frame)
    window.removeEventListener('scroll', onScroll)
    ro.disconnect()
    io.disconnect()
    document.removeEventListener('visibilitychange', sync)
    reduced.removeEventListener('change', sync)
  }
}
