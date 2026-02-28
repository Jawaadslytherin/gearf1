import { Link } from 'react-router-dom';

export default function Header() {
  const categories = ['Football', 'Cricket', 'Rugby', 'Tennis', 'Golf', 'Cycling', 'Others'];

  return (
    <header className="sticky top-0 z-10 bg-bg-card border-b border-border">
      <div className="max-w-[1320px] mx-auto px-6 py-4 flex flex-wrap items-center gap-6 lg:gap-10">
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg hover:text-accent no-underline hover:no-underline">
          <span className="w-9 h-9 rounded-full bg-accent text-bg-dark flex items-center justify-center text-base" aria-hidden>⚡</span>
          Suprast
        </Link>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {categories.map((cat) => (
            <a
              key={cat}
              href={`#${cat.toLowerCase()}`}
              className="text-text-muted text-sm py-1.5 hover:text-accent no-underline hover:no-underline"
            >
              {cat}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link to="/admin" className="text-sm font-medium text-accent hover:text-accent-dim no-underline hover:no-underline">
            Admin
          </Link>
          <button type="button" className="w-10 h-10 rounded-lg flex items-center justify-center text-text-muted hover:text-accent hover:bg-accent/10 transition-colors" aria-label="Search">
            <span aria-hidden>🔍</span>
          </button>
          <button type="button" className="w-10 h-10 rounded-lg flex items-center justify-center text-text-muted hover:text-accent hover:bg-accent/10 transition-colors" aria-label="Profile">
            <span aria-hidden>👤</span>
          </button>
        </div>
      </div>
    </header>
  );
}
