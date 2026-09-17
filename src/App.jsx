import { useEffect, useRef, useState } from 'react'
import wordmark from './assets/fsky-wordmark.png'
import markMetal from './assets/fsky-mark-metal.png'
import './App.css'

const LINE_URL = 'https://line.me/R/ti/p/%40085ccfzq'
const LINE_ID = '@085ccfzq'

function IconRoute() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="6" r="2.25" />
      <circle cx="19" cy="18" r="2.25" />
      <path d="M5 8.25V13a3 3 0 0 0 3 3h4a3 3 0 0 1 3 3v.25" />
    </svg>
  )
}

function IconCamera() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-1.5h7L16.5 7h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z" />
      <circle cx="12" cy="13" r="3.25" />
    </svg>
  )
}

function IconChat() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8c-1.1 0-2.15-.2-3.1-.58L4 20l1.35-4.5A7.94 7.94 0 0 1 4 12Z" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

function IconSparkle() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.5 13.6 9l5.4 1.6-5.4 1.6L12 17.7l-1.6-5.5L5 10.6 10.4 9 12 3.5Z" />
      <path d="M19 15.5l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9Z" />
    </svg>
  )
}

function IconChevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

const overview = [
  {
    icon: IconRoute,
    title: '完全オーダーメイド設計',
    description:
      'ご希望・予算・旅のテーマをヒアリングし、世界にひとつだけの旅程をプランニングします。',
  },
  {
    icon: IconCamera,
    title: 'Osmo Pocket 3 レンタル',
    description:
      '旅の景色や思い出を高画質な映像で。コンパクトジンバルカメラを手軽にレンタルできます。',
  },
  {
    icon: IconChat,
    title: 'LINEで気軽に相談',
    description:
      '堅苦しい手続きは不要です。LINEひとつでプランのご相談から予約まで完結します。',
  },
]

const plans = [
  {
    tag: '国内 / 1泊2日',
    title: '絶景弾丸フォトトリップ',
    description:
      '国内の絶景スポットを効率よく巡る弾丸プラン。Osmo Pocket 3での同行撮影サービスも組み合わせられます。',
    price: '¥38,000〜 / 人',
  },
  {
    tag: '海外 / 4泊6日',
    title: '海外オーダーメイド周遊プラン',
    description:
      '行き先・テーマを自由に設計する海外周遊プラン。観光もアクティビティも、ペース配分もお任せください。',
    price: '¥180,000〜 / 人',
  },
  {
    tag: '国内 / 2泊3日',
    title: '温泉・リトリートプラン',
    description:
      '日常を離れて、ゆったりと過ごす国内温泉プラン。何も予定を詰め込まない贅沢な時間も設計できます。',
    price: '¥52,000〜 / 人',
  },
]

const reviews = [
  {
    quote: '時間配分が完璧でスムーズに最高の旅行にすることができました!',
    name: 'Sさん',
    meta: '20代男性',
  },
  {
    quote: 'わざわざ自分で安いのを探す手間も省け、結果的に費用もさらに節約できて良かったです!',
    name: 'Rさん',
    meta: '20代男性',
  },
]

const faqs = [
  {
    q: 'オーダーメイドプランはどのように決まりますか?',
    a: 'まずはLINEで行き先のイメージ・ご予算・旅の目的などをヒアリングします。その内容をもとに旅程案を作成し、内容にご納得いただけるまで調整を重ねてから確定します。',
  },
  {
    q: '料金はどのくらいかかりますか?',
    a: '旅先や日程、内容によって大きく異なるため、まずは無料でお見積もりいたします。「例:オーダーメイド旅行プラン例」セクションの価格帯も参考にしてください。',
  },
  {
    q: '相談だけでも大丈夫ですか?',
    a: 'もちろんです。プランが固まっていない段階でのご相談も歓迎しています。まずは気軽にLINEでお声がけください。',
  },
  {
    q: 'キャンセルはできますか?',
    a: 'ご予約内容確定後のキャンセルポリシーについては、旅程確定時に個別にご案内します。ご不明点はLINEでお気軽にご確認ください。',
  },
  {
    q: 'Osmo Pocket 3のレンタルだけの利用も可能ですか?',
    a: 'はい、旅行プランと組み合わせず、レンタルのみのご利用も可能です。ご希望の期間をLINEでお知らせください。',
  },
  {
    q: '予約や相談の流れを教えてください',
    a: '① LINEでご相談 → ② ヒアリング・旅程のご提案 → ③ 内容確定・お見積もり → ④ ご予約、という流れです。すべてLINE上でやり取りが完結します。',
  },
]

