/**
 * Post-build static HTML for each article (crawlable body + full <head> before JS).
 * Vercel serves dist/article/:slug/index.html before the SPA catch-all when filesystem matches.
 *
 * For a dynamic Express "head only" layer on Node hosting, you could instead render this
 * response per request; this script is the static equivalent for Vercel + CDN.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { loadEnvFiles } from './load-env.mjs';
import {
  articleMetaDescription,
  buildArticleJsonLd,
  ogImageUrlForSite,
} from '../src/lib/articleStructuredData.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distDir = join(root, 'dist');

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(s) {
  return escapeHtml(s);
}

function extractAssets(html) {
  const scriptM = html.match(/<script type="module"[^>]*src="([^"]+)"[^>]*>\s*<\/script>/);
  const cssM = html.match(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/);
  return { js: scriptM?.[1], css: cssM?.[1] };
}

function buildArticleHtml(article, slug, siteUrl, scriptTag, linkTag) {
  const pageUrl = `${siteUrl}/article/${encodeURIComponent(slug)}`;
  const desc = articleMetaDescription(article);
  const ogImage = ogImageUrlForSite(siteUrl, article.imageUrl);
  const pageTitle = `${article.title} | GearUp F1`;
  const published = article.createdAt ? new Date(article.createdAt).toISOString() : '';
  const jsonLd = JSON.stringify(buildArticleJsonLd(article, slug, siteUrl)).replace(/</g, '\\u003c');

  const imgBlock =
    article.imageUrl &&
    `<figure style="margin:0 0 1.5rem"><img src="${escapeAttr(article.imageUrl)}" alt="${escapeAttr(article.title)}" width="1200" height="675" decoding="async" fetchpriority="high" style="width:100%;height:auto;border-radius:8px;display:block" />${
      article.photoCredit
        ? `<figcaption style="font-size:11px;color:#888;margin-top:0.5rem">${escapeHtml(article.photoCredit)}</figcaption>`
        : ''
    }</figure>`;

  const creditBlock =
    article.articleCredit &&
    `<p style="font-size:14px;color:#a3a3a3;margin:0 0 1rem">${escapeHtml(article.articleCredit)}</p>`;

  const excerptBlock =
    article.excerpt &&
    `<p style="font-size:1.05rem;color:#d4d4d4;line-height:1.6;border-left:4px solid #ef4444;padding-left:1rem;margin:0 0 1.5rem">${escapeHtml(article.excerpt)}</p>`;

  // Render body content — structured blocks take priority over legacy body string
  const bodyHtml =
    Array.isArray(article.content) && article.content.length > 0
      ? article.content
          .map((block) => {
            if (block.type === 'paragraph') {
              return `<p style="white-space:pre-wrap;margin:0 0 1rem;font-size:1rem;color:#e5e5e5">${escapeHtml(block.text || '')}</p>`;
            }
            if (block.type === 'divider') {
              return `<hr style="border:none;border-top:1px solid #27272a;margin:1.5rem 0" />`;
            }
            if (block.type === 'embed' && block.url) {
              // Embeds are client-only; expose the URL as a link so crawlers see the reference
              return `<p style="font-size:0.875rem;color:#737373;margin:0 0 1rem"><a href="${escapeAttr(block.url)}" rel="noopener noreferrer" style="color:#ef4444">${escapeHtml(block.url)}</a></p>`;
            }
            return '';
          })
          .join('')
      : `<div style="white-space:pre-wrap;font-size:1rem;color:#e5e5e5">${escapeHtml(article.body || '')}</div>`;

  const inner = `
    <div style="max-width:48rem;margin:0 auto;padding:1.5rem 1.25rem 3rem;font-family:ui-sans-serif,system-ui,sans-serif;background:#0a0a0a;color:#fafafa;min-height:100vh;line-height:1.5">
      <nav style="font-size:14px;margin-bottom:1.5rem"><a href="/" style="color:#ef4444;text-decoration:none">Home</a> <span style="color:#737373">/</span> <a href="/blog" style="color:#ef4444;text-decoration:none">Blog</a></nav>
      <article>
        <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#ef4444;margin:0 0 0.75rem">${escapeHtml(article.category || '')}</p>
        <h1 style="font-size:1.75rem;font-weight:700;margin:0 0 1rem;line-height:1.2">${escapeHtml(article.title)}</h1>
        ${creditBlock}
        ${imgBlock}
        ${excerptBlock}
        ${bodyHtml}
      </article>
      <p style="margin-top:2rem;font-size:13px"><a href="/blog" style="color:#ef4444;text-decoration:none">More articles</a> · <a href="/calendar" style="color:#ef4444;text-decoration:none">Calendar</a> · <a href="/drivers" style="color:#ef4444;text-decoration:none">Drivers</a></p>
    </div>`.trim();

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeAttr(desc)}" />
    <link rel="canonical" href="${escapeAttr(pageUrl)}" />
    <meta property="og:title" content="${escapeAttr(pageTitle)}" />
    <meta property="og:description" content="${escapeAttr(desc)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${escapeAttr(pageUrl)}" />
    <meta property="og:image" content="${escapeAttr(ogImage)}" />
    <meta property="og:site_name" content="GearUp F1" />
    ${published ? `<meta property="article:published_time" content="${escapeAttr(published)}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(pageTitle)}" />
    <meta name="twitter:description" content="${escapeAttr(desc)}" />
    <meta name="twitter:image" content="${escapeAttr(ogImage)}" />
    <script type="application/ld+json">${jsonLd}</script>
    ${linkTag}
    ${scriptTag}
  </head>
  <body>
    <div id="root">${inner}</div>
  </body>
</html>
`;
}

async function main() {
  loadEnvFiles(root);
  const SITE_URL = (process.env.VITE_SITE_URL || 'https://gearupf1.com').replace(/\/$/, '');
  const API_BASE = (process.env.VITE_API_URL || 'http://127.0.0.1:3001').replace(/\/$/, '');

  const indexPath = join(distDir, 'index.html');
  let baseHtml;
  try {
    baseHtml = readFileSync(indexPath, 'utf8');
  } catch {
    console.error('[prerender] dist/index.html missing — run vite build first');
    process.exit(1);
  }

  const { js, css } = extractAssets(baseHtml);
  if (!js || !css) {
    console.error('[prerender] Could not parse script/link from dist/index.html');
    process.exit(1);
  }
  const scriptTag = `<script type="module" crossorigin src="${js}"></script>`;
  const linkTag = `<link rel="stylesheet" crossorigin href="${css}">`;

  let articles = [];
  try {
    const res = await fetch(`${API_BASE}/api/articles?limit=500`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    articles = Array.isArray(data.articles) ? data.articles : [];
  } catch (e) {
    console.warn('[prerender] API unavailable; skipping article prerender:', e.message);
    return;
  }

  let count = 0;
  for (const article of articles) {
    if (!article.slug) continue;
    if (article.slug.includes('/') || article.slug.includes('\\')) {
      console.warn('[prerender] skip unsafe slug:', article.slug);
      continue;
    }
    const slug = article.slug;
    const outDir = join(distDir, 'article', slug);
    mkdirSync(outDir, { recursive: true });
    const html = buildArticleHtml(article, slug, SITE_URL, scriptTag, linkTag);
    writeFileSync(join(outDir, 'index.html'), html, 'utf8');
    count++;
  }
  console.log(`[prerender] wrote ${count} article page(s) under dist/article/<slug>/index.html`);
}

main().catch((err) => {
  console.error('[prerender]', err);
  process.exit(1);
});
