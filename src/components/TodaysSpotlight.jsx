import { Link } from 'react-router-dom';
import { timeAgo, categoryChipClasses, teamColorStripStyle } from '../lib/utils';

export default function TodaysSpotlight({ articles = [], loading }) {
  const list = articles.slice(0, 3);

  if (loading) {
    return (
      <section className="bg-bg-card rounded-2xl p-5">
        <div className="h-4 w-32 bg-border rounded mb-4" />
        <ul className="list-none p-0 m-0 space-y-4">
          {[1, 2].map((i) => (
            <li key={i} className="grid grid-cols-[56px_1fr] gap-4 py-2">
              <div className="w-14 h-14 rounded-xl bg-border animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-20 bg-border rounded" />
                <div className="h-4 w-full bg-border rounded" />
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (list.length === 0) {
    return (
      <section className="bg-bg-card rounded-2xl p-5">
        <h2 className="text-[0.75rem] font-semibold uppercase tracking-widest text-text-muted mb-4">
          Today&rsquo;s Spotlight
        </h2>
        <p className="text-text-muted text-sm">No articles yet.</p>
      </section>
    );
  }

  return (
    <section className="bg-bg-card rounded-2xl p-5">
      <h2 className="text-[0.75rem] font-semibold uppercase tracking-widest text-text-muted mb-4">
        Today&rsquo;s Spotlight
      </h2>
      <ul className="list-none p-0 m-0">
        {list.map((item) => (
          <li
            key={item._id}
            className="relative grid grid-cols-[56px_1fr] gap-4 py-4 border-b border-border last:border-0 first:pt-0 f1-card-hover"
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
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-border shrink-0" />
              )}
              <div>
                <div className="flex gap-2 items-center text-[0.78rem] text-text-muted mb-1">
                  <span className={categoryChipClasses(item.category)}>{item.category}</span>
                  <span>{timeAgo(item.createdAt)}</span>
                </div>
                <h3 className="text-sm font-medium leading-snug text-text hover:text-accent">{item.title}</h3>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
