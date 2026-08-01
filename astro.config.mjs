// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://exoskeletoninjuries.com',
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: true,
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.9,
      lastmod: new Date(),
    }),
  ],
  build: {
    assets: 'assets',
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
