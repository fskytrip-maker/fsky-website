/**
 * The sky-blue ground under everything after the transition (Contact
 * and the footer): one gradient with slowly drifting light, held
 * fixed to the screen (sticky) while those sections scroll over it, so it
 * runs on unbroken from section to section. Styles in SkyZone.css; at the
 * end of the transition it fades in over the transition's own sky (--wipe-in,
 * set by motion/skyWipe.js).
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
