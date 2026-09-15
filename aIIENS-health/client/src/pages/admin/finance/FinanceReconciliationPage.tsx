import { useQuery } from '@tanstack/react-query';
import { financeApi } from '@/api/financeApi';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { AlertTriangle, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export default function FinanceReconciliationPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['financeReconciliation'],
    queryFn: financeApi.getReconciliationReport,
  });

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Reconciliation Report</h1>
        <p className="text-surface-600 mt-1">Detect mismatches between Campaign allocation and Donation ledgers.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm mb-8">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-brand-600" /> Reconciliation Status
        </h3>
        {isLoading ? (
          <div className="py-8"><Spinner /></div>
        ) : isError ? (
          <Alert variant="error" title="Error">Failed to generate report.</Alert>
        ) : (
          <div className="mt-4">
            <p className="text-surface-700 mb-6">
              Checked <span className="font-bold">{data.totalChecked}</span> active campaigns against the master donation ledger.
            </p>

            {data.mismatches && data.mismatches.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex gap-3 text-rose-800">
                  <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold">Mismatches Detected</h4>
                    <p className="text-sm">The following campaigns show a discrepancy between the allocated raised amount and the sum of confirmed donation receipts. Please audit immediately.</p>
                  </div>
                </div>

                <div className="overflow-x-auto border border-surface-200 rounded-xl">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-surface-50 text-surface-600 border-b border-surface-200">
                      <tr>
                        <th className="px-6 py-4 font-medium">Campaign ID</th>
                        <th className="px-6 py-4 font-medium">Title</th>
                        <th className="px-6 py-4 font-medium">Campaign Value</th>
                        <th className="px-6 py-4 font-medium">Ledger Sum</th>
                        <th className="px-6 py-4 font-medium">Difference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100">
                      {data.mismatches.map((m: any) => (
                        <tr key={m.campaignId} className="bg-white">
                          <td className="px-6 py-4 font-mono text-xs">{m.campaignId}</td>
                          <td className="px-6 py-4 max-w-[200px] truncate">{m.title}</td>
                          <td className="px-6 py-4">₹{m.campaignRaisedAmount.toLocaleString()}</td>
                          <td className="px-6 py-4">₹{m.donationSum.toLocaleString()}</td>
                          <td className="px-6 py-4 font-bold text-rose-600">₹{m.difference.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center text-emerald-800 flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 mb-3 text-emerald-500" />
                <h4 className="font-bold text-lg mb-1">Perfect Reconciliation</h4>
                <p>All active campaign balances match exactly with the sum of their confirmed donation receipts. No discrepancies found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
