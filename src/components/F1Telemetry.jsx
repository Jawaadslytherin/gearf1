import { useEffect, useState } from 'react';
import { getCarData } from '../lib/api';

function formatDrs(drs) {
  if (drs === 10 || drs === 12 || drs === 14) return 'DRS ON';
  if (drs === 8) return 'DRS READY';
  return 'DRS OFF';
}

export default function F1Telemetry({ driverNumber = 55 }) {
  const [sample, setSample] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [displaySpeed, setDisplaySpeed] = useState(0);
  const [displayThrottle, setDisplayThrottle] = useState(0);
  const [displayBrake, setDisplayBrake] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError('');
        const res = await getCarData({
          driver_number: driverNumber,
          meeting_key: 'latest',
          session_key: 'latest',
          limit: 1,
        });
        if (cancelled) return;
        const last = Array.isArray(res.samples) && res.samples.length ? res.samples[res.samples.length - 1] : null;
        setSample(last);
      } catch (e) {
        if (!cancelled) setError('Telemetry unavailable right now.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [driverNumber]);

  useEffect(() => {
    if (!sample) return;
    const targetSpeed = sample.speed ?? 0;
    const targetThrottle = sample.throttle ?? 0;
    const targetBrake = sample.brake ?? 0;

    const duration = 500;
    const start = performance.now();

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      setDisplaySpeed(Math.round(targetSpeed * t));
      setDisplayThrottle(Math.round(targetThrottle * t));
      setDisplayBrake(Math.round(targetBrake * t));
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [sample]);

  return (
    <section className="rounded-lg border border-border bg-card/60 backdrop-blur-sm p-6 sticky top-24">
      <h2 className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-1.5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-live animate-pulse" aria-hidden />
        F1 Telemetry
      </h2>
      <p className="font-body text-[11px] text-muted-foreground mb-4">Live car data • Driver #{driverNumber}</p>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-10 w-32 bg-border rounded" />
          <div className="h-3 w-20 bg-border rounded" />
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-border rounded" />
            ))}
          </div>
        </div>
      ) : error || !sample ? (
        <p className="font-body text-sm text-muted-foreground">Telemetry not available right now.</p>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Speed</div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-foreground">{displaySpeed ?? '–'}</span>
              <span className="font-body text-xs text-muted-foreground uppercase">km/h</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 font-body text-xs text-muted-foreground">
            <div className="bg-secondary rounded-lg p-3 border border-border">
              <div className="uppercase tracking-[0.16em] mb-1">Gear</div>
              <div className="font-display text-lg font-semibold text-foreground">{sample.n_gear ?? 'N'}</div>
            </div>
            <div className="bg-secondary rounded-lg p-3 border border-border">
              <div className="uppercase tracking-[0.16em] mb-1">RPM</div>
              <div className="font-display text-lg font-semibold text-foreground">
                {sample.rpm ? `${Math.round(sample.rpm / 1000)}k` : '–'}
              </div>
            </div>
            <div className="bg-secondary rounded-lg p-3 border border-border">
              <div className="uppercase tracking-[0.16em] mb-1">DRS</div>
              <div className="text-[10px] font-semibold text-primary">{formatDrs(sample.drs)}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 font-body text-xs text-muted-foreground">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="uppercase tracking-[0.16em]">Throttle</span>
                <span>{displayThrottle}%</span>
              </div>
              <div className="h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary f1-telemetry-bar-inner"
                  style={{ width: `${Math.min(displayThrottle, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="uppercase tracking-[0.16em]">Brake</span>
                <span>{displayBrake}%</span>
              </div>
              <div className="h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-live f1-telemetry-bar-inner"
                  style={{ width: `${Math.min(displayBrake, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

