// Services → Contact transition (SilkWipe), built from the Hero's silk curves.
//
// As you scroll, glowing ribbons draw themselves in one after another across
// the dark screen — some sweeping left → right, some bottom → top — so they
// cross and weave. Then they swell: each widens and its light warms from the
// silk's ice blue into the colour of the next section (Contact), until
// together they cover the screen and that section simply continues.
//
// Canvas 2D only, same look as HeroSilk (wide soft blue glow + thin bright
// rim). Nothing animates on its own: a frame is drawn only when the scroll
// position changes while the transition is near the screen.

const MAX_DPR = 2
// Colour the bands swell into = the next section's background (its --bg),
// read at mount; paper white if it can't be read.
const PAPER_FALLBACK = [244, 242, 238]
// Progress range over which the last gaps fill in. The next section's own
// background fades in over the same range (as --wipe-in, 0 → 1), so it can
// carry its own gradient / motion on from the flat colour.
const FILL = [0.74, 0.86]

function parseColor(value) {
  const v = value.trim()
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1]
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
  }
  const rgb = v.match(/rgba?\(([^)]+)\)/)
  if (rgb) return rgb[1].split(/[\s,/]+/).slice(0, 3).map(Number)
  return null
}
const RIM = [210, 238, 255]
const GLOW = [45, 125, 255]
const GLOW_HOT = [150, 215, 255] // the glow's colour once the bands are white
const ACCENT = '114, 211, 249'
// Width a band swells to (fraction of the shorter side): wide enough that
// together they cover the screen before the next section's text fades in.
const BAND = 1.1
// Glow strokes: [width as a fraction of the shorter side, alpha].
const GLOW_LAYERS = [
  [0.11, 0.035],
  [0.065, 0.05],
  [0.035, 0.07],
  [0.016, 0.12],
  [0.007, 0.2],
]

function rng(seed) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Ribbons in normalised screen coordinates: cubic Béziers whose ends sit just
 * off-screen. Even ones cross horizontally, odd ones vertically (with a
 * diagonal lean), so they keep intersecting. `start` staggers when each one
 * draws in.
 */
function makeRibbons(count) {
  const r = rng(5)
  return Array.from({ length: count }, (_, i) => {
    const across = i % 2 === 0
    const a = 0.1 + r() * 0.8
    const b = 0.1 + r() * 0.8
    const bend = () => (r() - 0.5) * 0.9
    const p = across
      ? [[-0.12, a], [0.33, a + bend()], [0.66, b + bend()], [1.12, b]]
      : [[a, 1.12], [a + bend(), 0.66], [b + bend(), 0.33], [b, -0.12]]
    return {
      p,
      start: (i / count) * 0.42 + r() * 0.06,
      weight: 0.6 + r() * 0.4,
      lean: (r() - 0.5) * 0.02,
    }
  })
}

// First part (0..t) of a cubic Bézier — de Casteljau.
function split(pts, t) {
  const lerp = (a, b) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  const [p0, p1, p2, p3] = pts
  const a = lerp(p0, p1)
  const b = lerp(p1, p2)
  const c = lerp(p2, p3)
  const d = lerp(a, b)
  const e = lerp(b, c)
  return [p0, a, d, lerp(d, e)]
}

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

function stroke(ctx, pts) {
  ctx.beginPath()
  ctx.moveTo(pts[0][0], pts[0][1])
  ctx.bezierCurveTo(pts[1][0], pts[1][1], pts[2][0], pts[2][1], pts[3][0], pts[3][1])
  ctx.stroke()
}

