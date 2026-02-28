import { useState, useEffect } from 'react';
import { getFootballMatches } from '../lib/api';

function formatScore(home, away) {
  if (home == null || away == null) return '–';
  return `${home} – ${away}`;
}

function formatStatus(status, minute) {
  if (status === 'LIVE' && minute != null) return `${minute}'`;
  if (status === 'LIVE') return 'Live';
  if (status === 'IN_PLAY') return 'Live';
  if (status === 'FINISHED') return 'FT';
  if (status === 'SCHEDULED' || status === 'TIMED') return 'Upcoming';
  return status || '';
}

export default function LiveMatch() {
  const [matches, setMatches] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [liveRes, todayRes] = await Promise.all([
          getFootballMatches({ status: 'IN_PLAY' }),
          getFootballMatches({ status: 'SCHEDULED' }),
        ]);
        if (cancelled) return;
        const live = liveRes.matches || [];
        const today = (todayRes.matches || []).slice(0, 5);
        const combined = live.length ? live : today.slice(0, 5);
        setMatches(combined);
        if (!live.length && !today.length && (liveRes.message || todayRes.message)) {
          setMessage(liveRes.message || todayRes.message);
        }
      } catch {
        if (!cancelled) setMatches([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <section className="bg-bg-card rounded-2xl p-5">
        <h2 className="text-[0.75rem] font-semibold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-live animate-pulse" aria-hidden />
          Live Football
        </h2>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 bg-bg-dark rounded-xl animate-pulse">
              <div className="h-3 w-24 bg-border rounded mb-2" />
              <div className="h-5 flex justify-between">
                <div className="h-5 w-16 bg-border rounded" />
                <div className="h-5 w-8 bg-border rounded" />
                <div className="h-5 w-16 bg-border rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-bg-card rounded-2xl p-5">
      <h2 className="text-[0.75rem] font-semibold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-live animate-pulse" aria-hidden />
        Live Football
      </h2>
      {message && matches.length === 0 && (
        <div className="text-text-muted text-sm mb-3 space-y-1">
          <p>{message}</p>
          {message.includes('FOOTBALL_DATA_API_KEY') && (
            <p className="text-xs opacity-80">If you added the key to backend/.env, restart the backend server.</p>
          )}
        </div>
      )}
      <div className="flex flex-col gap-4">
        {matches.length === 0 && !message ? (
          <p className="text-text-muted text-sm">No matches right now.</p>
        ) : (
          matches.map((m) => (
            <div key={m.id} className="p-4 bg-bg-dark rounded-xl">
              <p className="text-[0.78rem] text-text-muted mb-2">{m.competition}</p>
              <div className="flex items-center justify-between gap-2 font-semibold text-base">
                <span className="truncate">{m.homeTeam}</span>
                <span className="text-accent shrink-0 px-1">
                  {formatScore(m.homeScore, m.awayScore)}
                </span>
                <span className="truncate text-right">{m.awayTeam}</span>
              </div>
              <p className="text-[0.7rem] text-text-muted mt-1">
                {formatStatus(m.status, m.minute)}
              </p>
            </div>
          ))
        )}
      </div>
      <p className="text-[0.65rem] text-text-muted mt-3 opacity-70">
        Data provided by football-data.org
      </p>
    </section>
  );
}
