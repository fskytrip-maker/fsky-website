import './DarkZone.css'

/**
 * The dark ground under Hero → About → Services: near-black under the Hero,
 * settling into the page's pure black. The sections inside let it show
 * through.
 */
export default function DarkZone({ children }) {
  return <div className="dark-zone">{children}</div>
}
