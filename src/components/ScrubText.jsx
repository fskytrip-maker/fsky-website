import { createElement } from 'react'

/**
 * Statement whose words brighten one after another as the section scrolls
 * through the viewport (data-scrub="words"). Japanese has no spaces between
 * words, so text without spaces brightens character by character instead.
 * Static and fully legible when motion is off.
 */
export default function ScrubText({ as = 'p', text, className }) {
  // `*…*` marks an accent-coloured stretch (asterisks not shown); "\n" is a
  // line break (rendered as <br class="sw-br">, which CSS may hide on phones).
  const plain = text.replaceAll('*', '').replaceAll('\n', '')
  const spaced = plain.includes(' ')
  const units = []
  text.split('*').forEach((part, k) => {
    const accent = k % 2 === 1
    part.split('\n').forEach((line, j) => {
      if (j > 0) units.push({ br: true })
      const pieces = spaced ? line.split(' ').filter(Boolean) : Array.from(line)
      pieces.forEach((piece) => units.push({ piece, accent }))
    })
  })
  return createElement(
    as,
    { className, 'data-scrub': 'words' },
    <span className="sr-only">{plain}</span>,
    <span aria-hidden="true">
      {units.map(({ piece, accent, br }, i) =>
        br ? (
          <br key={i} className="sw-br" />
        ) : (
          <span key={i}>
            <span className={accent ? 'sw is-accent' : 'sw'}>{piece}</span>
            {spaced && i < units.length - 1 && !units[i + 1].br ? ' ' : null}
          </span>
        ),
      )}
    </span>,
  )
}
