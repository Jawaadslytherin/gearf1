import { useState } from 'react';

const stats = [
  { label: 'Shots on target', left: 3, right: 3 },
  { label: 'Passes', left: 19, right: 12 },
  { label: 'Corners', left: 4, right: 3 },
];

export default function MatchOverview() {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <section className="bg-bg-card rounded-2xl p-5">
      <h2 className="text-[0.75rem] font-semibold uppercase tracking-widest text-text-muted mb-4">
        Match Overview
      </h2>
      <p className="text-[0.82rem] text-text-muted mb-4">
        Football • World Cup • London • 23.4
      </p>
      <div className="flex gap-1.5 mb-5">
        {['Summary', 'Report', 'Stats'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.toLowerCase()
                ? 'bg-accent text-bg-dark'
                : 'text-text-muted hover:text-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 mb-5">
        <span className="text-text-muted text-base">Arg</span>
        <span className="text-accent font-bold text-xl">3 – 1</span>
        <span className="text-text-muted text-base">Opp</span>
      </div>
      <ul className="list-none p-0 m-0 space-y-4">
        {stats.map((s) => (
          <li key={s.label}>
            <span className="block text-[0.78rem] text-text-muted mb-1.5">{s.label}</span>
            <div className="flex items-center gap-2">
              <div
                className="h-1.5 rounded-full bg-accent max-w-[72px] flex-1"
                style={{ width: `${(s.left / 20) * 100}%` }}
              />
              <span className="text-[0.78rem] text-text-muted min-w-[2.5rem] text-center">
                {s.left} vs {s.right}
              </span>
              <div
                className="h-1.5 rounded-full bg-border max-w-[72px] flex-1"
                style={{ width: `${(s.right / 20) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
