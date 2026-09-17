import { Shield, TrendingUp, CheckCircle, Database } from 'lucide-react';

export function TransparencySection() {
  const stats = [
    { label: "Total Campaigns Funded", value: "842", icon: <CheckCircle className="w-5 h-5 text-emerald-400" /> },
    { label: "Funds Settled to Hospitals", value: "₹12.4 Cr", icon: <TrendingUp className="w-5 h-5 text-emerald-400" /> },
    { label: "Active Verifications", value: "45", icon: <Shield className="w-5 h-5 text-blue-400" /> },
    { label: "Data Audits Completed", value: "24", icon: <Database className="w-5 h-5 text-purple-400" /> }
  ];

  return (
    <section className="py-24 bg-surface-950 text-white relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-800 text-surface-300 text-sm font-semibold mb-6">
              <Shield className="w-4 h-4" />
              100% Transparent
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              Your Trust Should Be <span className="text-brand-400">Verifiable.</span>
            </h2>
            <p className="text-lg text-surface-300 leading-relaxed mb-8">
              We believe in complete financial transparency. Every rupee donated is tracked, accounted for, and settled directly to the verified medical institution. No hidden fees. No opaque processes.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-lg">Direct to Hospital</h4>
                  <p className="text-surface-400 text-sm">Funds never go to personal bank accounts.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-lg">Public Audits</h4>
                  <p className="text-surface-400 text-sm">Regularly updated transparency reports available for public download.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="lg:w-1/2 w-full relative">
            {/* Background glow behind the dashboard */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
            
            <div className="bg-surface-900/40 backdrop-blur-xl rounded-3xl p-8 border border-surface-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-surface-800/50 relative z-10">
                <div>
                  <h3 className="font-bold text-xl text-white">Impact Dashboard</h3>
                  <p className="text-sm text-surface-400">Live data representation</p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div> Live
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-surface-950/50 backdrop-blur-md rounded-2xl p-6 border border-surface-800 relative group hover:border-brand-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(14,165,233,0.15)] hover:-translate-y-1">
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 to-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                    
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-surface-900/80 flex items-center justify-center border border-surface-800 group-hover:border-brand-500/30 group-hover:bg-brand-500/10 transition-colors">
                        {stat.icon}
                      </div>
                      <span className="text-surface-400 text-sm font-medium group-hover:text-surface-300 transition-colors">{stat.label}</span>
                    </div>
                    <div className="text-3xl font-black font-mono tracking-tight text-white group-hover:text-brand-50 transition-colors">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
