// Silk background for SilkZone (Hero → About → Services): long glowing blue
// "silk" ribbons plus drifting light particles, drawn on two 2D canvases
// (see components/HeroSilk). No WebGL.
//
//   glow canvas (low resolution, upscaled)  — wide, soft blue light built
//     from several layered strokes, offset toward the ribbon's lit face
//   rim canvas  (device resolution)         — a thin, bright cyan-white edge
//
// Each ribbon is ONE unbroken smooth curve running the full length of the
// zone, so it scrolls with the page without ever breaking off. The canvas is
// only a screen-sized window onto it. Every anchor point drifts on its own
// blend of slow sine waves, so the ribbons gently bend and sway.
//
// Runs on gsap.ticker (capped at 30fps), and only while the silk is on
// screen, the tab is visible and reduced motion is off. Otherwise a single
// static frame is drawn, so the background never goes blank. The animation
// clock only advances while running, so resuming never jumps.
import { gsap } from './gsap'

const REDUCED = '(prefers-reduced-motion: reduce)'
const FPS = 30
const START_TIME = 8 // seconds into the motion, so the first frame isn't a "rest" pose
const GLOW_SCALE = 0.35 // glow canvas resolution; the upscale itself softens it
const MAX_DPR = 1.5

// Motion feel: how fast the ribbons sway, and how far (fraction of the
// screen width / height).
const SPEED = 1.3
const SWAY_X = 0.035
const SWAY_Y = 0.02

// Light particles (after lenis.dev's hero): many tiny ice-blue points that
// rise slowly, sway a little and breathe in brightness, a few larger ones
// carrying a soft glow. Brighter toward the bottom, where the light is.
// Positions are a pure function of the clock, so the reduced-motion frame
// simply shows them still and nothing ever accumulates.
const PARTICLES = { wide: 90, tall: 45 }

// Colours (r, g, b). The rim stays a little bluer and dimmer than the FSKY
// cyan so the mark is always the brightest thing on screen.
const GLOW_OUTER = '22, 70, 200'
const GLOW_INNER = '45, 125, 255'
const RIM_HALO = '110, 180, 255'
const RIM_CORE = '210, 238, 255'
const AMBIENT = '14, 38, 110'

// Ribbons. Anchor k sits at y = START + k * STEP screen heights from the
// zone's top and x = base + amp * sin(k * freq + phase) (fraction of the
// width): a slow weave down one side of the page. They stay on the left and
// right edges (never across the middle, never off the edge), so text stays
// clear and no line ever leaves the screen and comes back "cut".
//   glow   glow width (fraction of the shorter side)
//   side   which side of the rim the lit face leans toward (fraction of width)
//   alpha  overall strength
const RIBBONS = {
  wide: [
    { base: 0.1, amp: 0.09, freq: 1.1, phase: 1.3, glow: 0.11, side: 0.022, alpha: 1 },
    { base: 0.045, amp: 0.04, freq: 0.8, phase: 0.4, glow: 0.08, side: 0.015, alpha: 0.45 },
    { base: 0.9, amp: 0.07, freq: 0.95, phase: 2.6, glow: 0.1, side: -0.022, alpha: 0.85 },
  ],
  // Portrait (phones / tall tablets): ribbons hug the edges a little more.
  tall: [
    { base: 0.08, amp: 0.08, freq: 1.2, phase: 1.3, glow: 0.16, side: 0.04, alpha: 1 },
    { base: 0.92, amp: 0.07, freq: 1, phase: 2.6, glow: 0.14, side: -0.04, alpha: 0.85 },
  ],
}
const START = -0.15
const STEP = 0.34

/** Anchor points of a ribbon at time t, in px of the zone (not the screen). */
function anchors(ribbon, index, count, t, w, h) {
  const time = t * SPEED
  const s = index * 1.9
  const pts = []
  for (let k = 0; k < count; k += 1) {
    const x = ribbon.base + ribbon.amp * Math.sin(k * ribbon.freq + ribbon.phase)
    const dx = 0.6 * Math.sin(time * 0.33 + s + k * 1.7) + 0.4 * Math.sin(time * 0.21 + s * 1.3 + k * 2.9)
    const dy = 0.6 * Math.cos(time * 0.27 + s * 0.7 + k * 2.3) + 0.4 * Math.sin(time * 0.17 + s * 2.1 + k * 1.1)
    pts.push([(x + SWAY_X * dx) * w, (START + k * STEP + SWAY_Y * dy) * h])
  }
  return pts
}