export function mountSilkWipe(wrapper) {
  const canvas = wrapper.querySelector('canvas')
  if (!canvas) return () => {}
  const ctx = canvas.getContext('2d')
  const next = wrapper.nextElementSibling
  const PAPER = (next && parseColor(getComputedStyle(next).getPropertyValue('--bg'))) || PAPER_FALLBACK
  let w = 0
  let h = 0
  let dpr = 1
  let ribbons = []
  let progress = -1
  let frame = 0
  let near = false

  const readProgress = () => {
    const r = wrapper.getBoundingClientRect()
    const vh = window.innerHeight
    // Starts as soon as the wrapper (which overlaps the end of Services)
    // enters from the bottom; ends (all white) as the next section — which overlaps the
    // wrapper's last screen, with a see-through top — nears the top of the
    // screen. So its heading rises over the white-out as it happens.
    return Math.min(1, Math.max(0, (vh - r.top) / (r.height - vh * 0.1)))
  }

  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    const p = progress
    if (p >= 1) {
      ctx.fillStyle = `rgb(${PAPER})`
      ctx.fillRect(0, 0, w, h)
      return
    }
    if (p <= 0) return

    const short = Math.min(w, h)
    const swell = smooth(0.45, 0.85, p) // 0: thin silk → 1: wide white bands
    const warm = smooth(0.4, 0.72, p) // ice-blue rim → paper white
    const core = RIM.map((c, i) => Math.round(c + (PAPER[i] - c) * warm))
    const glowRgb = GLOW.map((c, i) => Math.round(c + (GLOW_HOT[i] - c) * warm))
    const fill = smooth(FILL[0], FILL[1], p) // the last dark gaps fill in
    // The sky-blue band edges and the bloom belong to the bright peak; they
    // fade before the white takes over, so no blue outlines are left drawn
    // on the white and the last dark gaps don't turn bluish grey.
    const edgeFade = 1 - smooth(0.58, 0.72, p)
    ctx.lineCap = 'round'

    for (const ribbon of ribbons) {
      const drawn = smooth(ribbon.start, ribbon.start + 0.22, p)
      if (drawn <= 0) continue
      // The ribbons sway a little as you scroll, like the Hero's silk.
      const pts = ribbon.p.map(([x, y], k) => [
        (x + Math.sin(p * 5 + k * 1.7 + ribbon.start * 9) * 0.03 + ribbon.lean * k) * w,
        (y + Math.cos(p * 4 + k * 2.3 + ribbon.start * 7) * 0.03) * h,
      ])
      const seg = split(pts, drawn)

      // Glow: soft light from layered strokes, wide + faint → narrow +
      // brighter, so it falls off smoothly like the Hero's silk. As the
      // bands swell it widens and turns from blue to a pale, luminous cyan.
      ctx.globalCompositeOperation = 'lighter'
      const strength = ribbon.weight * (1 - 0.35 * warm)
      for (const [width, alpha] of GLOW_LAYERS) {
        ctx.strokeStyle = `rgba(${glowRgb}, ${alpha * strength})`
        ctx.lineWidth = short * width * (1 + 2.2 * swell)
        stroke(ctx, seg)
      }

      // Core: the thin bright rim, swelling into a solid white band edged
      // with a band of sky-blue light.
      ctx.globalCompositeOperation = 'source-over'
      if (swell > 0) {
        ctx.strokeStyle = `rgba(${ACCENT}, ${0.75 * swell * edgeFade})`
        ctx.lineWidth = 1.4 + swell * swell * short * BAND * (0.8 + 0.2 * ribbon.weight) + short * 0.03 * swell
        stroke(ctx, seg)
      }
      const thin = 0.85 * ribbon.weight
      ctx.strokeStyle = `rgba(${core}, ${thin + (1 - thin) * smooth(0, 0.25, swell)})`
      ctx.lineWidth = 1.4 + swell * swell * short * BAND * (0.8 + 0.2 * ribbon.weight)
      stroke(ctx, seg)
    }

    // A soft bloom over everything as the light peaks.
    const bloom = smooth(0.42, 0.58, p) * edgeFade
    if (bloom > 0) {
      ctx.globalCompositeOperation = 'lighter'
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7)
      g.addColorStop(0, `rgba(190, 230, 255, ${0.25 * bloom})`)
      g.addColorStop(1, `rgba(${ACCENT}, 0)`)
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
    }

    // Last stretch: the remaining dark gaps between the bands fill in.
    if (fill > 0) {
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = `rgba(${PAPER}, ${fill})`
      ctx.fillRect(0, 0, w, h)
    }
  }

  const update = () => {
    frame = 0
    const next = readProgress()
    if (next === progress) return
    progress = next
    draw()
    reveal()
  }

  // The next section's content fades in over the last of the white-out, and
  // its background (--wipe-in) with the last of the fill. Only while the wipe
  // is actually shown (it's display:none under reduced motion).
  const content = next?.querySelector('.section > .container')
  const reveal = () => {
    const shown = wrapper.offsetHeight > 0
    if (content) content.style.opacity = shown ? String(smooth(0.72, 0.86, progress)) : ''
    if (next) {
      if (shown) next.style.setProperty('--wipe-in', String(smooth(FILL[0], FILL[1], progress)))
      else next.style.removeProperty('--wipe-in')
    }
  }
  const onScroll = () => {
    if (near && !frame) frame = requestAnimationFrame(update)
  }

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    w = Math.max(1, Math.round(rect.width))
    h = Math.max(1, Math.round(rect.height))
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    ribbons = makeRibbons(w >= 768 ? 14 : 9)
    progress = readProgress()
    draw()
    reveal()
  }

  const io = new IntersectionObserver(
    ([entry]) => {
      near = entry.isIntersecting
      if (near) onScroll()
    },
    { rootMargin: '50% 0px' },
  )
  io.observe(wrapper)
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  window.addEventListener('scroll', onScroll, { passive: true })

  return () => {
    if (content) content.style.opacity = ''
    next?.style.removeProperty('--wipe-in')
    io.disconnect()
    ro.disconnect()
    cancelAnimationFrame(frame)
    window.removeEventListener('scroll', onScroll)
  }
}
