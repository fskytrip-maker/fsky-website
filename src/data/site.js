// Site-wide content. Everything here is TEMPORARY copy — edit freely.
// Values set to `null` render as visible placeholders instead of inventing data.

export const site = {
  name: 'FSKY',
  descriptor: 'Design Studio',
}

// Order = order of the sections on the page. `id` matches the section's DOM id.
export const nav = [
  { id: 'about', label: 'ABOUT' },
  { id: 'services', label: 'SERVICES' },
  { id: 'works', label: 'WORKS' },
  { id: 'process', label: 'PROCESS' },
  { id: 'profile', label: 'PROFILE' },
  { id: 'contact', label: 'CONTACT' },
]

export const hero = {
  meta: ['Design Studio', 'Digital / Brand'],
  // '\n' starts a new line in the headline.
  headline: 'We design\nbrands and\ndigital work.',
  lead: 'FSKYは、デジタルとブランドのデザインに取り組むデザインスタジオです。',
  imageLabel: 'Image placeholder',
  ticker: [
    'Web Design',
    'Logo / Brand Design',
    'Graphic / Business Card Design',
  ],
}

export const about = {
  index: '01',
  label: 'About',
  // Scroll-highlighted statement (English, split per word).
  statement:
    'FSKY is a design studio. We give clear form to ideas, for brands that want to be understood at first sight.',
  body: [
    'FSKYは、ウェブデザイン、ロゴ・ブランドデザイン、グラフィック・名刺デザインを手がけるデザインスタジオです。',
    'ここに、FSKYのスタンスや大切にしていることを書きます。（仮の文章です）',
  ],
}

export const services = {
  index: '02',
  label: 'Services',
  title: 'What we do',
  note: 'Current services',
}

export const works = {
  index: '03',
  label: 'Works',
  title: 'Selected\nworks',
  note: 'Placeholders are labelled CONCEPT PROJECT until client work is published.',
}

export const process = {
  index: '04',
  label: 'Process',
  title: 'How we\nwork',
  lead: '進め方のイメージです。最終的な内容は今後確定します。（仮）',
}

export const profile = {
  index: '05',
  label: 'Profile',
  title: 'Who\nis behind',
  // null = show a visible placeholder. Do not fill with invented details.
  name: null,
  role: 'Founder / Designer',
  bio: null,
  photo: null, // { src, alt } once a real photo exists
}

export const contact = {
  index: '06',
  label: 'Contact',
  title: "Let's\ntalk.",
  lead: 'ご相談・お見積りはこちらから。（仮の文章です）',
  // Set `email` to a real address to turn the CTA into a mailto: link.
  email: null,
  // e.g. [{ label: 'Instagram', href: 'https://…' }]
  socials: [],
  socialPlaceholders: ['Instagram', 'X', 'LINE'],
}

export const footer = {
  // Legal pages do not exist yet. Keep `href: null` until they do.
  legal: [
    { label: 'Privacy Policy', href: null },
    { label: 'Terms', href: null },
  ],
}
