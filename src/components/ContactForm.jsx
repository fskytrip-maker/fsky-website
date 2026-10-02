import { useEffect, useId, useRef, useState } from 'react'
import { activeServices } from '../data/services'
import { contact } from '../data/site'
import { FORM_ID, INQUIRE_EVENT } from '../motion/inquire'
import Arrow from './Arrow'
import './ContactForm.css'

/**
 * Inquiry form. Sends to the Formspree form set in data/site.js
 * (contact.form.endpoint), which emails the inquiry to the studio. Until an endpoint is set, it says so instead of
 * pretending to send.
 *
 * Choosing a service in the Services section (motion/inquire.js) preselects
 * it here.
 */
// The email shows the service's Japanese name, not its internal id.
function toPayload(formEl) {
  const data = new FormData(formEl)
  const id = data.get('service')
  const service = activeServices.find((s) => s.id === id)
  data.set('service', service ? service.titleJa : 'その他')
  return data
}

export default function ContactForm() {
  const { form } = contact
  const uid = useId()
  const nameRef = useRef(null)
  const [service, setService] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | done | error | unavailable

  useEffect(() => {
    const onInquire = (event) => {
      setService(event.detail.service)
      // Focus the first field once the smooth scroll has arrived.
      window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 1400)
    }
    window.addEventListener(INQUIRE_EVENT, onInquire)
    return () => window.removeEventListener(INQUIRE_EVENT, onInquire)
  }, [])

  const onSubmit = async (event) => {
    event.preventDefault()
    const formEl = event.currentTarget
    if (!form.endpoint) {
      setStatus('unavailable')
      return
    }
    setStatus('sending')
    try {
      const response = await fetch(form.endpoint, {
        method: 'POST',
        body: toPayload(formEl),
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) throw new Error(String(response.status))
      setStatus('done')
      formEl.reset()
      setService('')
    } catch {
      setStatus('error')
    }
  }

  const id = (name) => `${uid}-${name}`
  const required = <span className="cform__req" aria-hidden="true">*</span>

  return (
    <div className="cform" id={FORM_ID}>
      <h3 className="cform__title display">{form.heading}</h3>
      <p className="cform__sub">{form.sub}</p>

      {status === 'done' ? (
        <p className="cform__message is-done" role="status">
          {form.messages.done}
        </p>
      ) : (
        <form className="cform__form" onSubmit={onSubmit} noValidate={false}>
          <div className="cform__field">
            <label htmlFor={id('service')}>ご相談内容{required}</label>
            <select
              id={id('service')}
              name="service"
              required
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              <option value="" disabled>
                選択してください
              </option>
              {activeServices.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.titleJa}
                </option>
              ))}
              <option value="other">その他</option>
            </select>
          </div>

          <div className="cform__field">
            <label htmlFor={id('name')}>お名前{required}</label>
            <input
              ref={nameRef}
              id={id('name')}
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="山田 太郎"
            />
          </div>

          <div className="cform__field">
            <label htmlFor={id('email')}>メールアドレス{required}</label>
            <input
              id={id('email')}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              placeholder="example@mail.com"
            />
          </div>

          <div className="cform__field">
            <label htmlFor={id('tel')}>電話番号</label>
            <input
              id={id('tel')}
              name="tel"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="090-1234-5678"
            />
          </div>

          <div className="cform__field">
            <label htmlFor={id('message')}>お問い合わせ内容{required}</label>
            <textarea
              id={id('message')}
              name="message"
              rows={6}
              required
              placeholder="ご依頼の内容、ご予算やご希望の時期など、お気軽にご記入ください。"
            />
          </div>

          {/* Formspree: subject line of the email it sends you. (Replying to
              that email goes to the address in the "email" field.) */}
          <input type="hidden" name="_subject" value={form.subject} />

          {/* Spam trap: invisible to people, filled in by bots. */}
          <input className="cform__trap" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />

          {status === 'unavailable' && (
            <p className="cform__message" role="alert">
              {form.messages.unavailable}
            </p>
          )}
          {status === 'error' && (
            <p className="cform__message" role="alert">
              {form.messages.error}
            </p>
          )}

          <p className="cform__privacy">
            {form.privacyNote.split('プライバシーポリシー')[0]}
            <a href={form.privacyHref} target="_blank" rel="noopener">
              プライバシーポリシー
            </a>
            {form.privacyNote.split('プライバシーポリシー')[1]}
          </p>

          <button className="cform__submit arrow-host" type="submit" disabled={status === 'sending'}>
            <span>{status === 'sending' ? form.sending : form.submit}</span>
            <span className="cform__submit-icon" aria-hidden="true">
              <Arrow />
            </span>
          </button>
        </form>
      )}
    </div>
  )
}
