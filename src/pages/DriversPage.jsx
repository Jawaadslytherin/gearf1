import { useState } from 'react';
import { Trophy, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { Badge } from '../components/ui/Badge';

const DRIVERS = [
  { firstName: 'Lando', lastName: 'NORRIS', team: 'McLaren', number: 1, nationality: '🇬🇧', country: 'British', titles: 1, color: '#FF8000', accent: '#FFB266', image: '/drivers/lando-norris.png' },
  { firstName: 'Oscar', lastName: 'PIASTRI', team: 'McLaren', number: 81, nationality: '🇦🇺', country: 'Australian', titles: 0, color: '#FF8000', accent: '#FFB266', image: '/drivers/oscar-piastri.png' },
  { firstName: 'Max', lastName: 'VERSTAPPEN', team: 'Red Bull', number: 3, nationality: '🇳🇱', country: 'Dutch', titles: 4, color: '#3671C6', accent: '#6B9FE8', image: '/drivers/max-verstappen.png' },
  { firstName: 'Isack', lastName: 'HADJAR', team: 'Red Bull', number: 35, nationality: '🇫🇷', country: 'French', titles: 0, color: '#3671C6', accent: '#6B9FE8', image: '/drivers/isack-hadjar.png' },
  { firstName: 'Charles', lastName: 'LECLERC', team: 'Ferrari', number: 16, nationality: '🇲🇨', country: 'Monégasque', titles: 0, color: '#E8002D', accent: '#FF4D6D', image: '/drivers/charles-leclerc.png' },
  { firstName: 'Lewis', lastName: 'HAMILTON', team: 'Ferrari', number: 44, nationality: '🇬🇧', country: 'British', titles: 7, color: '#E8002D', accent: '#FF4D6D', image: '/drivers/lewis-hamilton.png' },
  { firstName: 'George', lastName: 'RUSSELL', team: 'Mercedes', number: 63, nationality: '🇬🇧', country: 'British', titles: 0, color: '#27F4D2', accent: '#6BFAE3', image: '/drivers/george-russell.png' },
  { firstName: 'Kimi', lastName: 'ANTONELLI', team: 'Mercedes', number: 12, nationality: '🇮🇹', country: 'Italian', titles: 0, color: '#27F4D2', accent: '#6BFAE3', image: '/drivers/kimi-antonelli.png' },
  { firstName: 'Fernando', lastName: 'ALONSO', team: 'Aston Martin', number: 14, nationality: '🇪🇸', country: 'Spanish', titles: 2, color: '#229971', accent: '#3DC99A', image: '/drivers/fernando-alonso.png' },
  { firstName: 'Lance', lastName: 'STROLL', team: 'Aston Martin', number: 18, nationality: '🇨🇦', country: 'Canadian', titles: 0, color: '#229971', accent: '#3DC99A', image: '/drivers/lance-stroll.png' },
  { firstName: 'Pierre', lastName: 'GASLY', team: 'Alpine', number: 10, nationality: '🇫🇷', country: 'French', titles: 0, color: '#0093CC', accent: '#33B5E5', image: '/drivers/pierre-gasly.png' },
  { firstName: 'Franco', lastName: 'COLAPINTO', team: 'Alpine', number: 43, nationality: '🇦🇷', country: 'Argentine', titles: 0, color: '#0093CC', accent: '#33B5E5', image: '/drivers/franco-colapinto.png' },
  { firstName: 'Alex', lastName: 'ALBON', team: 'Williams', number: 23, nationality: '🇹🇭', country: 'Thai', titles: 0, color: '#64C4FF', accent: '#96D9FF', image: '/drivers/alex-albon.png' },
  { firstName: 'Carlos', lastName: 'SAINZ', team: 'Williams', number: 55, nationality: '🇪🇸', country: 'Spanish', titles: 0, color: '#64C4FF', accent: '#96D9FF', image: '/drivers/carlos-sainz.png' },
  { firstName: 'Esteban', lastName: 'OCON', team: 'Haas', number: 31, nationality: '🇫🇷', country: 'French', titles: 0, color: '#B6BABD', accent: '#D0D3D6', image: '/drivers/esteban-ocon.png' },
  { firstName: 'Ollie', lastName: 'BEARMAN', team: 'Haas', number: 87, nationality: '🇬🇧', country: 'British', titles: 0, color: '#B6BABD', accent: '#D0D3D6', image: '/drivers/ollie-bearman.png' },
  { firstName: 'Nico', lastName: 'HÜLKENBERG', team: 'Audi', number: 27, nationality: '🇩🇪', country: 'German', titles: 0, color: '#00E701', accent: '#4DFF4D', image: '/drivers/nico-hulkenberg.png' },
  { firstName: 'Gabriel', lastName: 'BORTOLETO', team: 'Audi', number: 5, nationality: '🇧🇷', country: 'Brazilian', titles: 0, color: '#00E701', accent: '#4DFF4D', image: '/drivers/gabriel-bortoleto.png' },
  { firstName: 'Liam', lastName: 'LAWSON', team: 'Racing Bulls', number: 30, nationality: '🇳🇿', country: 'New Zealander', titles: 0, color: '#6692FF', accent: '#99B5FF', image: '/drivers/liam-lawson.png' },
  { firstName: 'Arvid', lastName: 'LINDBLAD', team: 'Racing Bulls', number: 40, nationality: '🇬🇧', country: 'British', titles: 0, color: '#6692FF', accent: '#99B5FF', image: '/drivers/arvid-lindblad.png' },
  { firstName: 'Valtteri', lastName: 'BOTTAS', team: 'Cadillac', number: 77, nationality: '🇫🇮', country: 'Finnish', titles: 0, color: '#C0C0C0', accent: '#E0E0E0', image: '/drivers/valtteri-bottas.png' },
  { firstName: 'Sergio', lastName: 'PÉREZ', team: 'Cadillac', number: 11, nationality: '🇲🇽', country: 'Mexican', titles: 0, color: '#C0C0C0', accent: '#E0E0E0', image: '/drivers/sergio-perez.png' },
];

const TEAMS = ['All', ...Array.from(new Set(DRIVERS.map((d) => d.team)))];

export default function DriversPage() {
  const [activeTeam, setActiveTeam] = useState('All');
  const filtered = activeTeam === 'All' ? DRIVERS : DRIVERS.filter((d) => d.team === activeTeam);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="2026 F1 driver grid"
        path="/drivers"
        description="Full Formula 1 2026 grid: teams, driver numbers, and profiles — GearUp F1."
        image="/drivers/lando-norris.png"
      />
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, transparent, transparent 20px, white 20px, white 22px)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-transparent to-primary/5" />
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(0deg, transparent 95%, white 95%), linear-gradient(90deg, transparent 95%, white 95%)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex gap-1">
              <div className="h-6 w-1 bg-primary rounded-full" />
              <div className="h-6 w-1 bg-primary/60 rounded-full" />
              <div className="h-6 w-1 bg-primary/30 rounded-full" />
            </div>
            <span className="font-display text-[10px] tracking-[0.4em] text-primary uppercase">
              Formula 1 · 2026
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black text-foreground mb-4 leading-[0.9]">
            THE
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-primary/60">
              GRID
            </span>
          </h1>
          <div className="flex items-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="font-display text-xs font-black text-primary">22</span>
              </div>
              <span className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                Drivers
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="font-display text-xs font-black text-primary">11</span>
              </div>
              <span className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                Teams
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Team filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {TEAMS.map((team) => {
            const teamDriver = DRIVERS.find((d) => d.team === team);
            const teamColor = teamDriver?.color;
            const isActive = activeTeam === team;
            return (
              <button
                key={team}
                type="button"
                onClick={() => setActiveTeam(team)}
                className="font-display text-[10px] tracking-[0.15em] uppercase px-4 py-2.5 rounded-sm border transition-all duration-200"
                style={
                  isActive && team !== 'All'
                    ? { borderColor: teamColor, backgroundColor: `${teamColor}15`, color: teamColor }
                    : isActive
                    ? {
                        borderColor: 'hsl(var(--color-primary))',
                        backgroundColor: 'hsl(var(--color-primary) / 0.1)',
                        color: 'hsl(var(--color-primary))',
                      }
                    : { borderColor: 'hsl(var(--color-border))', color: 'hsl(var(--color-muted-foreground))' }
                }
              >
                {team !== 'All' && (
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: teamColor }}
                  />
                )}
                {team}
              </button>
            );
          })}
        </div>

        {/* Drivers Grid */}
        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((driver) => (
            <div
              key={driver.number}
              className="group relative rounded-lg border border-border overflow-hidden transition-all duration-500 hover:border-transparent cursor-pointer"
              style={{
                background: `linear-gradient(135deg, hsl(var(--color-card)) 0%, hsl(var(--color-card)) 50%, ${driver.color}08 100%)`,
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none"
                style={{ boxShadow: `inset 0 0 60px ${driver.color}10, 0 0 30px ${driver.color}08` }}
              />

              {/* Team color top bar */}
              <div
                className="h-[3px]"
                style={{ background: `linear-gradient(90deg, ${driver.color}, ${driver.accent}, transparent)` }}
              />

              <div className="relative flex items-stretch min-h-[180px]">
                {/* Giant number background */}
                <div className="absolute -left-4 -top-6 select-none pointer-events-none">
                  <span
                    className="font-display text-[140px] md:text-[160px] font-black leading-none opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500"
                    style={{ color: driver.color }}
                  >
                    {driver.number}
                  </span>
                </div>

                {/* Content */}
                <div className="relative flex-1 p-6 md:p-8 z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="flex items-center justify-center h-10 w-14 rounded-sm font-display text-lg font-black"
                      style={{
                        backgroundColor: `${driver.color}18`,
                        color: driver.color,
                        border: `1px solid ${driver.color}30`,
                      }}
                    >
                      {driver.number}
                    </div>
                    {driver.titles > 0 && (
                      <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-sm px-3 py-1.5">
                        <Trophy className="h-3.5 w-3.5 text-primary" />
                        <span className="font-display text-[11px] font-bold text-primary tracking-wider">
                          {driver.titles}× WDC
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mb-5">
                    <p className="font-body text-xs text-muted-foreground mb-0.5">{driver.firstName}</p>
                    <h3 className="font-display text-xl md:text-2xl font-black text-foreground tracking-wide leading-none">
                      {driver.lastName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      className="font-display text-[9px] tracking-[0.2em] uppercase rounded-sm border-none px-3 py-1"
                      style={{ backgroundColor: `${driver.color}18`, color: driver.color }}
                    >
                      {driver.team}
                    </Badge>
                    <span className="font-body text-xs text-muted-foreground">
                      {driver.nationality} {driver.country}
                    </span>
                  </div>
                </div>

                {/* Driver photo */}
                <div className="relative w-36 md:w-44 flex-shrink-0 flex items-end justify-center overflow-hidden">
                  {/* Gradient fade from card to image area */}
                  <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, hsl(var(--color-card)) 0%, transparent 40%)',
                    }}
                  />
                  {/* Bottom team-color glow behind driver */}
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                    style={{ backgroundColor: driver.color }}
                  />
                  <img
                    src={driver.image}
                    alt={`${driver.firstName} ${driver.lastName}`}
                    className="relative z-20 h-40 md:h-44 object-contain object-bottom drop-shadow-lg group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Right edge stripe + chevron */}
                <div className="hidden md:flex flex-col items-center justify-center w-12 border-l border-border group-hover:border-transparent transition-colors">
                  <div
                    className="w-[2px] h-10 rounded-full opacity-30 group-hover:opacity-80 group-hover:h-16 transition-all duration-500"
                    style={{ backgroundColor: driver.color }}
                  />
                  <ChevronRight
                    className="h-4 w-4 mt-3 opacity-0 group-hover:opacity-60 transition-all duration-300 group-hover:translate-x-1"
                    style={{ color: driver.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

