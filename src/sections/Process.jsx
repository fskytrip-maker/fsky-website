import RevealText from '../components/RevealText'
import Section, { SectionHead } from '../components/Section'
import { steps } from '../data/process'
import { process as copy } from '../data/site'
import './Process.css'

export default function Process() {
  return (
    <Section id="process" className="process" aria-labelledby="process-title">
      <div className="container">
        <SectionHead index={copy.index} label={copy.label} />

        <div className="process__layout">
          <div className="process__intro">
            <h2 id="process-title" className="process__title display">
              <RevealText text={copy.title} />
            </h2>
            <p className="process__lead muted" data-reveal="fade">
              {copy.lead}
            </p>
          </div>

          <div className="process__steps">
            <span className="process__rail" aria-hidden="true">
              <span className="process__rail-fill" data-progress />
            </span>
            <ol>
              {steps.map((step, i) => (
                <li className="step" key={step.title} data-reveal="fade">
                  <span className="step__no label muted">0{i + 1}</span>
                  <h3 className="step__title display">{step.title}</h3>
                  <p className="step__desc muted">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </Section>
  )
}
