# Inventario de propiedad intelectual y dependencias

Fecha de revisión: 2026-04-07

## Resumen del sistema

- Sitio web de Banff Studio orientado a servicios web-first para México y Canadá.
- Soporta inglés, francés y español.
- Tiene shell global con header, mobile dock, theme switcher, selector de idioma, footer, fondos animados y tracker de analítica pasiva.
- Usa MDX local para páginas editoriales y blog.
- Usa SEO técnico propio: metadata, canonical URLs, JSON-LD, breadcrumbs, sitemap y robots.
- Consume GitHub para poblar portfolio con repositorios públicos.
- Embebe Google Maps en la página About.
- Hay backend propio en `app/api` para tracking, reportes mensuales y cron de analítica.

## Integraciones reales detectadas

- `next-themes`: cambio de tema y sincronización con cookie `NEXT_THEME`.
- GitHub Public API: portfolio dinámico en `lib/github-projects.ts`.
- Google Maps embed: iframe externo dentro de About.
- Google/Bing/Facebook site verification: solo metadata basada en variables de entorno.
- Vercel Analytics: dependencia instalada, pero el sitio usa un tracker propio para analítica pasiva.

## Lo que no aplica hoy

- Stripe: no existe implementación activa en este repo.
- Auth: no hay proveedor de autenticación, flujos de login ni middleware de auth.
- CMS: no hay CMS conectado; el contenido vive en MDX local.
- Email sending: no hay proveedor final conectado aún para reportes mensuales; el flujo de email queda listo mediante webhook configurable.
- Base de datos: no encontré ORM, cliente SQL ni esquema de BD.
- Payments: no hay checkout, payment intents ni flujos de cobro activos.

## Inventario final

### Cliente

| Ruta | Categoría | Razón | Licencia requerida | Exposición |
|---|---|---|---|---|
| `content/client/site-content.ts` | CLIENTE_OWNED | Modelo de copy, branding, contacto y estructura editorial del sitio | Requiere cesión o licencia contractual | Cliente visible |
| `content/pages/**` | CLIENTE_OWNED | Copy localizado de páginas | Requiere revisión legal/contractual si no hay cesión explícita | Cliente visible |
| `content/blog/**` | CLIENTE_OWNED | Artículos editoriales | Requiere revisión legal/contractual si no hay cesión explícita | Cliente visible |
| `BanffClaro.jpeg` / `BanffOscuro.jpeg` | CLIENTE_OWNED | Assets de marca | Requiere revisión legal/contractual | Cliente visible |
| `public/**` | CLIENTE_OWNED | Imágenes, logos y media del sitio | Requiere revisión legal/contractual | Cliente visible |

### Agencia

| Ruta | Categoría | Razón | Licencia requerida | Exposición |
|---|---|---|---|---|
| `components/core/**` | AGENCY_OWNED | Shell reusable, motion, navegación, theme, article shells y layout chrome | Sí, licencia limitada de uso para el cliente | Interno |
| `lib/core/**` | AGENCY_OWNED | Helpers reutilizables de locale, theme, blog, MDX y navegación | Sí, licencia limitada de uso para el cliente | Interno |
| `lib/seo/**` | AGENCY_OWNED | SEO técnico, metadata, breadcrumbs, JSON-LD y sitemap helpers | Sí, licencia limitada de uso para el cliente | Interno |
| `components/seo/**` | AGENCY_OWNED | Adaptadores e inyección de structured data | Sí | Interno |
| `components/ui/**` | AGENCY_OWNED | Base UI reusable tipo shadcn/Radix | Sí | Interno |
| `components/icons/**` | AGENCY_OWNED | Iconografía reusable de la agencia | Sí | Interno |
| `hooks/use-toast.ts` / `hooks/use-mobile.ts` | AGENCY_OWNED | State and breakpoint helpers reutilizables | Sí | Interno |
| `app/layout.tsx` | AGENCY_OWNED | Shell raíz, SEO global, theme, locale y chrome | Sí | Interno |
| `app/robots.ts` / `app/sitemap.ts` | AGENCY_OWNED | Archivos SEO generados por helpers | Sí | Interno |
| `app/[locale]/*` | AGENCY_OWNED | Router i18n y validación de locale | Sí | Interno |
| `app/api/analytics/**` | AGENCY_OWNED | Ingesta, agregación y reporte mensual de analítica pasiva | Sí | Interno |
| `app/api/cron/**` | AGENCY_OWNED | Cron mensual para preparar y despachar reportes | Sí | Interno |

