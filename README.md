# exoskeletoninjuries.com

Premium domain acquisition site for **exoskeletoninjuries.com**. Asking price **$100,000**. Seller: Desert Rich (`sales@desertrich.com`).

## Stack

- Astro 5, static output
- Tailwind CSS
- Content collections for category notes
- `@astrojs/sitemap`
- Cloudflare Workers static assets (free plan). No paid Workers features.

Build command: `npm run build`. Output directory: `dist`.

## Deploy

Connect this repo in Cloudflare and keep the Workers static-assets project, or:

```bash
npm install
npm run build
npx wrangler deploy
```

Canonical host redirects (www and http) stay in `src/index.ts`.

## Changelog

### 2026-10-11

- Rebuilt the page as a domain sale, asking price $100,000 (was $15,999).
- Title, description, canonical, Product/Offer schema, buyer and transfer pages.
- Above-the-fold price, buy / offer / contact paths, escrow steps, exit note.
- Light and dark theme, 48px controls, mobile menu.
- Category notes kept and labeled as public reporting, not part of the sale.
