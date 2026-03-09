import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <img
              src="/logo.svg"
              alt="GearUp"
              className="h-8 w-8 opacity-70 object-contain"
            />
            <span className="font-display text-sm font-bold tracking-wider text-muted-foreground">
              GEAR<span className="text-primary">UP</span>
            </span>
          </Link>
          <p className="font-body text-[11px] text-muted-foreground tracking-wide">
            © 2026 GearUp. All rights reserved. Not affiliated with Formula 1.
          </p>
        </div>
      </div>
    </footer>
  );
}
