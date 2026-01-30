export const siteConfig = {
  name: "Lucas Kleipödszus",
  title: "Lucas Kleipödszus",
  description:
    "Fullstack Developer aus Deutschland. Spezialist für Webdesign, SEO und innovative digitale Lösungen. Jedes Projekt ist Open Source auf GitHub.",
  url: "https://hilucas.de",
  author: {
    name: "Lucas Kleipödszus",
    twitter: "@Livvux",
    github: "Livvux",
  },
  links: {
    twitter: "https://x.com/Livvux",
    github: "https://github.com/Livvux",
    linkedin: "https://www.linkedin.com/in/lucas-kleipoedszus/",
    email: "mailto:mail@hilucas.de",
  },
} as const;

export type SiteConfig = typeof siteConfig;
