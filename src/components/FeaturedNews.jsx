import { useState } from 'react';
import { Link } from 'react-router-dom';
import { timeAgo, categoryChipClasses, teamColorStripStyle } from '../lib/utils';

const FILTERS = ['All', 'Race Report', 'Qualifying', 'Practice', 'Analysis', 'Tech', 'Drivers', 'Teams', 'News'];

export default function FeaturedNews({ articles = [], loading }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const filtered =
    activeFilter === 'All'
      ? articles
      : articles.filter((a) => a.category === activeFilter);
  const list = filtered.slice(0, 6);

  if (loading) {
    return (
      <section className="mb-8">
        <div className="flex flex-wrap gap-4 mb-5">
          <div className="h-4 w-24 bg-border rounded" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-16 bg-border rounded-lg" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <div key={i} className="bg-bg-card rounded-2xl overflow-hidden animate-pulse">
              <div className="h-28 bg-border" />
              <div className="p-5 space-y-2">
                <div className="h-4 w-20 bg-border rounded" />
                <div className="h-4 w-full bg-border rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <h2 className="text-[0.75rem] font-semibold uppercase tracking-widest text-text-muted">
          Featured F1 Stories
        </h2>
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`px-3.5 py-2 rounded-lg text-[0.82rem] border transition-colors ${
                activeFilter === f
                  ? 'bg-accent text-bg-dark border-accent'
                  : 'bg-transparent text-text-muted border-border hover:text-text hover:border-text-muted'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {list.length === 0 ? (
          <p className="text-text-muted text-sm col-span-2">No articles in this category.</p>
        ) : (
          list.map((article) => (
            <Link key={article._id} to={`/article/${article.slug}`} className="block no-underline hover:no-underline">
              <article className="relative bg-bg-card rounded-2xl overflow-hidden hover:ring-2 hover:ring-accent/30 transition-shadow f1-card-hover">
                <div
                  className="absolute inset-x-0 top-0 h-1"
                  style={teamColorStripStyle(article.team)}
                  aria-hidden
                />
                {article.imageUrl ? (
                  <img
                    src={article.imageUrl}
                    alt=""
                    className="h-28 w-full object-cover"
                  />
                ) : (
                  <div className="h-28 bg-gradient-to-br from-[#1e1e1e] to-[#141414]" />
                )}
                <span className={`${categoryChipClasses(article.category)} mt-3 mx-5`}>
                  {article.category}
                </span>
                <h3 className="mt-1.5 mx-5 mb-5 text-[0.95rem] font-medium leading-snug text-text hover:text-accent">
                  {article.title}
                </h3>
              </article>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
