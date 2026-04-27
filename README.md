# Banff Studio

Banff Studio is a website-first studio focused on Mexico and Canada. The site is built around clear UX/UI, bilingual and multilingual delivery, SEO, practical content support, and lightweight marketing when a project needs it. AI, automation, Web3, and mobile apps remain available as selective capabilities and can be quoted separately when needed.

## Repository Structure

- `content/pages/`: client-owned localized MDX content.
- `content/blog/`: client-owned editorial articles.
- `content/client/site-content.ts`: client-owned site copy model and locale data.
- `components/client/`: client-facing page compositions and portfolio/about/services copy shells.
- `components/core/`: reusable agency chrome, navigation, theme, and article shells.
- `lib/core/`: reusable agency helpers for locale, theme, navigation, blog, and MDX rendering.
- `lib/seo/`: reusable SEO, structured data, and metadata helpers.
- `components/ui/`: reusable UI primitives.
- `components/icons/`: reusable icon helpers.
- `public/`: brand and media assets used by the site.

This repository was forked from:
https://github.com/Chatbase-co/nextjs-marketplace-template

## What we do

- Bilingual websites in English, French, and Spanish.
- SEO, content, and practical marketing support.
- Website redesigns and modernization for older sites.
- Selective mobile app work quoted separately when the project truly needs it.
- AI, automation, and Web3 integrations when they add real value.

## Site structure

- Home
- About Us
- Packages
- Portfolio
- Blog
- Services
- Contact

## English

Banff Studio builds websites for teams that want to operate across Mexico and Canada. The studio combines design, content, SEO, and technical execution with a clear bilingual workflow.

What we offer:

- Launch-ready websites.
- Multilingual structure in English, French, and Spanish.
- SEO and local visibility.
- Content support and light marketing.
- Selective mobile app work quoted separately when needed.
- AI, automation, and Web3 integration when it makes sense.

## Français

Banff Studio crée des sites web pour des équipes qui veulent travailler entre le Mexique et le Canada. Le studio combine design, contenu, SEO et exécution technique avec un flux bilingue clair.

Ce que nous proposons :

- Sites prêts à lancer.
- Structure multilingue en anglais, français et espagnol.
- SEO et visibilité locale.
- Soutien en contenu et marketing léger.
- Travail mobile sélectif quand le projet le demande.
- Intégrations IA, automatisation et Web3 lorsque c’est pertinent.

## Español

Banff Studio crea sitios web para equipos que quieren operar entre México y Canadá. El estudio combina diseño, contenido, SEO y ejecución técnica con un flujo bilingüe claro.

Lo que ofrecemos:

- Sitios listos para lanzar.
- Estructura multilingüe en inglés, francés y español.
- SEO y visibilidad local.
- Apoyo en contenido y marketing ligero.
- Trabajo móvil selectivo cuando el proyecto lo necesita.
- Integraciones de AI, automatización y Web3 cuando aportan valor real.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes

- Default language: English.
- Default theme: Dark.
- The site supports language switching between English, French, and Spanish.
- The portfolio, services, packages, blog, and contact pages are all tailored to the studio’s website-first positioning.
- Reusable core logic lives under `components/core/` and `lib/core/`; client content lives under `content/` and `components/client/`.
