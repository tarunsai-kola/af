import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center pt-24 pb-32">
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      >
        {/* Subtle, premium gradient overlay matching "deep charcoal and medical blue" aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-r from-surface-950/95 via-surface-900/80 to-transparent"></div>
        <div className="absolute inset-0 bg-brand-900/10"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl text-left">
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Help Someone.<br />
            <span className="text-brand-400">Change a Life.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-surface-200 mb-10 leading-relaxed max-w-2xl font-light">
            AIIENS Foundation connects people in need with people ready to help — through verified medical fundraising, blood-donation coordination, free medical camps and community-driven healthcare support.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/fundraisers">
              <Button size="lg" variant="primary" className="w-full sm:w-auto px-10 py-7 text-lg rounded-2xl shadow-2xl shadow-brand-500/30 hover:scale-105 transition-transform bg-brand-600 hover:bg-brand-500 text-white font-bold border-none">
                Donate Now
              </Button>
            </Link>
            <Link to="/fundraisers/create">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-10 py-7 text-lg rounded-2xl bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-md hover:scale-105 transition-transform font-bold">
                Find Ways to Help
              </Button>
            </Link>
          </div>
          
        </div>
      </div>
    </section>
  );
}
