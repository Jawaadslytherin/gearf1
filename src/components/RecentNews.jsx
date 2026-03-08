import { useState } from 'react';
import { Link } from 'react-router-dom';
import { timeAgo, categoryChipClasses, teamColorStripStyle } from '../lib/utils';

export default function RecentNews({ articles = [], loading }) {
  const [activeTab, setActiveTab] = useState('recent');
  const list = articles.slice(0, 4);

  if (loading) {
    return (
      <section className="bg-bg-card rounded-2xl p-5 h-fit">
        <div className="flex gap-1.5 mb-5">
          <div className="h-9 w-24 bg-border rounded-lg" />
          <div className="h-9 w-20 bg-border rounded-lg" />
        </div>
        <ul className="list-none p-0 m-0 space-y-4">
          {[1, 2, 3].map((i) => (
            <li key={i} className="grid grid-cols-[52px_1fr] gap-4 py-2">
              <div className="w-[52px] h-[52px] rounded-xl bg-border animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-16 bg-border rounded" />
                <div className="h-4 w-full bg-border rounded" />
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="bg-bg-card rounded-2xl p-5 h-fit">
      <div className="flex gap-1.5 mb-5">
        <button
          type="button"
          onClick={() => setActiveTab('recent')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'recent'
              ? 'bg-accent text-bg-dark'
              : 'text-text-muted hover:text-text'
          }`}
        >
          Recent News
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('top')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'top'
              ? 'bg-accent text-bg-dark'
              : 'text-text-muted hover:text-text'
          }`}
        >
          Top Story
        </button>
      </div>
      <ul className="list-none p-0 m-0">
        {list.length === 0 ? (
          <li className="py-4 text-text-muted text-sm">No articles yet.</li>
        ) : (
          list.map((item, i) => (
            <li
              key={item._id}
              className={`relative grid grid-cols-[52px_1fr] gap-4 py-4 border-b border-border last:border-0 first:pt-0 f1-card-hover ${
                i === 1 ? 'bg-accent/10 -mx-3 px-3 py-4 rounded-xl border-0 my-1' : ''
              }`}
            >
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={teamColorStripStyle(item.team)}
                aria-hidden
              />
              <Link to={`/article/${item.slug}`} className="contents no-underline hover:no-underline">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="w-[52px] h-[52px] rounded-xl object-cover shrink-0"
                  />
                ) : (
                  <div className="w-[52px] h-[52px] rounded-xl bg-border shrink-0" />
                )}
                <div>
                  <div className="flex gap-2 items-center text-[0.78rem] text-text-muted">
                    <span className={categoryChipClasses(item.category)}>{item.category}</span>
                    <span>{timeAgo(item.createdAt)}</span>
                  </div>
                  <h3 className="mt-1.5 text-sm font-medium leading-snug text-text hover:text-accent">{item.title}</h3>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