/** One smooth path through the points (Catmull-Rom as cubic Béziers). */
function curve(ctx, pts) {
  ctx.beginPath()
  ctx.moveTo(pts[0][0], pts[0][1])
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    ctx.bezierCurveTo(
      p1[0] + (p2[0] - p0[0]) / 6,
      p1[1] + (p2[1] - p0[1]) / 6,
      p2[0] - (p3[0] - p1[0]) / 6,
      p2[1] - (p3[1] - p1[1]) / 6,
      p2[0],
      p2[1],
    )
  }
}

// Small seeded PRNG (mulberry32) so the particle field is identical on every
// load and resize, rather than reshuffling.
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
  grd.addColorStop(0, 'rgba(255, 255, 255, 1)')
  grd.addColorStop(0.16, 'rgba(215, 238, 255, 0.9)')
  grd.addColorStop(0.42, 'rgba(120, 190, 255, 0.22)')
  grd.addColorStop(1, 'rgba(120, 190, 255, 0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  return c
}

// Brightness that rises and falls down the length of a ribbon (in screen
// space), so the light seems to catch the silk in places — without ever
// fading to nothing, so the line reads as continuous.
function shimmer(ctx, rgb, offset, h, t) {
  const g = ctx.createLinearGradient(0, 0, 0, h)
  for (let i = 0; i <= 8; i += 1) {
    const y = i / 8
    const v = 0.62 + 0.38 * Math.sin(((y * h + offset) / h) * 4.2 + t * 0.25)
    g.addColorStop(y, `rgba(${rgb}, ${v})`)
  }
  return g
}

