/** Public site origin for canonical + Open Graph URLs. Set in Vercel: VITE_SITE_URL=https://gearupf1.com */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://gearupf1.com').replace(/\/$/, '');

export const SITE_NAME = 'GearUp F1';

export const DEFAULT_DESCRIPTION =
  'GearUp F1 – live F1 telemetry, race reports, driver grid, and in-depth Formula 1 analysis.';

export function absoluteUrl(path) {
  if (!path) return SITE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

export function ogImageUrl(image) {
  if (!image) return absoluteUrl('/logo.svg');
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return absoluteUrl(image);
}

export function truncateMeta(text, max = 155) {
  if (!text) return DEFAULT_DESCRIPTION;
  const t = String(text).replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

/** Prefer excerpt; otherwise strip common markdown noise from body for meta. */
export function articleMetaDescription(article) {
  if (!article) return DEFAULT_DESCRIPTION;
  if (article.excerpt) return truncateMeta(article.excerpt);
  if (!article.body) return DEFAULT_DESCRIPTION;
  const plain = String(article.body)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#*_`[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return truncateMeta(plain);
}
