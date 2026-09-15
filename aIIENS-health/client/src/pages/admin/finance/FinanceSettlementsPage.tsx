import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeApi } from '@/api/financeApi';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ArrowRightLeft } from 'lucide-react';

export default function FinanceSettlementsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [activeSettlement, setActiveSettlement] = useState<any>(null);

  const [updateStatus, setUpdateStatus] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['financeSettlements', page, status],
    queryFn: () => financeApi.getSettlements({ page, status, limit: 15 }),
    placeholderData: (prev) => prev
  });

  const updateMutation = useMutation({
    mutationFn: () => financeApi.updateSettlementStatus(activeSettlement._id, { 
      status: updateStatus,
      paymentReference: paymentRef,
      rejectionReason: rejectionReason
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financeSettlements'] });
      setActiveSettlement(null);
    }
  });

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Hospital Settlements</h1>
          <p className="text-surface-600 mt-1">Approve and process fund transfers to hospitals.</p>
        </div>
        <div className="w-48">
          <Select 
            label=""
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'SETTLEMENT_REQUESTED', label: 'Requested' },
              { value: 'UNDER_REVIEW', label: 'Under Review' },
              { value: 'APPROVED', label: 'Approved' },
              { value: 'COMPLETED', label: 'Completed' }
            ]}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-50 text-surface-600 border-b border-surface-200">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Hospital</th>
                <th className="px-6 py-4 font-medium">Campaign</th>
                <th className="px-6 py-4 font-medium">Net Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {isLoading && !data ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center"><Spinner className="mx-auto" /></td></tr>
              ) : isError ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-red-500">Failed to load data.</td></tr>
              ) : data?.data.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-surface-500">No settlements found.</td></tr>
              ) : (
                data?.data.map((s: any) => (
                  <tr key={s._id} className="hover:bg-surface-50">
                    <td className="px-6 py-4">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium">{s.hospitalId?.name}</td>
                    <td className="px-6 py-4 truncate max-w-[200px]">{s.campaignId?.title}</td>
                    <td className="px-6 py-4 font-bold text-brand-600">₹{s.netAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        s.status === 'COMPLETED' ? 'success' : 
                        s.status === 'APPROVED' ? 'brand' : 'warning'
                      }>
                        {s.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button size="sm" variant="outline" onClick={() => {
                        setActiveSettlement(s);
                        setUpdateStatus(s.status);
                      }}>
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeSettlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-brand-600" /> Manage Settlement
            </h2>
            <div className="bg-surface-50 p-4 rounded-xl mb-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-surface-500">Hospital:</span>
                <span className="font-bold">{activeSettlement.hospitalId?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-500">Net Amount:</span>
                <span className="font-bold text-brand-700">₹{activeSettlement.netAmount.toLocaleString()}</span>
              </div>
            </div>

            <Select 
              label="Update Status"
              value={updateStatus}
              onChange={(e) => setUpdateStatus(e.target.value)}
              options={[
                { value: 'UNDER_REVIEW', label: 'Under Review' },
                { value: 'APPROVED', label: 'Approve' },
                { value: 'COMPLETED', label: 'Mark as Completed / Paid' },
              ]}
              className="mb-4"
            />

            {updateStatus === 'COMPLETED' && (
              <Input 
                label="Bank Transfer Reference / UTR"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                className="mb-4"
                placeholder="e.g. HDFC12345678"
              />
            )}

            <div className="flex gap-3 justify-end mt-6">
              <Button variant="outline" onClick={() => setActiveSettlement(null)}>Cancel</Button>
              <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
                Save Status
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
