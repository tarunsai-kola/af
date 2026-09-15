import { useQuery } from '@tanstack/react-query';
import { impactApi } from '@/api/impactApi';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Globe, Info, HeartHandshake } from 'lucide-react';


export default function ImpactPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['impactSummary'],
    queryFn: () => impactApi.getImpactSummary()
  });

  return (
    <div className="min-h-screen bg-surface-50 pt-24 pb-16 px-4 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <Globe className="w-16 h-16 text-brand-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-black text-surface-900 mb-6 tracking-tight">Our Community Impact</h1>
          <p className="text-xl text-surface-600 leading-relaxed mb-4">
            AIIENS Health operates with complete transparency. The metrics below are generated dynamically in real-time from verified database records.
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-brand-600 bg-brand-50 px-4 py-2 rounded-full font-medium border border-brand-200">
            <HeartHandshake className="w-4 h-4" /> 100% Verifiable Public Benefit
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
        ) : isError ? (
          <div className="text-center py-12"><Alert variant="error">Failed to load impact metrics.</Alert></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.map((metric: any) => (
              <div key={metric.id} className="bg-white rounded-3xl p-8 border border-surface-200 shadow-sm relative group hover:shadow-xl transition-all duration-300">
                {metric.isDemoData && (
                  <span className="absolute top-4 right-4 text-[10px] font-black tracking-widest text-orange-500 bg-orange-100 px-2 py-1 rounded">
                    DEMO DATA
                  </span>
                )}
                
                <h3 className="text-surface-500 font-bold uppercase tracking-wider text-sm mb-2">{metric.name}</h3>
                <div className="text-4xl md:text-5xl font-black text-surface-900 mb-6 text-brand-600">
                  {metric.value}
                </div>
                
                <div className="border-t border-surface-100 pt-6">
                  <div className="flex items-start gap-3 text-sm text-surface-600">
                    <Info className="w-5 h-5 shrink-0 text-surface-400 mt-0.5" />
                    <div>
                      <p className="mb-2"><strong>Calculation:</strong> {metric.calculationMethod}</p>
                      <p className="font-mono text-xs text-surface-400 bg-surface-50 p-2 rounded border border-surface-200 break-all">
                        Source: {metric.source}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center text-sm text-surface-500 max-w-2xl mx-auto">
          <p>
            Metrics are temporarily cached for performance. All calculations strictly exclude unverified, drafted, or cancelled records. 
            Financial figures only include successfully settled transactions.
          </p>
        </div>
      </div>
    </div>
  );
}
