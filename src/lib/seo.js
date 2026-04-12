/** Public site origin for canonical + Open Graph URLs. Set in Vercel: VITE_SITE_URL=https://gearupf1.com */
import {
  DEFAULT_DESCRIPTION as _DEFAULT_DESCRIPTION,
  absoluteUrlForSite,
  ogImageUrlForSite,
  truncateMeta as truncateMetaPure,
  articleMetaDescription as articleMetaDescriptionPure,
  buildArticleJsonLd as buildArticleJsonLdPure,
} from './articleStructuredData.js';

export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://gearupf1.com').replace(/\/$/, '');

export const SITE_NAME = 'GearUp F1';

export const DEFAULT_DESCRIPTION = _DEFAULT_DESCRIPTION;

export function absoluteUrl(path) {
  return absoluteUrlForSite(SITE_URL, path);
}

export function ogImageUrl(image) {
  return ogImageUrlForSite(SITE_URL, image);
}

export function truncateMeta(text, max = 155) {
  return truncateMetaPure(text, max, DEFAULT_DESCRIPTION);
}

export function articleMetaDescription(article) {
  return articleMetaDescriptionPure(article, DEFAULT_DESCRIPTION);
}

export function articleJsonLd(article, slug) {
  return buildArticleJsonLdPure(article, slug, SITE_URL);
}
