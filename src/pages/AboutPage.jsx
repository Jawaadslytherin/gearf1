import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Seo from '../components/Seo';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="About GearUp F1"
        path="/about"
        description="What GearUp F1 is: independent Formula 1 coverage, analysis, and tools for fans — not affiliated with Formula 1."
      />
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-14 pb-20">
        <h1 className="font-display text-3xl font-bold text-foreground mb-6">About GearUp F1</h1>
        <div className="font-body text-muted-foreground space-y-4 leading-relaxed text-sm">
          <p>
            GearUp F1 publishes race weekend coverage, driver and team stories, and technical analysis
            for fans who want more than the headlines. We combine editorial posts with on-site tools
            like calendar and grid references to help you follow the season.
          </p>
          <p>
            This site is <strong className="text-foreground">not affiliated with Formula 1, the FIA, or any team</strong>.
            All trademarks belong to their respective owners.
          </p>
        </div>
        <nav className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-body text-sm">
          <Link to="/blog" className="text-primary no-underline hover:text-primary/90">Read the blog</Link>
          <Link to="/contact" className="text-primary no-underline hover:text-primary/90">Contact</Link>
          <Link to="/" className="text-muted-foreground no-underline hover:text-foreground">Home</Link>
        </nav>
      </main>
      <Footer />
    </div>
  );
}
