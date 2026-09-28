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
//     description: '…',
//     items: ['Spatial Design', 'Interior Design'],
//     status: 'planned',
//   },

export const services = [
  {
    id: 'web',
    title: 'WEB DESIGN',
    description:
      'ブランドの考え方を、伝わるウェブサイトのかたちにします。（仮）',
    items: ['Website design', 'Landing page', 'UI design'],
    status: 'active',
  },
  {
    id: 'brand',
    title: 'LOGO / BRAND DESIGN',
    description:
      'ロゴから始まる、ぶれのないブランドの見え方をつくります。（仮）',
    items: ['Logo design', 'Brand identity', 'Guidelines'],
    status: 'active',
  },
  {
    id: 'graphic',
    title: 'GRAPHIC / BUSINESS CARD DESIGN',
    description:
      '手に取られる場面まで考えた、グラフィックと名刺をつくります。（仮）',
    items: ['Business card', 'Print graphics', 'Collateral'],
    status: 'active',
  },
]

export const activeServices = services.filter((s) => s.status === 'active')
