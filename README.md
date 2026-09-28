# FSKY — design studio website

React + Vite, with GSAP / ScrollTrigger for motion and Lenis for smooth scrolling.
This is the **design-studio rebuild**. The previous travel-oriented site is preserved
in git on the `archive/travel-site-2026-09` branch (and as a tarball outside the repo).

The visual direction is **not final**: this is a flexible foundation to be refined
section by section (Figma comes later).

```bash
npm install
npm run dev      # dev server
npm run build    # production build → dist/
npm run lint     # oxlint
```

## Structure

```
src/
  main.jsx            entry: loads styles, primes the motion class
  App.jsx             section order + motion boot
  styles/
    tokens.css        ALL design tokens (colour, type scale, spacing, motion)
    base.css          reset + shared primitives (.container, .section, .button…)
    motion.css        pre-animation states + the data-attribute vocabulary
  data/               editable content (site copy, services, works, process)
  components/         Header, Section, Media, Marquee, RevealText, ScrubText
  sections/           Hero, About, Services, Works, Process, Profile, Contact, Footer
  motion/
    gsap.js           registers GSAP + ScrollTrigger once
    lenis.js          Lenis, driven by GSAP's ticker; scrollToId / scroll lock
    initMotion.js     every scroll effect, wired from data-attributes
    useMotion.js      boots Lenis + GSAP, honours prefers-reduced-motion
```

Each section = one component + one CSS file + its data. Redesign a section by
editing only those files.

## Editing content

- Site copy, nav, hero, contact, profile → `src/data/site.js`
- Services → `src/data/services.js` (only `status: 'active'` entries render; a future
  SPACE / INTERIOR category is documented there but is **not** offered yet)
- Works → `src/data/works.js` (`status: 'concept'` shows a CONCEPT PROJECT tag;
  `client: null` shows "—"; `cover: null` shows a placeholder)
- Process → `src/data/process.js`

Anything `null` renders as a visible placeholder — never invent clients, contact
details or personal information.

## Motion

Markup declares intent with data-attributes; `initMotion.js` does the rest.

| Attribute | Effect |
| --- | --- |
| `data-reveal="text"` | masked word-by-word rise (`<RevealText>`) |
| `data-reveal="fade"` | fade + small rise, batched so groups cascade |
| `data-reveal="line"` | hairline draws in |
| `data-reveal="image"` | clip-path wipe + settle (`<Media>`) |
| `data-scrub="words"` | words brighten with scroll (`<ScrubText>`) |
| `data-parallax` | image drifts inside its frame (desktop only) |
| `data-marquee` | large type slides sideways with scroll |
| `data-progress` | vertical line grows with scroll |
| `data-section-in` | section background widens into place (desktop only) |

With `prefers-reduced-motion: reduce` neither Lenis nor GSAP runs and the page is
fully static.
