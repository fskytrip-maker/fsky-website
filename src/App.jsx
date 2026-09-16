import { useEffect, useState } from 'react'
import wordmark from './assets/fsky-wordmark.png'
import markMetal from './assets/fsky-mark-metal.png'
import osmoPhoto from './assets/osmo-pocket-3.webp'
import './App.css'

const services = [
  {
    title: 'オーダーメイド旅行プラン',
    description:
      'ご希望や予算、旅のテーマに合わせて、世界にひとつだけの旅程をプランニングします。',
  },
  {
    title: 'Osmo Pocket 3 レンタル',
    description:
      '旅の景色や思い出を高画質な映像で残せる、コンパクトジンバルカメラをレンタルできます。',
  },
  {
    title: '今後のサービス拡大',
    description:
      '事業拡大に伴い、新しいサービスを順次追加していく予定です。お楽しみに。',
  },
]

const slides = [
  {
    id: 'travel',
    headline: '流れる空に乗って、あなただけの旅へ。',
    subtitle:
      'オーダーメイドの旅行プランニングと Osmo Pocket 3 のレンタルで、自由な旅をお手伝いします。',
    ctaLabel: 'お問い合わせ',
    ctaHref: '#contact',
  },
  {
    id: 'osmo',
    headline: 'Osmo Pocket 3、レンタル開始。',
    subtitle:
      '旅の景色や思い出を高画質な映像で。コンパクトジンバルカメラを手軽にレンタルできます。',
    ctaLabel: 'レンタルについて問い合わせる',
    ctaHref: '#contact',
    bgImage: osmoPhoto,
  },
  {
    id: 'brand',
    headline: 'FSKY',
    tagline: 'FLOWING SKY',
    subtitle: '流れる空に乗るように、自由でとらわれない旅を。',
    ctaLabel: 'FSKYについて見る',
    ctaHref: '#about',
    image: markMetal,
    imageRight: true,
    dark: true,
    bgGradient:
      'radial-gradient(ellipse 70% 60% at 30% 20%, rgba(255, 255, 255, 0.08), transparent 60%), linear-gradient(135deg, #060607 0%, #1b1c20 45%, #070708 100%)',
  },
]

function App() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [paused])

  const goTo = (i) => {
    setIndex((i + slides.length) % slides.length)
  }

  return (
    <>
      <header id="nav">
        <img src={wordmark} className="logo" alt="FSKY" />
        <nav>
          <a href="#about">FSKYについて</a>
          <a href="#services">サービス</a>
          <a href="#contact">お問い合わせ</a>
        </nav>
      </header>

      <section
        id="hero"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.map((slide, i) => (
          <div
            className={slide.dark ? 'slide slide--dark' : 'slide'}
            key={slide.id}
            aria-hidden={i !== index}
            style={{
              opacity: i === index ? 1 : 0,
              backgroundImage: slide.bgImage
                ? `linear-gradient(180deg, rgba(8, 20, 40, 0.35) 0%, rgba(8, 20, 40, 0.75) 100%), url(${slide.bgImage})`
                : slide.bgGradient || undefined,
              backgroundSize: slide.bgImage ? 'cover' : undefined,
              backgroundPosition: slide.bgImage ? 'center' : undefined,
            }}
          >
            <div className="hero-content">
              {slide.image && !slide.imageRight && (
                <img
                  src={slide.image}
                  className={
                    slide.imageLarge ? 'slide-image slide-image--large' : 'slide-image'
                  }
                  alt=""
                />
              )}
              <h1>{slide.headline}</h1>
              {slide.tagline && <p className="tagline">{slide.tagline}</p>}
              <p className="subtitle">{slide.subtitle}</p>
              <a className="cta" href={slide.ctaHref}>
                {slide.ctaLabel}
              </a>
            </div>
            {slide.image && slide.imageRight && (
              <img src={slide.image} className="slide-visual" alt="" />
            )}
          </div>
        ))}

        <button
          type="button"
          className="arrow prev"
          aria-label="前のスライド"
          onClick={() => goTo(index - 1)}
        >
          ‹
        </button>
        <button
          type="button"
          className="arrow next"
          aria-label="次のスライド"
          onClick={() => goTo(index + 1)}
        >
          ›
        </button>

        <div className="dots">
          {slides.map((slide, i) => (
            <button
              type="button"
              key={slide.id}
              className={i === index ? 'dot active' : 'dot'}
              aria-label={`スライド ${i + 1} へ`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </section>

      <section id="about">
        <h2>FSKYについて</h2>
        <p>
          行き先も、過ごし方も、思い出の残し方も——あなたらしい旅のかたちを
          一緒に考える旅行ブランドです。
        </p>
      </section>

      <section id="services">
        {services.map((service) => (
          <div className="service" key={service.title}>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
          </div>
        ))}
      </section>

      <footer id="contact">
        <p>旅のプランやレンタルについて、お気軽にお問い合わせください。</p>
        <p className="footnote">FSKY — Flowing Sky</p>
      </footer>
    </>
  )
}

export default App
