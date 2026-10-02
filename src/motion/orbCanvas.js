// Neon ring badge for the Services rows (ServiceOrb), drawn with Canvas 2D.
//
// At rest: a small, still neon ring — bright cyan line, blue-violet glow
// inside, black centre. While the row is hovered the ring grows and fills
// into a glassy sphere: a deep-blue body with aurora light flowing inside it (a drifting blue cloud,
// a violet glow and an undulating cyan ribbon), shaded darker underneath and
// lit along its rim. On leave it settles back into the still ring.
//
// Nothing runs at rest — frames are only drawn while hovering or easing back,
// so idle rings cost nothing. Reduced motion: hover shows one still frame.

const MAX_DPR = 2
// The canvas is larger than the badge so the glow can spill past its edge.
const BLEED = 1.7
// Ring size at rest, relative to its hovered (full) size.
const REST_SCALE = 0.6

const CYAN = '90, 215, 255'
const BLUE = '40, 110, 255'
const VIOLET = '95, 70, 255'

const smooth = (t) => t * t * (3 - 2 * t)
const TAU = Math.PI * 2

function blob(ctx, x, y, r, rgb, alpha) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, `rgba(${rgb}, ${alpha})`)
  g.addColorStop(0.5, `rgba(${rgb}, ${alpha * 0.45})`)
  g.addColorStop(1, `rgba(${rgb}, 0)`)
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, r, 0, TAU)
  ctx.fill()
}

/** Glassy aurora sphere of radius `r` at (c, c); `a` = opacity 0–1. */
function drawSphere(ctx, c, r, t, a) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(c, c, r, 0, TAU)
  ctx.clip()

  // Body: deep blue, a little lighter toward the edge.
  ctx.globalCompositeOperation = 'source-over'
  const body = ctx.createRadialGradient(c, c - r * 0.1, 0, c, c, r)
  body.addColorStop(0, `rgba(8, 24, 92, ${a})`)
  body.addColorStop(0.75, `rgba(18, 54, 170, ${a})`)
  body.addColorStop(1, `rgba(60, 140, 255, ${a})`)
  ctx.fillStyle = body
  ctx.fillRect(c - r, c - r, r * 2, r * 2)

  ctx.globalCompositeOperation = 'lighter'
  // Drifting blue cloud (upper left) and violet glow (right).
  blob(ctx, c - r * 0.25 + Math.cos(t * 0.5) * r * 0.2, c - r * 0.3 + Math.sin(t * 0.7) * r * 0.12, r * 0.75, '55, 140, 255', 0.55 * a)
  blob(ctx, c + r * 0.5 + Math.sin(t * 0.6) * r * 0.12, c + Math.cos(t * 0.45) * r * 0.15, r * 0.55, '140, 70, 255', 0.6 * a)

  // Shadow under the ribbon, so the lower half reads as the dark side.
  ctx.globalCompositeOperation = 'source-over'
  const shade = ctx.createRadialGradient(c, c + r * 0.85, 0, c, c + r * 0.85, r * 0.85)
  shade.addColorStop(0, `rgba(2, 6, 28, ${0.75 * a})`)
  shade.addColorStop(1, 'rgba(2, 6, 28, 0)')
  ctx.fillStyle = shade
  ctx.fillRect(c - r, c - r, r * 2, r * 2)
  // …and a darker pocket in the upper right, between the clouds.
  const pocket = ctx.createRadialGradient(c + r * 0.35, c - r * 0.55, 0, c + r * 0.35, c - r * 0.55, r * 0.6)
  pocket.addColorStop(0, `rgba(4, 10, 45, ${0.6 * a})`)
  pocket.addColorStop(1, 'rgba(4, 10, 45, 0)')
  ctx.fillStyle = pocket
  ctx.fillRect(c - r, c - r, r * 2, r * 2)

  // Undulating cyan ribbon, built from soft layered strokes (wide + faint
  // → narrow + bright) so it reads as a glowing band, not a line.
  ctx.globalCompositeOperation = 'lighter'
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  const tilt = -0.32
  const ct = Math.cos(tilt)
  const st = Math.sin(tilt)
  const path = () => {
    ctx.beginPath()
    for (let i = 0; i <= 24; i++) {
      const u = i / 24 // 0 → 1 across the sphere
      const x = (u * 2 - 1) * r * 0.85
      const y = r * 0.12 + Math.sin(u * 4.2 + t * 0.9) * r * 0.17 + Math.sin(u * 2.1 - t * 0.6) * r * 0.06
      const px = c + x * ct - y * st
      const py = c + x * st + y * ct
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
  }
  const layers = [
    [0.72, 0.07],
    [0.52, 0.1],
    [0.36, 0.13],
    [0.22, 0.13],
  ]
  for (const [w, alpha] of layers) {
    ctx.strokeStyle = `rgba(100, 240, 255, ${alpha * a})`
    ctx.lineWidth = r * w
    path()
    ctx.stroke()
  }
  ctx.restore()

  // Glass rim: light gathering along the inside edge, plus a crisp outline.
  ctx.globalCompositeOperation = 'lighter'
  const rim = ctx.createRadialGradient(c, c, r * 0.78, c, c, r)
  rim.addColorStop(0, 'rgba(110, 180, 255, 0)')
  rim.addColorStop(1, `rgba(110, 180, 255, ${0.5 * a})`)
  ctx.fillStyle = rim
  ctx.beginPath()
  ctx.arc(c, c, r, 0, TAU)
  ctx.fill()
  ctx.strokeStyle = `rgba(150, 210, 255, ${0.55 * a})`
  ctx.lineWidth = Math.max(1, r * 0.03)
  ctx.beginPath()
  ctx.arc(c, c, r, 0, TAU)
  ctx.stroke()
}

