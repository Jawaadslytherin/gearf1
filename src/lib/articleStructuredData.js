/**
 * Pure helpers for article meta + JSON-LD (safe to import from Node prerender scripts).
 * Browser code should use `seo.js` wrappers that inject `import.meta.env.VITE_SITE_URL`.
 */

export const DEFAULT_DESCRIPTION =
  'Get latest Formula 1 news, race analysis, and driver insights on GearUp F1.';

export function absoluteUrlForSite(siteUrl, path) {
  const base = String(siteUrl || 'https://gearupf1.com').replace(/\/$/, '');
  if (!path) return base;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

export function ogImageUrlForSite(siteUrl, image) {
  if (!image) return absoluteUrlForSite(siteUrl, '/logo.svg');
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return absoluteUrlForSite(siteUrl, image);
}

export function truncateMeta(text, max = 155, fallback = DEFAULT_DESCRIPTION) {
  if (!text) return fallback;
  const t = String(text).replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export function articleMetaDescription(article, fallback = DEFAULT_DESCRIPTION) {
  if (!article) return fallback;
  if (article.excerpt) return truncateMeta(article.excerpt, 155, fallback);
  if (!article.body) return fallback;
  const plain = String(article.body)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#*_`[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return truncateMeta(plain, 155, fallback);
}

/**
 * NewsArticle + BreadcrumbList for rich results / crawl clarity.
 * @param {string} siteUrl - canonical origin, no trailing slash
 */
export function buildArticleJsonLd(article, slug, siteUrl) {
  const base = String(siteUrl || 'https://gearupf1.com').replace(/\/$/, '');
  const pageUrl = `${base}/article/${encodeURIComponent(slug)}`;
  const desc = articleMetaDescription(article);
  const published = article.createdAt ? new Date(article.createdAt).toISOString() : undefined;
  const modified = article.updatedAt
    ? new Date(article.updatedAt).toISOString()
    : published;

  const author =
    article.articleCredit && String(article.articleCredit).trim()
      ? { '@type': 'Person', name: String(article.articleCredit).trim() }
      : { '@type': 'Organization', name: 'GearUp F1' };

  const images = [];
  if (article.imageUrl) {
    images.push(ogImageUrlForSite(base, article.imageUrl));
  }

  const newsArticle = {
    '@type': 'NewsArticle',
    '@id': `${pageUrl}#article`,
    url: pageUrl,
    headline: article.title,
    description: desc,
    image: images.length ? images : undefined,
    datePublished: published,
    dateModified: modified,
    author,
    articleSection: article.category || undefined,
    isAccessibleForFree: true,
    publisher: {
      '@type': 'Organization',
      name: 'GearUp F1',
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrlForSite(base, '/logo.svg'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
  };

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: base,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${base}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: pageUrl,
      },
    ],
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [newsArticle, breadcrumb],
  };
}
