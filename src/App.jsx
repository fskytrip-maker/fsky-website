import { Fragment, useEffect, useRef, useState } from 'react'
import logo from './assets/fsky-logo.png'
import headerLogo from './assets/fsky-logo-header.png'
import heroDesktop from './assets/fsky-hero-desktop.webp'
import heroMobile from './assets/fsky-hero-mobile.webp'
import windowDesktop from './assets/fsky-window-desktop.webp'
import windowMobile from './assets/fsky-window-mobile.webp'
import './App.css'
import { TermsDocument } from './Terms.jsx'
import { PrivacyDocument } from './Privacy.jsx'

const LINE_URL = 'https://line.me/R/ti/p/%40085ccfzq'
const LINE_ID = '@085ccfzq'
const TERMS_PATH = '/terms' // 利用規約 (see usePath / RouteLink below)
const PRIVACY_PATH = '/privacy' // プライバシーポリシー

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

// SERVICE copy. Every string is one phrase (bunsetsu); <Phrased /> joins them
// with <wbr /> so Japanese only wraps between phrases. Joined text is exactly
// the supplied copy.
const SERVICE_LEAD = [
  'FSKYでは、', '行き先選びから', '旅程、', 'ホテル、', '移動、', '観光まで、',
  '一人ひとりの', '希望や予算に', '合わせて', '旅行プランを', '作成します。',
]

const SERVICE_INCLUDED = [
  ['旅行先の', 'ご提案'],
  ['日程、', '旅程の作成'],
  ['ホテル候補の', 'ご提案'],
  ['移動手段の', 'ご提案'],
  ['観光スポット、', '飲食店のご提案'],
  ['混雑を避けやすい', '時間帯のご案内'],
  ['現地での注意点や', '移動時の', 'ポイントのご案内'],
  ['予算に合わせた', 'プラン調整'],
  ['完成後の', 'プラン修正 2回まで'],
]

const SERVICE_OPTIONS = [
  {
    title: ['旅行中の', 'チャットサポート'],
    description: [
      '営業時間内であれば、', 'LINEなどを通じて', '旅行中のご質問や',
      '予定変更時のご相談に', '対応します。',
    ],
  },
  {
    title: ['Osmo Pocket 3', ' レンタル'],
    description: [
      '旅行の思い出を', 'より綺麗に', '残したい方向けに、',
      'カメラレンタルも', 'ご用意しています。',
    ],
  },
]

function Phrased({ phrases }) {
  return phrases.map((phrase, i) => (
    <Fragment key={phrase + i}>
      {i > 0 && <wbr />}
      <span className="phrase">{phrase}</span>
    </Fragment>
  ))
}

// HOW IT WORKS copy. Steps 1-5 are the standard flow (numbered); the travel
// support item is an OPTION and is deliberately NOT part of the numbered list.
// Every string is one phrase; <Phrased /> joins them so Japanese only wraps
// between phrases. Joined text is exactly the supplied copy.
const FLOW_STEPS = [
  {
    title: 'LINEからご相談',
    description: ['行き先、', '日程、', '人数、', '予算、', 'やりたいことなどを', 'お聞きします。'],
  },
  {
    title: 'ご希望をヒアリング',
    description: [
      '旅のスタイルや', '優先したいことを', '確認し、', 'プランの方向性を', '決めます。',
      '内容が固まりましたら、', '料金と利用規約を', 'ご案内します。',
    ],
  },
  {
    title: 'お申込みと旅行プランの作成',
    description: [
      '利用規約への', 'ご同意と', 'お支払いの', '完了後、', 'FSKYから', '受付完了を', 'ご連絡します。',
      'その後、', 'ホテル候補、', '移動手段、', '観光スポット、', '飲食店、',
      '混雑しにくい時間帯などを', '含めて', 'プランを作成します。',
    ],
  },
  {
    title: 'プランをご確認',
    description: ['内容を', 'ご確認いただき、', '必要に応じて', '調整します。'],
  },
  {
    title: '完成したプランをお渡し',
    description: ['旅行中に', '使いやすい形で、', '原則として', '公式LINEを通じて', 'PDFで', 'プランを', 'ご案内します。'],
  },
]

const FLOW_OPTION = {
  title: '旅行中もサポート',
  description: [
    '営業時間内であれば、', 'LINEなどのチャットで', '旅行中の', 'ご質問にも', '対応します。',
  ],
}

// Pricing. Amounts are the exact standard prices - no per-plan discounted
// figures are shown (the 10% opening campaign is stated in words, and applies
// to the travel-planning fee only - not to the Osmo rental).
// `plus` rows render as "＋1,000円／日" (fullwidth plus, fullwidth slash).
const PRICE_PLANNING = [
  { label: '1日', amount: '1,980', unit: '円' },
  { label: '2日', amount: '2,980', unit: '円' },
  { label: '3日', amount: '3,980', unit: '円' },
  { label: '4日', amount: '4,980', unit: '円' },
  { label: '5日', amount: '5,980', unit: '円' },
  { label: '6日目以降', amount: '1,000', unit: '円／日', plus: true },
]

const PRICE_OSMO = [
  { label: '1泊2日', amount: '3,480', unit: '円' },
  { label: '2泊3日', amount: '4,980', unit: '円' },
  { label: '3泊4日', amount: '6,480', unit: '円' },
  { label: '4泊5日以降', amount: '1,500', unit: '円／泊', plus: true },
]

