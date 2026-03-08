import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function timeAgo(date) {
  if (!date) return '';
  const d = new Date(date);
  const sec = Math.floor((Date.now() - d) / 1000);
  if (sec < 60) return 'Just now';
  if (sec < 3600) return `${Math.floor(sec / 60)} min`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} hr`;
  if (sec < 604800) return `${Math.floor(sec / 86400)} days`;
  return d.toLocaleDateString();
}

export function categoryChipClasses(category) {
  const base =
    'inline-block text-[0.7rem] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border';
  const map = {
    'Race Report': 'bg-red-500/10 border-red-500/50 text-red-300',
    Qualifying: 'bg-purple-500/10 border-purple-500/50 text-purple-300',
    Practice: 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300',
    Analysis: 'bg-slate-500/10 border-slate-500/50 text-slate-300',
    Tech: 'bg-sky-500/10 border-sky-500/50 text-sky-300',
    Drivers: 'bg-orange-500/10 border-orange-500/50 text-orange-300',
    Teams: 'bg-pink-500/10 border-pink-500/50 text-pink-300',
    News: 'bg-amber-500/10 border-amber-500/50 text-amber-300',
  };
  const extra = map[category] || 'bg-accent/10 border-accent/40 text-accent';
  return `${base} ${extra}`;
}

export function teamColorStripStyle(team) {
  if (!team) return { backgroundColor: 'transparent' };
  const map = {
    RedBull: '#0600ef',
    Ferrari: '#dc0000',
    Mercedes: '#00d2be',
    McLaren: '#ff8000',
    AstonMartin: '#006f62',
    Alpine: '#0090ff',
    Williams: '#005aff',
    KickSauber: '#52e252',
    RB: '#6692ff',
    Haas: '#b6babd',
  };
  const key = team.replace(/\s+/g, '');
  const color = map[key] || '#f5c518';
  return { backgroundColor: color };
}
