// "Ask about this service": jump to the contact form with the service chosen.
// Services calls inquire(); the form (sections/Contact) listens for the event.
import { scrollToId } from './lenis'

export const INQUIRE_EVENT = 'fsky:inquire'
export const FORM_ID = 'contact-form'

export function inquire(serviceId) {
  window.dispatchEvent(new CustomEvent(INQUIRE_EVENT, { detail: { service: serviceId } }))
  window.history.replaceState(null, '', `#${FORM_ID}`)
  // Stop just below the fixed header.
  const header = document.querySelector('.header')?.offsetHeight ?? 0
  scrollToId(FORM_ID, { offset: -(header + 24) })
}
