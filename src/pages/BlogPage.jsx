import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Flag } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { Badge } from '../components/ui/Badge';
import { getArticles } from '../lib/api';
import { timeAgo } from '../lib/utils';

export default function BlogPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticles()
      .then((data) => setArticles(data.articles || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="F1 stories & race analysis"
        path="/blog"
        description="Every GearUp F1 article: race reports, qualifying, tech, drivers, and paddock news — updated through the season."
      />
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-14 pb-20">
        <div className="mb-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 rounded-full bg-primary" />
            <span className="font-display text-[10px] tracking-[0.3em] text-primary uppercase">Blog</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Stories & analysis</h1>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            Browse every post. For the{' '}
            <Link to="/" className="text-primary hover:text-primary/90 no-underline">homepage</Link>
            {' '}with live telemetry, visit the pit wall. Explore the{' '}
            <Link to="/calendar" className="text-primary hover:text-primary/90 no-underline">race calendar</Link>
            {' '}and{' '}
            <Link to="/drivers" className="text-primary hover:text-primary/90 no-underline">driver grid</Link>.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-lg border border-border bg-card/60 overflow-hidden animate-pulse h-48" />
            ))
          ) : (
            articles.map((article) => (
              <Link key={article._id} to={`/article/${article.slug}`} className="block no-underline">
                <article className="group relative rounded-lg border border-border bg-card/60 backdrop-blur-sm overflow-hidden hover:border-primary/30 transition-all duration-300 h-full">
                  <div className="h-[2px] bg-gradient-to-r from-primary/60 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant="outline"
                        className="font-display text-[9px] tracking-[0.15em] uppercase border-border text-muted-foreground rounded-sm"
                      >
                        {article.category}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
                        <Clock className="h-3 w-3" />
                        <span className="font-body text-[11px]">{article.readTime || '4 min'}</span>
                      </div>
                    </div>
                    <h2 className="font-display text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {article.excerpt || 'Read the full story.'}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="font-body text-[11px] text-muted-foreground">
                        {timeAgo(article.createdAt)}
                      </span>
                      <span className="flex items-center gap-1 font-display text-[10px] tracking-[0.15em] uppercase text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Read
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>

        {!loading && articles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Flag className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="font-display text-sm text-muted-foreground">No articles yet. Check back soon.</p>
            <Link to="/" className="mt-4 text-primary text-sm no-underline">← Home</Link>
          </div>
        )}

        <nav className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-8 font-body text-sm text-muted-foreground">
          <Link to="/about" className="text-foreground hover:text-primary no-underline">About GearUp F1</Link>
          <Link to="/contact" className="text-foreground hover:text-primary no-underline">Contact</Link>
          <Link to="/calendar" className="text-foreground hover:text-primary no-underline">Race calendar</Link>
        </nav>
      </main>
      <Footer />
    </div>
  );
}
