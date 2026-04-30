import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import ArticleJsonLd from '../components/ArticleJsonLd';
import SocialEmbed from '../components/SocialEmbed';
import { getArticleBySlug } from '../lib/api';
import { articleMetaDescription } from '../lib/seo';
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
        <Seo
          title="Article"
          path={slug ? `/article/${slug}` : '/'}
          description="Loading article on GearUp F1."
        />
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
        <Seo
          title="Article not found"
          path={slug ? `/article/${slug}` : '/'}
          description="This article may have been removed or the link is incorrect."
          noindex
        />
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
      <Seo
        title={article.title}
        description={articleMetaDescription(article)}
        path={`/article/${slug}`}
        image={article.imageUrl}
        type="article"
        publishedTime={
          article.createdAt
            ? new Date(article.createdAt).toISOString()
            : undefined
        }
      />
      <ArticleJsonLd article={article} slug={slug} />
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-8 pb-12">
        <nav className="font-body text-sm text-muted-foreground mb-6 flex flex-wrap gap-x-2 gap-y-1">
          <Link to="/" className="text-primary hover:text-primary/90 no-underline">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/blog" className="text-primary hover:text-primary/90 no-underline">Blog</Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground truncate max-w-[12rem] sm:max-w-none">{article.title}</span>
        </nav>

        <article className="rounded-lg border border-border bg-card/60 overflow-hidden backdrop-blur-sm">
          {article.imageUrl && (
            <div className="relative">
              <img
                src={article.imageUrl}
                alt={article.title ? `${article.title.slice(0, 120)}${article.title.length > 120 ? '…' : ''}` : ''}
                className="w-full aspect-video object-cover"
                width={1200}
                height={675}
                decoding="async"
                fetchPriority="high"
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
            {article.subheading && (
              <p className="font-display text-lg sm:text-xl text-muted-foreground leading-snug mb-3">
                {article.subheading}
              </p>
            )}
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
            {Array.isArray(article.content) && article.content.length > 0 ? (
              <div className="font-body text-foreground leading-relaxed space-y-4 [&_a]:text-primary [&_a]:underline [&_a:hover]:text-primary/80">
                {article.content.map((block, index) => {
                  if (block.type === 'subheading') {
                    return (
                      <h2 key={index} className="font-display text-lg font-bold text-foreground mt-6 mb-1">
                        {block.text}
                      </h2>
                    );
                  }
                  if (block.type === 'paragraph') {
                    return (
                      <p key={index} className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: block.text }} />
                    );
                  }
                  if (block.type === 'divider') {
                    return (
                      <hr key={index} className="border-t border-border my-6" />
                    );
                  }
                  if (block.type === 'embed') {
                    return (
                      <div key={index} className="my-4">
                        <SocialEmbed url={block.url} />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            ) : (
              <div className="font-body text-foreground leading-relaxed whitespace-pre-wrap">
                {article.body || <p className="text-muted-foreground">No content yet.</p>}
              </div>
            )}
            <nav className="mt-10 pt-8 border-t border-border font-body text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-2">
              <Link to="/blog" className="text-primary no-underline hover:text-primary/90">More articles</Link>
              <Link to="/calendar" className="text-primary no-underline hover:text-primary/90">Calendar</Link>
              <Link to="/drivers" className="text-primary no-underline hover:text-primary/90">Drivers</Link>
              <Link to="/contact" className="text-primary no-underline hover:text-primary/90">Contact</Link>
            </nav>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
