import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArticles, createArticle, updateArticle, deleteArticle, uploadImage } from '../lib/api';

const CATEGORIES = ['Football', 'Cricket', 'Rugby', 'Tennis', 'Golf', 'Cycling', 'Others'];

export default function AdminPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    category: 'Football',
    excerpt: '',
    body: '',
    imageUrl: '',
    featured: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    try {
      setLoading(true);
      const { articles: list } = await getArticles();
      setArticles(list || []);
    } catch (e) {
      setError('Could not load articles. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  function clearForm() {
    setForm({
      title: '',
      category: 'Football',
      excerpt: '',
      body: '',
      imageUrl: '',
      featured: false,
    });
    setImageFile(null);
    setImagePreview('');
    setEditingId(null);
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.title.trim()) {
      setError('Please enter a title.');
      return;
    }
    setSaving(true);
    try {
      let imageUrl = form.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      const payload = { ...form, imageUrl };
      if (editingId) {
        await updateArticle(editingId, payload);
        setSuccess('Article updated.');
      } else {
        await createArticle(payload);
        setSuccess('Article created.');
      }
      clearForm();
      loadArticles();
    } catch (e) {
      setError(e.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this article?')) return;
    setError('');
    try {
      await deleteArticle(id);
      setSuccess('Article deleted.');
      loadArticles();
      if (editingId === id) clearForm();
    } catch (e) {
      setError(e.message || 'Could not delete.');
    }
  }

  function startEdit(article) {
    setEditingId(article._id);
    setForm({
      title: article.title,
      category: article.category,
      excerpt: article.excerpt || '',
      body: article.body || '',
      imageUrl: article.imageUrl || '',
      featured: !!article.featured,
    });
    setImageFile(null);
    setImagePreview(article.imageUrl || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-bg-dark text-text">
      <header className="bg-bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Admin – Articles</h1>
          <Link
            to="/"
            className="text-accent hover:text-accent-dim no-underline hover:no-underline text-sm font-medium"
          >
            ← Back to site
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <section className="bg-bg-card rounded-2xl p-6 mb-10">
          <h2 className="text-lg font-semibold text-white mb-6">
            {editingId ? 'Edit article' : 'Add new article'}
          </h2>

          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-500/20 text-red-300 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 rounded-xl bg-green-500/20 text-green-300 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Big match preview"
                className="w-full px-4 py-3 rounded-xl bg-bg-dark border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-accent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-bg-dark border border-border text-text focus:outline-none focus:border-accent"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">
                Short description (shown in lists)
              </label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="One or two sentences about the article"
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-bg-dark border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-accent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">
                Full article content
              </label>
              <textarea
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                placeholder="Write your article here..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl bg-bg-dark border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-accent resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">
                Cover image
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                className="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent/20 file:text-accent file:font-medium"
              />
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-40 rounded-xl object-cover border border-border"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                className="w-4 h-4 rounded border-border bg-bg-dark text-accent focus:ring-accent"
              />
              <label htmlFor="featured" className="text-sm text-text-muted">
                Show as featured on homepage
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-accent text-bg-dark font-semibold hover:bg-accent-dim disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : editingId ? 'Update article' : 'Publish article'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="px-6 py-3 rounded-xl border border-border text-text-muted hover:text-text hover:border-text-muted"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Your articles</h2>
          {loading ? (
            <p className="text-text-muted">Loading...</p>
          ) : articles.length === 0 ? (
            <p className="text-text-muted">No articles yet. Add one above.</p>
          ) : (
            <ul className="space-y-3">
              {articles.map((a) => (
                <li
                  key={a._id}
                  className="flex flex-wrap items-center justify-between gap-4 bg-bg-card rounded-xl p-4 border border-border"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white truncate">{a.title}</p>
                    <p className="text-sm text-text-muted">
                      {a.category} · {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(a)}
                      className="px-4 py-2 rounded-lg bg-accent/20 text-accent font-medium hover:bg-accent/30"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(a._id)}
                      className="px-4 py-2 rounded-lg border border-border text-text-muted hover:text-red-400 hover:border-red-400/50"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
