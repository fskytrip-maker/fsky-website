import './Arrow.css'

// The arrow glyph itself: a thin shaft ending in a sharp dart-shaped head,
// echoing the pointed tips of the FSKY mark. Points up-right; sized 1em and
// coloured by currentColor.
function Dart({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.5 19.5 13.4 10.6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M20 4 8.6 6.9l4.8 3.7 3.7 4.8Z" fill="currentColor" />
    </svg>
  )
}

/**
 * Site-wide link arrow. Put `arrow-host` on the link or button that holds it:
 * on hover the arrow flies off to the upper right while a fresh one slides in
 * from the lower left.
 */
export default function Arrow({ className = '' }) {
  return (
    <span className={`arrow ${className}`.trim()} aria-hidden="true">
      <Dart className="arrow__glyph" />
      <Dart className="arrow__glyph arrow__glyph--next" />
    </span>
  )
}
