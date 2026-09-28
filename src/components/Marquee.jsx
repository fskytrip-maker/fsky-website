import './Marquee.css'

/**
 * Oversized type that slides sideways as the page scrolls (scroll-linked, not
 * a continuous animation, so it costs nothing while the user is not scrolling).
 * Purely decorative → hidden from assistive tech. `items` is repeated twice to
 * fill the track.
 */
export default function Marquee({ items, direction = 'forward', className = '' }) {
  const group = (
    <div className="marquee__group">
      {items.map((item) => (
        <span className="marquee__item" key={item}>
          {item}
          <span className="marquee__sep" />
        </span>
      ))}
    </div>
  )
  return (
    <div
      className={`marquee ${className}`.trim()}
      data-marquee={direction}
      aria-hidden="true"
    >
      <div className="marquee__track">
        {group}
        {group}
      </div>
    </div>
  )
}