export function mountOrb(canvas, row) {
  const ctx = canvas.getContext('2d')
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')

  let size = 0
  let hover = 0 // eased 0 (still ring) → 1 (aurora sphere)
  let target = 0
  let time = 0
  let last = 0
  let raf = 0

  const draw = () => {
    if (!size) return
    const c = size / 2
    const R = size / BLEED / 2 // badge radius in device px
    const h = smooth(hover)
    // Small at rest; grows to full size as the sphere fills in.
    const ring = R * 0.9 * (REST_SCALE + (1 - REST_SCALE) * h)
    ctx.clearRect(0, 0, size, size)
    ctx.globalCompositeOperation = 'lighter'

    // Soft halo around the ring (stronger while active).
    // (Starts at the centre with a transparent stop so the middle stays black.)
    // Its reach follows the ring's size, so the small resting ring isn't
    // sitting in a big haze.
    const haloR = Math.min(c, ring * 1.85)
    const halo = ctx.createRadialGradient(c, c, 0, c, c, haloR)
    halo.addColorStop(0, `rgba(${BLUE}, 0)`)
    halo.addColorStop((ring * 0.8) / haloR, `rgba(${BLUE}, 0)`)
    halo.addColorStop(ring / haloR, `rgba(${BLUE}, ${0.28 + 0.22 * h})`)
    halo.addColorStop(1, `rgba(${BLUE}, 0)`)
    ctx.fillStyle = halo
    ctx.fillRect(0, 0, size, size)

    // Blue-violet glow lining the inside of the ring (fades as the sphere fills).
    if (h < 1) {
      const inner = ctx.createRadialGradient(c, c, ring * 0.7, c, c, ring)
      inner.addColorStop(0, `rgba(${VIOLET}, 0)`)
      inner.addColorStop(0.7, `rgba(${VIOLET}, ${0.22 * (1 - h)})`)
      inner.addColorStop(1, `rgba(${BLUE}, ${0.5 * (1 - h)})`)
      ctx.fillStyle = inner
      ctx.beginPath()
      ctx.arc(c, c, ring, 0, TAU)
      ctx.fill()
    }

    if (h > 0) drawSphere(ctx, c, ring, time, h)

    // The neon line; it dissolves into the sphere's glass rim on hover.
    if (h < 1) {
      ctx.globalCompositeOperation = 'lighter'
      ctx.shadowColor = `rgba(${CYAN}, 1)`
      ctx.shadowBlur = ring * 0.45
      ctx.strokeStyle = `rgba(${CYAN}, ${0.95 * (1 - h)})`
      ctx.lineWidth = ring * 0.12
      ctx.beginPath()
      ctx.arc(c, c, ring, 0, TAU)
      ctx.stroke()
      ctx.shadowBlur = 0
    }
    ctx.globalCompositeOperation = 'source-over'
  }

  const frame = (now) => {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0
    last = now
    time += dt
    hover += (target - hover) * Math.min(1, dt * 4.5)
    if (target === 0 && hover < 0.003) {
      hover = 0
      raf = 0
      last = 0
      draw()
      return
    }
    draw()
    raf = requestAnimationFrame(frame)
  }

  const setTarget = (value) => {
    target = value
    if (reduce.matches) {
      hover = value
      draw()
      return
    }
    if (!raf) {
      last = 0
      raf = requestAnimationFrame(frame)
    }
  }

  const enter = () => setTarget(1)
  const leave = () => setTarget(0)
  row?.addEventListener('pointerenter', enter)
  row?.addEventListener('pointerleave', leave)

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    const next = Math.round(canvas.clientWidth * dpr)
    if (!next || next === size) return
    size = next
    canvas.width = canvas.height = size
    draw()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  return () => {
    ro.disconnect()
    cancelAnimationFrame(raf)
    row?.removeEventListener('pointerenter', enter)
    row?.removeEventListener('pointerleave', leave)
  }
}
