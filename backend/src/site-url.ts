/** GitHub Pages project site lives at https://<user>.github.io/<repo>. */
export const GITHUB_PAGES_REPO = 'dkeramik';

/** CORS Origin header is scheme+host only — never a path. */
export function corsAllowOrigin(frontendOrigin: string): string {
  const trimmed = frontendOrigin.trim();
  if (!trimmed) return trimmed;
  try {
    return new URL(trimmed).origin;
  } catch {
    return trimmed.replace(/\/+$/, '');
  }
}

/**
 * Public shop URL prefix. `FRONTEND_ORIGIN` is also the CORS origin, so it is
 * often `https://user.github.io` without `/dkeramik`. Project Pages still need
 * that repo segment in every shop/portfolio link.
 */
export function siteBaseUrl(frontendOrigin: string): string {
  const trimmed = frontendOrigin.trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  try {
    const url = new URL(trimmed);
    if (url.hostname.endsWith('.github.io')) {
      const segments = url.pathname.split('/').filter(Boolean);
      if (segments.length === 0) {
        return `${url.origin}/${GITHUB_PAGES_REPO}`;
      }
    }
    const path = url.pathname.replace(/\/+$/, '');
    return path ? `${url.origin}${path}` : url.origin;
  } catch {
    return trimmed;
  }
}

export function publicPageUrl(frontendOrigin: string, pathWithQuery: string): string {
  const base = siteBaseUrl(frontendOrigin);
  const path = pathWithQuery.startsWith('/') ? pathWithQuery : `/${pathWithQuery}`;
  return `${base}${path}`;
}
