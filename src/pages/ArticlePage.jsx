import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { getArticleBySlug } from '../lib/api';
import { timeAgo } from '../lib/utils';

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    getArticleBySlug(slug)
      .then(setArticle)
      .catch(() => setError('Article not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark">
        <Header />
        <main className="max-w-3xl mx-auto px-6 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-3/4 bg-border rounded" />
            <div className="h-4 w-24 bg-border rounded" />
            <div className="h-64 bg-border rounded" />
            <div className="h-4 w-full bg-border rounded" />
            <div className="h-4 w-full bg-border rounded" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-bg-dark">
        <Header />
        <main className="max-w-3xl mx-auto px-6 py-12 text-center">
          <p className="text-text-muted mb-6">{error || 'Article not found.'}</p>
          <Link to="/" className="text-accent hover:underline">← Back to home</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-8 pb-12">
        <Link to="/" className="inline-block text-accent hover:text-accent-dim text-sm font-medium mb-6 no-underline hover:no-underline">
          ← Back to home
        </Link>

        <article className="bg-bg-card rounded-2xl overflow-hidden border border-border">
          {article.imageUrl && (
            <img
              src={article.imageUrl}
              alt=""
              className="w-full aspect-video object-cover"
            />
          )}
          <div className="p-6 sm:p-8">
            <span className="inline-block text-accent text-[0.7rem] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border border-accent/40 bg-accent/10 mb-3">
              {article.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">
              {article.title}
            </h1>
            <p className="text-sm text-text-muted mb-6">
              {timeAgo(article.createdAt)}
              {article.updatedAt && article.updatedAt !== article.createdAt && (
                <span> · Updated {timeAgo(article.updatedAt)}</span>
              )}
            </p>
            {article.excerpt && (
              <p className="text-lg text-text-muted leading-relaxed mb-6 border-l-4 border-accent/50 pl-4">
                {article.excerpt}
              </p>
            )}
            <div className="prose prose-invert max-w-none text-text leading-relaxed whitespace-pre-wrap">
              {article.body || <p className="text-text-muted">No content yet.</p>}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
