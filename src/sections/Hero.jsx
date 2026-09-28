import Marquee from '../components/Marquee'
import Media from '../components/Media'
import RevealText from '../components/RevealText'
import { hero, site } from '../data/site'
import './Hero.css'

// Temporary structure: typography-led, hairlines, one image slot, one sliding
// line of type. The hero concept is intentionally not final — swap the inside
// of this component without touching the rest of the page.
export default function Hero() {
  return (
    <section id="top" className="hero" aria-label={`${site.name} — ${site.descriptor}`}>
      <div className="container hero__inner">
        <div className="hero__meta label" data-reveal="fade">
          {hero.meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <span className="hairline" data-reveal="line" data-delay="0.1" />

        <div className="hero__body">
          <h1 className="hero__title display">
            <RevealText text={hero.headline} delay={0.15} />
          </h1>

          <Media
            className="hero__media"
            ratio="4 / 5"
            label={hero.imageLabel}
            parallax
            priority
            delay={0.5}
          />
        </div>

        <div className="hero__foot">
          <p className="hero__lead" data-reveal="fade">
            {hero.lead}
          </p>
          <p className="hero__scroll label muted" data-reveal="fade">
            <span className="hero__scroll-line" aria-hidden="true" />
            Scroll
          </p>
        </div>
      </div>

      <Marquee items={hero.ticker} className="hero__ticker" />
    </section>
  )
}
