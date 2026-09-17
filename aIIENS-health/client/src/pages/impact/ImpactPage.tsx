import { useQuery } from '@tanstack/react-query';
import { impactApi } from '@/api/impactApi';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Globe, Info, HeartHandshake, ShieldCheck } from 'lucide-react';


export default function ImpactPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['impactSummary'],
    queryFn: () => impactApi.getImpactSummary()
  });

  return (
    <div className="min-h-screen bg-surface-950 pb-24">
      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 overflow-hidden border-b border-surface-800">
        <div className="absolute inset-0 bg-surface-900">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
            style={{ backgroundImage: 'url(/images/programs/medical-fundraising.jpg)' }}
          />
          <div className="absolute inset-0 bg-brand-500/5" />
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 font-medium text-sm mb-6 animate-fade-in-up">
            <ShieldCheck className="w-4 h-4" />
            100% Verifiable Public Benefit
          </div>
          
          <Globe className="w-16 h-16 text-brand-500 mx-auto mb-6 animate-fade-in-up opacity-80" style={{ animationDelay: '50ms' }} />
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Our Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">Impact</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 mb-6 leading-relaxed animate-fade-in-up max-w-2xl mx-auto" style={{ animationDelay: '200ms' }}>
            AIIENS Health operates with complete transparency. The metrics below are generated dynamically in real-time from verified database records.
          </p>
        </div>
      </section>

      {/* ── Metrics Grid ── */}
      <div className="container mx-auto px-4 -mt-10 relative z-20 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="py-20 flex justify-center bg-surface-900/50 backdrop-blur-md rounded-3xl border border-surface-800 shadow-xl">
              <Spinner size="lg" />
            </div>
          ) : isError ? (
            <div className="text-center py-12 bg-surface-900/50 backdrop-blur-md rounded-3xl border border-surface-800 shadow-xl">
              <Alert variant="error">Failed to load impact metrics.</Alert>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.map((metric: any) => (
                <div key={metric.id} className="bg-surface-900/50 backdrop-blur-md rounded-3xl p-8 border border-surface-800 shadow-xl relative group hover:border-brand-500/30 transition-all duration-300">
                  
                  {/* Glowing background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-brand-500/0 to-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />

                  {metric.isDemoData && (
                    <span className="absolute top-4 right-4 text-[10px] font-black tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded">
                      DEMO DATA
                    </span>
                  )}
                  
                  <h3 className="text-brand-400 font-bold uppercase tracking-wider text-sm mb-3">
                    {metric.name}
                  </h3>
                  
                  <div className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">
                    {metric.value}
                  </div>
                  
                  <div className="border-t border-surface-800/50 pt-6">
                    <div className="flex items-start gap-3 text-sm text-slate-400">
                      <Info className="w-5 h-5 shrink-0 text-slate-500 mt-0.5" />
                      <div>
                        <p className="mb-3">
                          <strong className="text-slate-300">Calculation:</strong> {metric.calculationMethod}
                        </p>
                        <p className="font-mono text-xs text-brand-300/70 bg-brand-500/5 p-2.5 rounded-lg border border-brand-500/10 break-all shadow-inner">
                          <span className="text-slate-500 mr-1">Source:</span>
                          {metric.source}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-20 text-center text-sm text-slate-500 max-w-2xl mx-auto border-t border-surface-800/50 pt-10">
            <p>
              Metrics are temporarily cached for performance. All calculations strictly exclude unverified, drafted, or cancelled records. 
              Financial figures only include successfully settled transactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
