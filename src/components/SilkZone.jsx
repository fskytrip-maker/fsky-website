import HeroSilk from './HeroSilk'

/**
 * Runs the Hero's silk folds on behind the sections that follow it: the
 * silk sits in a sticky, screen-sized layer spanning everything inside this
 * zone (Hero → About → Services), so the curves stay in view while the
 * content scrolls over them, then fade out at the zone's end.
 */
export default function SilkZone({ children }) {
  return (
    <div className="silk-zone">
      <div className="silk-zone__backdrop" aria-hidden="true">
        <div className="silk-zone__sticky" data-silk-sticky>
          <HeroSilk />
        </div>
      </div>
      {children}
    </div>
  )
}
