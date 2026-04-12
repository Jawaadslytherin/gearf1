import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { Badge } from '../components/ui/Badge';
import { MapPin, Calendar as CalendarIcon, Clock, ChevronRight, Flag } from 'lucide-react';

const RACES = [
  { round: 1, name: 'Australia', officialName: 'FORMULA 1 AUSTRALIAN GRAND PRIX 2026', circuit: 'Albert Park Circuit', location: 'Melbourne', country: 'Australia', flag: '🇦🇺', date: 'Mar 15', raceTime: '15:00', laps: 58, circuitLength: '5.278 km', status: 'completed' },
  { round: 2, name: 'China', officialName: 'FORMULA 1 CHINESE GRAND PRIX 2026', circuit: 'Shanghai International Circuit', location: 'Shanghai', country: 'China', flag: '🇨🇳', date: 'Mar 29', raceTime: '15:00', laps: 56, circuitLength: '5.451 km', status: 'upcoming' },
  { round: 3, name: 'Japan', officialName: 'FORMULA 1 JAPANESE GRAND PRIX 2026', circuit: 'Suzuka International Racing Course', location: 'Suzuka', country: 'Japan', flag: '🇯🇵', date: 'Apr 5', raceTime: '14:00', laps: 53, circuitLength: '5.807 km', status: 'upcoming' },
  { round: 4, name: 'Bahrain', officialName: 'FORMULA 1 BAHRAIN GRAND PRIX 2026', circuit: 'Bahrain International Circuit', location: 'Sakhir', country: 'Bahrain', flag: '🇧🇭', date: 'Apr 19', raceTime: '18:00', laps: 57, circuitLength: '5.412 km', status: 'upcoming' },
  { round: 5, name: 'Saudi Arabia', officialName: 'FORMULA 1 SAUDI ARABIAN GRAND PRIX 2026', circuit: 'Jeddah Corniche Circuit', location: 'Jeddah', country: 'Saudi Arabia', flag: '🇸🇦', date: 'Apr 26', raceTime: '20:00', laps: 50, circuitLength: '6.174 km', status: 'upcoming' },
  { round: 6, name: 'Miami', officialName: 'FORMULA 1 MIAMI GRAND PRIX 2026', circuit: 'Miami International Autodrome', location: 'Miami', country: 'USA', flag: '🇺🇸', date: 'May 3', raceTime: '16:00', laps: 57, circuitLength: '5.412 km', status: 'upcoming' },
  { round: 7, name: 'Emilia Romagna', officialName: 'FORMULA 1 EMILIA ROMAGNA GRAND PRIX 2026', circuit: 'Autodromo Enzo e Dino Ferrari', location: 'Imola', country: 'Italy', flag: '🇮🇹', date: 'May 17', raceTime: '15:00', laps: 63, circuitLength: '4.909 km', status: 'upcoming' },
  { round: 8, name: 'Monaco', officialName: 'FORMULA 1 MONACO GRAND PRIX 2026', circuit: 'Circuit de Monaco', location: 'Monte Carlo', country: 'Monaco', flag: '🇲🇨', date: 'May 24', raceTime: '15:00', laps: 78, circuitLength: '3.337 km', status: 'upcoming' },
  { round: 9, name: 'Spain', officialName: 'FORMULA 1 SPANISH GRAND PRIX 2026', circuit: 'Circuit de Barcelona-Catalunya', location: 'Barcelona', country: 'Spain', flag: '🇪🇸', date: 'Jun 7', raceTime: '15:00', laps: 66, circuitLength: '4.657 km', status: 'upcoming' },
  { round: 10, name: 'Canada', officialName: 'FORMULA 1 CANADIAN GRAND PRIX 2026', circuit: 'Circuit Gilles Villeneuve', location: 'Montréal', country: 'Canada', flag: '🇨🇦', date: 'Jun 14', raceTime: '14:00', laps: 70, circuitLength: '4.361 km', status: 'upcoming' },
  { round: 11, name: 'Austria', officialName: 'FORMULA 1 AUSTRIAN GRAND PRIX 2026', circuit: 'Red Bull Ring', location: 'Spielberg', country: 'Austria', flag: '🇦🇹', date: 'Jun 28', raceTime: '15:00', laps: 71, circuitLength: '4.318 km', status: 'upcoming' },
  { round: 12, name: 'Great Britain', officialName: 'FORMULA 1 BRITISH GRAND PRIX 2026', circuit: 'Silverstone Circuit', location: 'Silverstone', country: 'UK', flag: '🇬🇧', date: 'Jul 5', raceTime: '15:00', laps: 52, circuitLength: '5.891 km', status: 'upcoming' },
  { round: 13, name: 'Belgium', officialName: 'FORMULA 1 BELGIAN GRAND PRIX 2026', circuit: 'Circuit de Spa-Francorchamps', location: 'Spa', country: 'Belgium', flag: '🇧🇪', date: 'Jul 26', raceTime: '15:00', laps: 44, circuitLength: '7.004 km', status: 'upcoming' },
  { round: 14, name: 'Hungary', officialName: 'FORMULA 1 HUNGARIAN GRAND PRIX 2026', circuit: 'Hungaroring', location: 'Budapest', country: 'Hungary', flag: '🇭🇺', date: 'Aug 2', raceTime: '15:00', laps: 70, circuitLength: '4.381 km', status: 'upcoming' },
  { round: 15, name: 'Netherlands', officialName: 'FORMULA 1 DUTCH GRAND PRIX 2026', circuit: 'Circuit Zandvoort', location: 'Zandvoort', country: 'Netherlands', flag: '🇳🇱', date: 'Aug 30', raceTime: '15:00', laps: 72, circuitLength: '4.259 km', status: 'upcoming' },
  { round: 16, name: 'Italy', officialName: 'FORMULA 1 ITALIAN GRAND PRIX 2026', circuit: 'Autodromo Nazionale Monza', location: 'Monza', country: 'Italy', flag: '🇮🇹', date: 'Sep 6', raceTime: '15:00', laps: 53, circuitLength: '5.793 km', status: 'upcoming' },
  { round: 17, name: 'Azerbaijan', officialName: 'FORMULA 1 AZERBAIJAN GRAND PRIX 2026', circuit: 'Baku City Circuit', location: 'Baku', country: 'Azerbaijan', flag: '🇦🇿', date: 'Sep 20', raceTime: '15:00', laps: 51, circuitLength: '6.003 km', status: 'upcoming' },
  { round: 18, name: 'Singapore', officialName: 'FORMULA 1 SINGAPORE GRAND PRIX 2026', circuit: 'Marina Bay Street Circuit', location: 'Singapore', country: 'Singapore', flag: '🇸🇬', date: 'Oct 4', raceTime: '20:00', laps: 62, circuitLength: '4.940 km', status: 'upcoming' },
  { round: 19, name: 'United States', officialName: 'FORMULA 1 UNITED STATES GRAND PRIX 2026', circuit: 'Circuit of the Americas', location: 'Austin', country: 'USA', flag: '🇺🇸', date: 'Oct 18', raceTime: '14:00', laps: 56, circuitLength: '5.513 km', status: 'upcoming' },
  { round: 20, name: 'Mexico', officialName: 'FORMULA 1 MEXICAN GRAND PRIX 2026', circuit: 'Autódromo Hermanos Rodríguez', location: 'Mexico City', country: 'Mexico', flag: '🇲🇽', date: 'Oct 25', raceTime: '14:00', laps: 71, circuitLength: '4.304 km', status: 'upcoming' },
  { round: 21, name: 'Brazil', officialName: 'FORMULA 1 BRAZILIAN GRAND PRIX 2026', circuit: 'Interlagos', location: 'São Paulo', country: 'Brazil', flag: '🇧🇷', date: 'Nov 8', raceTime: '14:00', laps: 71, circuitLength: '4.309 km', status: 'upcoming' },
  { round: 22, name: 'Las Vegas', officialName: 'FORMULA 1 LAS VEGAS GRAND PRIX 2026', circuit: 'Las Vegas Strip Circuit', location: 'Las Vegas', country: 'USA', flag: '🇺🇸', date: 'Nov 22', raceTime: '22:00', laps: 50, circuitLength: '6.201 km', status: 'upcoming' },
  { round: 23, name: 'Qatar', officialName: 'FORMULA 1 QATAR GRAND PRIX 2026', circuit: 'Lusail International Circuit', location: 'Lusail', country: 'Qatar', flag: '🇶🇦', date: 'Nov 29', raceTime: '18:00', laps: 57, circuitLength: '5.380 km', status: 'upcoming' },
  { round: 24, name: 'Abu Dhabi', officialName: 'FORMULA 1 ABU DHABI GRAND PRIX 2026', circuit: 'Yas Marina Circuit', location: 'Abu Dhabi', country: 'UAE', flag: '🇦🇪', date: 'Dec 6', raceTime: '17:00', laps: 58, circuitLength: '5.281 km', status: 'upcoming' },
];

