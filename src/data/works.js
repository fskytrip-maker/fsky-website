// Project catalogue.
//
// Fields
//   id           unique slug
//   title        project title
//   client       string | null   (null → shown as "—". Never invent clients.)
//   category     'Web Design' | 'Logo / Brand Design' | 'Graphic Design' | …
//   year         number | null
//   description  short summary
//   href         string | null   (project link; null → no link is rendered)
//   status       'concept' | 'client'   ('concept' shows a CONCEPT PROJECT tag)
//   cover        { src, alt, width, height, srcSet?, sizes? } | null
//                (null → generated placeholder cover)
//
// Layout: the grid position of each project is derived from its index (see
// Works.css), so adding/removing entries never needs layout fields.
//
// Everything below is a PLACEHOLDER. Replace with real projects when ready.

export const works = [
  {
    id: 'concept-01',
    title: 'Concept Project 01',
    client: null,
    category: 'Web Design',
    year: null,
    description: 'ここにプロジェクトの概要が入ります。（仮）',
    href: null,
    status: 'concept',
    cover: null,
  },
  {
    id: 'concept-02',
    title: 'Concept Project 02',
    client: null,
    category: 'Logo / Brand Design',
    year: null,
    description: 'ここにプロジェクトの概要が入ります。（仮）',
    href: null,
    status: 'concept',
    cover: null,
  },
  {
    id: 'concept-03',
    title: 'Concept Project 03',
    client: null,
    category: 'Graphic / Business Card',
    year: null,
    description: 'ここにプロジェクトの概要が入ります。（仮）',
    href: null,
    status: 'concept',
    cover: null,
  },
  {
    id: 'concept-04',
    title: 'Concept Project 04',
    client: null,
    category: 'Web Design',
    year: null,
    description: 'ここにプロジェクトの概要が入ります。（仮）',
    href: null,
    status: 'concept',
    cover: null,
  },
]
