import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { financeApi } from '@/api/financeApi';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function FinanceDonationsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['financeDonations', page, status],
    queryFn: () => financeApi.getDonations({ page, status, limit: 15 }),
    placeholderData: (prev) => prev
  });

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Donation Ledger</h1>
          <p className="text-surface-600 mt-1">Master record of all processed donations.</p>
        </div>
        <div className="w-48">
          <Select 
            label=""
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'refunded', label: 'Refunded' },
              { value: 'failed', label: 'Failed' }
            ]}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-50 text-surface-600 border-b border-surface-200">
              <tr>
                <th className="px-6 py-4 font-medium">Receipt / ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Donor</th>
                <th className="px-6 py-4 font-medium">Campaign</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Provider Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {isLoading && !data ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center"><Spinner className="mx-auto" /></td></tr>
              ) : isError ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-red-500">Failed to load data.</td></tr>
              ) : data?.data.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-surface-500">No donations found.</td></tr>
              ) : (
                data?.data.map((d: any) => (
                  <tr key={d._id} className="hover:bg-surface-50">
                    <td className="px-6 py-4 font-mono text-xs text-surface-600">{d.receiptNumber || d._id}</td>
                    <td className="px-6 py-4">{new Date(d.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4">{d.isAnonymous ? 'Anonymous' : d.userId?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 max-w-[200px] truncate">{d.campaignId?.title}</td>
                    <td className="px-6 py-4 font-bold text-surface-900">₹{d.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <Badge variant={d.status === 'confirmed' ? 'success' : d.status === 'refunded' ? 'warning' : 'error'}>
                        {d.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-surface-500">
                      {d.paymentTransactionId?.providerPaymentId || d.providerReference || 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {data?.meta && data.meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-surface-200 flex items-center justify-between">
            <p className="text-sm text-surface-500">Page {data.meta.page} of {data.meta.totalPages}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={!data.meta.hasPrevPage} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" disabled={!data.meta.hasNextPage} onClick={() => setPage(p => p + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
