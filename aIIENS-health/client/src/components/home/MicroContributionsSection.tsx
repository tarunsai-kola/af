import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { IndianRupee } from 'lucide-react';

export function MicroContributionsSection() {
  const impacts = [
    { amount: "₹100", impact: "Can cover one day of critical medicines for a pediatric patient." },
    { amount: "₹500", impact: "Can fund a complete nutritional kit for a recovering mother." },
    { amount: "₹1,000", impact: "Can sponsor the diagnostic tests required before a major surgery." }
  ];

  return (
    <section className="py-24 bg-surface-900 text-white border-y border-surface-800">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="w-16 h-16 bg-brand-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-400">
            <IndianRupee className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            You Don't Need to Give a Lot to Make a Difference.
          </h2>
          <p className="text-lg text-surface-300 leading-relaxed">
            Every contribution, no matter the size, is pooled together transparently to fund life-saving treatments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {impacts.map((item, index) => (
            <div key={index} className="bg-surface-800 rounded-2xl p-8 border border-surface-700 text-center hover:border-brand-500 transition-colors">
              <h3 className="text-4xl font-black text-brand-400 mb-4">{item.amount}</h3>
              <p className="text-surface-300 leading-relaxed">{item.impact}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/fundraisers">
            <Button size="lg" className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-10 py-6 text-lg rounded-xl shadow-lg shadow-brand-500/20">
              Make a Micro-Contribution Today
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
