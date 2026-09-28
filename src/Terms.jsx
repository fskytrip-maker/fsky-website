import './Terms.css'
import { TERMS, TERMS_TITLE, TERMS_DATES, TERMS_GROUPS } from './terms.js'

// Nested list: "(1) (2) (3)" or bullets, inside a numbered item.
function SubList({ sub }) {
  if (sub.paren) {
    return (
      <ol className="terms-sub">
        {sub.paren.map((text, i) => (
          <li key={text}>
            <span className="terms-num" aria-hidden="true">
              ({i + 1})
            </span>
            <span>{text}</span>
          </li>
        ))}
      </ol>
    )
  }
  return <BulletList items={sub.ul} nested />
}

function BulletList({ items, nested = false }) {
  return (
    <ul className={nested ? 'terms-bullets terms-bullets--nested' : 'terms-bullets'}>
      {items.map((text) => (
        <li key={text}>{text}</li>
      ))}
    </ul>
  )
}

// Numbers are real text (aria-hidden: the <ol> already announces position), so
// they survive copy/paste of a clause and stay aligned with a hanging indent.
function NumberedList({ items }) {
  return (
    <ol className="terms-list">
      {items.map((item, i) => {
        const text = typeof item === 'string' ? item : item.text
        return (
          <li key={text}>
            <span className="terms-num" aria-hidden="true">
              {i + 1}.
            </span>
            <div className="terms-li">
              <p>{text}</p>
              {typeof item !== 'string' && item.sub && <SubList sub={item.sub} />}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

// Also used by the Privacy page (same reading-column styles and list markup).
export function Block({ block }) {
  if (typeof block === 'string') return <p>{block}</p>
  if (block.ol) return <NumberedList items={block.ol} />
  if (block.ul) return <BulletList items={block.ul} />
  return null
}

// The document body only (<main>). The site header/footer are supplied by App
// so the page shares them with the rest of the site.
export function TermsDocument({ backLink }) {
  return (
    <main className="terms" id="main">
      <article className="terms-doc" aria-labelledby="terms-title">
        <header className="terms-head">
          <p className="terms-eyebrow">TERMS OF SERVICE</p>
          <h1 className="terms-title" id="terms-title">
            {TERMS_TITLE}
          </h1>
          {backLink}
        </header>

        <nav className="terms-toc" aria-labelledby="terms-toc-title">
          <h2 className="terms-toc-title" id="terms-toc-title">
            目次
          </h2>
          <ul>
            {TERMS_GROUPS.map((group) => (
              <li key={group.href}>
                <a href={group.href}>
                  <span className="terms-toc-label">{group.label}</span>
                  <span className="terms-toc-range">{group.range}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {TERMS.map((entry) =>
          entry.part ? (
            <h2 className="terms-part" id={entry.id} key={entry.part}>
              {entry.part}
            </h2>
          ) : (
            <section
              className="terms-article"
              id={`article-${entry.no}`}
              key={entry.no}
              aria-labelledby={`article-${entry.no}-title`}
            >
              <h2 className="terms-article-title" id={`article-${entry.no}-title`}>
                <span className="terms-no">第{entry.no}条</span>（{entry.title}）
              </h2>
              {entry.blocks.map((block, i) => (
                <Block block={block} key={i} />
              ))}
            </section>
          ),
        )}

        <section className="terms-article terms-dates" aria-labelledby="terms-dates-title">
          <h2 className="terms-article-title" id="terms-dates-title">
            制定日・改定日
          </h2>
          <p>制定日：{TERMS_DATES.enacted}</p>
          <p>最終改定日：{TERMS_DATES.revised}</p>
        </section>
      </article>
    </main>
  )
}
