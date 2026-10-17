# Diaz Environmental — sitio web

Sitio corporativo de Diaz Environmental LLC (diseño de sistemas sépticos, pruebas de percolación y servicios ambientales en Arizona). Bilingüe (es/en) client-side.

## Stack

- **Astro 6** (`^6.1.8`), modo **static** (sin `output: 'server'`, sin adaptador). Todo se compila a HTML/CSS/JS estático.
- **React 19** solo para islas interactivas (`@astrojs/react`), hidratadas con `client:load` / `client:visible` / `client:only="react"` según el componente — nunca SSR de React.
- Estado global ligero: `nanostores` + `@nanostores/react` (`src/stores/language.ts` para el idioma, persistido en `localStorage`).
- `@astrojs/sitemap` genera el sitemap en build.
- Animaciones: `gsap`, `lenis` (smooth scroll).
- Formulario de contacto actual: `emailjs-com` (EmailJS), **no se toca** al integrar Supabase.
- Gestor de paquetes: npm. Scripts: `npm run dev`, `npm run build`, `npm run preview`.

## Estructura

- `src/pages/` — páginas y landings SEO (home, FAQ, 404, 7+ landings locales por condado/ciudad).
- `src/layouts/Layout.astro` — único layout, head/meta/schema.org global y estilos globales (`:root` con los tokens de diseño).
- `src/components/` — un folder por componente (React + CSS propio).
- `src/stores/` — stores de nanostores (idioma).
- `src/Services/emailServices.js` — envío del formulario de contacto vía EmailJS.
- `src/lib/` — utilidades de bajo nivel compartidas (p. ej. cliente de Supabase).
- `design-tokens.json` (raíz) — copia en JSON de los tokens reales definidos en `Layout.astro` / CSS de componentes. Si cambian los tokens del CSS, actualizar también este archivo.
- `public/` — assets estáticos servidos tal cual (logo, favicon, videos del hero, `robots.txt`).

## Despliegue

- **Manual a Hostinger**: `npm run build` → carpeta `dist/` → se comprime a `dist.zip` → se sube a mano al hosting. No hay GitHub Actions ni CI/CD.
- `dist/` y `dist.zip` están en `.gitignore` — nunca se commitean.
- **Producción apunta al commit `d236eb8`**, no a `main`. Antes de asumir que "lo que está en main/la rama actual" es lo que está en producción, confirmar con el usuario cuál es el commit/paquete realmente desplegado.
- El dominio (`https://diazenviroaz.com`) y el hosting (Hostinger) son fijos; no agregar pasos de CI/CD ni adaptadores SSR sin pedirlo explícitamente — el plan de hosting puede no soportarlos.

## Reglas de trabajo en este repo

- **Sin secretos en el repo.** Nunca commitear `.env`, `.env.production`, ni ninguna clave `service_role` o privada. Solo claves públicas/publicables (p. ej. `PUBLIC_*` de Supabase) pueden vivir en código cliente, y aun así preferir `.env` + `.env.example` sin valores.
- **El sitio sigue siendo estático.** Cualquier función que necesite backend (auth, subida de archivos, base de datos) se resuelve en el navegador contra servicios externos (Supabase) con la clave publicable — nunca agregar un adaptador SSR/Node a Astro sin pedirlo explícitamente.
- **Un commit por paso** cuando se trabaja en una tarea de varios pasos — no acumular cambios de pasos distintos en un solo commit.
- **`npm run build` debe pasar** antes de considerar un paso terminado.
- **No hacer `git push`** salvo que el usuario lo pida explícitamente.
- No tocar Hero, Services, Projects ni el flujo de despliegue salvo que se pida explícitamente — son áreas de rediseño visual en curso en la rama `diseno-visual`.

## Pendientes conocidos (ver contexto de conversación/memoria para detalle)

- Bug de hidratación #418 relacionado con el cambio de idioma — diagnosticar antes de arreglar, al terminar el rediseño visual. Las islas nuevas que dependan de `languageStore` y necesiten evitar este bug deben usar `client:only="react"`.
- Rediseño visual en curso en la rama `diseno-visual` (tokens de color, tipografías, footer, animaciones).
