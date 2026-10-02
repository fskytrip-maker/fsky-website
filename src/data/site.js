// Site-wide content. Everything here is TEMPORARY copy — edit freely.
// Values set to `null` render as visible placeholders instead of inventing data.

export const site = {
  name: 'FSKY',
  descriptor: 'Design Studio',
}

// Order = order of the sections on the page. `id` matches the section's DOM id.
// Used by the mobile menu (all sections) and the Footer.
export const nav = [
  { id: 'about', label: 'ABOUT' },
  { id: 'services', label: 'SERVICES' },
  { id: 'contact', label: 'CONTACT' },
]

// Curated subset + order for the desktop header bar's left side. The mobile
// menu still lists every section via `nav` above.
export const headerNav = [
  { id: 'services', label: 'SERVICES' },
  { id: 'about', label: 'ABOUT' },
]

// Single CTA on the header bar's right side (desktop only).
export const headerContact = { id: 'contact', label: 'CONTACT' }

export const hero = {
  // The wordmark is the supplied lockup image (src/assets/fsky-lockup.webp) —
  // no text headline is set here, so it can never drift from that artwork.
  logoAlt: 'FSKY',
  tagline: 'DESIGN STUDIO',
  categories: ['WEB', 'BRAND', 'GRAPHIC'],
  scrollLabel: 'SCROLL TO EXPLORE',
  ctas: {
    inquiry: { label: 'PROJECT INQUIRY', subLabel: '制作の相談', targetId: 'contact' },
  },
}

export const about = {
  index: '01',
  label: 'About',
  // Scroll-highlighted statement. Japanese brightens character by character;
  // text with spaces (English) brightens word by word. *…* = accent colour,
  // "\n" = line break on wide screens.
  statement: 'お客様の想いに寄り添い、\nまだどこにもない、\n*ひときわ輝くデザイン*を。',
  // English rendering, shown small under the statement.
  statementEn: 'Staying close to your vision, we create designs that shine like nothing else.',
  // Body, as blocks: `big` lines are the large coloured highlights
  // (tone 'sky' = brand cyan, 'blue' = the silk's blue-violet). "\n" = line
  // break on wide screens.
  body: [
    { text: 'FSKYは、ウェブデザイン、ロゴ・ブランドデザイン、\nグラフィック・名刺デザインを手がけるデザインスタジオです。' },
    { text: 'お客様の声に耳を傾け、その想いに寄り添う。', big: true, tone: 'sky' },
    { text: 'それが、FSKYがいちばん大切にしていることです。' },
    { text: 'クリエイティブな独創性にあふれた、\nほかにはないデザインを。', big: true, tone: 'blue' },
    { text: 'お客様と一緒に、かたちにしていきます。' },
  ],
}

export const services = {
  index: '02',
  label: 'Services',
  title: 'What we do',
  titleJa: 'できること', // shown small under the heading
  note: 'Current services',
  // Each service row links to the contact form with that service chosen.
  inquire: 'このサービスについて相談する',
}

export const contact = {
  index: '03',
  label: 'Contact',
  title: "Let's\ntalk.",
  lead: 'ご相談・お見積りはこちらから。',
  phone: {
    heading: 'CALL US',
    sub: 'お電話でのお問い合わせ',
    label: '080-9610-8093',
    href: 'tel:+818096108093',
  },
  line: {
    heading: 'OFFICIAL LINE',
    sub: 'LINEでのお問い合わせ',
    label: 'LINE',
    href: 'https://lin.ee/T8AhI00', // add-friend link
  },
  form: {
    heading: 'CONTACT FORM',
    sub: 'フォームでのお問い合わせ',
    // URL of the form service that receives the inquiry and emails it to you
    // (e.g. Formspree: 'https://formspree.io/f/xxxxxxx'). null = not set up
    // yet: the form is shown, but says it can't send yet.
    endpoint: null,
    privacyNote: '送信いただいた内容は、プライバシーポリシーに従って取り扱います。',
    privacyHref: '/privacy/',
    submit: '送信する',
    sending: '送信中…',
    messages: {
      done: 'お問い合わせありがとうございます。内容を確認のうえ、ご連絡いたします。',
      error: '送信できませんでした。時間をおいて再度お試しいただくか、お電話・LINEでご連絡ください。',
      unavailable: 'フォームは現在準備中です。お手数ですが、お電話またはLINEでご連絡ください。',
    },
  },
  // e.g. [{ label: 'X', href: 'https://…' }]
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/fsky_creative/' },
    { label: 'X', href: 'https://x.com/FSKY_Creative' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@fsky892' },
  ],
  socialPlaceholders: [],
}

export const footer = {
  // `href: null` = page doesn't exist yet (shown as inactive text).
  legal: [
    { label: 'Privacy Policy', href: '/privacy/' },
  ],
}
