import { createElement } from 'react'

/**
 * Headline whose words rise out of a mask when scrolled into view.
 * `text` may contain '\n' to force line breaks. The visual copy is split into
 * aria-hidden spans and the real text is exposed once via .sr-only, so screen
 * readers read a normal heading.
 *
 * Animated by initMotion() via data-reveal="text"; `delay` (seconds) is
 * optional and useful for above-the-fold text. `label` (optional) replaces
 * what screen readers and search engines read, when it should say more than
 * the visible words.
 */
export default function RevealText({ as = 'span', text, className, delay, label }) {
  const lines = text.split('\n')
  return createElement(
    as,
    { className, 'data-reveal': 'text', 'data-delay': delay },
    <span className="sr-only">{label ?? lines.join(' ')}</span>,
    <span aria-hidden="true">
      {lines.map((line, i) => (
        <span className="rt-line" key={i}>
          {line.split(' ').map((word, j, arr) => (
            <span key={j}>
              <span className="rt-word">
                <span className="rt-inner">{word}</span>
              </span>
              {j < arr.length - 1 ? ' ' : null}
            </span>
          ))}
        </span>
      ))}
    </span>,
  )
}
