import Media from '../components/Media'
import RevealText from '../components/RevealText'
import Section, { SectionHead } from '../components/Section'
import { profile as copy } from '../data/site'
import './Profile.css'

// Placeholder-only: no personal details are invented. Fill `profile` in
// src/data/site.js (name, bio, photo) and the placeholders disappear.
export default function Profile() {
  return (
    <Section id="profile" className="profile" aria-labelledby="profile-title">
      <div className="container">
        <SectionHead index={copy.index} label={copy.label} />

        <div className="profile__layout">
          <Media
            className="profile__photo"
            image={copy.photo}
            ratio="4 / 5"
            label="Portrait placeholder"
            parallax
          />

          <div className="profile__text">
            <h2 id="profile-title" className="profile__title display">
              <RevealText text={copy.title} />
            </h2>

            <dl className="profile__list">
              <div data-reveal="fade">
                <dt className="label muted">Role</dt>
                <dd>{copy.role}</dd>
              </div>
              <div data-reveal="fade">
                <dt className="label muted">Name</dt>
                <dd className={copy.name ? undefined : 'is-placeholder'}>
                  {copy.name ?? 'Name — to be added'}
                </dd>
              </div>
              <div data-reveal="fade">
                <dt className="label muted">Bio</dt>
                <dd className={copy.bio ? undefined : 'is-placeholder'}>
                  {copy.bio ?? 'Profile text — to be added'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </Section>
  )
}
