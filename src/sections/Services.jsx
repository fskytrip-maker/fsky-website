import RevealText from '../components/RevealText'
import Section, { SectionHead } from '../components/Section'
import { activeServices } from '../data/services'
import { services } from '../data/site'
import './Services.css'

export default function Services() {
  return (
    <Section id="services" className="services" aria-labelledby="services-title">
      <div className="container">
        <SectionHead index={services.index} label={services.label} />

        <div className="services__head">
          <h2 id="services-title" className="services__title display">
            <RevealText text={services.title} />
          </h2>
          <p className="services__note label muted" data-reveal="fade">
            {services.note}
          </p>
        </div>

        <ul className="services__list">
          {activeServices.map((service, i) => (
            <li className="service" key={service.id} data-reveal="fade">
              <span className="service__no label muted">0{i + 1}</span>
              <h3 className="service__title display">{service.title}</h3>
              <div className="service__detail">
                <p>{service.description}</p>
                <ul className="service__items label">
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
