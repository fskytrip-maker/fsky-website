/**
 * The sky-blue ground under everything after the silk transition (Contact
 * and the footer): one gradient with slowly drifting light, held
 * fixed to the screen (sticky) while those sections scroll over it, so it
 * runs on unbroken from section to section. Styles in SkyZone.css; after
 * the transition it fades in as the white-out completes (--wipe-in, set by
 * motion/silkWipe.js).
 */
import './SkyZone.css'

export default function SkyZone({ children }) {
  return (
    <div className="sky-zone" data-theme="sky">
      <div className="sky-zone__bg" aria-hidden="true">
        <div className="sky-zone__view">
          <span className="sky-zone__glow sky-zone__glow--a" />
          <span className="sky-zone__glow sky-zone__glow--b" />
          <span className="sky-zone__glow sky-zone__glow--c" />
        </div>
      </div>
      {children}
    </div>
  )
}
