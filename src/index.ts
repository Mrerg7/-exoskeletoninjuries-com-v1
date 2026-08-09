interface Env {
  ASSETS: Fetcher;
}

const CANONICAL_HOST = 'exoskeletoninjuries.com';
const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;
const NOT_FOUND_PATHS = new Set(['/404', '/404/', '/404.html', '/404.html/']);

function normalizePathname(pathname: string): string {
  let path = pathname || '/';

  if (path === '/index.html' || path === '/index.html/') {
    return '/';
  }

  if (path.endsWith('/index.html')) {
    path = path.slice(0, -'index.html'.length);
  }

  if (path !== '/' && !path.endsWith('/') && !path.split('/').pop()?.includes('.')) {
    path = `${path}/`;
  }

  return path;
}

function notFoundResponse(): Response {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><meta name="robots" content="noindex, nofollow"/><title>404 — Page Not Found | Exoskeleton Injuries</title><style>body{margin:0;background:#0b1220;color:#94a3b8;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100dvh}.w{text-align:center;padding:2rem}h1{font-size:clamp(3rem,12vw,6rem);font-weight:800;color:#0ea5e9;margin:0;line-height:1}p{font-size:1.125rem;margin:1.5rem 0 2rem}a{display:inline-flex;min-height:48px;align-items:center;padding:0.75rem 1.75rem;background:#0284c7;color:#fff;text-decoration:none;border-radius:0.75rem;font-weight:600}</style></head><body><div class="w"><h1>404</h1><p>Page not found.</p><p><a href="/">Return Home</a></p></div></body></html>`,
    {
      status: 404,
      statusText: 'Not Found',
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'private, no-store',
        'X-Robots-Tag': 'noindex, nofollow',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
  );
}

function assetPathFor(pathname: string): string {
  if (pathname === '/' || pathname === '') return '/index.html';
  if (pathname.endsWith('/')) return `${pathname}index.html`;
  return pathname;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();

    if (NOT_FOUND_PATHS.has(url.pathname)) {
      return notFoundResponse();
    }

    const normalizedPath = normalizePathname(url.pathname);
    const isWorkersDev = host.endsWith('.workers.dev');
    const needsHostFix = host === `www.${CANONICAL_HOST}` || url.protocol === 'http:';
    const needsPathFix = normalizedPath !== url.pathname;

    if (!isWorkersDev && (needsHostFix || needsPathFix)) {
      const target = new URL(normalizedPath + url.search + url.hash, CANONICAL_ORIGIN);
      return Response.redirect(target.toString(), 301);
    }

    if (isWorkersDev && needsPathFix) {
      const target = new URL(url.toString());
      target.pathname = normalizedPath;
      return Response.redirect(target.toString(), 301);
    }

    // html_handling=none: map / → /index.html for the asset fetch only.
    // Browser-facing /index.html already redirected above, so this cannot loop.
    const assetUrl = new URL(request.url);
    assetUrl.pathname = assetPathFor(url.pathname);
    const assetResponse = await env.ASSETS.fetch(new Request(assetUrl, request));

    // If the asset layer still tries to redirect, do not bounce the browser.
    if (assetResponse.status >= 300 && assetResponse.status < 400) {
      return notFoundResponse();
    }

    const headers = new Headers(assetResponse.headers);
    // Drop asset-path SEO headers that would noindex the homepage when serving via /.
    headers.delete('X-Robots-Tag');
    headers.delete('Link');

    if (isWorkersDev) {
      headers.set('X-Robots-Tag', 'noindex, nofollow');
      return new Response(assetResponse.body, {
        status: assetResponse.status,
        statusText: assetResponse.statusText,
        headers,
      });
    }

    const contentType = headers.get('content-type') || '';
    if (assetResponse.ok && contentType.includes('text/html')) {
      headers.set('Link', `<${CANONICAL_ORIGIN}${normalizedPath}>; rel="canonical"`);
    }

    return new Response(assetResponse.body, {
      status: assetResponse.status,
      statusText: assetResponse.statusText,
      headers,
    });
  },
} satisfies ExportedHandler<Env>;
