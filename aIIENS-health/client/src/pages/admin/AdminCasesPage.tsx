import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/adminApi';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export default function AdminCasesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentStatus = searchParams.get('status') || '';
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminCases', currentStatus, currentPage],
    queryFn: () => adminApi.getCases({ status: currentStatus, page: currentPage, limit: 15 }),
    placeholderData: (prev) => prev,
  });

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams(prev => {
      if (e.target.value) prev.set('status', e.target.value);
      else prev.delete('status');
      prev.set('page', '1');
      return prev;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => {
      prev.set('page', newPage.toString());
      return prev;
    });
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Case Verification</h1>
          <p className="text-surface-600 mt-1">Review and process fundraiser applications.</p>
        </div>

        <div className="w-full md:w-64">
          <Select 
            label="" 
            value={currentStatus}
            onChange={handleStatusChange}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'UNDER_VERIFICATION', label: 'Under Verification' },
              { value: 'DOCUMENTS_PENDING', label: 'Documents Pending' },
              { value: 'APPROVED', label: 'Approved' },
              { value: 'LIVE', label: 'Live' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ]}
          />
        </div>
      </div>

      {isError && (
        <Alert variant="error" title="Failed to load cases" className="mb-6">
          There was an error connecting to the server.
        </Alert>
      )}

      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-50 text-surface-600 border-b border-surface-200">
              <tr>
                <th className="px-6 py-4 font-medium">Case ID / Patient</th>
                <th className="px-6 py-4 font-medium">Hospital</th>
                <th className="px-6 py-4 font-medium">Target Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date Applied</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {isLoading && !data ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Spinner className="mx-auto" />
                  </td>
                </tr>
              ) : data?.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-surface-500">
                    No cases found matching the criteria.
                  </td>
                </tr>
              ) : (
                data?.data.map(c => (
                  <tr key={c._id} className="hover:bg-surface-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-surface-900">{c.patientName || 'Unknown Patient'}</p>
                      <p className="text-xs text-surface-500 font-mono mt-0.5">{c._id}</p>
                    </td>
                    <td className="px-6 py-4 text-surface-600">
                      {(c.hospitalId as any)?.name || 'Not Selected'}
                    </td>
                    <td className="px-6 py-4 font-medium text-surface-900">
                      ₹{c.fundraisingTarget?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        c.status === 'UNDER_VERIFICATION' ? 'warning' :
                        c.status === 'APPROVED' ? 'success' :
                        c.status === 'LIVE' ? 'brand' :
                        c.status === 'CANCELLED' ? 'error' : 'default'
                      }>
                        {c.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-surface-600">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => navigate(`/admin/cases/${c._id}`)}
                      >
                        <Eye className="w-4 h-4" /> Review
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.meta && data.meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-surface-200 flex items-center justify-between">
            <p className="text-sm text-surface-500">
              Showing page {data.meta.page} of {data.meta.totalPages}
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!data.meta.hasPrevPage}
                onClick={() => handlePageChange(data.meta.page - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!data.meta.hasNextPage}
                onClick={() => handlePageChange(data.meta.page + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
