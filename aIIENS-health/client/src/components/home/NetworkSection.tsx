import { Network, Building2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NetworkSection() {
  return (
    <section className="py-24 bg-white border-y border-surface-100 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="lg:w-1/2 relative">
            {/* Visual representation of a network */}
            <div className="aspect-square max-w-md mx-auto relative">
              <div className="absolute inset-0 bg-brand-50 rounded-full animate-pulse-slow"></div>
              <div className="absolute inset-8 bg-brand-100 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center z-20 relative">
                  <div className="absolute -top-3 -right-3 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xl text-brand-600 tracking-tight">AIIENS</span>
                </div>
              </div>
              
              {/* Surrounding nodes */}
              <div className="absolute top-[10%] left-[20%] w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center z-10 border border-surface-100">
                <Building2 className="w-6 h-6 text-surface-400" />
              </div>
              <div className="absolute bottom-[20%] left-[10%] w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center z-10 border border-surface-100">
                <Network className="w-5 h-5 text-surface-400" />
              </div>
              <div className="absolute top-[30%] right-[10%] w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center z-10 border border-surface-100">
                <Building2 className="w-8 h-8 text-surface-400" />
              </div>
              <div className="absolute bottom-[15%] right-[25%] w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center z-10 border border-surface-100">
                <Network className="w-6 h-6 text-surface-400" />
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-6 tracking-tight">
              A Verified Network of Care
            </h2>
            <p className="text-lg text-surface-600 mb-8 leading-relaxed">
              We don't work alone. AIIENS Foundation operates as a central hub, connecting verified healthcare providers, local NGOs, and donors.
            </p>
            
            <div className="space-y-8 mb-10">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-surface-900 mb-2">Healthcare Provider Network</h3>
                  <p className="text-surface-600 leading-relaxed text-sm">
                    We partner with 150+ verified hospitals and clinics. All medical cases are authenticated directly by the treating doctors, and funds are settled straight to the hospital's bank account.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <Network className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-surface-900 mb-2">NGO Partner Network</h3>
                  <p className="text-surface-600 leading-relaxed text-sm">
                    Local NGOs act as our eyes and ears on the ground, identifying critical cases in remote areas and helping families navigate the digital platform to seek aid.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/ngo-network">
                <Button variant="outline" className="border-surface-300">Join as an NGO</Button>
              </Link>
              <Link to="/partner">
                <Button variant="outline" className="border-surface-300">Join as a Hospital</Button>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
