/**
 * Base wrapper for every page section.
 *   theme       'dark' (default) | 'light'  — swaps the semantic colour tokens
 *   panelIn     desktop-only: the section background widens into place as it
 *               enters (a light panel sliding out of the dark page)
 *
 * The background is a separate layer (.section__bg) so it can animate without
 * touching the content.
 */
export default function Section({
  id,
  theme = 'dark',
  panelIn = false,
  className = '',
  children,
  ...rest
}) {
  return (
    <section
      id={id}
      className={`section ${className}`.trim()}
      data-theme={theme === 'light' ? 'light' : undefined}
      data-section-in={panelIn ? '' : undefined}
      {...rest}
    >
      <span className="section__bg" aria-hidden="true" />
      {children}
    </section>
  )
}

/** "(01)  Label ————" row that opens each section. */
export function SectionHead({ index, label }) {
  return (
    <div className="section-head">
      <span className="label muted">({index})</span>
      <span className="label">{label}</span>
      <span className="hairline" data-reveal="line" />
    </div>
  )
}
