import Arrow from '../components/Arrow'
import MotionTitle from '../components/MotionTitle'
import Section, { SectionHead } from '../components/Section'
import ServiceOrb from '../components/ServiceOrb'
import { activeServices } from '../data/services'
import { services } from '../data/site'
import { inquire } from '../motion/inquire'
import './Services.css'

// Each service row is a link to the contact form, with that service already
// chosen in it.
export default function Services() {
  return (
    <Section id="services" className="services" aria-labelledby="services-title">
      <div className="container">
        <SectionHead index={services.index} label={services.label} />

        <div className="services__head">
          <div>
            <h2 id="services-title" className="services__title display">
              <MotionTitle text={services.title} />
            </h2>
            <p className="services__title-ja" data-reveal="fade">
              {services.titleJa}
            </p>
          </div>
          <p className="services__note label muted" data-reveal="fade">
            {services.note}
          </p>
        </div>

        <ul className="services__list">
          {activeServices.map((service, i) => (
            <li className="service arrow-host" key={service.id} data-reveal="fade">
              {/* The whole row is the link: a transparent anchor laid over it. */}
              <a
                className="service__toggle"
                href="#contact-form"
                onClick={(event) => {
                  event.preventDefault()
                  inquire(service.id)
                }}
              >
                <span className="sr-only">
                  {service.title} — {services.inquire}
                </span>
              </a>
              <span className="service__no label muted">0{i + 1}</span>
              <h3 className="service__title display">
                {service.title}
                {service.titleJa && <span className="service__title-ja">{service.titleJa}</span>}
              </h3>
              <div className="service__detail">
                <p>{service.description}</p>
                <ul className="service__items label">
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <span className="service__more" aria-hidden="true">
                  {services.inquire}
                  <Arrow />
                </span>
              </div>
              <ServiceOrb />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
