import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { isAuthenticated } = useAuth();
  const navItems = ['News', 'Teams', 'Drivers', 'Calendar'];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <img
            src="/Blue Transparent.png"
            alt="GearUp"
            className="h-8 w-8 invert opacity-90 object-contain"
          />
          <span className="font-display text-xl font-bold tracking-wider text-foreground">
            GEAR<span className="text-primary">UP</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item}
              type="button"
              className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item}
            </button>
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
          <div className="h-4 w-px bg-border" />
          {isAuthenticated ? (
            <Link to="/admin">
              <Button
                variant="ghost"
                size="sm"
                className="font-display text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground"
              >
                Admin
              </Button>
            </Link>
          ) : (
            <Link to="/admin/login">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <Lock className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
      {/* Racing stripe */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
    </nav>
  );
}
