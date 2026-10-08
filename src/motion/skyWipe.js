// Services → Contact transition (SkyWipe), drawn with Canvas 2D.
//
// The stage pins over the last screen of Services. As you scroll, light
// blooms from the middle of the dark, streams of glowing particles flow
// across it (lower left → upper right) and the dark clears into the sky
// gradient of the Contact ground. A centred chapter card for Contact — its
// lead surfacing character by character, then the English line under it —
// comes and goes, then Contact's own ground and content take over.
//
// Nothing animates on its own: a frame is drawn only when the scroll position
// changes while the transition is near the screen.

// The scene is soft light and small dots, redrawn on every scroll frame:
// plain resolution keeps that cheap with no visible loss.
const MAX_DPR = 1
// Progress ranges (0 → 1 while the stage is pinned).
const COVERED = 0.47 // the sky has filled the screen
// The chapter card: its characters surface one after another over CHARS,
// the English line follows over EN, then the card fades out over OUT.
const CHARS = [COVERED - 0.13, COVERED + 0.04]
const CHAR_SPAN = 0.045 // how long each character takes
const EN = [COVERED + 0.03, COVERED + 0.09]
const OUT = [0.635, 0.725]
// Contact's own ground (as --wipe-in on the next element) — only once its
// screen-sized ground layer has reached the top of the screen — and its
// content.
const FILL = [0.7, 0.8]
const CONTENT = [0.75, 0.925]
// How steeply the particle streams climb, as height per unit of width: the
// angle they have on a 16:10-ish screen, kept on narrower ones.
const RISE = 0.6

const clamp = (x) => Math.min(1, Math.max(0, x))
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const lerp = (a, b, t) => a + (b - a) * t
const TAU = Math.PI * 2

function rng(seed) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Same gradient as the sky ground (SkyZone.css: linear-gradient(160deg, …)),
// so the scene hands over to it seamlessly.
const SKY = [
  [0, '#b4ecff'],
  [0.42, '#72d3f9'],
  [0.78, '#4cb2f3'],
  [1, '#3d93e6'],
]
function skyGradient(ctx, w, h) {
  const a = (160 * Math.PI) / 180
  const dx = Math.sin(a)
  const dy = -Math.cos(a)
  const half = (Math.abs(w * dx) + Math.abs(h * dy)) / 2
  const g = ctx.createLinearGradient(w / 2 - dx * half, h / 2 - dy * half, w / 2 + dx * half, h / 2 + dy * half)
  for (const [o, c] of SKY) g.addColorStop(o, c)
  return g
}

// Stamps drawn once and reused for every dot / orb (far cheaper than a path
// or gradient per dot per frame).
function makeSprite(stops) {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  for (const [o, col] of stops) grd.addColorStop(o, col)
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  return c
}
// A small hard-edged white dot (its edge anti-aliased by the gradient)…
const dotSprite = () =>
  makeSprite([
    [0, '#fff'],
    [0.8, '#fff'],
    [1, 'rgba(255, 255, 255, 0)'],
  ])
// …and a large soft orb.
const orbSprite = () =>
  makeSprite([
    [0, 'rgba(255, 255, 255, 1)'],
    [0.35, 'rgba(235, 250, 255, 0.55)'],
    [1, 'rgba(200, 240, 255, 0)'],
  ])

/**
 * Streams, each a wavy band of dots with a few large soft orbs riding along.
 * `mid` is the stream's height across the middle of the screen and `drop`
 * how far it climbs from left to right (fractions of the height on a wide
 * screen; see RISE).
 */
function makeStreams() {
  const r = rng(23)
  return Array.from({ length: 3 }, (_, i) => {
    const y0 = 0.62 + i * 0.26 + r() * 0.06
    const y1 = y0 - 0.75 - r() * 0.25
    return {
      mid: (y0 + y1) / 2,
      drop: y0 - y1,
      amp: 0.05 + r() * 0.04,
      freq: 1.5 + r() * 1.5,
      phase: r() * TAU,
      speed: 0.55 + r() * 0.35,
      start: 0.02 + i * 0.05,
      dots: Array.from({ length: 220 }, () => ({
        u: r(),
        off: (r() + r() + r() - 1.5) * 0.014,
        size: 0.6 + r() * r() * 2.6,
        alpha: 0.35 + r() * 0.65,
      })),
      orbs: Array.from({ length: 4 }, () => ({
        u: r(),
        off: (r() - 0.5) * 0.03,
        size: 0.025 + r() * 0.035,
      })),
    }
  })
}

