import { useCallback, useEffect, useRef, useState } from 'react'
import fskyMark from '../assets/fsky-mark.webp'
import Arrow from './Arrow'
import { headerContact, headerNav, nav, site } from '../data/site'
import { scrollToId, setScrollLocked } from '../motion/lenis'
import './Header.css'

const DESKTOP_NAV = '(min-width: 1024px)'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const buttonRef = useRef(null)
  const menuRef = useRef(null)

  // Solid bar once the page has moved (cheap: only re-renders when crossing).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = useCallback((restoreFocus = true) => {
    setOpen(false)
    if (restoreFocus) buttonRef.current?.focus()
  }, [])

  // Scroll lock + focus handling while the mobile menu is open.
  useEffect(() => {
    setScrollLocked(open)
    if (!open) return undefined

    const menu = menuRef.current
    const focusables = () =>
      [buttonRef.current, ...menu.querySelectorAll('a[href]')].filter(Boolean)
    menu.querySelector('a[href]')?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        close()
        return
      }
      if (event.key !== 'Tab') return
      // Keep Tab inside the menu (button + links).
      const items = focusables()
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      setScrollLocked(false)
    }
  }, [open, close])

  // Leaving mobile layout with the menu open would strand the scroll lock.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_NAV)
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const go = (event, id) => {
    event.preventDefault()
    setOpen(false)
    window.history.replaceState(null, '', `#${id}`)
    // Let the menu start closing / scroll unlock before scrolling.
    requestAnimationFrame(() => scrollToId(id))
  }

  const goTop = (event) => {
    event.preventDefault()
    setOpen(false)
    window.history.replaceState(null, '', window.location.pathname)
    requestAnimationFrame(() => scrollToId('top'))
  }

  return (
    <header className={`header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="header__bar">
        {/* Left: official logo, top-left at all sizes */}
        <a className="header__logo" href="#top" onClick={goTop} aria-label={`${site.name} — top`}>
          <img src={fskyMark} alt="" width={360} height={192} loading="eager" decoding="async" />
        </a>

        {/* Desktop-only, right: curated nav + contact, grouped as one row
            (see data/site.js headerNav / headerContact) */}
        <nav className="header__nav" aria-label="Primary">
          <ul>
            {headerNav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={(e) => go(e, item.id)}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                className="header__contact arrow-host"
                href={`#${headerContact.id}`}
                onClick={(e) => go(e, headerContact.id)}
              >
                {headerContact.label}
                <Arrow />
              </a>
            </li>
          </ul>
        </nav>

        {/* Mobile-only, right: menu toggle */}
        <button
          ref={buttonRef}
          type="button"
          className="header__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span className="header__toggle-label label" aria-hidden="true">
            {open ? 'Close' : 'Menu'}
          </span>
        </button>
      </div>

      <div id="mobile-menu" className="menu" ref={menuRef} inert={!open}>
        <nav aria-label="Mobile">
          <ul>
            {nav.map((item, i) => (
              <li key={item.id} style={{ '--i': i }}>
                <a href={`#${item.id}`} onClick={(e) => go(e, item.id)}>
                  <span className="label muted">0{i + 1}</span>
                  <span className="menu__label">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