export default function CalendarPage() {
  const [filter, setFilter] = useState('all');

  const nextRace = RACES.find((r) => r.status === 'upcoming') || RACES[1];
  const filtered = filter === 'all' ? RACES : RACES.filter((r) => r.status === filter);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="2026 F1 race calendar"
        path="/calendar"
        description="Formula 1 2026 schedule: rounds, circuits, dates, and session times — GearUp F1."
      />
      <Header />

      {/* Hero — Next Race Spotlight */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Animated racing stripes */}
        <div className="absolute inset-0 opacity-[0.03]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-full w-[2px] bg-primary"
              style={{ left: `${8 + i * 8}%`, transform: 'skewX(-20deg)' }}
            />
          ))}
        </div>

        {/* Checkered flag corner */}
        <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.04]">
          <div className="grid grid-cols-6 grid-rows-6 w-full h-full">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className={`${(Math.floor(i / 6) + (i % 6)) % 2 === 0 ? 'bg-foreground' : ''}`} />
            ))}
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-primary rounded-full" />
                <Badge
                  variant="outline"
                  className="border-primary/40 text-primary font-display text-[10px] tracking-widest uppercase"
                >
                  Next Race — Round {nextRace.round}
                </Badge>
              </div>

              <div>
                <p className="font-body text-sm text-muted-foreground mb-2 tracking-wide uppercase">
                  {nextRace.circuit}
                </p>
                <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-none">
                  {nextRace.flag} {nextRace.name}
                </h1>
                <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-primary leading-none mt-1">
                  GP
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-6 font-body text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  {nextRace.date}, 2026
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Lights Out {nextRace.raceTime} Local
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {nextRace.location}
                </span>
              </div>
            </div>

            <div className="bg-card/60 backdrop-blur border border-border rounded-lg p-6 min-w-[240px]">
              <p className="font-display text-[10px] tracking-widest text-muted-foreground uppercase mb-4">
                Circuit Data
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-body text-xs text-muted-foreground">Length</span>
                  <span className="font-display text-lg font-bold text-foreground">
                    {nextRace.circuitLength}
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between items-baseline">
                  <span className="font-body text-xs text-muted-foreground">Laps</span>
                  <span className="font-display text-lg font-bold text-foreground">{nextRace.laps}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between items-baseline">
                  <span className="font-body text-xs text-muted-foreground">Round</span>
                  <span className="font-display text-lg font-bold text-primary">{nextRace.round} / 24</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Season Timeline Header */}
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Flag className="w-5 h-5 text-primary" />
            <h2 className="font-display text-2xl font-bold tracking-wider text-foreground">
              2026 <span className="text-primary">SEASON</span>
            </h2>
            <span className="font-body text-sm text-muted-foreground ml-2">24 Races</span>
          </div>

          <div className="flex gap-2">
            {['all', 'completed', 'upcoming'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full font-body text-xs uppercase tracking-wider transition-all ${
                  filter === f
                    ? 'bg-primary text-primary-foreground shadow-[var(--glow-primary)]'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Season progress bar */}
        <div className="mt-6 relative">
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-700"
              style={{
                width: `${(RACES.filter((r) => r.status === 'completed').length / RACES.length) * 100}%`,
              }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-body text-[10px] text-muted-foreground">MAR</span>
            <span className="font-body text-[10px] text-muted-foreground">DEC</span>
          </div>
        </div>
      </section>

      {/* Race Cards */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="space-y-3">
          {filtered.map((race) => {
            const isNext = race === nextRace;
            const isCompleted = race.status === 'completed';

            return (
              <div
                key={race.round}
                className={`group relative rounded-lg border transition-all duration-300 overflow-hidden ${
                  isNext
                    ? 'border-primary/50 bg-primary/[0.04] shadow-[0_0_40px_-10px_hsl(var(--color-primary)/0.15)]'
                    : isCompleted
                    ? 'border-border/50 bg-card/30 opacity-60'
                    : 'border-border bg-card/40 hover:border-primary/30 hover:bg-card/60'
                }`}
              >
                {isNext && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l" />}

                <div className="flex items-center gap-0">
                  <div className="flex-shrink-0 w-20 md:w-24 self-stretch flex items-center justify-center border-r border-border/50">
                    <div className="text-center">
                      <p className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">
                        Round
                      </p>
                      <p
                        className={`font-display text-2xl md:text-3xl font-black ${
                          isNext ? 'text-primary' : 'text-foreground/30'
                        }`}
                      >
                        {String(race.round).padStart(2, '0')}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{race.flag}</span>
                        <h3
                          className={`font-display text-base md:text-lg font-bold tracking-wide truncate ${
                            isCompleted ? 'text-muted-foreground' : 'text-foreground'
                          }`}
                        >
                          {race.name} <span className="text-primary">GP</span>
                        </h3>
                        {isNext && (
                          <Badge className="bg-primary text-primary-foreground font-display text-[9px] tracking-widest ml-2 animate-pulse">
                            NEXT
                          </Badge>
                        )}
                        {isCompleted && (
                          <Badge
                            variant="outline"
                            className="border-muted-foreground/30 text-muted-foreground font-display text-[9px] tracking-widest ml-2"
                          >
                            FINISHED
                          </Badge>
                        )}
                      </div>
                      <p className="font-body text-xs text-muted-foreground truncate">{race.circuit}</p>
                    </div>

                    <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
                      <div className="hidden lg:block text-right">
                        <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">
                          Location
                        </p>
                        <p className="font-body text-sm text-foreground">{race.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">
                          Date
                        </p>
                        <p
                          className={`font-display text-sm font-semibold ${
                            isNext ? 'text-primary' : 'text-foreground'
                          }`}
                        >
                          {race.date}
                        </p>
                      </div>
                      <div className="hidden sm:block text-right">
                        <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">
                          Laps
                        </p>
                        <p className="font-display text-sm font-semibold text-foreground">{race.laps}</p>
                      </div>
                      <div className="hidden sm:block text-right">
                        <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">
                          Length
                        </p>
                        <p className="font-display text-sm font-semibold text-foreground">
                          {race.circuitLength}
                        </p>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                          isNext ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <nav className="mx-auto max-w-7xl px-6 pb-10 font-body text-sm text-muted-foreground flex flex-wrap gap-x-5 gap-y-2">
        <Link to="/blog" className="text-primary no-underline hover:text-primary/90">All articles</Link>
        <Link to="/drivers" className="text-primary no-underline hover:text-primary/90">Driver grid</Link>
        <Link to="/about" className="text-primary no-underline hover:text-primary/90">About</Link>
      </nav>

      <Footer />
    </div>
  );
}

