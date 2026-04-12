import { Link } from 'react-router-dom';

export default function Footer() {
  const links = [
    { label: 'Blog', to: '/blog' },
    { label: 'Calendar', to: '/calendar' },
    { label: 'Drivers', to: '/drivers' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <footer className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <Link to="/" className="flex items-center gap-3 no-underline shrink-0">
            <img
              src="/logo.svg"
              alt="GearUp"
              className="h-8 w-8 opacity-70 object-contain"
            />
            <span className="font-display text-sm font-bold tracking-wider text-muted-foreground">
              GEAR<span className="text-primary">UP</span>
            </span>
          </Link>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 font-body text-xs text-muted-foreground" aria-label="Footer">
            {links.map(({ label, to }) => (
              <Link key={to} to={to} className="hover:text-foreground no-underline transition-colors">
                {label}
              </Link>
            ))}
            <Link to="/" className="hover:text-foreground no-underline transition-colors">
              Home
            </Link>
          </nav>
        </div>
        <p className="mt-8 font-body text-[11px] text-muted-foreground tracking-wide text-center md:text-left">
          © 2026 GearUp. All rights reserved. Not affiliated with Formula 1.
        </p>
      </div>
    </footer>
  );
}
