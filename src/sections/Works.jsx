import Media from '../components/Media'
import RevealText from '../components/RevealText'
import Section, { SectionHead } from '../components/Section'
import { works as copy } from '../data/site'
import { works } from '../data/works'
import './Works.css'

// Position in the editorial grid cycles every four projects (see Works.css).
const POSITIONS = ['a', 'b', 'c', 'd']
const RATIOS = ['4 / 3', '4 / 5', '4 / 5', '4 / 3']

function Project({ project, position }) {
  const { title, client, category, year, description, href, status, cover } = project
  const isConcept = status === 'concept'

  const body = (
    <>
      <Media
        className="work__media"
        image={cover}
        ratio={RATIOS[position]}
        label={isConcept ? 'Concept project' : title}
        parallax
      />
      <div className="work__info">
        <div className="work__row">
          <h3 className="work__title display">{title}</h3>
          {isConcept && <span className="work__tag label">Concept Project</span>}
        </div>
        <dl className="work__meta label muted">
          <div>
            <dt className="sr-only">Category</dt>
            <dd>{category}</dd>
          </div>
          <div>
            <dt className="sr-only">Client</dt>
            <dd>{client ?? '—'}</dd>
          </div>
          <div>
            <dt className="sr-only">Year</dt>
            <dd>{year ?? '—'}</dd>
          </div>
        </dl>
        <p className="work__desc">{description}</p>
      </div>
    </>
  )

  return (
    <article className={`work work--${POSITIONS[position]}`} data-reveal="fade">
      {href ? (
        <a className="work__link" href={href} target="_blank" rel="noreferrer noopener">
          {body}
        </a>
      ) : (
        <div className="work__link">{body}</div>
      )}
    </article>
  )
}

export default function Works() {
  return (
    <Section id="works" theme="light" panelIn className="works" aria-labelledby="works-title">
      <div className="container">
        <SectionHead index={copy.index} label={copy.label} />

        <div className="works__head">
          <h2 id="works-title" className="works__title display">
            <RevealText text={copy.title} />
          </h2>
          <p className="works__note label muted" data-reveal="fade">
            {copy.note}
          </p>
        </div>

        <div className="works__grid">
          {works.map((project, i) => (
            <Project key={project.id} project={project} position={i % POSITIONS.length} />
          ))}
        </div>
      </div>
    </Section>
  )
}
