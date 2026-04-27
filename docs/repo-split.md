# Separación de propiedad intelectual por carpetas

Fecha de revisión: 2026-04-07

Este repositorio corresponde al sitio de Banff Studio. No hay implementación activa de Stripe, Openpay, Listmonk, Neon ni una capa de checkout propia.

## 1) Cliente

- `content/client/**`
- `content/pages/**`
- `content/blog/**`
- `public/**`
- `BanffClaro.jpeg`
- `BanffOscuro.jpeg`
- `components/client/**`

Regla:
- Todo el copy, branding, imágenes y contenido editorial vive aquí.
- Si un archivo combina contenido con composición, debe tratarse como `MIXED`.

## 2) Agencia

- `components/core/**`
- `lib/core/**`
- `lib/analytics/**`
- `lib/seo/**`
- `components/seo/**`
- `components/ui/**`
- `components/icons/**`
- `app/api/analytics/**`
- `app/api/cron/**`
- `hooks/use-toast.ts`
- `hooks/use-mobile.ts`
- `app/layout.tsx`
- `app/robots.ts`
- `app/sitemap.ts`
- `app/[locale]/**`

Regla:
- El núcleo reusable de la agencia incluye layout system, motion, navegación, SEO, JSON-LD, helpers de MDX y componentes base.
- Este código puede licenciarse al cliente bajo licencia limitada.

## 3) Terceros

- GitHub API en `lib/github-projects.ts`
- Google Maps embed en `components/client/about-page-content.tsx`
- `next-themes`
- `@vercel/analytics` si se monta en runtime
- `next/font/google`
- `lucide-react`
- `framer-motion`
- `class-variance-authority`

Regla:
- Cada proveedor conserva su propia licencia y términos.

## 4) Mixto

- `app/page.tsx`
- `app/blog/page.tsx`
- `app/blog/[slug]/page.tsx`
- `app/casos/[slug]/page.tsx`
- `lib/site-content.ts`
- `lib/blog.ts`
- `lib/mdx.ts`

Regla:
- Separar `CLIENTE_OWNED` y `AGENCY_OWNED` dentro del archivo con comentarios de frontera.
- Si el archivo pasa a ser un wrapper técnico, documentarlo como puente temporal.

## 5) Reglas de licencia

- `CLIENTE_OWNED`: entregable al cliente.
- `AGENCY_OWNED`: reutilizable por la agencia bajo licencia limitada.
- `THIRD_PARTY_INTEGRATION`: sujeto a licencia del proveedor.
- `MIXED`: requiere separación interna y comentario claro.

## 6) Nota de alcance

- Stripe, Openpay, Listmonk y Neon no aplican en este repo salvo que se incorporen más adelante con código real y configuración explícita.
- Una mención textual no constituye integración técnica.
