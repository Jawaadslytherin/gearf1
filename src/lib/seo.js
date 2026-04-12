/** Public site origin for canonical + Open Graph URLs. Set in Vercel: VITE_SITE_URL=https://gearupf1.com */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://gearupf1.com').replace(/\/$/, '');

export const SITE_NAME = 'GearUp F1';

export const DEFAULT_DESCRIPTION =
  'Get latest Formula 1 news, race analysis, and driver insights on GearUp F1.';

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

/** JSON-LD NewsArticle for article pages (Google rich results). */
export function articleJsonLd(article, slug) {
  const pageUrl = absoluteUrl(`/article/${encodeURIComponent(slug)}`);
  const desc = articleMetaDescription(article);
  const published = article.createdAt ? new Date(article.createdAt).toISOString() : undefined;
  const modified = article.updatedAt
    ? new Date(article.updatedAt).toISOString()
    : published;

  const author =
    article.articleCredit && String(article.articleCredit).trim()
      ? { '@type': 'Person', name: String(article.articleCredit).trim() }
      : { '@type': 'Organization', name: SITE_NAME };

  const images = [];
  if (article.imageUrl) {
    images.push(ogImageUrl(article.imageUrl));
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: desc,
    image: images.length ? images : undefined,
    datePublished: published,
    dateModified: modified,
    author,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/logo.svg'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
  };
}
