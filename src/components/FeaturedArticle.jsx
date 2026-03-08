import { Link } from 'react-router-dom';
import { timeAgo, categoryChipClasses, teamColorStripStyle } from '../lib/utils';

export default function FeaturedArticle({ article, loading }) {
  if (loading) {
    return (
      <article className="relative rounded-2xl overflow-hidden bg-bg-card min-h-[300px] animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e1e1e] to-[#141414]" />
        <div className="relative h-full min-h-[300px] flex flex-col justify-end p-8">
          <div className="h-6 w-20 bg-border rounded mb-3" />
          <div className="h-6 w-3/4 bg-border rounded mb-2" />
          <div className="h-4 w-24 bg-border rounded" />
        </div>
      </article>
    );
  }

  if (!article) {
    return (
      <article className="relative rounded-2xl overflow-hidden bg-bg-card min-h-[300px]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e1e1e] to-[#141414]" />
        <div className="relative h-full min-h-[300px] flex flex-col justify-end p-8 bg-gradient-to-t from-black/90 to-transparent">
          <span className="inline-flex self-start text-accent text-[0.7rem] font-semibold uppercase tracking-wider px-2.5 py-1.5 rounded-md border border-accent/40 bg-accent/10">
            No article yet
          </span>
          <p className="mt-3 text-text-muted text-sm">Add an article in Admin to see it here.</p>
        </div>
      </article>
    );
  }

  return (
    <Link to={`/article/${article.slug}`} className="block no-underline hover:no-underline">
      <article className="relative rounded-2xl overflow-hidden bg-bg-card min-h-[300px] hover:ring-2 hover:ring-accent/50 transition-shadow f1-card-hover">
        <div
          className="absolute inset-x-0 top-0 h-1.5"
          style={teamColorStripStyle(article.team)}
          aria-hidden
        />
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e1e1e] to-[#141414]" />
        )}
        <div className="relative h-full min-h-[300px] flex flex-col justify-end p-8 bg-gradient-to-t from-black/90 to-transparent">
          <span className={categoryChipClasses(article.category)}>
            {article.category}
          </span>
          <h2 className="mt-3 mb-1 text-xl font-semibold leading-snug max-w-[28ch] text-white">
            {article.title}
          </h2>
          <span className="text-sm text-text-muted">{timeAgo(article.createdAt)}</span>
        </div>
      </article>
    </Link>
  );
}
