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
- `public/` — assets estáticos servidos tal cual (logo, favicon, videos del hero, `robots.txt`). No importar nada desde aquí como módulo de JS/TS (rompe Vite) — referenciar siempre por URL absoluta (p. ej. `/logo.png`).

## Portal de clientes

Funcionalidad añadida sobre Supabase (auth + Postgres + Storage), consumida directamente desde el navegador con la clave publicable — el sitio sigue siendo 100% estático, sin backend propio.

- **Rutas**: `/portal` (login/registro/recuperación de contraseña y panel "Mis solicitudes" una vez autenticado), `/request-service` (formulario público de solicitud de servicio; adjuntar archivos y enviar requiere sesión iniciada), `/privacy-policy` y `/terms` (textos legales en borrador, con marcadores pendientes de confirmar). Las cuatro páginas son `noindex` y están excluidas del sitemap.
- **Tablas Supabase**: `client_requests` (una fila por solicitud; `status` pasa de `draft` a `submitted` al adjuntar y enviar) y `client_request_files` (metadata de cada archivo adjunto, referenciando la fila de `client_requests`). Acceso restringido por RLS a la propia cuenta del usuario.
- **Storage**: bucket `client-uploads` (privado). Las descargas desde el panel del portal usan URLs firmadas (`createSignedUrl`, no URLs públicas). Límites de archivo: PDF/JPG/PNG, 15 MB por archivo, máximo 10 archivos por solicitud (`src/lib/fileUpload.js`).
- **Login**: Google OAuth (`supabase.auth.signInWithOAuth`) y correo+contraseña (`signInWithPassword` / `signUp`), con recuperación de contraseña vía `resetPasswordForEmail` + página de reseteo. Tras login redirige a la página de origen (`/portal?redirect=...`).
- **Google OAuth está en modo Testing** en Google Cloud Console — solo funciona con las cuentas de prueba agregadas ahí. Hay que pasarlo a producción (verificación de la app) antes de publicar el portal para clientes reales.
- **Variables de entorno** (`.env`, ver `.env.example`): `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_KEY` (clave publicable, no `service_role`), `PUBLIC_EMAILJS_SERVICE_ID`, `PUBLIC_EMAILJS_TEMPLATE_ID`, `PUBLIC_EMAILJS_PUBLIC_KEY`.
- El cliente de Supabase vive en `src/lib/supabase.ts`.

## Despliegue

- **Manual a Hostinger**: `npm run build` → carpeta `dist/` → se comprime a `dist.zip` → se sube a mano al hosting. No hay GitHub Actions ni CI/CD.
- `dist/` y `dist.zip` están en `.gitignore` — nunca se commitean.
- **Producción apunta al commit `d236eb8`**, no a `main`. Antes de asumir que "lo que está en main/la rama actual" es lo que está en producción, confirmar con el usuario cuál es el commit/paquete realmente desplegado.
- El portal de clientes (rama `feature/client-portal`) **todavía no está publicado**: producción sigue en `d236eb8` hasta que se decida publicarlo, lo cual se hará junto con el rediseño visual (`diseno-visual`), no por separado.
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
