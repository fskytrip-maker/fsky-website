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

function App() {
  return (
    <>
      <section id="hero">
        <p className="eyebrow">FSKY</p>
        <h1>流れる空に乗って、あなただけの旅へ。</h1>
        <p className="subtitle">
          オーダーメイドの旅行プランニングと Osmo Pocket 3
          のレンタルで、自由な旅をお手伝いします。
        </p>
        <a className="cta" href="#contact">
          お問い合わせ
        </a>
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
