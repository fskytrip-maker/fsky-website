import fskyMark from '../assets/fsky-mark.png'
import { privacy } from '../data/privacy'
import { site } from '../data/site'
import './PrivacyPage.css'

/** Standalone privacy policy page (/privacy/). No motion: plain and readable. */
export default function PrivacyPage() {
  return (
    <div className="pp">
      <header className="pp__header">
        <a className="pp__logo" href="/" aria-label={`${site.name} トップページへ`}>
          <img src={fskyMark} alt="" width={1206} height={642} />
        </a>
        <a className="pp__back" href="/">
          トップページへ戻る
        </a>
      </header>

      <main className="pp__main">
        <p className="pp__en label">{privacy.titleEn}</p>
        <h1 className="pp__title display">{privacy.title}</h1>
        <p className="pp__updated label muted">制定日：{privacy.updated}</p>

        <p className="pp__intro">{privacy.intro}</p>

        <ol className="pp__sections">
          {privacy.sections.map((section, i) => (
            <li className="pp__section" key={section.title}>
              <h2 className="pp__heading">
                <span className="pp__no">{String(i + 1).padStart(2, '0')}</span>
                {section.title}
              </h2>
              {section.body.map((block, j) =>
                typeof block === 'string' ? (
                  <p key={j}>{block}</p>
                ) : (
                  <ul key={j} className="pp__list">
                    {block.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ),
              )}
            </li>
          ))}
        </ol>
      </main>

      <footer className="pp__footer label muted">
        © {new Date().getFullYear()} {site.name}
      </footer>
    </div>
  )
}
