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
  index: '01',
  title: ['A', 'CREATIVE', 'STUDIO'],
  lead: ['想いを、かたちに。', '未来へつなぐデザインを。'],
  categories: ['WEB', 'LOGO', 'BRAND', 'GRAPHIC'],
  motto: "DESIGN FOR WHAT'S NEXT.",
  scrollLabel: 'SCROLL',
  // The glass FSKY mark (supplied render, used as-is).
  visualAlt: 'FSKY',
}

export const about = {
  index: '02',
  label: 'About',
  // Scroll-highlighted statement. Japanese brightens character by character;
  // text with spaces (English) brightens word by word. *…* = accent colour,
  // "\n" = line break on wide screens.
  statement: 'お客様の想いに寄り添い、\nまだどこにもない、\n*ひときわ輝くデザイン*を。',
  // English rendering, shown small under the statement.
  statementEn: 'Staying close to your vision, we create designs that shine like nothing else.',
  // Body, as blocks: `big` lines are the large coloured highlights
  // (tone 'sky' = brand cyan, 'blue' = blue-violet). "\n" = line
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
  index: '03',
  label: 'Services',
  title: 'What we do',
  titleJa: 'できること', // shown small under the heading
  note: 'Current services',
  // Each service row links to the contact form with that service chosen.
  inquire: 'このサービスについて相談する',
}

export const contact = {
  index: '04',
  label: 'Contact',
  title: "Let's\ntalk.",
  lead: 'ご相談・お見積りはこちらから。',
  // Shown under the lead on the transition into this section (SkyWipe).
  leadEn: 'For consultations and estimates, start here.',
  // SNS buttons, from `socials` below.
  social: {
    heading: 'SOCIAL',
    sub: 'SNSでのお問い合わせ',
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
    // Formspree form that receives the inquiry and emails it to you. null =
    // not set up: the form is shown, but says it can't send yet.
    endpoint: 'https://formspree.io/f/mwlpdyne',
    // Subject line of the notification email.
    subject: '【FSKY】ウェブサイトからのお問い合わせ',
    privacyNote: '送信いただいた内容は、プライバシーポリシーに従って取り扱います。',
    privacyHref: '/privacy/',
    submit: '送信する',
    sending: '送信中…',
    messages: {
      done: 'お問い合わせありがとうございます。内容を確認のうえ、ご連絡いたします。',
      error: '送信できませんでした。時間をおいて再度お試しいただくか、LINE・SNSでご連絡ください。',
      unavailable: 'フォームは現在準備中です。お手数ですが、LINEまたはSNSでご連絡ください。',
    },
  },
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/fsky_creative/' },
    { label: 'X', href: 'https://x.com/FSKY_Creative' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@fsky892' },
  ],
}

export const footer = {
  // `href: null` = page doesn't exist yet (shown as inactive text).
  legal: [
    { label: 'Privacy Policy', href: '/privacy/' },
  ],
}
