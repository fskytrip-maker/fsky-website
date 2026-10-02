/**
 * Blueprint-style drawings behind Contact: a fine drafting grid, a flange
 * drawn with centre lines and dimensions, and a plate with hidden lines and
 * dimensions — white hairlines on the sky-blue ground. The outlines draw
 * themselves in and out, a radius line sweeps round like a compass, and the
 * grid drifts. Pure SVG + CSS animation (GeoPattern.css); still under reduced
 * motion.
 */
import './GeoPattern.css'

const TAU = Math.PI * 2
const at = (r, deg) => [r * Math.cos((deg * TAU) / 360), r * Math.sin((deg * TAU) / 360)]

/** Arrowheads for dimension lines (one id per drawing, so ids stay unique). */
function Arrows({ id }) {
  return (
    <defs>
      <marker id={`${id}-a`} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 1.5 L10 5 L0 8.5 Z" className="bp__head" />
      </marker>
    </defs>
  )
}

/** Flange: circles, bolt holes, centre lines, Ø / R / angle dimensions. */
function Flange() {
  const holes = [0, 60, 120, 180, 240, 300]
  const [rx, ry] = at(100, -35)
  return (
    <svg className="bp__fig bp__fig--flange" viewBox="-150 -150 300 300">
      <Arrows id="fl" />
      {/* centre lines */}
      <line className="bp__center" x1="-135" y1="0" x2="135" y2="0" />
      <line className="bp__center" x1="0" y1="-135" x2="0" y2="135" />
      <circle className="bp__center" r="80" />

      {/* outline (draws itself) */}
      <g className="bp__draw">
        <circle r="100" pathLength="1" />
        <circle r="56" pathLength="1" />
        <circle r="14" pathLength="1" />
        {holes.map((a) => {
          const [x, y] = at(80, a)
          return <circle key={a} cx={x} cy={y} r="7" pathLength="1" />
        })}
      </g>

      {/* Ø200 above */}
      <line className="bp__ext" x1="-100" y1="-4" x2="-100" y2="-128" />
      <line className="bp__ext" x1="100" y1="-4" x2="100" y2="-128" />
      <line className="bp__dim" x1="-100" y1="-120" x2="100" y2="-120" markerStart="url(#fl-a)" markerEnd="url(#fl-a)" />
      <text className="bp__label" x="0" y="-125" textAnchor="middle">
        Ø200
      </text>

      {/* R100 */}
      <line className="bp__dim" x1="0" y1="0" x2={rx} y2={ry} markerEnd="url(#fl-a)" />
      <text className="bp__label" x={rx * 0.55 + 4} y={ry * 0.55 - 6}>
        R100
      </text>

      {/* 60° between two bolt holes */}
      <path className="bp__dim" d={`M ${at(118, 0).join(' ')} A 118 118 0 0 1 ${at(118, 60).join(' ')}`} markerStart="url(#fl-a)" markerEnd="url(#fl-a)" />
      <text className="bp__label" x={at(128, 30)[0]} y={at(128, 30)[1]}>
        60°
      </text>

      {/* compass sweep */}
      <g className="bp__sweep">
        <line x1="0" y1="0" x2="100" y2="0" />
        <circle cx="100" cy="0" r="2.5" className="bp__dot" />
      </g>
      <circle r="2" className="bp__dot" />
    </svg>
  )
}

/** Plate: outline with a chamfer, a hole and a hidden slot, with dimensions. */
function Plate() {
  return (
    <svg className="bp__fig bp__fig--plate" viewBox="0 0 320 220">
      <Arrows id="pl" />
      {/* centre lines of the hole */}
      <line className="bp__center" x1="190" y1="62" x2="190" y2="138" />
      <line className="bp__center" x1="152" y1="100" x2="228" y2="100" />

      {/* outline (draws itself) */}
      <g className="bp__draw bp__draw--late">
        <path d="M40 50 H250 L270 70 V150 H40 Z" pathLength="1" />
        <circle cx="190" cy="100" r="22" pathLength="1" />
      </g>
      {/* hidden slot */}
      <rect className="bp__hidden" x="70" y="80" width="70" height="40" rx="20" />

      {/* 230 along the bottom */}
      <line className="bp__ext" x1="40" y1="154" x2="40" y2="184" />
      <line className="bp__ext" x1="270" y1="154" x2="270" y2="184" />
      <line className="bp__dim" x1="40" y1="176" x2="270" y2="176" markerStart="url(#pl-a)" markerEnd="url(#pl-a)" />
      <text className="bp__label" x="155" y="171" textAnchor="middle">
        230
      </text>

      {/* 100 on the left */}
      <line className="bp__ext" x1="36" y1="50" x2="10" y2="50" />
      <line className="bp__ext" x1="36" y1="150" x2="10" y2="150" />
      <line className="bp__dim" x1="18" y1="50" x2="18" y2="150" markerStart="url(#pl-a)" markerEnd="url(#pl-a)" />
      <text className="bp__label" x="14" y="100" textAnchor="middle" transform="rotate(-90 14 100)">
        100
      </text>

      {/* leader to the hole */}
      <polyline className="bp__dim" points="290,28 240,28 206,84" markerEnd="url(#pl-a)" />
      <text className="bp__label" x="244" y="22">
        Ø44 THRU
      </text>
      <text className="bp__label" x="276" y="66">
        C20
      </text>
    </svg>
  )
}

export default function GeoPattern() {
  return (
    <div className="bp" aria-hidden="true">
      <div className="bp__grid" />
      <Flange />
      <Plate />
      <svg className="bp__fig bp__fig--title" viewBox="0 0 200 48">
        <rect x="0.5" y="0.5" width="199" height="47" />
        <line x1="0.5" y1="24" x2="199.5" y2="24" />
        <line x1="120" y1="0.5" x2="120" y2="47.5" />
        <text className="bp__label" x="8" y="16">
          FSKY DESIGN STUDIO
        </text>
        <text className="bp__label" x="128" y="16">
          SCALE 1:20
        </text>
        <text className="bp__label" x="8" y="40">
          CONTACT
        </text>
        <text className="bp__label" x="128" y="40">
          DWG 03
        </text>
      </svg>
    </div>
  )
}
