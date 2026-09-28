import { footer, nav, site } from '../data/site'
import { scrollToId } from '../motion/lenis'
import './Footer.css'

export default function Footer() {
  const go = (event, id) => {
    event.preventDefault()
    window.history.replaceState(null, '', id === 'top' ? window.location.pathname : `#${id}`)
    scrollToId(id)
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <p className="footer__mark display" aria-hidden="true">
            {site.name}
          </p>

          <nav className="footer__nav" aria-label="Footer">
            <ul>
              {nav.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} onClick={(e) => go(e, item.id)} className="label">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer__bottom label muted">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          {/* Legal pages don't exist yet: shown as inactive text, not dead links. */}
          <ul className="footer__legal">
            {footer.legal.map((item) => (
              <li key={item.label}>
                {item.href ? (
                  <a href={item.href}>{item.label}</a>
                ) : (
                  <span aria-disabled="true" title="Coming soon">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
