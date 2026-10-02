import lineIcon from '../assets/line-icon.png'
import Arrow from '../components/Arrow'
import ContactForm from '../components/ContactForm'
import RevealText from '../components/RevealText'
import Section, { SectionHead } from '../components/Section'
import { contact } from '../data/site'
import './Contact.css'

// Phone and LINE, each as a heading block with one big button, plus the
// inquiry form. Social links stay a visible placeholder until real accounts
// are set in src/data/site.js.
export default function Contact() {
  const { phone, line, socials, socialPlaceholders } = contact

  return (
    <Section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="container">
        <SectionHead index={contact.index} label={contact.label} />

        <div className="contact__grid">
          <h2 id="contact-title" className="contact__title display">
            <RevealText text={contact.title} />
          </h2>

          <p className="contact__lead" data-reveal="fade">
            {contact.lead}
          </p>

          <div className="contact__channels">
            <div className="contact__channel" data-reveal="fade">
              <h3 className="contact__channel-title display">{phone.heading}</h3>
              <p className="contact__channel-sub">{phone.sub}</p>
              <a className="contact-btn" href={phone.href}>
                <svg className="contact-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z"
                  />
                </svg>
                <span className="contact-btn__label">{phone.label}</span>
              </a>
            </div>

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

            <dl className="contact__details" data-reveal="fade">
              <div>
                <dt className="label muted">Social</dt>
                <dd className={socials.length ? undefined : 'is-placeholder'}>
                  {socials.length ? (
                    <ul className="contact__socials">
                      {socials.map((s) => (
                        <li key={s.label}>
                          <a href={s.href} target="_blank" rel="noreferrer noopener">
                            {s.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    `${socialPlaceholders.join(' / ')} — to be added`
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className="contact__form" data-reveal="fade">
            <ContactForm />
          </div>
        </div>
      </div>
    </Section>
  )
}
