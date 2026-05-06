# AGENTS.md — Portafolio Web Serv Front

## Descripción del Proyecto

Portafolio web de servicios profesionales con landing page multilingüe (es/en), formulario de contacto con CAPTCHA, y temas claro/oscuro. Construido con Astro 6 como sitio estático desplegado en Cloudflare Pages.

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Astro 6 (static output) |
| CSS | Tailwind CSS 4 + DaisyUI 5 |
| Backend API | Hono (Cloudflare Pages Functions) |
| Email | Resend SDK |
| CAPTCHA | Cloudflare Turnstile |
| Lint/Format | Biome 2 |
| Tests | Vitest + jsdom + @testing-library/react |
| Icons | Iconify (@iconify/json + @iconify/tailwind4) |
| i18n | Custom (es default, en) |
| Fonts | @fontsource/outfit |
| Runtime | Bun 1.3 |
| Deploy | Cloudflare Pages (Wrangler) |

## Estructura del Código

```
src/
├── assets/                  # Estáticos (imágenes SVG)
├── components/              # Componentes Astro (.astro)
│   ├── About.astro
│   ├── Contact.astro
│   ├── Footer.astro
│   ├── Hero.astro
│   ├── LanguagePicker.astro
│   ├── Projects.astro
│   ├── Services.astro
│   ├── Testimonios.astro
│   └── ThemeToggle.astro
├── data/
│   └── proyectos.ts         # Datos de proyectos (Project[])
├── i18n/
│   ├── ui.ts                # Traducciones es/en
│   └── utils.ts             # Helper getLang()
├── layouts/
│   └── Layout.astro         # Layout principal (SEO, meta tags)
├── pages/
│   ├── index.astro          # Home (es)
│   ├── en/index.astro       # Home (en)
│   └── 404.astro            # Página 404
├── styles/
│   └── global.css           # Estilos globales + Tailwind
├── test/
│   └── setup.ts             # Setup Vitest (jest-dom)
├── types.ts                 # Interfaces: TranslationKey, Project, ContactFormData, CloudflareImageOptions
└── utils/
    ├── images.ts
    └── images.test.ts       # Tests de utils

functions/
└── api/[[route]].ts         # API Hono (contact + Turnstile verification)
```

## Comandos Disponibles

| Comando | Descripción |
|---|---|
| `bun run dev` | Servidor de desarrollo (Astro) |
| `bun run build` | Build de producción |
| `bun run preview` | Preview del build |
| `bun run lint` | Biome lint (auto-fix) |
| `bun run check` | Biome check (lint + format + organize) |
| `bun run test` | Vitest (run mode) |

## Convenciones de Código

- **Indentación**: Tabs (configurado en Biome)
- **Comillas**: Dobles (`"`) en JS/TS
- **Imports**: Organizados automáticamente por Biome
- **Componentes Astro**: PascalCase
- **Tipado**: TypeScript estricto
- **Estilos**: Tailwind CSS 4 utility classes + DaisyUI components
- **Nombres archivos**: kebab-case para .astro, snake_case para data

## API (Cloudflare Pages Functions)

- Único endpoint catch-all `functions/api/[[route]].ts`
- Endpoint `POST /api/contact` — envía email vía Resend (valida con Turnstile)
- Variables server: `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY` (disponibles en `c.env`)

## Variables de Entorno

| Variable | Ámbito | Uso |
|---|---|---|
| `PUBLIC_TURNSTILE_SITE_KEY` | Cliente (`import.meta.env`) | Site key de Turnstile |
| `TURNSTILE_SECRET_KEY` | Server (`c.env`) | Verificación server-side Turnstile |
| `RESEND_API_KEY` | Server (`c.env`) | API key de Resend para envío de emails |

## Reglas para el Agente

1. Correr `bun run lint` y `bun run test` después de cambios
2. Mantener i18n consistente (agregar claves en `es` Y en `en`)
3. Usar Biome para formato, no Prettier
4. Respetar convención tabs + comillas dobles
5. No emojis en commits ni código
6. Variables públicas van en `.env`, secrets van en dashboard de Cloudflare