function PriceRows({ rows }) {
  return (
    <ul className="price-list">
      {rows.map((row) => (
        <li className={row.plus ? 'price-row price-row--plus' : 'price-row'} key={row.label}>
          <span className="price-label">{row.label}</span>{' '}
          <span className="price-value">
            {row.plus && <span className="price-plus">＋</span>}
            <span className="price-amount">{row.amount}</span>
            <span className="price-unit">{row.unit}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}

function Pricing() {
  return (
    <div className="pricing">
      <div className="price-group">
        <div className="price-head">
          <span className="price-eyebrow">TRAVEL PLANNING</span>
          <h3 className="price-title">旅行プラン作成料金</h3>
        </div>
        <div className="price-body">
          <PriceRows rows={PRICE_PLANNING} />
          <p className="price-campaign">OPEN記念 旅行プラン作成料金 10%OFF</p>
          <p className="price-note">※割引後の金額はお見積もり時にご案内します。</p>
        </div>
      </div>

      {/* separate list, dashed rules and an explicit RENTAL OPTION label: an
          add-on, not part of the planning fee (and not covered by the campaign line above) */}
      <div className="price-group price-group--option">
        <div className="price-head">
          <span className="price-eyebrow">OSMO POCKET 3</span>
          <span className="price-option-tag">RENTAL OPTION</span>
          <h3 className="price-title price-title--option">Osmo Pocket 3 レンタル料金</h3>
        </div>
        <div className="price-body">
          <PriceRows rows={PRICE_OSMO} />
          <p className="price-note">※旅行プラン作成料金とは別のオプションです。</p>
        </div>
      </div>
    </div>
  )
}

function HowItWorks() {
  const [ref, visible] = useReveal(0.12)
  return (
    <section id="flow" className="story story--flow">
      <div className="story-inner">
        <SectionMarker n="03" label="FLOW" />
        <RevealDisplay lines={['HOW IT', 'WORKS.']} className="story-display story-display--md" />
        <div ref={ref} className={`flow ${visible ? 'is-visible' : ''}`}>
          <ol className="flow-list" aria-label="利用の流れ">
            {FLOW_STEPS.map((step, i) => (
              <li className="flow-step flow-reveal" key={step.title} style={{ '--k': i }}>
                <span className="flow-node" aria-hidden="true" />
                <div className="flow-body">
                  <span className="flow-index" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="flow-title">{step.title}</h3>
                  <p className="flow-text">
                    <Phrased phrases={step.description} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
          {/* Optional add-on: separate from the numbered flow, joined to it by a
              dashed connector, and labelled in text (not only by styling). */}
          <div className="flow-step flow-step--option flow-reveal" style={{ '--k': FLOW_STEPS.length }}>
            <span className="flow-node flow-node--option" aria-hidden="true">
              +
            </span>
            <div className="flow-body">
              <span className="flow-option-tag">OPTION</span>
              <h3 className="flow-title flow-title--option">{FLOW_OPTION.title}</h3>
              <p className="flow-text">
                <Phrased phrases={FLOW_OPTION.description} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const plans = [
  {
    tag: '国内 / 4泊5日',
    title: '九州旅行',
    description: '実際に訪れた旅をもとに作成したプランです。',
    price: '¥200,000〜',
  },
  {
    tag: '国内 / 4泊5日',
    title: '長野旅行',
    description: '実際に訪れた旅をもとに作成したプランです。',
    price: '¥160,000〜',
  },
  {
    tag: '海外 / 7泊9日',
    title: 'ヨーロッパ旅行',
    description: '作成済みのプランです。ご希望に合わせて調整できます。',
    price: '¥450,000〜',
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
    a: 'まずはLINEで行き先のイメージ・ご予算・旅の目的などをヒアリングします。その内容をもとにプランをご提案し、当初のご希望条件の範囲内で2回まで無料で修正できます。行き先や旅行日数などの大幅な変更がある場合は、内容に応じて追加料金をご案内する場合があります。',
  },
  {
    q: '料金はどのくらいかかりますか?',
    a: '旅行プラン作成料金は、1日1,980円から日数に応じて設定しています。6日目以降は1日につき＋1,000円です。航空券・宿泊費・交通費など実際の旅行費用は、行き先・時期・出発地・ご希望内容によって異なります。詳しい料金はPLANセクションをご確認ください。',
  },
  {
    q: '相談だけでも大丈夫ですか?',
    a: 'もちろんです。プランが固まっていない段階でのご相談も歓迎しています。まずは気軽にLINEでお声がけください。',
  },
  {
    q: 'キャンセルはできますか?',
    a: '旅行プランの作成開始前であれば、全額返金にてキャンセルできます。作成開始後の利用者都合によるキャンセルは、原則として返金対象外となります。ただし、法令上返金が必要な場合やFSKY側に原因がある場合などはこの限りではありません。詳しくは利用規約をご確認ください。',
    link: { text: '利用規約', to: TERMS_PATH },
  },
  {
    q: 'Osmo Pocket 3のレンタルだけの利用も可能ですか?',
    a: 'はい、旅行プランと組み合わせず、レンタルのみのご利用も可能です。ご希望の期間をLINEでお知らせください。',
  },
  {
    q: '予約や相談の流れを教えてください',
    a: 'ご相談から完成したプランのお渡しまでの流れは、ページ内の「HOW IT WORKS」セクションでご案内しています。ご相談・ヒアリングなどのやり取りは公式LINEを中心に行います。',
  },
]

function useReveal(threshold = 0.35) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.unobserve(el)
        }
      },
      { threshold, rootMargin: '0px 0px -10% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return [ref, visible]
}

function SectionMarker({ n, label }) {
  return (
    <div className="marker">
      <span className="marker-num">{n}</span>
      <span className="marker-line" aria-hidden="true" />
      <span className="marker-label">{label}</span>
    </div>
  )
}

function RevealDisplay({ lines, as: Tag = 'h2', className = '' }) {
  const [ref, visible] = useReveal(0.4)
  return (
    <Tag ref={ref} className={`display-reveal ${visible ? 'is-visible' : ''} ${className}`}>
      {lines.map((line, i) => (
        <Fragment key={line + i}>
          {/* real space between the block-level lines: invisible (whitespace
              between blocks collapses) but keeps the heading's text "HOW IT WORKS." */}
          {i > 0 && ' '}
          <span className="display-line-mask">
            <span className="display-line" style={{ transitionDelay: `${i * 90}ms` }}>
              {line}
            </span>
          </span>
        </Fragment>
      ))}
    </Tag>
  )
}

// --- Hero -> black transition: dev-only comparison switch ---
// 'A' = rising black curtain (solid panel + 1px boundary line)
// 'B' = clean architectural wipe (hard clip edge + small feather)
// 'C' = horizon line that extends, then the sky below it turns black
// 'WAVE' = temporary: one large asymmetric SVG curve at the Hero's bottom
//          edge instead of a full curtain/wipe reveal - see HeroWave below.
// Not exposed in any UI - edit this constant to compare options.
const TRANSITION_MODE = 'WAVE' // 'A' | 'B' | 'C' | 'WAVE'

function applyTransitionStyle(mode, panel, line, p) {
  if (mode === 'WAVE') return // handled entirely by HeroWave instead
  if (!panel) return

  if (mode === 'A') {
    panel.style.transform = `translateY(${(1 - p) * 100}%)`
    return
  }

  // B and C both reveal the same solid panel via a clip-path wipe; only the
  // boundary treatment (feather vs. horizon line) differs.
  panel.style.clipPath = `inset(${(1 - p) * 100}% 0 0 0)`
  if (!line) return

  if (mode === 'B') {
    const y = (1 - p) * window.innerHeight - 20
    line.style.transform = `translateY(${y}px)`
  } else {
    const y = (1 - p) * window.innerHeight
    const extend = Math.min(p / 0.3, 1)
    line.style.transform = `translateY(${y}px) scaleX(${extend})`
  }
}

function TransitionLayer({ mode, panelRef, lineRef }) {
  if (mode === 'WAVE') return null // HeroWave renders the transition instead
  if (mode === 'A') {
    return (
      <div className="transition-panel transition-panel--curtain" ref={panelRef} aria-hidden="true">
        <div className="transition-panel-line" />
      </div>
    )
  }
  if (mode === 'B') {
    return (
      <>
        <div className="transition-panel transition-panel--wipe" ref={panelRef} aria-hidden="true" />
        <div className="transition-feather" ref={lineRef} aria-hidden="true" />
      </>
    )
  }
  return (
    <>
      <div className="transition-panel transition-panel--wipe" ref={panelRef} aria-hidden="true" />
      <div className="transition-horizon-line" ref={lineRef} aria-hidden="true" />
    </>
  )
}

// --- WAVE mode: ONE very broad, shallow curve at the Hero's bottom edge -----
// Black "next section" easing into the sky: a single continuous stroke that
// enters gently on the left, reaches its highest intrusion right-of-middle,
// and relaxes again toward the right edge. No repeated peaks, no sharp turns.
// The two cubic segments share a horizontal tangent at (1000,44) so the join
// is smooth. Mobile gets its own shallower path via CSS `d:` (see App.css).
const HERO_WAVE_PATH =
  'M 0,128 C 380,128 720,44 1000,44 C 1200,44 1340,62 1440,84 L 1440,200 L 0,200 Z'

function HeroWave({ groupRef }) {
  return (
    <div className="hero-wave" aria-hidden="true" ref={groupRef}>
      <svg
        className="hero-wave-svg"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path className="hero-wave-path" d={HERO_WAVE_PATH} fill="#000000" />
      </svg>
    </div>
  )
}

// Scroll-linked rise (wave lifts + Hero copy fades as the Hero leaves).
// Disabled while the static shape is being evaluated - flip to true to restore.
const HERO_WAVE_MOTION = false
const HERO_WAVE_RISE_PX = 55 // within the requested 30-80px range
const HERO_WAVE_WINDOW_PX = 220 // scroll distance the rise/fade plays out over

// --- Hero variant switch ---------------------------------------------------
//   'WINDOW'   - airplane-window hero (static photo + live HTML/CSS type +
//                separately animated airplane). Current default.
//   'SUITCASE' - the previous suitcase-over-clouds Hero (+ TRANSITION_MODE).
// Both stay in the codebase so they can be compared; flip this constant.
const HERO_VARIANT = 'WINDOW' // 'WINDOW' | 'SUITCASE'

// All editable WINDOW hero copy lives here. Images are imported above
// (windowDesktop / windowMobile); airplane geometry + timing are CSS custom
// properties at the top of the "WINDOW hero" block in App.css.
const AIRPLANE_ASSET = import.meta.glob('./assets/fsky-airplane.{png,webp}', {
  eager: true,
  import: 'default',
})

const WINDOW_HERO = {
  brand: 'FSKY',
  headingLines: ['Beyond', 'the sky.'],
  supportingLines: ['Tailored travel planning,', 'designed around you.'],
  ctaLabel: 'Plan Your Journey',
  ctaHref: LINE_URL,
  imageAlt: '',
  // Transparent airplane image (see AirplaneShape). Drop the file at
  // src/assets/fsky-airplane.png (or .webp) and it is picked up automatically;
  // with no file there, the built-in SVG is used. Or set a path directly here.
  airplaneSrc: Object.values(AIRPLANE_ASSET)[0] ?? null,
}

// Airplane layer. A photographic airplane (transparent PNG/WebP, nose pointing
// RIGHT, tightly trimmed) at src/assets/fsky-airplane.* is used automatically;
// if the photo is pitched nose-up, set --plane-pitch in App.css to its angle so
// it sits level along the flight path. Flight path, size, trails, clipping and
// reduced-motion behaviour are identical for the photo and the SVG. With no source set, a
// small three-quarter-view airliner is drawn below (shaded, not an icon).
function AirplaneShape() {
  return (
    <svg className="whero-plane-svg" viewBox="0 0 120 40" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="wp-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#eef2fb" />
          <stop offset="1" stopColor="#aebbd3" />
        </linearGradient>
        <linearGradient id="wp-wing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4f7fd" />
          <stop offset="1" stopColor="#9fb0cc" />
        </linearGradient>
      </defs>
      {/* far wing + far tailplane, seen slightly from above: darker, behind */}
      <path d="M60 17.4 44 9.6h4.6L72 16.9Z" fill="#b4c1d9" />
      <path d="M17 19.6 9.5 16h4l10.5 3Z" fill="#b4c1d9" />
      {/* fin */}
      <path d="M12 19.2 5.2 3.6h7.1l19 13.6Z" fill="#f2f5fc" />
      {/* fuselage */}
      <path
        d="M6 19.4C24 16.3 78 15.5 103 17.3c8 .6 13.6 2.3 13.6 4.3 0 1.9-5.6 3.3-13.6 3.7L22 25c-8-.5-14.4-2.5-16-5.6Z"
        fill="url(#wp-body)"
      />
      {/* near wing (lower, swept back) + engine pod */}
      <path d="M60 22.2 33.5 36.4h8.3L82 23.6Z" fill="url(#wp-wing)" />
      <ellipse cx="56" cy="29.6" rx="7.4" ry="2.5" fill="#dfe6f2" />
      <ellipse cx="62.6" cy="29.6" rx="1.6" ry="2.2" fill="#8794ad" />
      {/* near tailplane */}
      <path d="M17 22.6 8.5 27.6h5.2L27 23.6Z" fill="#c3cee2" />
      {/* cockpit + window line */}
      <path d="M100 18.1c3.2.3 6.4 1.2 8.6 2.4-2.8.2-6.2-.1-9.2-.6Z" fill="#5d6f92" opacity="0.75" />
      <path d="M30 20.6h66" stroke="#9aa9c6" strokeWidth="0.7" strokeDasharray="1.1 1.9" opacity="0.8" />
    </svg>
  )
}

function WindowHero() {
  // Same header-height sync the WAVE Hero uses, so hero + first fold fit.
  useEffect(() => {
    const nav = document.getElementById('nav')
    if (!nav) return
    const sync = () =>
      document.documentElement.style.setProperty('--nav-h', `${nav.offsetHeight}px`)
    sync()
    if (!('ResizeObserver' in window)) return
    const observer = new ResizeObserver(sync)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [])

  const { brand, headingLines, supportingLines, ctaLabel, ctaHref, imageAlt, airplaneSrc } =
    WINDOW_HERO

  return (
    <section id="hero-window" className="whero">
      {/* The stage is sized/positioned exactly like object-fit: cover, so the
          airplane (a % of the photo) always lands inside the window. */}
      <div className="whero-stage">
        <picture>
          <source media="(max-width: 767px), (orientation: portrait)" srcSet={windowMobile} />
          <img
            className="whero-bg"
            src={windowDesktop}
            alt={imageAlt}
            fetchPriority="high"
            decoding="async"
          />
        </picture>

        <div className="whero-sky" aria-hidden="true">
          <div className="whero-flight">
            <span className="whero-trail whero-trail--a" />
            <span className="whero-trail whero-trail--b" />
            <div className="whero-mover">
              {airplaneSrc ? (
                <img className="whero-plane-svg whero-plane-photo" src={airplaneSrc} alt="" decoding="async" />
              ) : (
                <AirplaneShape />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="whero-fade" aria-hidden="true" />

      <div className="whero-copy">
        <div className="whero-head">
          <p className="whero-brand">{brand}</p>
          {/* each line sits in its own overflow-hidden mask and rises into place */}
          <h1 className="whero-heading">
            {headingLines.map((line, i) => (
              <Fragment key={line}>
                {i > 0 && ' '}
                <span className="whero-line" style={{ '--n': i }}>
                  <span className="whero-line-inner">{line}</span>
                </span>
              </Fragment>
            ))}
          </h1>
        </div>
        <div className="whero-foot">
          <p className="whero-sub">
            {supportingLines.map((line, i) => (
              <Fragment key={line}>
                {i > 0 && ' '}
                <span>{line}</span>
              </Fragment>
            ))}
          </p>
          <a
            className="whero-cta"
            href={ctaHref}
            target="_blank"
            rel="noreferrer"
          >
            <span>{ctaLabel}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

function Hero() {
  const trackRef = useRef(null)
  const panelRef = useRef(null)
  const lineRef = useRef(null)
  const overlayRef = useRef(null)
  const waveRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    const overlay = overlayRef.current
    if (!track) return

    let ticking = false
    let update
    let navObserver

    if (TRANSITION_MODE === 'WAVE') {
      // The sticky header sits above the Hero in normal flow, so a plain
      // 100dvh Hero pushes its bottom (and the wave) below the first fold.
      // Track the header height so the Hero + wave fit the first screen.
      const nav = document.getElementById('nav')
      const syncNav = () => {
        if (nav) document.documentElement.style.setProperty('--nav-h', `${nav.offsetHeight}px`)
      }
      syncNav()
      if (nav && 'ResizeObserver' in window) {
        navObserver = new ResizeObserver(syncNav)
        navObserver.observe(nav)
      }

      // No curtain/wipe/horizon runway in this mode - #hero is a plain
      // 100dvh block (see .hero--wave in App.css) and the only motion is a
      // very small, subtle rise as the user scrolls past its bottom edge.
      const wave = waveRef.current
      update = () => {
        ticking = false
        if (!HERO_WAVE_MOTION) return
        const rect = track.getBoundingClientRect()
        const p = Math.min(
          Math.max((window.innerHeight - rect.bottom) / HERO_WAVE_WINDOW_PX, 0),
          1
        )
        if (wave) wave.style.transform = `translateY(${-p * HERO_WAVE_RISE_PX}px)`
        if (overlay) {
          overlay.style.opacity = String(1 - p)
          overlay.style.transform = `translateY(${-p * 14}px)`
        }
      }
    } else {
      const panel = panelRef.current
      const line = lineRef.current
      if (!panel) return

      update = () => {
        ticking = false
        const rect = track.getBoundingClientRect()
        const scrollable = rect.height - window.innerHeight
        const progress =
          scrollable > 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 1) : 0

        // 0-18%: Hero stays fully as-is. 18-100%: the transition layer
        // rises, finishing exactly as the sticky Hero releases into About.
        const transitionP = Math.min(Math.max((progress - 0.18) / 0.82, 0), 1)
        applyTransitionStyle(TRANSITION_MODE, panel, line, transitionP)

        if (overlay) {
          // Overlay text fades out slightly ahead of the transition layer
          // so it never reads as half-covered by the rising reveal.
          const fade = 1 - Math.min(Math.max((progress - 0.22) / 0.28, 0), 1)
          overlay.style.opacity = String(fade)
          overlay.style.transform = `translateY(${(1 - fade) * -14}px)`
        }
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
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (navObserver) navObserver.disconnect()
    }
  }, [])

  return (
    <section
      id="hero"
      ref={trackRef}
      className={TRANSITION_MODE === 'WAVE' ? 'hero--wave' : undefined}
    >
      <div className="hero-sticky">
        <picture className="hero-media">
          <source media="(max-width: 767px)" srcSet={heroMobile} />
          <img
            src={heroDesktop}
            alt="雲海の上をゆくスーツケース"
            fetchPriority="high"
            decoding="async"
          />
        </picture>

        <div className="hero-overlay" ref={overlayRef}>
          <img src={logo} className="hero-logo" alt="FSKY" />
          <h1 className="hero-jp">空の向こうへ、あなたらしい旅を。</h1>
          <p className="hero-en">Beyond the sky.</p>
        </div>

        <div className="hero-scroll" aria-hidden="true">
          <span className="hero-scroll-line" />
          <span className="hero-scroll-label">SCROLL</span>
        </div>

        <TransitionLayer mode={TRANSITION_MODE} panelRef={panelRef} lineRef={lineRef} />
        {TRANSITION_MODE === 'WAVE' && <HeroWave groupRef={waveRef} />}
      </div>
    </section>
  )
}

// ABOUT body copy, one array per paragraph, one string per phrase (bunsetsu).
// Phrases are joined with <wbr /> and the paragraph uses `word-break:
// keep-all` (see .story-copy--about), so lines only ever wrap between
// phrases - never mid-word like "混雑 / を" or "一人ひ / とり". The rendered
// text is the exact copy with no added characters or spaces.
const ABOUT_COPY = [
  ['旅程をつくるだけではありません。'],
  [
    '自分で調べるだけでは', '見つけにくい', 'おすすめスポットや、', '混雑を避けやすい',
    '時間帯、', '移動時の注意点まで', '細かくご提案。',
    'さらに、', '自己手配や', 'AIだけでは', '見落としやすい部分も', '人の目で確認し、',
    '旅行前から', 'しっかりサポートします。',
  ],
  [
    'FSKYは、', '予算や滞在時間、', '移動効率まで', '考えながら、', '一人ひとりに',
    '合わせた', '旅行プランを', 'つくるサービスです。',
    '旅行の計画に', 'かかる時間や', '手間を減らし、',
    '「調べること」ではなく', '「旅を楽しむこと」に', '時間を使えるように。',
  ],
]

function AboutIntro() {
  const sectionRef = useRef(null)
  const markerRef = useRef(null)
  const headlineRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const marker = markerRef.current
    const headline = headlineRef.current
    if (!section || !marker || !headline) return

    const lines = headline.querySelectorAll('.display-line')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      marker.style.opacity = '1'
      lines.forEach((lineEl) => {
        lineEl.style.opacity = '1'
        lineEl.style.transform = 'none'
      })
      return
    }

    let ticking = false

    const update = () => {
      ticking = false
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when the section's top is at the bottom edge of the viewport,
      // 1 once it has scrolled up to ~35% of viewport height from the top.
      const start = vh
      const end = vh * 0.35
      const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1)

      // Marker leads; the headline only starts once the marker is well underway,
      // so nothing overlaps the Hero transition or arrives all at once.
      const markerP = Math.min(progress / 0.45, 1)
      marker.style.opacity = String(markerP)
      marker.style.transform = `translateY(${(1 - markerP) * 14}px)`

      const headlineP = Math.min(Math.max((progress - 0.3) / 0.7, 0), 1)
      lines.forEach((lineEl, i) => {
        const lineP = Math.min(Math.max((headlineP - i * 0.15) / (1 - i * 0.15), 0), 1)
        lineEl.style.opacity = String(lineP)
        lineEl.style.transform = `translateY(${(1 - lineP) * 100}%)`
      })
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
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="story-inner" ref={sectionRef}>
      <div className="marker" ref={markerRef} style={{ opacity: 0 }}>
        <span className="marker-num">01</span>
        <span className="marker-line" aria-hidden="true" />
        <span className="marker-label">ABOUT FSKY</span>
      </div>
      <h2 className="display-reveal display-reveal--scrubbed story-display" ref={headlineRef}>
        {['BEYOND', 'THE', 'SKY.'].map((line, i) => (
          <Fragment key={line + i}>
            {i > 0 && ' '}
            <span className="display-line-mask">
              <span className="display-line" style={{ opacity: 0 }}>
                {line}
              </span>
            </span>
          </Fragment>
        ))}
      </h2>
      <div className="story-copy story-copy--about">
        {ABOUT_COPY.map((phrases) => (
          <p key={phrases[0]}>
            {phrases.map((phrase, i) => (
              <Fragment key={phrase + i}>
                {i > 0 && <wbr />}
                <span className="phrase">{phrase}</span>
              </Fragment>
            ))}
          </p>
        ))}
      </div>
    </div>
  )
}

// --- Opening / first-view intro ---------------------------------------
// Fully independent from TRANSITION_MODE ('A'/'B'/'C', the Hero -> About
// scroll transition above) - separate constant, separate DOM, separate
// timers. This layer only ever runs once, before the user can interact
// with the Hero, and coordinates with the existing Hero/nav purely through
// CSS classes on <html> ('intro-active' / 'intro-reveal' / 'intro-variant-*')
// so Hero.jsx and the nav markup never need to know it exists, and every
// variant hands off to the exact same Hero end state.
const INTRO_ENABLED = true // dev-only switch

// Dev-only comparison switch - not exposed in any UI. Edit this constant to
// compare the three opening treatments; see IntroVariantA/B/C below.
//   'A' - editorial mask (refined TOYOX-inspired panels, unchanged concept)
//   'B' - center opening (two panels part from a single seam - minimal)
//   'C' - typography -> sky (FSKY / Beyond the sky., then the line the text
//         sits on becomes the mask edge the Hero reveals from)
const INTRO_VARIANT = 'A' // 'A' | 'B' | 'C'

// Per-variant hand-off timing in ms. unlockAt = when Hero/nav start fading
// in (html.intro-reveal replaces html.intro-active); unmountAt = when the
// intro DOM is removed entirely. Each variant's own visual sequence below
// is authored to have essentially finished by its own unlockAt.
const INTRO_TIMING = {
  A: { unlockAt: 1100, unmountAt: 1900, mobileUnlockAt: 850, mobileUnmountAt: 1400 },
  B: { unlockAt: 850, unmountAt: 1700, mobileUnlockAt: 600, mobileUnmountAt: 1250 },
  C: { unlockAt: 1150, unmountAt: 1750, mobileUnlockAt: 750, mobileUnmountAt: 1200 },
}

function introShouldRun() {
  if (!INTRO_ENABLED) return false
  if (typeof window === 'undefined') return false
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function IntroVariantA() {
  return (
    <>
      <div className="intro-a-line" />
      <div className="intro-a-type">
        <span className="intro-a-logo-mask">
          <img src={logo} className="intro-a-logo" alt="" />
        </span>
        <span className="intro-a-tagline-mask">
          <span className="intro-a-tagline">Beyond the sky.</span>
        </span>
      </div>
      <div className="intro-a-panels">
        <span className="intro-a-panel intro-a-panel-1" />
        <span className="intro-a-panel intro-a-panel-2" />
        <span className="intro-a-panel intro-a-panel-3" />
        <span className="intro-a-panel intro-a-panel-4" />
      </div>
    </>
  )
}

function IntroVariantB() {
  return (
    <>
      <div className="intro-b-line" />
      <div className="intro-b-panel intro-b-panel-1" />
      <div className="intro-b-panel intro-b-panel-2" />
    </>
  )
}

function IntroVariantC() {
  return (
    <>
      <div className="intro-c-type">
        <span className="intro-c-logo-mask">
          <img src={logo} className="intro-c-logo" alt="" />
        </span>
        <span className="intro-c-tagline-mask">
          <span className="intro-c-tagline">Beyond the sky.</span>
        </span>
      </div>
      <div className="intro-c-line" />
      <div className="intro-c-panel intro-c-panel-1" />
      <div className="intro-c-panel intro-c-panel-2" />
    </>
  )
}

const INTRO_VARIANTS = { A: IntroVariantA, B: IntroVariantB, C: IntroVariantC }

function Intro() {
  const variantClass = `intro-variant-${INTRO_VARIANT.toLowerCase()}`

  // Decided + applied synchronously (before first paint) so the Hero/nav
  // are never visible for even one frame before the intro covers them.
  const [running, setRunning] = useState(() => {
    const run = introShouldRun()
    if (run) document.documentElement.classList.add('intro-active', variantClass)
    return run
  })

  useEffect(() => {
    if (!running) return

    // Re-assert the hidden state here too (not just in the initializer):
    // StrictMode's dev-only mount -> cleanup -> mount replay runs this
    // effect's cleanup once immediately, which strips these classes. Since
    // they're otherwise only added by the initializer (which does not
    // re-run on that replay), skipping this line would leave Hero/nav
    // permanently unhidden and the scroll lock off for the rest of the
    // (still in-progress) intro. Re-adding it here is a no-op outside
    // StrictMode's replay.
    document.documentElement.classList.add('intro-active', variantClass)

    const isMobile = window.matchMedia('(max-width: 640px)').matches
    const timing = INTRO_TIMING[INTRO_VARIANT]
    const unlockAt = isMobile ? timing.mobileUnlockAt : timing.unlockAt
    const unmountAt = isMobile ? timing.mobileUnmountAt : timing.unmountAt

    const unlockTimer = window.setTimeout(() => {
      document.documentElement.classList.remove('intro-active')
      document.documentElement.classList.add('intro-reveal')
    }, unlockAt)

    const unmountTimer = window.setTimeout(() => {
      document.documentElement.classList.remove('intro-reveal', variantClass)
      setRunning(false)
    }, unmountAt)

    // Dev-only console helper - no user-facing replay button.
    // Usage: replayFskyIntro() in the browser console. A full reload is the
    // simplest reliable way to restart every CSS animation cleanly.
    window.replayFskyIntro = () => window.location.reload()

    return () => {
      window.clearTimeout(unlockTimer)
      window.clearTimeout(unmountTimer)
      document.documentElement.classList.remove('intro-active', 'intro-reveal', variantClass)
      delete window.replayFskyIntro
    }
  }, [running, variantClass])

  if (!running) return null

  const VariantContent = INTRO_VARIANTS[INTRO_VARIANT]

  return (
    <div className="intro" aria-hidden="true">
      <VariantContent />
    </div>
  )
}

// --- Minimal routing -----------------------------------------------------
// No router dependency: the only extra route is /terms (利用規約). It works on
// direct load / refresh (the dev server and a static host with an SPA fallback
// serve index.html for /terms) and via pushState from in-page links.
function normalizePath(pathname) {
  const trimmed = pathname.replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed
}

function usePath() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname))

  useEffect(() => {
    const onPop = () => setPath(normalizePath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = (to) => {
    window.history.pushState({}, '', to)
    setPath(normalizePath(window.location.pathname))
    window.scrollTo(0, 0)
  }
  return [path, navigate]
}

// In-page link that navigates without a reload, but stays a real <a href>
// (open in new tab, copy link, keyboard, no-JS all keep working).
function RouteLink({ to, navigate, className, children, ...rest }) {
  const onClick = (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return
    }
    e.preventDefault()
    navigate(to)
  }
  return (
    <a href={to} className={className} onClick={onClick} {...rest}>
      {children}
    </a>
  )
}

function SiteHeader({ isHome, navigate }) {
  // On the home page the nav uses in-page anchors; elsewhere they point back
  // at the home page's sections.
  const base = isHome ? '' : '/'
  const logo = <img src={headerLogo} className="logo" alt="FSKY" />
  return (
    <header id="nav">
      <div className="nav-inner">
        {isHome ? (
          logo
        ) : (
          <RouteLink to="/" navigate={navigate} className="logo-link" aria-label="FSKY トップへ">
            {logo}
          </RouteLink>
        )}
        <nav>
          <a href={`${base}#service`}>サービス</a>
          <a href={`${base}#plans`}>プラン</a>
          <a href={`${base}#faq`}>よくある質問</a>
          <a className="nav-cta" href={LINE_URL} target="_blank" rel="noreferrer">
            <IconChat />
            LINEで相談
          </a>
        </nav>
      </div>
    </header>
  )
}

// Footer legal links. Add future pages (キャンセル・返金ポリシー, 特定商取引法に
// 基づく表記) as further entries in FOOTER_LINKS once those pages exist.
const FOOTER_LINKS = [
  { to: TERMS_PATH, label: '利用規約' },
  { to: PRIVACY_PATH, label: 'プライバシーポリシー' },
]

function SiteFooter({ path, navigate }) {
  return (
    <footer className="footer">
      <nav className="footer-links" aria-label="規約・ポリシー">
        <ul>
          {FOOTER_LINKS.map((link) => (
            <li key={link.to}>
              <RouteLink
                to={link.to}
                navigate={navigate}
                aria-current={path === link.to ? 'page' : undefined}
              >
                {link.label}
              </RouteLink>
            </li>
          ))}
        </ul>
      </nav>
      <p className="footnote">FSKY — Flowing Sky</p>
    </footer>
  )
}

// FAQ answers are plain strings; an answer may name one phrase to turn into a
// link (e.g. 利用規約 -> /terms) without changing the FAQ markup or styling.
function renderFaqAnswer(item, navigate) {
  if (!item.link) return item.a
  const at = item.a.indexOf(item.link.text)
  if (at < 0) return item.a
  return (
    <>
      {item.a.slice(0, at)}
      <RouteLink to={item.link.to} navigate={navigate} className="faq-link">
        {item.link.text}
      </RouteLink>
      {item.a.slice(at + item.link.text.length)}
    </>
  )
}

function HomeSections({ navigate }) {
  return (
    <>
      {HERO_VARIANT === 'WINDOW' ? <WindowHero /> : <Hero />}

      <section
        id="about"
        className={
          HERO_VARIANT === 'SUITCASE' && TRANSITION_MODE === 'WAVE'
            ? 'story story--wave-offset'
            : 'story'
        }
      >
        <AboutIntro />
      </section>

      <section id="service" className="story story--muted">
        <div className="story-inner">
          <SectionMarker n="02" label="SERVICE" />
          <RevealDisplay lines={['TRAVEL', 'DESIGNED', 'FOR YOU.']} className="story-display story-display--md" />
          <div className="service-main">
            <p className="service-lead">
              <Phrased phrases={SERVICE_LEAD} />
            </p>
            <div className="service-included">
              <h3 className="service-included-title">
                <Phrased phrases={['旅行プラン作成に', '含まれるもの']} />
              </h3>
              <ol className="service-included-list">
                {SERVICE_INCLUDED.map((phrases, i) => (
                  <li key={phrases[0]}>
                    <span className="service-index">{String(i + 1).padStart(2, '0')}</span>
                    <span className="service-included-text">
                      <Phrased phrases={phrases} />
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="service-option">
            <div className="service-option-head">
              <span className="service-option-label">OPTION</span>
              <span className="service-option-line" aria-hidden="true" />
            </div>
            <ul className="service-option-list">
              {SERVICE_OPTIONS.map((option) => (
                <li key={option.title[0]}>
                  <span className="service-option-plus" aria-hidden="true">+</span>
                  <div>
                    <h4>
                      <Phrased phrases={option.title} />
                    </h4>
                    <p>
                      <Phrased phrases={option.description} />
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <HowItWorks />

      <section id="plans" className="story">
        <div className="story-inner">
          <SectionMarker n="04" label="PLAN" />
          <RevealDisplay lines={['YOUR JOURNEY,', 'YOUR WAY.']} className="story-display story-display--md" />
          <Pricing />
          <p className="story-copy story-copy--wide">
            FSKYで作成した旅行プランの一例です。行き先・日程・ご予算に合わせて、完全にカスタマイズいたします。
          </p>
        </div>
        <div className="plan-list">
          {plans.map((plan, i) => (
            <div className="plan-row" key={plan.title}>
              <span className="plan-index">{String(i + 1).padStart(2, '0')}</span>
              <div className="plan-row-body">
                <span className="plan-tag">{plan.tag}</span>
                <h3>{plan.title}</h3>
                <p>{plan.description}</p>
              </div>
              <div className="plan-row-footer">
                <div className="plan-price-block">
                  <span className="plan-price-label">旅行費用目安</span>
                  <span className="plan-price">{plan.price}</span>
                </div>
                <a className="plan-link" href={LINE_URL} target="_blank" rel="noreferrer">
                  相談する →
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="plan-note">
          ※価格は交通費・宿泊費などの旅行費用の目安です。実際の費用は、時期・出発地・宿泊先や交通手段のご希望によって変わります。FSKYの旅行プラン作成料金は別途となります。
        </p>
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
          <h2>
            <span className="phrase">OPEN記念</span> <span className="phrase">旅行プラン作成料金</span>{' '}
            <span className="phrase">10%OFF</span>
          </h2>
          <p className="section-desc">
            期間限定で、旅行プラン作成料金を10%OFFでご案内します。
          </p>
          <a className="cta cta--gold" href={LINE_URL} target="_blank" rel="noreferrer">
            LINEで10%OFFを問い合わせる
          </a>
          <p className="campaign-note">※予告なく終了する場合があります。詳細はLINEにてご確認ください。</p>
        </div>
      </section>

      <section id="reviews" className="story story--muted">
        <div className="story-inner">
          <SectionMarker n="05" label="REVIEW" />
          <h2 className="story-eyebrow-copy">ご利用いただいた方の声</h2>
        </div>
        <div className="review-list">
          {reviews.map((review) => (
            <div className="review-row" key={review.name}>
              <p className="review-quote">{review.quote}</p>
              <p className="review-attr">
                {review.name} <span>/ {review.meta}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="operator" className="story">
        <div className="story-inner">
          <SectionMarker n="06" label="PROFILE" />
          <div className="operator-row">
            <div className="operator-avatar">
              <img src={logo} alt="" />
            </div>
            <div className="operator-body">
              <h2>FSKY 代表</h2>
              <p>
                旅とガジェットが好きが高じて、オーダーメイド旅行と Osmo Pocket 3
                レンタルを始めました。お一人おひとりの「行きたい」を丁寧にお伺いします。
              </p>
              <p className="operator-message">「あなたの『行きたい』を、そのまま形にします。」</p>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="story story--muted">
        <div className="story-inner">
          <SectionMarker n="07" label="FAQ" />
          <h2 className="story-eyebrow-copy">よくある質問</h2>
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
              <p>{renderFaqAnswer(item, navigate)}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-inner">
          <RevealDisplay lines={['BEYOND THE SKY,']} as="p" className="display-reveal--line contact-kicker" />
          <h2 className="contact-title">あなたらしい旅を、ここから。</h2>
          <p className="section-desc">
            旅のプランやレンタルについて、まずはLINEでお気軽にお問い合わせください。
          </p>
          <a className="cta cta--line" href={LINE_URL} target="_blank" rel="noreferrer">
            <IconChat />
            公式LINEで相談する
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
                LINEは24時間メッセージを送信いただけます。返信は営業時間10:00〜20:00を基本に順次対応します。
              </p>
              <p className="hours-note">
                旅行中サポートをご利用の場合、営業時間外も可能な範囲で対応することがありますが、即時のご返信をお約束するものではありません。
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// Per-page <title> and meta description (the home page has no description tag).
const HOME_TITLE = 'FSKY'
const PAGE_META = {
  [TERMS_PATH]: {
    title: '利用規約 | FSKY',
    description: 'FSKYの旅行プラン作成サービスおよびOsmo Pocket 3レンタルの利用規約です。',
  },
  [PRIVACY_PATH]: {
    title: 'プライバシーポリシー | FSKY',
    description: 'FSKYにおける個人情報の取得・利用・管理についてのプライバシーポリシーです。',
  },
}

function App() {
  const [path, navigate] = usePath()
  const meta = PAGE_META[path]
  const isLegal = Boolean(meta)
  // The opening intro belongs to the home page's first load only.
  const [introEnabled] = useState(() => !PAGE_META[normalizePath(window.location.pathname)])

  useEffect(() => {
    document.title = meta ? meta.title : HOME_TITLE
    let tag = document.querySelector('meta[name="description"]')
    if (meta) {
      if (!tag) {
        tag = document.createElement('meta')
        tag.name = 'description'
        document.head.appendChild(tag)
      }
      tag.content = meta.description
    } else if (tag) {
      tag.remove()
    }
  }, [meta])

  const backLink = (
    <RouteLink to="/" navigate={navigate} className="terms-back">
      ← FSKY トップへ戻る
    </RouteLink>
  )

  return (
    <>
      {introEnabled && <Intro />}
      <SiteHeader isHome={!isLegal} navigate={navigate} />
      {path === TERMS_PATH && <TermsDocument backLink={backLink} />}
      {path === PRIVACY_PATH && (
        <PrivacyDocument backLink={backLink} lineUrl={LINE_URL} lineId={LINE_ID} />
      )}
      {!isLegal && <HomeSections navigate={navigate} />}
      <SiteFooter path={path} navigate={navigate} />
    </>
  )
}

export default App
