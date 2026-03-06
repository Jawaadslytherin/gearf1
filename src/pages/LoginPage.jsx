import { useState } from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin } from '../lib/api';

function HelmetIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4a4 4 0 0 0-4 4v2h8V8a4 4 0 0 0-4-4Z" />
      <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
      <path d="M4 12h16" />
    </svg>
  );
}

function LockIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CheckeredFlagIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <rect x="2" y="2" width="4" height="4" fill="white" />
      <rect x="6" y="2" width="4" height="4" fill="#1a1a1a" />
      <rect x="10" y="2" width="4" height="4" fill="white" />
      <rect x="14" y="2" width="4" height="4" fill="#1a1a1a" />
      <rect x="2" y="6" width="4" height="4" fill="#1a1a1a" />
      <rect x="6" y="6" width="4" height="4" fill="white" />
      <rect x="10" y="6" width="4" height="4" fill="#1a1a1a" />
      <rect x="14" y="6" width="4" height="4" fill="white" />
    </svg>
  );
}

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
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden f1-login-bg"
      style={{
        backgroundImage: 'url(/skynews-verstappen-red-bull_6364747.jpg.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50" aria-hidden />

      {/* Header - top left */}
      <header className="absolute top-8 left-8 z-10">
        <h1 className="text-2xl font-bold tracking-wider" style={{ color: '#00d4ff', textShadow: '0 0 20px rgba(0,212,255,0.6)' }}>
          F1 ADMIN PORTAL
        </h1>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-white" style={{ color: '#e10600' }}>FORMULA 1</span>
          <span className="text-sm text-white/90">SPORTS NEWS</span>
        </div>
      </header>

      {/* Login form - center */}
      <div className="relative z-10 w-full max-w-[560px]">
        <div className="f1-card">
          <div className="f1-notch" aria-hidden />

          {/* Form header */}
          <div className="flex flex-col items-center mb-7">
            <div className="text-white/90 mb-3">
              <HelmetIcon className="w-10 h-10" />
            </div>
            <h2 className="text-[30px] leading-none font-extrabold text-white f1-title uppercase">
              Admin Login
            </h2>
            <p className="text-xs text-white/75 mt-2 f1-subtitle uppercase">
              Secure Access Portal
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-500/20 text-red-300 text-sm border border-red-500/30">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative pt-2">
              <div className="f1-fieldLabel">Username</div>
              <div className="f1-field flex items-center gap-4">
                <div className="f1-iconBadge text-white/80">
                  <HelmetIcon className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  aria-label="Username"
                  className="f1-input"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="relative pt-2">
              <div className="f1-fieldLabel">Password</div>
              <div className="f1-field flex items-center gap-4">
                <div className="f1-iconBadge text-white/80">
                  <LockIcon className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-label="Password"
                  className="f1-input tracking-[0.18em]"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="f1-cta flex items-center justify-center gap-4"
              >
                <CheckeredFlagIcon className="w-6 h-6" />
                {loading ? 'Signing in...' : 'Enter Pit Lane'}
              </button>
              <p className="text-center text-xs text-white/70 mt-2">LOG IN</p>
            </div>

            <div className="f1-links flex justify-center gap-8 pt-1">
              <button type="button">Forgot Password?</button>
              <button type="button">Request Access</button>
            </div>
          </form>

          {/* Bottom ornaments (match screenshot placement) */}
          <div className="mt-9 pt-7 border-t border-white/10 relative">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              {/* Gauge - left */}
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 46 46" className="w-11 h-11 text-white/60">
                  <defs>
                    <linearGradient id="gaugeGlow" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="rgba(0,212,255,0.85)" />
                      <stop offset="1" stopColor="rgba(0,212,255,0.15)" />
                    </linearGradient>
                  </defs>
                  <circle cx="23" cy="23" r="18" fill="none" stroke="url(#gaugeGlow)" strokeWidth="1.6" />
                  <circle cx="23" cy="23" r="12" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" />
                  <path d="M23 23 L36 16" stroke="rgba(0,212,255,0.8)" strokeWidth="1.6" />
                  <text x="23" y="30" textAnchor="middle" className="text-[7px] font-mono fill-current">3700</text>
                </svg>
                <span className="text-xs text-white/60">RPM</span>
              </div>

              {/* Car silhouette - center */}
              <div className="flex flex-col items-center gap-1">
                <svg viewBox="0 0 220 40" className="h-8 w-[200px] opacity-90">
                  <path
                    d="M18 26c7-7 20-12 40-13l16-7h52l14 6c18 1 31 4 39 10l17 1c5 0 9 4 9 9H18c-6 0-10-4-10-9 0-4 4-8 10-8Z"
                    fill="rgba(255,255,255,0.14)"
                    stroke="rgba(0,212,255,0.55)"
                    strokeWidth="1.2"
                  />
                  <circle cx="62" cy="31" r="6" fill="rgba(0,0,0,0.35)" stroke="rgba(225,6,0,0.6)" strokeWidth="2" />
                  <circle cx="170" cy="31" r="6" fill="rgba(0,0,0,0.35)" stroke="rgba(225,6,0,0.6)" strokeWidth="2" />
                  <rect x="96" y="10" width="34" height="9" rx="3" fill="rgba(225,6,0,0.18)" />
                </svg>
              </div>

              {/* Track - right */}
              <div className="w-12 h-12 opacity-90 ml-auto">
                <svg viewBox="0 0 48 48" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" className="w-full h-full">
                  <path d="M12 18c0-5 6-9 12-9s12 4 12 9c0 4-2 6-5 8-3 2-4 4-4 7 0 6-5 10-10 10-6 0-10-4-10-10 0-3 1-5 3-7 2-2 2-3 2-8Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center">
          <Link to="/" className="text-sm text-white/70 hover:text-white">
            ← Back to site
          </Link>
        </p>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 left-0 right-0 text-center text-xs text-white/60 z-10">
        © 2024 FORMULA 1 SPORTS | Confidential Access
      </footer>
    </div>
  );
}
