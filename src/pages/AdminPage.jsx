import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getArticles, createArticle, updateArticle, deleteArticle, uploadImage } from '../lib/api';
import Seo from '../components/Seo';
import RichParagraph from '../components/RichParagraph';

const CATEGORIES = ['Race Report', 'Qualifying', 'Practice', 'Analysis', 'Tech', 'Drivers', 'Teams', 'News'];

export default function AdminPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    subheading: '',
    category: 'Race Report',
    excerpt: '',
    content: [],
    imageUrl: '',
    photoCredit: '',
    articleCredit: '',
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
    } catch {
      setError('Could not load articles. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  function clearForm() {
    setForm({
      title: '',
      subheading: '',
      category: 'Race Report',
      excerpt: '',
      content: [],
      imageUrl: '',
      photoCredit: '',
      articleCredit: '',
      featured: false,
    });
    setImageFile(null);
    setImagePreview('');
    setEditingId(null);
  }

  function addBlock(type) {
    const block =
      type === 'paragraph'  ? { type: 'paragraph', text: '' }
      : type === 'embed'    ? { type: 'embed', url: '' }
      : type === 'subheading' ? { type: 'subheading', text: '' }
      :                       { type: 'divider' };
    setForm((f) => ({ ...f, content: [...f.content, block] }));
  }

  function updateBlock(index, patch) {
    setForm((f) => ({
      ...f,
      content: f.content.map((b, i) => (i === index ? { ...b, ...patch } : b)),
    }));
  }

  function removeBlock(index) {
    setForm((f) => ({ ...f, content: f.content.filter((_, i) => i !== index) }));
  }

  function moveBlock(index, dir) {
    setForm((f) => {
      const next = [...f.content];
      const target = index + dir;
      if (target < 0 || target >= next.length) return f;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...f, content: next };
    });
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
    // If the article has structured content blocks, use them.
    // Otherwise convert legacy body string into a single paragraph block.
    const content =
      Array.isArray(article.content) && article.content.length > 0
        ? article.content
        : article.body
        ? [{ type: 'paragraph', text: article.body }]
        : [];
    setForm({
      title: article.title,
      subheading: article.subheading || '',
      category: article.category,
      excerpt: article.excerpt || '',
      content,
      imageUrl: article.imageUrl || '',
      photoCredit: article.photoCredit || '',
      articleCredit: article.articleCredit || '',
      featured: !!article.featured,
    });
    setImageFile(null);
    setImagePreview(article.imageUrl || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen text-white f1-dashboard-bg">
      <Seo
        title="Articles admin"
        path="/admin"
        description="GearUp F1 CMS — not for public indexing."
        image="/logo.svg"
        noindex
      />
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/60 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-wider" style={{ color: '#00d4ff', textShadow: '0 0 12px rgba(0,212,255,0.4)' }}>
              F1 ADMIN
            </span>
            <span className="text-sm text-white/60 font-medium tracking-widest uppercase">Articles</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => { logout(); navigate('/admin/login'); }}
              className="text-sm font-medium text-white/70 hover:text-[#00d4ff] transition-colors"
            >
              Sign out
            </button>
            <Link
              to="/"
              className="text-sm font-medium text-[#00d4ff] hover:text-[#70eeff] no-underline transition-colors"
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <section className="f1-dashboard-panel mb-10">
          <h2 className="text-xl font-bold text-white mb-6 tracking-wide" style={{ textShadow: '0 0 12px rgba(255,255,255,0.15)' }}>
            {editingId ? 'Edit article' : 'Add new article'}
          </h2>

          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-500/20 text-red-300 text-sm border border-red-500/30">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 rounded-xl bg-emerald-500/20 text-emerald-300 text-sm border border-emerald-500/30">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Big match preview"
                className="f1-dashboard-input"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                Subheading
              </label>
              <input
                type="text"
                value={form.subheading}
                onChange={(e) => setForm((f) => ({ ...f, subheading: e.target.value }))}
                placeholder="e.g. A closer look at the title fight"
                className="f1-dashboard-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="f1-dashboard-input f1-dashboard-select"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                Short description (shown in lists)
              </label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="One or two sentences about the article"
                rows={2}
                className="f1-dashboard-input resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                Article content
              </label>
              <div className="space-y-3">
                {form.content.map((block, i) => (
                  <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{
                          color: block.type === 'embed' ? '#00d4ff'
                               : block.type === 'divider' ? '#737373'
                               : block.type === 'subheading' ? '#f59e0b'
                               : '#a3a3a3',
                        }}
                      >
                        {block.type === 'embed' ? 'Embed' : block.type === 'divider' ? 'Divider' : block.type === 'subheading' ? 'Subheading' : 'Paragraph'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveBlock(i, -1)}
                          disabled={i === 0}
                          className="text-white/40 hover:text-white/80 disabled:opacity-20 px-1 text-sm"
                          title="Move up"
                        >↑</button>
                        <button
                          type="button"
                          onClick={() => moveBlock(i, 1)}
                          disabled={i === form.content.length - 1}
                          className="text-white/40 hover:text-white/80 disabled:opacity-20 px-1 text-sm"
                          title="Move down"
                        >↓</button>
                        <button
                          type="button"
                          onClick={() => removeBlock(i)}
                          className="text-red-400/70 hover:text-red-400 px-1 text-sm ml-1"
                          title="Remove block"
                        >×</button>
                      </div>
                    </div>
                    {block.type === 'subheading' ? (
                      <input
                        type="text"
                        value={block.text}
                        onChange={(e) => updateBlock(i, { text: e.target.value })}
                        placeholder="Section heading..."
                        className="f1-dashboard-input font-bold"
                      />
                    ) : block.type === 'paragraph' ? (
                      <RichParagraph
                        value={block.text}
                        onChange={(html) => updateBlock(i, { text: html })}
                        placeholder="Paragraph text... (select text to add a hyperlink)"
                      />
                    ) : block.type === 'embed' ? (
                      <input
                        type="url"
                        value={block.url}
                        onChange={(e) => updateBlock(i, { url: e.target.value })}
                        placeholder="https://twitter.com/.../status/123 or https://instagram.com/p/..."
                        className="f1-dashboard-input"
                      />
                    ) : (
                      <div className="border-t border-white/20 my-1" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => addBlock('subheading')}
                  className="f1-dashboard-btn-ghost text-sm"
                  style={{ color: '#f59e0b', borderColor: 'rgba(245,158,11,0.3)' }}
                >
                  + Subheading
                </button>
                <button
                  type="button"
                  onClick={() => addBlock('paragraph')}
                  className="f1-dashboard-btn-ghost text-sm"
                >
                  + Paragraph
                </button>
                <button
                  type="button"
                  onClick={() => addBlock('divider')}
                  className="f1-dashboard-btn-ghost text-sm"
                  style={{ color: '#737373', borderColor: 'rgba(115,115,115,0.3)' }}
                >
                  + Divider
                </button>
                <button
                  type="button"
                  onClick={() => addBlock('embed')}
                  className="f1-dashboard-btn-ghost text-sm"
                  style={{ color: '#00d4ff', borderColor: 'rgba(0,212,255,0.3)' }}
                >
                  + Embed
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                Cover image
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                className="w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#00d4ff]/20 file:text-[#00d4ff] file:font-semibold file:cursor-pointer"
              />
              {imagePreview && (
                <div className="mt-3 rounded-xl overflow-hidden border border-white/20" style={{ boxShadow: '0 0 20px rgba(0,212,255,0.1)' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-40 w-full object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                Photograph credit
              </label>
              <input
                type="text"
                value={form.photoCredit}
                onChange={(e) => setForm((f) => ({ ...f, photoCredit: e.target.value }))}
                placeholder="e.g. Photo: Getty Images / Mark Thompson"
                className="f1-dashboard-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                Article credit
              </label>
              <input
                type="text"
                value={form.articleCredit}
                onChange={(e) => setForm((f) => ({ ...f, articleCredit: e.target.value }))}
                placeholder="e.g. By Mohd A."
                className="f1-dashboard-input"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                className="w-4 h-4 rounded border-white/30 bg-black/50 text-[#e10600] focus:ring-[#00d4ff] focus:ring-offset-0 focus:ring-2"
              />
              <label htmlFor="featured" className="text-sm text-white/70">
                Show as featured on homepage
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="f1-dashboard-btn-primary"
              >
                {saving ? 'Saving...' : editingId ? 'Update article' : 'Publish article'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="f1-dashboard-btn-ghost"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-4 tracking-wide flex items-center gap-2">
            <span style={{ color: '#00d4ff' }}>Your articles</span>
          </h2>
          {loading ? (
            <p className="text-white/50">Loading...</p>
          ) : articles.length === 0 ? (
            <p className="text-white/50">No articles yet. Add one above.</p>
          ) : (
            <ul className="space-y-3">
              {articles.map((a) => (
                <li
                  key={a._id}
                  className="f1-dashboard-article-card flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white truncate">{a.title}</p>
                    <p className="text-sm text-white/50">
                      {a.category} · {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(a)}
                      className="f1-dashboard-btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(a._id)}
                      className="f1-dashboard-btn-ghost"
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
