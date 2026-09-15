import { useQuery } from '@tanstack/react-query';
import { financeApi } from '@/api/financeApi';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { DollarSign, Clock, FileSpreadsheet, XCircle, ArrowRightLeft, CheckCircle2 } from 'lucide-react';

export default function FinanceDashboardPage() {
  const { data: metrics, isLoading, isError } = useQuery({
    queryKey: ['financeMetrics'],
    queryFn: financeApi.getMetrics,
  });

  if (isLoading) return <div className="p-12 flex justify-center"><Spinner size="lg" /></div>;
  if (isError || !metrics) return <Alert variant="error" title="Error">Failed to load finance metrics.</Alert>;

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900">Finance & Accounts</h1>
        <p className="text-surface-600 mt-1">Overview of donations, settlements, and reconciliation.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        
        {/* Total Donations */}
        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-500">Total Donations</p>
              <p className="text-2xl font-bold text-surface-900">{metrics.totalDonations}</p>
            </div>
          </div>
        </div>

        {/* Today's Donations */}
        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-500">Today's Donations</p>
              <p className="text-2xl font-bold text-surface-900">{metrics.todayDonations}</p>
            </div>
          </div>
        </div>

        {/* Pending Settlements */}
        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-500">Pending Settlements</p>
              <p className="text-2xl font-bold text-surface-900">{metrics.pendingSettlements}</p>
            </div>
          </div>
        </div>

        {/* Completed Settlements */}
        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-500">Completed Settlements</p>
              <p className="text-2xl font-bold text-surface-900">{metrics.completedSettlements}</p>
            </div>
          </div>
        </div>

        {/* Pending Reconciliation */}
        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-500">Reconciliation Action</p>
              <p className="text-2xl font-bold text-surface-900">{metrics.pendingReconciliation}</p>
            </div>
          </div>
        </div>

        {/* Failed Payments */}
        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-500">Failed Payments</p>
              <p className="text-2xl font-bold text-surface-900">{metrics.failedPayments}</p>
            </div>
          </div>
        </div>

        {/* Refunds */}
        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-500">Refunds Processed</p>
              <p className="text-2xl font-bold text-surface-900">{metrics.refunds}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
