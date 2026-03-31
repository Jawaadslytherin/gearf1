import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
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
      <div className="min-h-screen bg-background">
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
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-3xl mx-auto px-6 py-12 text-center">
          <p className="text-muted-foreground mb-6">{error || 'Article not found.'}</p>
          <Link to="/" className="text-primary hover:text-primary/90 no-underline">← Back to home</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-8 pb-12">
        <Link to="/" className="inline-block text-primary hover:text-primary/90 text-sm font-medium mb-6 no-underline">
          ← Back to home
        </Link>

        <article className="rounded-lg border border-border bg-card/60 overflow-hidden backdrop-blur-sm">
          {article.imageUrl && (
            <div className="relative">
              <img
                src={article.imageUrl}
                alt=""
                className="w-full aspect-video object-cover"
              />
              {article.photoCredit && (
                <span className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-1 text-[10px] font-body text-white/90">
                  {article.photoCredit}
                </span>
              )}
            </div>
          )}
          <div className="p-6 sm:p-8">
            <span className="inline-block text-primary text-[0.7rem] font-display font-semibold uppercase tracking-[0.2em] px-3 py-1 rounded-sm border border-primary/40 bg-primary/10 mb-3">
              {article.category}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-2">
              {article.title}
            </h1>
            {article.articleCredit && (
              <p className="font-body text-sm text-muted-foreground mb-2">
                {article.articleCredit}
              </p>
            )}
            <p className="font-body text-sm text-muted-foreground mb-6">
              {timeAgo(article.createdAt)}
              {article.updatedAt && article.updatedAt !== article.createdAt && (
                <span> · Updated {timeAgo(article.updatedAt)}</span>
              )}
            </p>
            {article.excerpt && (
              <p className="font-body text-lg text-muted-foreground leading-relaxed mb-6 border-l-4 border-primary/50 pl-4">
                {article.excerpt}
              </p>
            )}
            <div className="font-body text-foreground leading-relaxed whitespace-pre-wrap">
              {article.body || <p className="text-muted-foreground">No content yet.</p>}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
