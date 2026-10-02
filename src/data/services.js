// Service catalogue.
//
// `status: 'active'` entries are shown on the site. Anything else is ignored by
// the Services section, so a new category can be prepared here and switched on
// later by changing one field.
//
// FUTURE (not offered yet — do NOT add as 'active' until it is available):
//   {
//     id: 'space',
//     title: 'SPACE / INTERIOR DESIGN',
//     titleJa: '空間・インテリアデザイン',
//     description: '…',
//     items: ['Spatial Design', 'Interior Design'],
//     status: 'planned',
//   },

export const services = [
  {
    id: 'web',
    title: 'WEB DESIGN',
    titleJa: 'ウェブデザイン',
    description: '想いや強みが伝わる、見る人の心に届くウェブサイトをデザインします。',
    items: ['ウェブサイト', 'LP', 'UIデザイン'],
    status: 'active',
  },
  {
    id: 'brand',
    title: 'LOGO / BRAND DESIGN',
    titleJa: 'ロゴ・ブランドデザイン',
    description: 'ロゴを軸に、ブランドの「らしさ」をかたちにし、ぶれない見え方をつくります。',
    items: ['ロゴ', 'ブランドアイデンティティ', 'ガイドライン'],
    status: 'active',
  },
  {
    id: 'graphic',
    title: 'GRAPHIC / BUSINESS CARD DESIGN',
    titleJa: 'グラフィック・名刺デザイン',
    description: '名刺やチラシなど、手に取った瞬間に印象に残るグラフィックをデザインします。',
    items: ['名刺', 'チラシ・フライヤー', '販促物'],
    status: 'active',
  },
]

export const activeServices = services.filter((s) => s.status === 'active')