export function mountHeroSilk(container) {
  const glowCanvas = container.querySelector('[data-silk-glow]')
  const rimCanvas = container.querySelector('[data-silk-rim]')
  if (!glowCanvas || !rimCanvas) return () => {}
  const glow = glowCanvas.getContext('2d')
  const rim = rimCanvas.getContext('2d')
  if (!glow || !rim) return () => {}

  const reduced = window.matchMedia(REDUCED)
  // The tall element the ribbons run through (falls back to just this box).
  const zone = container.closest('.silk-zone')
  let w = 0
  let h = 0
  let dpr = 1
  let ribbons = RIBBONS.wide
  let count = 0 // anchors per ribbon (enough to span the zone)
  let offset = 0 // px of the zone scrolled above the canvas's top edge
  let frame = 0
  let clock = START_TIME
  let acc = 0
  let inView = true
  let running = false
  let particles = []
  const sprite = makeSprite()

  function resize() {
    const r = container.getBoundingClientRect()
    w = Math.max(1, Math.round(r.width))
    h = Math.max(1, Math.round(r.height))
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    ribbons = w >= h ? RIBBONS.wide : RIBBONS.tall
    const zoneH = zone ? zone.offsetHeight : h
    count = Math.ceil((zoneH / h - START) / STEP) + 3
    offset = readOffset()
    const dots = w >= h ? PARTICLES.wide : PARTICLES.tall
    if (particles.length !== dots) particles = makeParticles(dots)
    glowCanvas.width = Math.max(1, Math.round(w * GLOW_SCALE))
    glowCanvas.height = Math.max(1, Math.round(h * GLOW_SCALE))
    rimCanvas.width = Math.round(w * dpr)
    rimCanvas.height = Math.round(h * dpr)
    draw(clock)
  }

  function readOffset() {
    if (!zone) return 0
    return container.getBoundingClientRect().top - zone.getBoundingClientRect().top
  }

  function draw(t) {
    const short = Math.min(w, h)

    glow.setTransform(1, 0, 0, 1, 0, 0)
    glow.clearRect(0, 0, glowCanvas.width, glowCanvas.height)
    glow.setTransform(GLOW_SCALE, 0, 0, GLOW_SCALE, 0, 0)
    glow.globalCompositeOperation = 'lighter'
    glow.lineCap = 'round'

    // Faint navy ambience from the lower-left and upper-right corners.
    ;[
      [0.05, 0.9, 0.28],
      [0.95, 0.12, 0.22],
    ].forEach(([x, y, a], i) => {
      const cx = (x + 0.03 * Math.sin(t * 0.12 + i * 2)) * w
      const cy = (y + 0.03 * Math.cos(t * 0.1 + i)) * h
      const r = Math.max(w, h) * 0.6
      const g = glow.createRadialGradient(cx, cy, 0, cx, cy, r)
      g.addColorStop(0, `rgba(${AMBIENT}, ${a})`)
      g.addColorStop(1, `rgba(${AMBIENT}, 0)`)
      glow.fillStyle = g
      glow.fillRect(0, 0, w, h)
    })

    rim.setTransform(1, 0, 0, 1, 0, 0)
    rim.clearRect(0, 0, rimCanvas.width, rimCanvas.height)
    rim.setTransform(dpr, 0, 0, dpr, 0, 0)
    rim.globalCompositeOperation = 'lighter'
    rim.lineCap = 'round'

    // Only the anchors near the screen are drawn (plus neighbours, so the
    // curve's shape at the edges is the same as in the full ribbon).
    const first = Math.max(0, Math.floor((offset / h - START) / STEP) - 2)
    const last = Math.min(count, Math.ceil(((offset + h) / h - START) / STEP) + 3)

    ribbons.forEach((ribbon, index) => {
      const pts = anchors(ribbon, index, count, t, w, h)
        .slice(first, last)
        .map(([x, y]) => [x, y - offset])
      if (pts.length < 2) return
      const width = ribbon.glow * short
      const ox = ribbon.side * w

      // Glow: 6 layered strokes, widest/faintest leaning furthest toward
      // the lit face, narrowing back onto the rim — a soft falloff without
      // any blur filter.
      for (let k = 0; k < 6; k += 1) {
        const f = 1 - k / 6
        glow.save()
        glow.translate(ox * f, 0)
        glow.strokeStyle = `rgb(${k < 3 ? GLOW_OUTER : GLOW_INNER})`
        glow.lineWidth = width * (0.2 + 0.8 * f)
        glow.globalAlpha = (k < 3 ? 0.09 : 0.13) * ribbon.alpha
        curve(glow, pts)
        glow.stroke()
        glow.restore()
      }

      // Rim: a faint halo, then the thin bright edge.
      rim.strokeStyle = shimmer(rim, RIM_HALO, offset, h, t)
      rim.lineWidth = 4
      rim.globalAlpha = 0.22 * ribbon.alpha
      curve(rim, pts)
      rim.stroke()

      rim.strokeStyle = shimmer(rim, RIM_CORE, offset, h, t)
      rim.lineWidth = 1.3
      rim.globalAlpha = 0.85 * ribbon.alpha
      curve(rim, pts)
      rim.stroke()
    })

    // Particles, on the sharp rim canvas so the points stay crisp.
    particles.forEach((p) => {
      // Rise, wrapping from just below the bottom to just above the top;
      // the fade at both ends makes the wrap invisible.
      // They scroll with the page too (the field repeats every screen).
      const y = ((((p.y - p.rise * t - offset / h) % 1.1) + 1.1) % 1.1) - 0.05
      const x = p.x + p.sway * Math.sin(t * p.swayF + p.phase)
      const edge = Math.max(0, Math.min(1, (y + 0.05) / 0.12, (1.05 - y) / 0.12))
      const depth = 0.55 + 0.45 * y // brighter toward the bottom
      const breathe = 0.65 + 0.35 * Math.sin(t * p.twinkle + p.phase)
      const a = p.alpha * edge * depth * breathe
      if (a <= 0.01) return
      const d = p.size * 6
      rim.globalAlpha = a
      rim.drawImage(sprite, x * w - d / 2, y * h - d / 2, d, d)
    })

    glow.globalAlpha = 1
    rim.globalAlpha = 1
  }

  // gsap.ticker hands deltaTime in ms. Only the time spent running is added
  // to the clock, so a pause (off-screen / hidden tab) resumes seamlessly.
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

  // Scrolling redraws at once (not on the 30fps clock), so the ribbons move in
  // lockstep with the content — also under reduced motion, where they still
  // scroll but never drift.
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
  ro.observe(container)
  if (zone) ro.observe(zone)

  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    sync()
  })
  io.observe(container)

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
