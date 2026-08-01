# exoskeletoninjuries.com

Static Astro site for **exoskeletoninjuries.com** — demonstration & informational overview of wearable exoskeleton technology trends in 2026.

## Stack

- **Astro 5** (pure static output)
- **TypeScript** (strict)
- **Tailwind CSS**
- **Content Collections**
- **@astrojs/sitemap**
- Deployed as **Cloudflare Workers Static Assets** (assets-only, no adapter)

## Features

- Fully static, edge-optimized
- Mobile-first responsive design
- Complete Open Graph + Twitter Card meta
- JSON-LD structured data (WebSite + WebPage + Organization)
- Sitemap + robots.txt
- Sophisticated domain acquisition CTA → `sales@desertrich.com`
- Content Collections for advancements

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output lands in `./dist` ready for Cloudflare Workers Static Assets.

## Deploy (Cloudflare)

```bash
npx wrangler deploy
```

Or connect the GitHub repo in the Cloudflare dashboard and set build command `npm run build`, output directory `dist`.

## Domain Acquisition

All inquiries: **sales@desertrich.com**

---

© Desert Rich. This site is for demonstration purposes only.
