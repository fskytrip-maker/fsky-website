import './Terms.css'
import { Block } from './Terms.jsx'
import {
  PRIVACY,
  PRIVACY_TITLE,
  PRIVACY_INTRO,
  PRIVACY_DATES,
  PRIVACY_GROUPS,
} from './privacy.js'

// プライバシーポリシー: same reading column / list markup / TOC pattern as the
// Terms page (Terms.css). Only the body (<main>) - the site header and footer
// come from App. `lineUrl` / `lineId` are the site's existing LINE constants;
// no e-mail address is shown because none has been set up.
export function PrivacyDocument({ backLink, lineUrl, lineId }) {
  return (
    <main className="terms" id="main">
      <article className="terms-doc" aria-labelledby="privacy-title">
        <header className="terms-head">
          <p className="terms-eyebrow">PRIVACY POLICY</p>
          <h1 className="terms-title" id="privacy-title">
            {PRIVACY_TITLE}
          </h1>
          {backLink}
        </header>

        <section className="terms-intro" aria-label="はじめに">
          {PRIVACY_INTRO.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </section>

        <nav className="terms-toc" aria-labelledby="privacy-toc-title">
          <h2 className="terms-toc-title" id="privacy-toc-title">
            目次
          </h2>
          <ul>
            {PRIVACY_GROUPS.map((group) => (
              <li key={group.href}>
                <a href={group.href}>
                  <span className="terms-toc-label">{group.label}</span>
                  <span className="terms-toc-range">{group.range}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {PRIVACY.map((entry) =>
          entry.part ? (
            <h2 className="terms-part" id={entry.id} key={entry.part}>
              {entry.part}
            </h2>
          ) : (
            <section
              className="terms-article"
              id={`privacy-${entry.no}`}
              key={entry.no}
              aria-labelledby={`privacy-${entry.no}-title`}
            >
              <h2 className="terms-article-title" id={`privacy-${entry.no}-title`}>
                <span className="terms-no">{entry.no}.</span>
                {entry.title}
              </h2>
              {entry.blocks.map((block, i) =>
                block.contact ? (
                  <ul className="terms-bullets" key={i}>
                    <li>
                      FSKY公式LINE（
                      <a className="terms-link" href={lineUrl} target="_blank" rel="noreferrer">
                        LINE ID：{lineId}
                      </a>
                      ）
                    </li>
                  </ul>
                ) : (
                  <Block block={block} key={i} />
                ),
              )}
            </section>
          ),
        )}

        <section className="terms-article terms-dates" aria-labelledby="privacy-dates-title">
          <h2 className="terms-article-title" id="privacy-dates-title">
            制定日・最終改定日
          </h2>
          <p>制定日：{PRIVACY_DATES.enacted}</p>
          <p>最終改定日：{PRIVACY_DATES.revised}</p>
        </section>
      </article>
    </main>
  )
}
