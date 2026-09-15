import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditApi } from '@/api/auditApi';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { FileSpreadsheet, Search, ChevronDown, ChevronUp, User, Clock, HardDrive, Shield } from 'lucide-react';

const AUDIT_ACTIONS = [
  'LOGIN', 'LOGOUT', 'CASE_CREATED', 'CASE_UPDATED', 'DOCUMENT_UPLOADED', 'DOCUMENT_ACCESSED',
  'HOSPITAL_VERIFIED', 'CLINICAL_REVIEW_COMPLETED', 'CAMPAIGN_APPROVED', 'CAMPAIGN_PUBLISHED',
  'CAMPAIGN_PAUSED', 'DONATION_CREATED', 'PAYMENT_CONFIRMED', 'PAYMENT_FAILED', 'REFUND_CREATED',
  'SETTLEMENT_REQUESTED', 'SETTLEMENT_APPROVED', 'SETTLEMENT_COMPLETED', 'DONOR_MATCHED',
  'CAMP_APPROVED', 'RISK_FLAG_CREATED', 'COMPLAINT_CREATED', 'ROLE_CHANGED', 'create', 'update', 'delete'
];

export default function AdminAuditPage() {
  const [page, setPage] = useState(1);
  const [actor, setActor] = useState('');
  const [action, setAction] = useState('');
  const [objectType, setObjectType] = useState('');
  const [objectId, setObjectId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['auditLogs', page, actor, action, objectType, objectId, startDate, endDate],
    queryFn: () => auditApi.getAuditLogs({ 
      page, limit: 15, actor, action, objectType, objectId, startDate, endDate 
    }),
    placeholderData: (prev) => prev
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleClearFilters = () => {
    setActor('');
    setAction('');
    setObjectType('');
    setObjectId('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-brand-600" /> System Audit Logs
          </h1>
          <p className="text-surface-600 mt-1">Immutable ledger of critical system events and user actions.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-6 mb-8">
        <h3 className="font-bold text-surface-900 mb-4 flex items-center gap-2">
          <Search className="w-4 h-4 text-surface-500" /> Filter Logs
        </h3>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          <Input label="Actor User ID" value={actor} onChange={e => {setActor(e.target.value); setPage(1)}} placeholder="Object ID..." />
          <Select 
            label="Action" 
            value={action} 
            onChange={e => {setAction(e.target.value); setPage(1)}}
            options={[
              {value:'', label: 'All Actions'},
              ...AUDIT_ACTIONS.map(a => ({value: a, label: a}))
            ]}
          />
          <Input label="Object Type" value={objectType} onChange={e => {setObjectType(e.target.value); setPage(1)}} placeholder="e.g. Campaign" />
          <Input label="Object ID" value={objectId} onChange={e => {setObjectId(e.target.value); setPage(1)}} placeholder="Object ID..." />
          <Input label="Start Date" type="date" value={startDate} onChange={e => {setStartDate(e.target.value); setPage(1)}} />
          <Input label="End Date" type="date" value={endDate} onChange={e => {setEndDate(e.target.value); setPage(1)}} />
        </div>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleClearFilters}>Clear Filters</Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-50 text-surface-600 border-b border-surface-200">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Actor</th>
                <th className="px-6 py-4 font-medium">Object</th>
                <th className="px-6 py-4 font-medium">Summary</th>
                <th className="px-6 py-4 font-medium text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {isLoading && !data ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center"><Spinner className="mx-auto" /></td></tr>
              ) : isError ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-red-500">Failed to load audit logs.</td></tr>
              ) : data?.data.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-surface-500">No logs found for the given filters.</td></tr>
              ) : (
                data?.data.map((log: any) => (
                  <React.Fragment key={log._id}>
                    <tr className="hover:bg-surface-50 cursor-pointer" onClick={() => toggleExpand(log._id)}>
                      <td className="px-6 py-4 text-surface-600 font-medium">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="brand">{log.action}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        {log.actorUserId ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-surface-900">{log.actorUserId.name}</span>
                            <span className="text-xs text-surface-500">{log.actorUserId.email}</span>
                          </div>
                        ) : (
                          <span className="text-surface-400 italic">SYSTEM</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-surface-900">{log.objectType}</span>
                          <span className="text-xs text-surface-500 font-mono">{log.objectId || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-surface-700 max-w-xs truncate">
                        {log.changeSummary || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm">
                          {expandedId === log._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </td>
                    </tr>
                    
                    {/* Expanded Details Row */}
                    {expandedId === log._id && (
                      <tr className="bg-surface-50 border-b border-surface-200">
                        <td colSpan={6} className="px-8 py-6">
                          <div className="grid md:grid-cols-2 gap-8">
                            <div>
                              <h4 className="font-bold text-surface-900 mb-3 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-surface-500" /> Event Metadata
                              </h4>
                              <div className="space-y-2 text-sm text-surface-700">
                                <p><strong className="text-surface-500">Log ID:</strong> <span className="font-mono">{log._id}</span></p>
                                <p><strong className="text-surface-500">Request ID:</strong> <span className="font-mono">{log.requestId || '-'}</span></p>
                                <p><strong className="text-surface-500">Source:</strong> {log.source}</p>
                                <p><strong className="text-surface-500">Full Summary:</strong> {log.changeSummary || '-'}</p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-bold text-surface-900 mb-3 flex items-center gap-2">
                                <HardDrive className="w-4 h-4 text-surface-500" /> State Snapshots
                              </h4>
                              
                              {(!log.beforeSnapshot && !log.afterSnapshot) ? (
                                <p className="text-sm text-surface-500 italic">No state snapshots captured for this event.</p>
                              ) : (
                                <div className="space-y-4">
                                  {log.beforeSnapshot && (
                                    <div>
                                      <p className="text-xs font-bold text-red-600 mb-1">BEFORE</p>
                                      <div className="bg-white rounded border border-surface-200 p-3 overflow-x-auto">
                                        <pre className="text-xs font-mono text-surface-600">{JSON.stringify(JSON.parse(log.beforeSnapshot), null, 2)}</pre>
                                      </div>
                                    </div>
                                  )}
                                  {log.afterSnapshot && (
                                    <div>
                                      <p className="text-xs font-bold text-emerald-600 mb-1">AFTER</p>
                                      <div className="bg-white rounded border border-surface-200 p-3 overflow-x-auto">
                                        <pre className="text-xs font-mono text-surface-600">{JSON.stringify(JSON.parse(log.afterSnapshot), null, 2)}</pre>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={data.meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
