import fskyLockup from '../assets/fsky-lockup.webp'
import Arrow from '../components/Arrow'
import { hero } from '../data/site'
import { scrollToId } from '../motion/lenis'
import './Hero.css'

// The wordmark is the supplied lockup artwork (src/assets/fsky-lockup.webp,
// cropped tight to its visible glyph — see that file's history) — no text
// headline is set in code, so it can never drift from that image.
// The glowing silk folds behind it come from SilkZone (see App.jsx), which
// carries them on behind About and Services too.
export default function Hero() {
  const goTo = (event, id) => {
    event.preventDefault()
    window.history.replaceState(null, '', `#${id}`)
    scrollToId(id)
  }

  return (
    <section id="top" className="hero" aria-label="FSKY — Design Studio">
      <div className="hero__stage">
        <h1 className="hero__mark" data-reveal="fade">
          <img
            src={fskyLockup}
            alt={hero.logoAlt}
            width={1950}
            height={442}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </h1>
        <p className="hero__tagline" data-hero-tagline>
          {hero.tagline}
        </p>
      </div>

      <div className="hero__stage hero__bottom">
        <div className="hero__info" data-reveal="fade">
          <p className="hero__categories label">{hero.categories.join(' / ')}</p>
          <p className="hero__scroll label muted">
            <span className="hero__scroll-line" aria-hidden="true" />
            {hero.scrollLabel}
          </p>
        </div>

        <div className="hero__ctas" data-reveal="fade">
          <a
            className="hero-cta hero-cta--solid arrow-host"
            href={`#${hero.ctas.inquiry.targetId}`}
            onClick={(e) => goTo(e, hero.ctas.inquiry.targetId)}
          >
            <span className="hero-cta__text">
              <span className="hero-cta__label">{hero.ctas.inquiry.label}</span>
              <span className="hero-cta__sub">{hero.ctas.inquiry.subLabel}</span>
            </span>
            <span className="hero-cta__icon" aria-hidden="true">
              <Arrow className="hero-cta__arrow" />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
