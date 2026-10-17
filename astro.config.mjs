import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://diazenviroaz.com',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/portal') && !page.includes('/request-service'),
    }),
  ],
  // Solo afecta a `astro dev` / `astro preview` (no al build): permite abrir el
  // servidor local a través de túneles de Cloudflare (*.trycloudflare.com),
  // cuyo subdominio cambia en cada ejecución.
  server: {
    allowedHosts: ['.trycloudflare.com'],
  },
});