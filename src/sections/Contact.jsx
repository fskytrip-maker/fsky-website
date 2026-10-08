import lineIcon from '../assets/line-icon.png'
import Arrow from '../components/Arrow'
import ContactForm from '../components/ContactForm'
import Section, { SectionHead } from '../components/Section'
import WriteTitle from '../components/WriteTitle'
import { contact } from '../data/site'
import './Contact.css'

// LINE and SNS, each as a heading block with its buttons, plus the inquiry
// form. Accounts and links live in src/data/site.js.
export default function Contact() {
  const { social, line, socials } = contact

  return (
    <Section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="container">
        <SectionHead index={contact.index} label={contact.label} />

        <div className="contact__grid">
          <h2 id="contact-title" className="contact__title display">
            <WriteTitle text={contact.title} />
          </h2>

          <p className="contact__lead" data-reveal="fade">
            {contact.lead}
          </p>

          <div className="contact__channels">
            <div className="contact__channel" data-reveal="fade">
              <h3 className="contact__channel-title display">{line.heading}</h3>
              <p className="contact__channel-sub">{line.sub}</p>
              <a
                className="contact-btn contact-btn--line arrow-host"
                href={line.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                {/* Official LINE icon (supplied artwork, used as-is). */}
                <img
                  className="contact-btn__icon contact-btn__icon--line"
                  src={lineIcon}
                  alt=""
                  width={114}
                  height={112}
                  loading="lazy"
                  decoding="async"
                />
                <span className="contact-btn__label">{line.label}</span>
                <Arrow className="contact-btn__arrow" />
              </a>
            </div>

            <div className="contact__channel" data-reveal="fade">
              <h3 className="contact__channel-title display">{social.heading}</h3>
              <p className="contact__channel-sub">{social.sub}</p>
              <ul className="contact-sns">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      className="contact-btn contact-btn--sns arrow-host"
                      href={s.href}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <span className="contact-btn__label">{s.label}</span>
                      <Arrow className="contact-btn__arrow" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="contact__form" data-reveal="fade">
            <ContactForm />
          </div>
        </div>
      </div>
    </Section>
  )
}
