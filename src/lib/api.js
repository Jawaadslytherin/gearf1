const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001';

export async function getArticles(params = {}) {
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/articles${q ? '?' + q : ''}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getArticle(id) {
  const res = await fetch(`${API_BASE}/api/articles/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getArticleBySlug(slug) {
  const res = await fetch(`${API_BASE}/api/articles/by-slug/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createArticle(data) {
  const res = await fetch(`${API_BASE}/api/articles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Failed to create article');
  }
  return res.json();
}

export async function updateArticle(id, data) {
  const res = await fetch(`${API_BASE}/api/articles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Failed to update article');
  }
  return res.json();
}

export async function deleteArticle(id) {
  const res = await fetch(`${API_BASE}/api/articles/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete article');
  return res.json();
}

export async function uploadImage(file) {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Upload failed');
  }
  const data = await res.json();
  return `${API_BASE}${data.url}`;
}

export async function getFootballMatches(params = {}) {
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/football/matches${q ? '?' + q : ''}`);
  if (!res.ok) return { matches: [] };
  return res.json();
}
