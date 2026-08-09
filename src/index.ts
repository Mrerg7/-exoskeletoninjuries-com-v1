interface Env {
  ASSETS: Fetcher;
}

const CANONICAL_HOST = 'exoskeletoninjuries.com';
const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;

/** Collapse duplicate path forms onto the trailing-slash canonical path. */
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

function canonicalRedirect(url: URL, pathname = normalizePathname(url.pathname)): Response {
  const target = new URL(pathname + url.search + url.hash, CANONICAL_ORIGIN);
  return Response.redirect(target.toString(), 301);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();
    const normalizedPath = normalizePathname(url.pathname);

    const isNotFoundAlias =
      url.pathname === '/404' ||
      url.pathname === '/404/' ||
      url.pathname === '/404.html' ||
      url.pathname === '/404.html/' ||
      normalizedPath === '/404/';

    // Explicit /404 URL variants are not indexable pages — return a real 404 without redirects.
    if (isNotFoundAlias) {
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

    const isWorkersDev = host.endsWith('.workers.dev');
    const isWww = host === `www.${CANONICAL_HOST}`;
    const needsHostFix = isWww || url.protocol === 'http:';
    const needsPathFix = normalizedPath !== url.pathname;

    // One-hop 301 to the single preferred URL (apex HTTPS + trailing slash, no index.html).
    if (!isWorkersDev && (needsHostFix || needsPathFix)) {
      return canonicalRedirect(url, normalizedPath);
    }

    if (isWorkersDev && needsPathFix) {
      url.pathname = normalizedPath;
      return Response.redirect(url.toString(), 301);
    }

    const assetPath =
      url.pathname === '/' || url.pathname === ''
        ? '/index.html'
        : url.pathname.endsWith('/')
          ? `${url.pathname}index.html`
          : url.pathname;

    const assetRequest = new Request(new URL(assetPath, url.origin), request);
    const response = await env.ASSETS.fetch(assetRequest);
    const headers = new Headers(response.headers);

    if (isWorkersDev) {
      headers.set('X-Robots-Tag', 'noindex, nofollow');
      headers.delete('Link');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    const contentType = headers.get('content-type') || '';
    if (response.ok && contentType.includes('text/html')) {
      headers.set('Link', `<${CANONICAL_ORIGIN}${normalizedPath}>; rel="canonical"`);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
} satisfies ExportedHandler<Env>;
