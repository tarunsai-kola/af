import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { impactApi } from '@/api/impactApi';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Select } from '@/components/ui/Select';
import { BarChart4, RefreshCcw, Database } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminImpactPage() {
  const [selectedMetric, setSelectedMetric] = useState('active-fundraisers');

  const { data: metrics, isLoading: loadingSummary, refetch } = useQuery({
    queryKey: ['impactSummaryAdmin'],
    queryFn: () => impactApi.getImpactSummary(true) // Force fresh
  });

  const { data: inspection, isLoading: loadingInspection, isFetching } = useQuery({
    queryKey: ['impactInspection', selectedMetric],
    queryFn: () => impactApi.getImpactInspection(selectedMetric),
    enabled: !!selectedMetric
  });

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
            <BarChart4 className="w-6 h-6 text-brand-600" /> Impact Data Audit
          </h1>
          <p className="text-surface-600 mt-1">Inspect the raw database records behind public impact claims.</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCcw className="w-4 h-4" /> Force Recalculate
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-lg text-surface-900 border-b border-surface-200 pb-2">Current Metrics</h3>
          {loadingSummary ? (
            <div className="py-8 text-center"><Spinner /></div>
          ) : metrics?.map((m: any) => (
            <button
              key={m.id}
              onClick={() => setSelectedMetric(m.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedMetric === m.id 
                  ? 'bg-brand-50 border-brand-200 ring-2 ring-brand-500/20' 
                  : 'bg-white border-surface-200 hover:border-brand-300'
              }`}
            >
              <div className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1">{m.name}</div>
              <div className="text-2xl font-black text-brand-700">{m.value}</div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-6 h-full min-h-[500px]">
            <div className="flex items-center gap-2 mb-6 border-b border-surface-100 pb-4">
              <Database className="w-5 h-5 text-surface-400" />
              <h3 className="font-bold text-lg text-surface-900">Raw Data Inspection</h3>
            </div>

            {loadingInspection || isFetching ? (
              <div className="py-20 flex justify-center"><Spinner /></div>
            ) : inspection?.message ? (
              <Alert variant="info">{inspection.message}</Alert>
            ) : inspection?.sample ? (
              <div>
                <Alert variant="info" className="mb-4">{inspection.note}</Alert>
                <div className="bg-surface-50 rounded-xl overflow-x-auto border border-surface-200">
                  <pre className="p-4 text-xs font-mono text-surface-700 whitespace-pre-wrap">
                    {JSON.stringify(inspection.sample, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-surface-500">Select a metric to inspect its source data.</div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
