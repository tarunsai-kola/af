import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function AboutGovernanceSection() {
  return (
    <section className="py-24 bg-surface-950 text-white">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-800 text-surface-300 text-xs font-bold uppercase tracking-wider mb-6">
              Who We Are
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              Technology for Humanity. Impact for Everyone.
            </h2>
            <p className="text-surface-300 leading-relaxed mb-6">
              AIIENS Foundation is a technology-enabled charitable foundation focused on healthcare access. We build the digital infrastructure that connects those in desperate need of medical care with those who can provide it—with complete transparency.
            </p>
            <p className="text-surface-300 leading-relaxed mb-8">
              We believe that financial barriers should not determine a person's right to live.
            </p>
            <Link to="/about">
              <Button variant="outline" className="bg-transparent border-surface-600 text-white hover:bg-surface-800">
                Read Our Story
              </Button>
            </Link>
          </div>

          <div className="bg-surface-900 rounded-3xl p-8 md:p-10 border border-surface-800">
            <h3 className="text-2xl font-bold mb-8 tracking-tight">Open About How We Work</h3>
            
            <div className="space-y-6">
              <div className="border-b border-surface-800 pb-6">
                <h4 className="font-bold text-brand-400 mb-2">Strict Governance</h4>
                <p className="text-surface-400 text-sm leading-relaxed">
                  We operate under stringent legal and ethical guidelines. Our board includes medical professionals, financial auditors, and social workers to ensure balanced and fair decision-making.
                </p>
              </div>
              
              <div className="border-b border-surface-800 pb-6">
                <h4 className="font-bold text-brand-400 mb-2">Zero Platform Fee on Donations</h4>
                <p className="text-surface-400 text-sm leading-relaxed">
                  100% of your donation (minus mandatory payment gateway charges) goes directly to the hospital for the patient's treatment. We fund our operational costs separately.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-brand-400 mb-2">Annual Transparency Reports</h4>
                <p className="text-surface-400 text-sm leading-relaxed mb-6">
                  Every year, we publish a detailed financial and impact audit. We believe trust is earned through verifiable data.
                </p>
                <Link to="/transparency" className="text-sm font-semibold text-white hover:text-brand-400 transition-colors flex items-center gap-2">
                  View Latest Report →
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
