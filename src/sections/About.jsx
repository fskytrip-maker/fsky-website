import ScrubText from '../components/ScrubText'
import Section, { SectionHead } from '../components/Section'
import { about } from '../data/site'
import './About.css'

export default function About() {
  return (
    <Section id="about" className="about" aria-labelledby="about-title">
      <div className="container">
        <SectionHead index={about.index} label={about.label} />
        <h2 id="about-title" className="sr-only">
          FSKYについて
        </h2>

        <ScrubText className="about__statement display" text={about.statement} />
        <p className="about__statement-en" lang="en" data-reveal="fade">
          {about.statementEn}
        </p>

        <div className="about__body">
          {about.body.map((block, i) => (
            <p
              key={i}
              className={block.big ? `about__line about__line--big is-${block.tone}` : 'about__line'}
              data-reveal="fade"
            >
              {block.text.split('\n').map((line, j) => (
                <span key={j}>
                  {j > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </Section>
  )
}
