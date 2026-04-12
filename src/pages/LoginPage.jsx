import { useState } from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { Lock, Mail, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin } from '../lib/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import Seo from '../components/Seo';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await apiLogin({ username, password });
      login(token, user);
      navigate(from, { replace: true });
    } catch (e) {
      setError(e.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen">
      <Seo
        title="Admin sign in"
        path="/admin/login"
        description="Sign in to manage GearUp F1 articles."
        image="/logo.svg"
        noindex
      />
      {/* Left side — F1 background */}
      <div className="hidden lg:flex lg:w-1/2 relative items-end p-12">
        <img
          src="/skynews-verstappen-red-bull_6364747.jpg.jpeg"
          alt="Formula 1"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-12 bg-primary rounded-full" />
            <span className="font-display text-xs tracking-[0.3em] text-primary uppercase">
              Lights Out
            </span>
          </div>
          <h2 className="font-display text-4xl font-bold leading-tight text-foreground">
            Every satisfactory lap<br />
            begins with<br />
            <span className="text-primary">preparation.</span>
          </h2>
          <p className="max-w-sm font-body text-sm text-muted-foreground leading-relaxed">
            Manage your articles, track engagement, and keep the racing community informed — all from one cockpit.
          </p>
        </div>
      </div>

      {/* Right side — Login form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-primary/8 blur-[80px]" />

        {/* Checkered flag pattern — subtle corner accent */}
        <div
          className="absolute top-0 right-0 w-32 h-32 opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-conic-gradient(hsl(0 0% 95%) 0% 25%, transparent 0% 50%)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Racing stripe top */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />

        <div className="relative z-10 w-full max-w-sm px-8">
          {/* Logo & Brand */}
          <div className="mb-10 flex flex-col items-center">
            <img
              src="/logo.svg"
              alt="GearUp logo"
              className="h-16 w-16 mb-4 opacity-90 object-contain"
            />
            <h1 className="font-display text-3xl font-bold tracking-wider text-foreground">
              GEAR<span className="text-primary">UP</span>
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-px w-8 bg-border" />
              <span className="font-display text-[10px] tracking-[0.4em] text-muted-foreground uppercase">
                Pit Wall Access
              </span>
              <div className="h-px w-8 bg-border" />
            </div>
          </div>

          {/* Login Card */}
          <div className="rounded-lg border border-border bg-card/60 p-7 backdrop-blur-md">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/30">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="admin@gearup.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border-border bg-secondary pl-10 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-border bg-secondary pl-10 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="group w-full bg-primary font-display text-xs font-semibold uppercase tracking-[0.25em] text-primary-foreground hover:bg-primary/90 h-11"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Authenticating
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center">
            <Link to="/" className="font-body text-sm text-muted-foreground hover:text-foreground no-underline">
              ← Back to site
            </Link>
          </p>

          {/* Footer */}
          <p className="mt-8 text-center font-body text-[11px] text-muted-foreground tracking-wide">
            © 2026 GearUp. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
