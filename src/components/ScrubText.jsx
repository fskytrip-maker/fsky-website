import { createElement } from 'react'

/**
 * Statement whose words brighten one after another as the section scrolls
 * through the viewport (data-scrub="words"). Static and fully legible when
 * motion is off.
 */
export default function ScrubText({ as = 'p', text, className }) {
  const words = text.split(' ')
  return createElement(
    as,
    { className, 'data-scrub': 'words' },
    <span className="sr-only">{text}</span>,
    <span aria-hidden="true">
      {words.map((word, i) => (
        <span key={i}>
          <span className="sw">{word}</span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>,
  )
}
