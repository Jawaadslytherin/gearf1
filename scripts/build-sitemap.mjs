/**
 * Writes public/sitemap.xml before Vite build: static routes + article URLs from API.
 * Env: VITE_SITE_URL, VITE_API_URL (or .env / .env.production).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');

function loadEnvFile(rel) {
  try {
    const text = readFileSync(join(root, rel), 'utf8');
    for (const line of text.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('=');
      if (eq === -1) continue;
      const key = t.slice(0, eq).trim();
      let val = t.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  } catch {
    /* optional */
  }
}

loadEnvFile('.env.production');
loadEnvFile('.env');

const SITE_URL = (process.env.VITE_SITE_URL || 'https://gearupf1.com').replace(/\/$/, '');
const API_BASE = (process.env.VITE_API_URL || 'http://127.0.0.1:3001').replace(/\/$/, '');

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function w3cDate(d) {
  if (!d) return new Date().toISOString().slice(0, 10);
  const x = new Date(d);
  return Number.isNaN(x.getTime()) ? new Date().toISOString().slice(0, 10) : x.toISOString().slice(0, 10);
}

function urlEntry(loc, priority, changefreq, lastmod) {
  const parts = [`<loc>${xmlEscape(loc)}</loc>`];
  if (lastmod) parts.push(`<lastmod>${lastmod}</lastmod>`);
  if (changefreq) parts.push(`<changefreq>${changefreq}</changefreq>`);
  parts.push(`<priority>${priority}</priority>`);
  return `  <url>\n    ${parts.join('\n    ')}\n  </url>`;
}

async function fetchArticles() {
  const res = await fetch(`${API_BASE}/api/articles?limit=500`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Articles ${res.status}`);
  const data = await res.json();
  return Array.isArray(data.articles) ? data.articles : [];
}

async function main() {
  mkdirSync(publicDir, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);

  const staticRoutes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/blog', priority: '0.9', changefreq: 'daily' },
    { path: '/calendar', priority: '0.85', changefreq: 'weekly' },
    { path: '/drivers', priority: '0.85', changefreq: 'weekly' },
    { path: '/about', priority: '0.7', changefreq: 'monthly' },
    { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  ];

  const urls = staticRoutes.map((r) =>
    urlEntry(`${SITE_URL}${r.path}`, r.priority, r.changefreq, today),
  );

  let articles = [];
  try {
    articles = await fetchArticles();
    console.log(`[sitemap] ${articles.length} article URL(s) from API`);
  } catch (e) {
    console.warn(`[sitemap] API skip (${e.message}); static routes only`);
  }

  for (const a of articles) {
    if (!a.slug) continue;
    const loc = `${SITE_URL}/article/${encodeURIComponent(a.slug)}`;
    urls.push(urlEntry(loc, '0.8', 'weekly', w3cDate(a.updatedAt || a.createdAt)));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core + content (articles merged at build; re-run deploy after new posts) -->
${urls.join('\n')}
</urlset>
`;

  writeFileSync(join(publicDir, 'sitemap.xml'), xml, 'utf8');
  console.log(`[sitemap] wrote public/sitemap.xml (${urls.length} URLs)`);
}

main().catch((err) => {
  console.error('[sitemap]', err);
  process.exit(1);
});
