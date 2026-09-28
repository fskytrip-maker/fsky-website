import './Media.css'

/**
 * Image frame used by hero, works and profile.
 *   image        { src, alt, width, height, srcSet?, sizes? } | null
 *                null renders a clearly-labelled placeholder (no fake imagery)
 *   ratio        CSS aspect-ratio, e.g. '4 / 5'
 *   label        text shown on the placeholder
 *   parallax     enable the desktop parallax layer
 *   priority     above-the-fold image: skip lazy loading
 *
 * Always pass real width/height (or a ratio) so images never shift layout.
 */
export default function Media({
  image,
  ratio = '4 / 3',
  label = 'Placeholder',
  parallax = false,
  priority = false,
  delay,
  className = '',
}) {
  return (
    <figure
      className={`media ${className}`.trim()}
      style={{ aspectRatio: ratio }}
      data-reveal="image"
      data-parallax={parallax ? '' : undefined}
      data-delay={delay}
    >
      <div className="media__parallax">
        <div className="media__inner">
          {image ? (
            <img
              src={image.src}
              srcSet={image.srcSet}
              sizes={image.sizes}
              width={image.width}
              height={image.height}
              alt={image.alt ?? ''}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
            />
          ) : (
            <div className="media__placeholder" role="img" aria-label={label}>
              <span className="label">{label}</span>
            </div>
          )}
        </div>
      </div>
    </figure>
  )
}
