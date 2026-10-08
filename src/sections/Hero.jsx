import heroBg from '../assets/hero-bg.webp'
import heroGlassAvif from '../assets/hero-glass.avif'
import heroGlass from '../assets/hero-glass.webp'
import RevealText from '../components/RevealText'
import { hero } from '../data/site'
import './Hero.css'

// Phone layouts being compared: ?hero=a (poster) | b (mark first) |
// c (vertical Japanese). Without it, the current phone layout.
const PHONE_LAYOUT = ['a', 'b', 'c'].find((v) => v === new URLSearchParams(window.location.search).get('hero'))

// A dark stage with a lit, reflective floor (supplied image) fills the
// background. Both images come from the supplied PNGs: the background as
// lossless WebP (lossy formats turn its fine grain into blocky bands in the
// dark), the mark as full-colour AVIF with a lossless WebP fallback. Copy on the left; the glass FSKY mark (a supplied render, used as-is —
// src/assets/hero-glass.webp) fills the right and sits behind the copy on
// small screens; the copy always stays in front of it. On load the copy plays
// in step by step (data-hero-step = delay in seconds, see initMotion).
export default function Hero() {
  return (
    <section id="top" className="hero" data-m={PHONE_LAYOUT} aria-label="FSKY — Design Studio">
      <div className="hero__bg" aria-hidden="true">
        <img data-hero-bg src={heroBg} alt="" width={1672} height={941} loading="eager" decoding="async" />
      </div>

      <div className="hero__visual">
        <picture>
          <source type="image/avif" srcSet={heroGlassAvif} />
          <img
            src={heroGlass}
            alt={hero.visualAlt}
            width={1774}
            height={887}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </div>

      <div className="hero__copy">
        <p className="hero__index label" data-hero-step="0.2">
          {hero.index}
          <span className="hero__index-line" data-reveal="line" data-delay="0.35" aria-hidden="true" />
        </p>

        <RevealText as="h1" className="hero__title display" text={hero.title.join('\n')} delay={0.35} />

        {/* Each character surfaces out of a blur, one after another. */}
        <p className="hero__lead" data-hero-chars data-delay="0.95">
          <span className="sr-only">{hero.lead.join('')}</span>
          {hero.lead.map((line) => (
            <span key={line} className="hero__lead-line" aria-hidden="true">
              {[...line].map((char, i) => (
                <span key={i} className="hero__char">
                  {char}
                </span>
              ))}
            </span>
          ))}
        </p>

        <p className="hero__categories label" data-hero-step="1.75">
          {hero.categories.join(' / ')}
          <br />
          {hero.motto}
        </p>

        <p className="hero__scroll label" data-hero-step="2">
          <span className="hero__mouse" aria-hidden="true" />
          {hero.scrollLabel}
        </p>
      </div>
    </section>
  )
}