function drawScene(ctx, p, w, h, streams, sprites) {
  const short = Math.min(w, h)
  const R = Math.hypot(w, h) / 2
  const cx = w / 2
  const cy = h / 2

  // The sky spreads out from the middle behind the bloom, very soft-edged,
  // so the dark clears into blue instead of greying over.
  const sky = smooth(0.08, COVERED, p)
  if (sky > 0) {
    const rad = lerp(R * 0.2, R * 3.4, sky)
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = skyGradient(ctx, w, h)
    ctx.fillRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'destination-in'
    const mask = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad)
    mask.addColorStop(0, '#000')
    mask.addColorStop(0.3, '#000')
    mask.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = mask
    ctx.fillRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'source-over'
  }

  // Light blooming from the middle, ahead of the sky.
  const bloom = smooth(0, 0.22, p) * (1 - 0.75 * smooth(0.4, 0.6, p))
  if (bloom > 0) {
    const rad = R * lerp(0.15, 1.2, smooth(0, 0.4, p))
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad)
    g.addColorStop(0, `rgba(225, 248, 255, ${0.85 * bloom})`)
    g.addColorStop(0.45, `rgba(150, 220, 255, ${0.35 * bloom})`)
    g.addColorStop(1, 'rgba(110, 200, 255, 0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
  }

  // The particle streams.
  const out = 1 - smooth(0.6, 0.75, p)
  ctx.globalCompositeOperation = 'lighter'
  for (const s of streams) {
    const shown = smooth(s.start, s.start + 0.16, p) * out
    if (shown <= 0) continue
    // The climb and the waves are measured against the width (at most the
    // height), so the streams keep the same gentle shape on a tall phone as
    // on a wide screen.
    const rise = Math.min(h, w * RISE)
    const at = (u, off) => {
      const x = lerp(-0.15, 1.15, u)
      const wave = Math.sin(u * s.freq * TAU + s.phase + p * 3) * s.amp * rise
      const y = s.mid * h + (0.5 - u) * s.drop * rise + wave + off * h
      return [x * w, y]
    }
    const flow = p * s.speed
    for (const d of s.dots) {
      const u = (d.u + flow) % 1
      const [x, y] = at(u, d.off)
      ctx.globalAlpha = d.alpha * shown * (0.6 + 0.4 * Math.sin(u * 40 + d.u * 9) ** 2)
      const r = d.size * 1.25 // the sprite's solid core is 80% of its radius
      ctx.drawImage(sprites.dot, x - r, y - r, r * 2, r * 2)
    }
    ctx.globalAlpha = 1
    for (const o of s.orbs) {
      const u = (o.u + flow * 1.2) % 1
      const [x, y] = at(u, o.off)
      const r = o.size * short
      ctx.globalAlpha = 0.7 * shown
      ctx.drawImage(sprites.orb, x - r, y - r, r * 2, r * 2)
    }
  }
  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'source-over'
}

export function mountSkyWipe(wrapper) {
  const canvas = wrapper.querySelector('canvas')
  if (!canvas) return () => {}
  const ctx = canvas.getContext('2d')
  const chapter = wrapper.querySelector('.sky-wipe__chapter')
  const chars = [...wrapper.querySelectorAll('.sky-wipe__char')]
  const en = wrapper.querySelector('.sky-wipe__chapter-en')
  const next = wrapper.nextElementSibling
  const content = next?.querySelector('.section > .container')
  const streams = makeStreams()
  const sprites = { dot: dotSprite(), orb: orbSprite() }
  let w = 0
  let h = 0
  let dpr = 1
  let progress = -1
  let frame = 0
  let near = false

  // 0 as the stage pins (Services' last screen fully in view), 1 as it lets go.
  const readProgress = () => {
    const r = wrapper.getBoundingClientRect()
    return clamp(-r.top / Math.max(1, r.height - window.innerHeight))
  }

  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    const p = progress
    if (chapter) {
      chapter.style.opacity = String(1 - smooth(...OUT, p))
      chapter.style.transform = `translate3d(0, ${(1 - smooth(CHARS[0], OUT[1], p)) * 40 - 20}px, 0)`
      const step = (CHARS[1] - CHARS[0] - CHAR_SPAN) / Math.max(1, chars.length - 1)
      chars.forEach((el, i) => {
        const from = CHARS[0] + i * step
        el.style.setProperty('--t', smooth(from, from + CHAR_SPAN, p).toFixed(3))
      })
      if (en) en.style.opacity = String(smooth(...EN, p))
    }
    if (p > 0 && p < 1) drawScene(ctx, p, w, h, streams, sprites)
  }

  // Contact's content fades in once the chapter card has gone, and its own
  // ground (--wipe-in) takes over from the canvas. Only while the wipe is
  // actually shown (it's display:none under reduced motion).
  const reveal = () => {
    const shown = wrapper.offsetHeight > 0
    if (content) content.style.opacity = shown ? String(smooth(...CONTENT, progress)) : ''
    if (shown) next?.style.setProperty('--wipe-in', String(smooth(...FILL, progress)))
    else next?.style.removeProperty('--wipe-in')
  }

  const update = () => {
    frame = 0
    const p = readProgress()
    if (p === progress) return
    progress = p
    draw()
    reveal()
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
