import { Link } from 'react-router-dom';
import { Button } from './ui/Button';

export default function Header() {
  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Blog', to: '/blog' },
    { label: 'Drivers', to: '/drivers' },
    { label: 'Calendar', to: '/calendar' },
    { label: 'About', to: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <img
            src="/logo.svg"
            alt="GearUp"
            className="h-10 w-10 opacity-90 object-contain"
          />
          <span className="font-display text-xl font-bold tracking-wider text-foreground">
            GEAR<span className="text-primary">UP</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors no-underline"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="font-display text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground"
          >
            Subscribe
          </Button>
        </div>
      </div>
      {/* Racing stripe */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
    </nav>
  );
}
