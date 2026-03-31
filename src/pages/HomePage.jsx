import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock, Flame, Flag, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import F1Telemetry from '../components/F1Telemetry';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { getArticles } from '../lib/api';
import { timeAgo } from '../lib/utils';

const CATEGORIES = ['All', 'Race Report', 'Qualifying', 'Practice', 'Analysis', 'Tech', 'Drivers', 'Teams', 'News'];

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    getArticles()
      .then((data) => setArticles(data.articles || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  const featured = articles.find((a) => a.featured) || articles[0];
  const filtered = activeCategory === 'All'
    ? articles.filter((a) => a !== featured)
    : articles.filter((a) => a !== featured && a.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero / Featured Article */}
      {featured && !loading && (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            {featured.imageUrl ? (
              <img src={featured.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#1e1e1e] to-[#141414]" />
            )}
            {featured.imageUrl && featured.photoCredit && (
              <span className="absolute bottom-3 right-3 z-20 rounded bg-black/60 px-2 py-1 text-[10px] font-body text-white/90">
                {featured.photoCredit}
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
          </div>
          <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
            <div className="max-w-2xl space-y-6">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary text-primary-foreground font-display text-[10px] tracking-[0.2em] uppercase border-none rounded-sm px-3 py-1">
                  <Flame className="mr-1.5 h-3 w-3 inline" />
                  Featured
                </Badge>
                <span className="font-body text-xs text-muted-foreground">
                  {timeAgo(featured.createdAt) || new Date(featured.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight text-foreground">
                {featured.title}
              </h1>
              {featured.articleCredit && (
                <p className="font-body text-xs text-muted-foreground">
                  {featured.articleCredit}
                </p>
              )}
              <p className="font-body text-base text-muted-foreground leading-relaxed max-w-lg line-clamp-2">
                {featured.excerpt || 'Read the full story.'}
              </p>
              <Link to={`/article/${featured.slug}`} className="no-underline">
                <Button className="group bg-primary font-display text-[10px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-primary/90 h-11 px-6">
                  Read Article
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Loading hero placeholder */}
      {loading && (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e1e1e] to-[#141414]" />
          <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
            <div className="max-w-2xl space-y-6 animate-pulse">
              <div className="h-6 w-24 bg-border rounded" />
              <div className="h-12 w-3/4 bg-border rounded" />
              <div className="h-4 w-full bg-border rounded" />
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
          <div>
            {/* Section heading */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-8 rounded-full bg-primary" />
                  <span className="font-display text-[10px] tracking-[0.3em] text-primary uppercase">
                    Latest Stories
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground">From the Paddock</h2>
              </div>

              {/* Category filter */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`font-display text-[10px] tracking-[0.15em] uppercase px-4 py-2 rounded-sm border transition-colors ${
                      activeCategory === cat
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <article key={i} className="rounded-lg border border-border bg-card/60 overflow-hidden animate-pulse">
                    <div className="h-32 bg-border" />
                    <div className="p-6 space-y-4">
                      <div className="h-4 w-20 bg-border rounded" />
                      <div className="h-5 w-full bg-border rounded" />
                      <div className="h-3 w-3/4 bg-border rounded" />
                    </div>
                  </article>
                ))
              ) : (
                filtered.map((article) => (
                  <Link key={article._id} to={`/article/${article.slug}`} className="block no-underline">
                    <article className="group relative rounded-lg border border-border bg-card/60 backdrop-blur-sm overflow-hidden hover:border-primary/30 transition-all duration-300">
                      {/* Top accent line */}
                      <div className="h-[2px] bg-gradient-to-r from-primary/60 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className="font-display text-[9px] tracking-[0.15em] uppercase border-border text-muted-foreground rounded-sm"
                          >
                            {article.category}
                          </Badge>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span className="font-body text-[11px]">
                              {article.readTime || '4 min'}
                            </span>
                          </div>
                        </div>

                        <h3 className="font-display text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        {article.articleCredit && (
                          <p className="font-body text-[11px] text-muted-foreground line-clamp-1">
                            {article.articleCredit}
                          </p>
                        )}

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

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Flag className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="font-display text-sm text-muted-foreground">
                  No articles in this category yet.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar: F1 Telemetry */}
          <aside className="lg:order-2">
            <F1Telemetry />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