const HERO_VIDEO_DURATION_FALLBACK = 5

function VideoHero() {
  const trackRef = useRef(null)
  const videoRef = useRef(null)
  const copyRef = useRef(null)
  const reduceMotionRef = useRef(false)
  const [videoSupported, setVideoSupported] = useState(true)

  useEffect(() => {
    const track = trackRef.current
    const video = videoRef.current
    const copy = copyRef.current
    if (!track || !video) return

    reduceMotionRef.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    let duration = HERO_VIDEO_DURATION_FALLBACK
    const onLoadedMetadata = () => {
      if (video.duration && Number.isFinite(video.duration)) {
        duration = video.duration
      }
    }
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.pause()

    let ticking = false

    const update = () => {
      ticking = false
      const rect = track.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const progress =
        scrollable > 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 1) : 0

      if (!reduceMotionRef.current && video.readyState >= 1) {
        const target = progress * duration
        if (Math.abs(video.currentTime - target) > 0.045) {
          if (typeof video.fastSeek === 'function') {
            video.fastSeek(target)
          } else {
            video.currentTime = target
          }
        }
      }

      if (copy) {
        const fade = Math.max(0, 1 - progress / 0.22)
        copy.style.opacity = String(fade)
        copy.style.transform = `translateY(${(1 - fade) * -16}px)`
      }
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section id="hero" ref={trackRef}>
      <div className="hero-sticky">
        {videoSupported && (
          <video
            ref={videoRef}
            className="hero-video"
            src="/fsky-hero.mp4"
            poster="/fsky-hero-poster.jpg"
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            onError={() => setVideoSupported(false)}
          />
        )}
        {!videoSupported && (
          <img
            src="/fsky-hero-poster.jpg"
            className="hero-video hero-video-fallback"
            alt=""
            aria-hidden="true"
          />
        )}
        <div className="hero-scrim" />
        <div className="hero-copy" ref={copyRef}>
          <p className="hero-tagline-jp">流れる空に乗るように、自由でとらわれない旅を。</p>
          <a className="cta hero-cta" href={LINE_URL} target="_blank" rel="noreferrer">
            公式LINEで相談する
          </a>
        </div>
      </div>
    </section>
  )
}

function App() {
  return (
    <>
      <header id="nav">
        <img src={wordmark} className="logo" alt="FSKY" />
        <nav>
          <a href="#about">サービス</a>
          <a href="#plans">プラン</a>
          <a href="#faq">よくある質問</a>
          <a className="nav-cta" href={LINE_URL} target="_blank" rel="noreferrer">
            <IconChat />
            LINEで相談
          </a>
        </nav>
      </header>

      <VideoHero />

      <section id="about" className="section">
        <div className="section-head">
          <p className="eyebrow">Service Overview</p>
          <h2>FSKYができること</h2>
          <p className="section-desc">
            行き先も、過ごし方も、思い出の残し方も——あなたらしい旅のかたちを
            一緒に考える旅行ブランドです。
          </p>
        </div>
        <div className="overview-grid">
          {overview.map((item) => (
            <div className="overview-card" key={item.title}>
              <div className="overview-icon">
                <item.icon />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="plans" className="section section--muted">
        <div className="section-head">
          <p className="eyebrow">Example Plans</p>
          <h2>オーダーメイド旅行プラン例</h2>
          <p className="section-desc">
            過去のご相談をもとにした一例です。行き先・日程・ご予算に合わせて、完全にカスタマイズいたします。
          </p>
        </div>
        <div className="plan-grid">
          {plans.map((plan) => (
            <div className="plan-card" key={plan.title}>
              <span className="plan-tag">{plan.tag}</span>
              <h3>{plan.title}</h3>
              <p>{plan.description}</p>
              <div className="plan-footer">
                <span className="plan-price">{plan.price}</span>
                <a className="plan-link" href={LINE_URL} target="_blank" rel="noreferrer">
                  相談する →
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="plan-note">
          ※上記は一例です。詳しいご予算・ご要望はLINEにてお気軽にご相談ください。
        </p>
      </section>

      <section className="section campaign-section">
        <div className="campaign-card">
          <div className="campaign-icon">
            <IconSparkle />
          </div>
          <p className="eyebrow eyebrow--gold">Opening Campaign</p>
          <h2>オープニング記念 10%OFF</h2>
          <p className="section-desc">
            期間限定で、すべてのオーダーメイド旅行プランを10%OFFでご案内します。
          </p>
          <a className="cta cta--gold" href={LINE_URL} target="_blank" rel="noreferrer">
            LINEで10%OFFを問い合わせる
          </a>
          <p className="campaign-note">※予告なく終了する場合があります。詳細はLINEにてご確認ください。</p>
        </div>
      </section>

      <section id="reviews" className="section section--muted">
        <div className="section-head">
          <p className="eyebrow">Voices</p>
          <h2>ご利用いただいた方の声</h2>
        </div>
        <div className="review-grid">
          {reviews.map((review) => (
            <div className="review-card" key={review.name}>
              <p className="review-quote">"{review.quote}"</p>
              <p className="review-attr">
                {review.name} <span>/ {review.meta}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="operator" className="section">
        <div className="section-head">
          <p className="eyebrow">Operator</p>
          <h2>運営者について</h2>
        </div>
        <div className="operator-card">
          <div className="operator-avatar">
            <img src={markMetal} alt="" />
          </div>
          <div className="operator-body">
            <h3>FSKY 代表</h3>
            <p>
              旅とガジェットが好きが高じて、オーダーメイド旅行と Osmo Pocket 3
              レンタルを始めました。お一人おひとりの「行きたい」を丁寧にお伺いします。
            </p>
            <p className="operator-message">「あなたの『行きたい』を、そのまま形にします。」</p>
          </div>
        </div>
      </section>

      <section id="faq" className="section section--muted">
        <div className="section-head">
          <p className="eyebrow">FAQ</p>
          <h2>よくある質問</h2>
        </div>
        <div className="faq-list">
          {faqs.map((item) => (
            <details className="faq-item" key={item.q}>
              <summary>
                <span>{item.q}</span>
                <span className="faq-chevron">
                  <IconChevron />
                </span>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="section-head">
          <p className="eyebrow">Contact</p>
          <h2>LINEで気軽に相談する</h2>
          <p className="section-desc">
            旅のプランやレンタルについて、まずはLINEでお気軽にお問い合わせください。
          </p>
        </div>
        <a className="cta cta--line" href={LINE_URL} target="_blank" rel="noreferrer">
          <IconChat />
          公式LINEを開く
        </a>
        <p className="line-id">LINE ID: {LINE_ID}</p>

        <div className="hours-card">
          <div className="hours-icon">
            <IconClock />
          </div>
          <div>
            <h3>営業時間</h3>
            <p>10:00 〜 20:00</p>
            <p className="hours-note">
              LINEのメッセージは24時間受付しています。ご返信は営業時間内に順次対応いたします。
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p className="footnote">FSKY — Flowing Sky</p>
      </footer>
    </>
  )
}

export default App
