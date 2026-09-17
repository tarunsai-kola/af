import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Users2, Trophy, ArrowRight } from 'lucide-react';

export function CommunityFundraisingSection() {
  return (
    <section 
      className="py-24 relative bg-cover bg-center bg-fixed text-white"
      style={{ backgroundImage: 'url(/images/programs/medical-camps.jpg)' }}
    >
      <div className="absolute inset-0 bg-surface-900/85 backdrop-blur-[2px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
              You Don't Have to <br className="hidden md:block"/> Give Alone.
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              When communities come together, impact multiplies. Start a team fundraiser, participate in a community challenge, and pool your resources to hit massive verified medical goals together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/fundraisers/create-team">
                <Button size="lg" className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white gap-2">
                  <Users2 className="w-5 h-5" /> Start a Team
                </Button>
              </Link>
              <Link to="/challenges">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                  <Trophy className="w-5 h-5 text-amber-500" /> View Challenges
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-900/30 rounded-bl-full -z-0"></div>
              
              <div className="relative z-10">
                <div className="inline-flex px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-full uppercase tracking-wider mb-6 flex-items-center gap-1.5">
                  <Trophy className="w-4 h-4" /> Community Challenge
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">Corporate Matching: Save 10 Lives</h3>
                <p className="text-slate-300 text-sm mb-6">Tech Mahindra Foundation is matching every donation up to ₹5,00,000 for verified pediatric surgeries this week.</p>
                
                <div className="bg-surface-900/50 rounded-2xl p-6 mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase">Pooled So Far</p>
                      <p className="text-2xl font-bold text-white">₹3,42,000</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-400 uppercase">Target</p>
                      <p className="text-sm font-bold text-white">₹5,00,000</p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-surface-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
                
                <Link to="/challenges/tech-mahindra-pediatric" className="flex items-center justify-between group">
                  <span className="font-semibold text-brand-600 group-hover:text-brand-700">Join this challenge</span>
                  <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 group-hover:bg-brand-100 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