### Mixto

| Ruta | Categoría | Razón | Licencia requerida | Exposición |
|---|---|---|---|---|
| `components/client/**` | MIXED | Mezcla copy del cliente con composición reusable de la agencia | Sí, separar por módulos si se va a licenciar | Cliente visible |
| `app/page.tsx` | MIXED | Hero del sitio con SEO reusable | Sí | Cliente visible |
| `app/blog/page.tsx` / `app/blog/[slug]/page.tsx` | MIXED | Contenido cliente + scaffolding reusable | Sí | Cliente visible |
| `app/casos/[slug]/page.tsx` | MIXED | Casos de uso con JSON-LD y contenido de marca | Sí | Cliente visible |
| `lib/site-content.ts` | MIXED | Wrapper de compatibilidad que expone el modelo de cliente | Temporal; revisar y retirar cuando sea posible | Interno |
| `lib/blog.ts` / `lib/mdx.ts` | MIXED | Lectura de contenido cliente + parser reusable | Sí | Interno |

### Terceros

| Ruta / servicio | Categoría | Razón | Licencia requerida | Exposición |
|---|---|---|---|---|
| `lib/github-projects.ts` | THIRD_PARTY_INTEGRATION | Consume la API pública de GitHub | Sujeto a ToS de GitHub | Interno |
| Google Maps embed | THIRD_PARTY_INTEGRATION | Renderizado externo en About | Sujeto a términos de Google | Cliente visible |
| `next-themes` | THIRD_PARTY_INTEGRATION | Proveedor externo de theme state | Licencia del proveedor | Interno |
| `next/font/google` | THIRD_PARTY_INTEGRATION | Fuentes de Google | Términos del proveedor | Interno |
| `@vercel/analytics` | THIRD_PARTY_INTEGRATION | Dependencia externa instalada | Licencia del proveedor | Interno |
| `lucide-react`, `framer-motion`, `class-variance-authority` | THIRD_PARTY_INTEGRATION | Librerías externas | Licencia del proveedor | Interno |

## Dependencias críticas y puntos de integración

| Dependencia / servicio | Uso real | Punto de integración |
|---|---|---|
| `next-themes` | Activo | `components/core/theme-provider.tsx`, `components/core/theme-switcher.tsx`, `lib/core/theme.ts`, `middleware.ts` |
| GitHub Public API | Activo | `lib/github-projects.ts`, `components/client/portfolio-page-content.tsx` |
| Google Maps embed | Activo | `components/client/about-page-content.tsx` |
| MDX local | Activo | `lib/core/mdx.ts`, `lib/core/blog.ts`, `components/core/localized-mdx-page.tsx`, `components/core/blog-article.tsx`, `components/core/mdx-article.tsx` |
| SEO técnico propio | Activo | `lib/seo/**`, `components/seo/**`, `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts` |
| Vercel Analytics | No activo | Dependencia en `package.json`, pero el tracker propio ya cubre analítica pasiva |
| Stripe | No activo | No hay SDK, variables, webhooks ni checkout en el repo |
| Auth provider | No activo | No hay auth middleware ni login UI |
| Email provider | Pendiente | El cron genera el payload y deja listo el webhook para el proveedor que elijas |
| CMS | No activo | Contenido local en MDX |
| Base de datos | No activo | No hay ORM, schema ni cliente de BD |

## Recomendación de separación

1. `repo/app del cliente`
   - `content/client/**`
   - `content/pages/**`
   - `content/blog/**`
   - `components/client/**`
   - `public/**`
   - assets de marca y copy final

2. `paquete privado de la agencia`
   - `components/core/**`
   - `lib/core/**`
   - `lib/seo/**`
   - `components/seo/**`
   - `components/ui/**`
   - `components/icons/**`

3. `integraciones de terceros`
   - GitHub API, Google Maps, `next-themes`, analytics, auth, email, pagos o CMS cuando existan
   - Cada proveedor mantiene su propia licencia y términos

## Observaciones legales

- Cualquier asset de marca, fotografía, copy o artículo sin cesión explícita debe quedar marcado como `requiere revisión legal/contractual`.
- Los módulos reutilizables de SEO, animación, layout y navegación deben documentarse como propiedad de la agencia con licencia limitada de uso para el cliente.
- Stripe no debe clasificarse como integración de este proyecto hasta que exista código activo, configuración de entorno y flujo operativo real.
