import { ShieldCheck, HeartPulse, Building2, Users } from 'lucide-react';

export function TrustStripSection() {
  return (
    <section className="bg-surface-900 border-b border-surface-800 relative z-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-8 md:py-12">
          
          <div className="flex flex-col items-center text-center px-4">
            <div className="w-12 h-12 rounded-full bg-brand-900/50 flex items-center justify-center mb-4 text-brand-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-white font-semibold mb-2">Verified Cases</h3>
            <p className="text-slate-300 text-sm">Every campaign is authenticated by authorized medical professionals.</p>
          </div>

          <div className="flex flex-col items-center text-center px-4">
            <div className="w-12 h-12 rounded-full bg-emerald-900/50 flex items-center justify-center mb-4 text-emerald-400">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-white font-semibold mb-2">Transparent Flow</h3>
            <p className="text-slate-300 text-sm">Contributions are recorded transparently and settled directly to hospitals.</p>
          </div>

          <div className="flex flex-col items-center text-center px-4">
            <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-4 text-blue-400">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-white font-semibold mb-2">Healthcare Partners</h3>
            <p className="text-slate-300 text-sm">Built alongside verified hospitals, clinics, and blood centers.</p>
          </div>

          <div className="flex flex-col items-center text-center px-4">
            <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mb-4 text-purple-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-white font-semibold mb-2">Community Powered</h3>
            <p className="text-slate-300 text-sm">Impact is driven by individuals, groups, and organizations working together.</p>
          </div>

        </div>
      </div>
    </section>
  );
}
