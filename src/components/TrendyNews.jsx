import { Link } from 'react-router-dom';
import { timeAgo } from '../lib/utils';

export default function TrendyNews({ articles = [], loading }) {
  const list = articles.slice(1, 4);

  if (loading) {
    return (
      <section className="mb-10">
        <div className="h-4 w-28 bg-border rounded mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-bg-card rounded-2xl overflow-hidden animate-pulse">
              <div className="h-36 bg-border" />
              <div className="p-5 space-y-2">
                <div className="h-3 w-20 bg-border rounded" />
                <div className="h-4 w-full bg-border rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (list.length === 0) {
    return (
      <section className="mb-10">
        <h2 className="text-[0.75rem] font-semibold uppercase tracking-widest text-text-muted mb-5">
          Trendy News
        </h2>
        <p className="text-text-muted text-sm">No articles yet.</p>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <h2 className="text-[0.75rem] font-semibold uppercase tracking-widest text-text-muted mb-5">
        Trendy News
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {list.map((item) => (
          <Link key={item._id} to={`/article/${item.slug}`} className="block no-underline hover:no-underline">
            <article className="bg-bg-card rounded-2xl overflow-hidden hover:ring-2 hover:ring-accent/30 transition-shadow">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt=""
                  className="h-36 w-full object-cover"
                />
              ) : (
                <div className="h-36 bg-gradient-to-br from-[#1e1e1e] to-[#141414]" />
              )}
              <div className="flex items-center justify-between gap-2 pt-3 px-5 text-[0.78rem] text-text-muted">
                <span className="text-accent font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border border-accent/30 bg-accent/10">
                  {item.category}
                </span>
                <span>{timeAgo(item.createdAt)}</span>
              </div>
              <h3 className="mt-1.5 px-5 pb-5 text-[0.95rem] font-medium leading-snug text-text hover:text-accent">
                {item.title}
              </h3>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
