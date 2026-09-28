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
          About FSKY
        </h2>

        <ScrubText className="about__statement display" text={about.statement} />

        <div className="about__body">
          {about.body.map((paragraph, i) => (
            <p key={i} data-reveal="fade">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </Section>
  )
}
