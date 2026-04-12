import { Helmet } from 'react-helmet-async';
import { SITE_NAME, DEFAULT_DESCRIPTION, absoluteUrl, ogImageUrl, truncateMeta } from '../lib/seo';

/**
 * @param {object} props
 * @param {string} props.title - Page title (brand suffix added unless already present)
 * @param {string} [props.description]
 * @param {string} [props.path] - Path only, e.g. /calendar
 * @param {string} [props.image] - Absolute or site-relative image URL
 * @param {'website'|'article'} [props.type]
 * @param {boolean} [props.noindex]
 * @param {string} [props.publishedTime] - ISO date for article:published_time
 */
export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image,
  type = 'website',
  noindex = false,
  publishedTime,
}) {
  const desc = truncateMeta(description);
  const pageTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const url = absoluteUrl(path);
  const ogImg = ogImageUrl(image);

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{pageTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImg} />
      <meta property="og:site_name" content={SITE_NAME} />
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImg} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
}
