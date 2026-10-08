// The motion system. One function wires every scroll-driven effect by reading
// data-attributes (see src/styles/motion.css for the vocabulary), so sections
// stay declarative and can be redesigned without touching animation code.
//
// Everything runs inside gsap.matchMedia(): effects are created per breakpoint
// and reverted automatically when the breakpoint changes or on cleanup.
import { gsap, ScrollTrigger } from './gsap'

const q = (root, sel) => gsap.utils.toArray(sel, root)

export function initMotion(root) {
  const mm = gsap.matchMedia()

  mm.add(
    {
      // Hover-capable large screens get the richer effects; everything else
      // (phones, tablets) gets the simpler set.
      desktop: '(min-width: 1024px) and (hover: hover) and (pointer: fine)',
      // gsap.matchMedia only runs the callback when at least one condition
      // matches, so this always-true one makes the base effects run everywhere.
      all: 'all',
    },
    (context) => {
      const { desktop } = context.conditions

      // -- Hero intro: the background fades up and the copy plays in step by
      // step (the title itself is a data-reveal="text" below). The glass
      // mark itself stays still. -------------------------------------------
      q(root, '[data-hero-bg]').forEach((el) => {
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1.6, ease: 'power2.out' })
      })
      // Copy that starts below the first screen (some phone layouts) plays
      // in when scrolled to, without the load-time delay.
      const later = (el) => el.getBoundingClientRect().top > window.innerHeight
      const onView = (el) => ({ trigger: el, start: 'top bottom', once: true })
      q(root, '[data-hero-step]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: later(el) ? 0.1 : Number(el.dataset.heroStep),
            ease: 'power3.out',
            scrollTrigger: onView(el),
          },
        )
      })
      q(root, '[data-hero-chars]').forEach((el) => {
        gsap.fromTo(
          el.querySelectorAll('.hero__char'),
          { opacity: 0, yPercent: 35, filter: 'blur(8px)' },
          {
            opacity: 1,
            yPercent: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            stagger: 0.045,
            delay: later(el) ? 0.1 : Number(el.dataset.delay || 0),
            ease: 'power3.out',
            scrollTrigger: onView(el),
          },
        )
      })

      // -- Masked text: words rise out of their line mask ---------------------
      q(root, '[data-reveal="text"]').forEach((el) => {
        const words = el.querySelectorAll('.rt-inner')
        gsap.fromTo(
          words,
          // y:0 is explicit on purpose: the pre-animation CSS state is a
          // translateY(%), which GSAP would otherwise read back as leftover px.
          { yPercent: 112, y: 0 },
          {
            yPercent: 0,
            y: 0,
            duration: desktop ? 1.15 : 0.9,
            ease: 'power4.out',
            stagger: desktop ? 0.055 : 0.04,
            delay: Number(el.dataset.delay || 0),
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          },
        )
      })

      // -- Fades: batched so elements entering together cascade ---------------
      // (from-left / from-right slide in sideways instead of rising)
      const fades = q(
        root,
        '[data-reveal="fade"], [data-reveal="from-left"], [data-reveal="from-right"]',
      )
      if (fades.length) {
        ScrollTrigger.batch(fades, {
          start: 'top 96%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.9,
              ease: 'power3.out',
              stagger: 0.09,
              overwrite: true,
            }),
        })
      }

      // -- Hairlines draw in ---------------------------------------------------
      q(root, '[data-reveal="line"]').forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.4,
            ease: 'power3.inOut',
            delay: Number(el.dataset.delay || 0),
            scrollTrigger: { trigger: el, start: 'top 96%', once: true },
          },
        )
      })

      // -- Images: wipe open while the picture settles from a slight zoom -----
      q(root, '[data-reveal="image"]').forEach((el) => {
        const inner = el.querySelector('.media__inner')
        const scrollTrigger = { trigger: el, start: 'top 88%', once: true }
        const delay = Number(el.dataset.delay || 0)
        gsap.fromTo(
          el,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.3,
            ease: 'power4.inOut',
            delay,
            scrollTrigger,
          },
        )
        if (inner) {
          gsap.fromTo(
            inner,
            { scale: 1.18 },
            { scale: 1, duration: 1.8, ease: 'power3.out', delay, scrollTrigger },
          )
        }
      })

      // -- Statement text brightens word by word as you scroll ----------------
      q(root, '[data-scrub="words"]').forEach((el) => {
        gsap.fromTo(
          el.querySelectorAll('.sw'),
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
              end: 'bottom 48%',
              scrub: true,
            },
          },
        )
      })

      // -- Big type sliding sideways (cheap: one transform per track) ---------
      q(root, '[data-marquee]').forEach((el) => {
        const track = el.querySelector('.marquee__track')
        if (!track) return
        const dir = el.dataset.marquee === 'reverse' ? -1 : 1
        const shift = desktop ? 22 : 14 // % of the (2-copy) track
        gsap.fromTo(
          track,
          { xPercent: dir > 0 ? 0 : -shift },
          {
            xPercent: dir > 0 ? -shift : 0,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })

      // -- Vertical progress line ---------------------------------------------
      q(root, '[data-progress]').forEach((el) => {
        gsap.fromTo(
          el,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: '50% 0',
            scrollTrigger: {
              trigger: el.parentElement,
              start: 'top 70%',
              end: 'bottom 60%',
              scrub: true,
            },
          },
        )
      })

      // -- Desktop only: parallax + section panels that widen into place ------
      if (desktop) {
        q(root, '[data-parallax]').forEach((el) => {
          const layer = el.querySelector('.media__parallax')
          if (!layer) return
          gsap.fromTo(
            layer,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        })

        q(root, '[data-section-in]').forEach((section) => {
          const bg = section.querySelector(':scope > .section__bg')
          if (!bg) return
          gsap.fromTo(
            bg,
            { scaleX: 0.9 },
            {
              scaleX: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'top 25%',
                scrub: true,
              },
            },
          )
        })
      }
    },
    root,
  )

  // Images/fonts can change layout after first paint.
  const refresh = () => ScrollTrigger.refresh()
  window.addEventListener('load', refresh)

  return () => {
    window.removeEventListener('load', refresh)
    mm.revert()
  }
}
