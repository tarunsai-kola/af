import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campApi } from '@/api/campApi';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Stethoscope } from 'lucide-react';

const WORKFLOW = [
  'DRAFT',
  'SUBMITTED',
  'ORGANIZER_VERIFICATION',
  'PROVIDER_VERIFICATION',
  'LOCATION_CONFIRMATION',
  'APPROVED',
  'PUBLISHED',
  'REGISTRATION_OPEN',
  'COMPLETED',
  'CLOSED'
];

export default function AdminCampsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [activeCamp, setActiveCamp] = useState<any>(null);
  
  const [updateStatus, setUpdateStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminCamps', page, status],
    queryFn: () => campApi.getAllCampsAdmin({ page, status, limit: 15 }),
    placeholderData: (prev) => prev
  });

  const updateMutation = useMutation({
    mutationFn: () => campApi.verifyCampStatus(activeCamp._id, { status: updateStatus, notes: adminNotes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCamps'] });
      setActiveCamp(null);
      setAdminNotes('');
    }
  });

  const openManage = (camp: any) => {
    setActiveCamp(camp);
    setUpdateStatus(camp.status);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Camps Verification</h1>
          <p className="text-surface-600 mt-1">Review and approve proposed medical camps.</p>
        </div>
        <div className="w-64">
          <Select 
            label=""
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            options={[
              { value: '', label: 'All Statuses' },
              ...WORKFLOW.map(w => ({ value: w, label: w.replace(/_/g, ' ') }))
            ]}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-50 text-surface-600 border-b border-surface-200">
              <tr>
                <th className="px-6 py-4 font-medium">Camp Title</th>
                <th className="px-6 py-4 font-medium">Host</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">City</th>
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
                <tr><td colSpan={6} className="px-6 py-12 text-center text-surface-500">No camps found.</td></tr>
              ) : (
                data?.data.map((c: any) => (
                  <tr key={c._id} className="hover:bg-surface-50">
                    <td className="px-6 py-4 font-medium max-w-[200px] truncate">{c.title}</td>
                    <td className="px-6 py-4 text-surface-600">{c.hostUserId?.name}</td>
                    <td className="px-6 py-4">{new Date(c.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{c.location?.city}</td>
                    <td className="px-6 py-4">
                      <Badge variant={c.status === 'PUBLISHED' || c.status === 'REGISTRATION_OPEN' ? 'success' : 'brand'}>
                        {c.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button size="sm" variant="outline" onClick={() => openManage(c)}>Review</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeCamp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-brand-600" /> Verify Camp
            </h2>
            
            <div className="bg-surface-50 p-4 rounded-xl mb-6 text-sm space-y-3 border border-surface-200">
              <p><strong className="text-surface-500">Title:</strong> {activeCamp.title}</p>
              <p><strong className="text-surface-500">Provider:</strong> {activeCamp.provider.name} (Reg: {activeCamp.provider.registrationNumber})</p>
              <p><strong className="text-surface-500">Contact:</strong> {activeCamp.provider.contactName} - {activeCamp.provider.contactPhone}</p>
              <p><strong className="text-surface-500">Venue:</strong> {activeCamp.location.venue}, {activeCamp.location.address}</p>
              
              {activeCamp.notes && (
                <div className="mt-4 pt-4 border-t border-surface-200">
                  <strong className="text-surface-500 block mb-1">Previous Notes:</strong>
                  <p className="whitespace-pre-wrap">{activeCamp.notes}</p>
                </div>
              )}
            </div>

            <Select 
              label="Transition Status"
              value={updateStatus}
              onChange={(e) => setUpdateStatus(e.target.value)}
              options={WORKFLOW.map(w => ({ value: w, label: w.replace(/_/g, ' ') }))}
              className="mb-4"
            />

            <div className="mb-6">
              <label className="block text-sm font-medium text-surface-700 mb-1">Admin Notes (Optional)</label>
              <textarea 
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[80px]"
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                placeholder="Log verification details..."
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setActiveCamp(null)}>Cancel</Button>
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
