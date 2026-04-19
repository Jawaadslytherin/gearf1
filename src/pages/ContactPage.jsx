import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Seo from '../components/Seo';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Contact"
        path="/contact"
        description="Get in touch with GearUp F1 — feedback, tips, and partnership enquiries."
      />
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-14 pb-20">
        <h1 className="font-display text-3xl font-bold text-foreground mb-6">Contact</h1>
        <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">
          Questions about our coverage, corrections, or collaborations? Reach out by email. We read
          every message; response time varies during race weekends.
        </p>
        <a
          href="mailto:gearupf1@gmail.com"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-4 py-3 font-body text-sm text-foreground no-underline hover:border-primary/40 transition-colors"
        >
          <Mail className="h-4 w-4 text-primary" />
          gearupf1@gmail.com
        </a>
        <nav className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-body text-sm">
          <Link to="/about" className="text-primary no-underline hover:text-primary/90">About</Link>
          <Link to="/blog" className="text-primary no-underline hover:text-primary/90">Blog</Link>
          <Link to="/" className="text-muted-foreground no-underline hover:text-foreground">Home</Link>
        </nav>
      </main>
      <Footer />
    </div>
  );
}
