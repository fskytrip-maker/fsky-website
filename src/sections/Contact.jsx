import RevealText from '../components/RevealText'
import Section, { SectionHead } from '../components/Section'
import { contact } from '../data/site'
import './Contact.css'

// No contact details exist yet. Until `contact.email` is set the CTA renders as
// a clearly inactive placeholder instead of a dead or invented link.
export default function Contact() {
  const { email, socials, socialPlaceholders } = contact

  return (
    <Section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="container">
        <SectionHead index={contact.index} label={contact.label} />

        <h2 id="contact-title" className="contact__title display">
          <RevealText text={contact.title} />
        </h2>

        <div className="contact__grid">
          <p className="contact__lead" data-reveal="fade">
            {contact.lead}
          </p>

          <div className="contact__cta" data-reveal="fade">
            {email ? (
              <a className="button" href={`mailto:${email}`}>
                Start a project <span className="button__arrow">→</span>
              </a>
            ) : (
              <span className="button is-placeholder" role="note">
                Contact form / email — to be added
              </span>
            )}
          </div>

          <dl className="contact__details">
            <div data-reveal="fade">
              <dt className="label muted">Email</dt>
              <dd className={email ? undefined : 'is-placeholder'}>
                {email ? <a href={`mailto:${email}`}>{email}</a> : 'To be added'}
              </dd>
            </div>
            <div data-reveal="fade">
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
      </div>
    </Section>
  )
}
