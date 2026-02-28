import { useState, useEffect } from 'react';
import Header from '../components/Header';
import FeaturedArticle from '../components/FeaturedArticle';
import RecentNews from '../components/RecentNews';
import TrendyNews from '../components/TrendyNews';
import FeaturedNews from '../components/FeaturedNews';
import MatchOverview from '../components/MatchOverview';
import LiveMatch from '../components/LiveMatch';
import TodaysSpotlight from '../components/TodaysSpotlight';
import { getArticles } from '../lib/api';

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticles()
      .then((data) => setArticles(data.articles || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  const featured = articles.find((a) => a.featured) || articles[0];
  const recent = articles.slice(0, 4);
  const trendy = articles.slice(1, 4);
  const spotlight = articles.slice(0, 3);

  return (
    <div className="min-h-screen bg-bg-dark">
      <Header />
      <div className="max-w-[1320px] mx-auto px-6 py-2 text-center text-text-muted text-xs uppercase tracking-widest">
        Ad
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-[260px_1fr_280px] gap-8 max-w-[1320px] mx-auto px-6 py-8 pb-12">
        <aside className="order-2 lg:order-1">
          <MatchOverview />
        </aside>

        <div className="min-w-0 order-1 lg:order-2">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 mb-10">
            <FeaturedArticle article={featured} loading={loading} />
            <RecentNews articles={recent} loading={loading} />
          </div>
          <TrendyNews articles={trendy} loading={loading} />
          <FeaturedNews articles={articles} loading={loading} />
        </div>

        <aside className="order-3 space-y-8">
          <LiveMatch />
          <TodaysSpotlight articles={spotlight} loading={loading} />
        </aside>
      </main>
    </div>
  );
}
