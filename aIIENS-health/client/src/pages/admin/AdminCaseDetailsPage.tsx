import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/adminApi';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { ArrowLeft, CheckCircle2, XCircle, Clock, ShieldAlert } from 'lucide-react';

const GATES = [
  { id: 'G1_IDENTITY', label: 'Identity Verification', roles: ['CASE_OFFICER', 'SUPER_ADMIN'] },
  { id: 'G2_HOSPITAL', label: 'Hospital Verification', roles: ['HOSPITAL_VERIFIER', 'SUPER_ADMIN'] },
  { id: 'G3_CLINICAL', label: 'Clinical Review', roles: ['MEDICAL_REVIEWER', 'SUPER_ADMIN'] },
  { id: 'G4_FINANCIAL_NEED', label: 'Financial Need Assessment', roles: ['FINANCE_OFFICER', 'SUPER_ADMIN'] },
  { id: 'G5_CONSENT', label: 'Legal & Consent', roles: ['CASE_OFFICER', 'SUPER_ADMIN'] },
  { id: 'G6_INTEGRITY', label: 'Fraud & Integrity', roles: ['FRAUD_REVIEWER', 'SUPER_ADMIN'] },
  { id: 'G7_FINANCE', label: 'Final Financial Approval', roles: ['FINANCE_OFFICER', 'SUPER_ADMIN'] },
  { id: 'G8_PUBLICATION', label: 'Campaign Publication', roles: ['CAMPAIGN_APPROVER', 'SUPER_ADMIN'] },
];

export default function AdminCaseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [activeGate, setActiveGate] = useState<string | null>(null);
  const [gateStatus, setGateStatus] = useState('');
  const [gateNotes, setGateNotes] = useState('');

  const { data: c, isLoading, isError } = useQuery({
    queryKey: ['adminCase', id],
    queryFn: () => adminApi.getCaseDetails(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { gateId: string, status: string, notes: string }) => 
      adminApi.updateVerificationGate(id!, payload.gateId, { status: payload.status, notes: payload.notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCase', id] });
      setActiveGate(null);
      setGateStatus('');
      setGateNotes('');
    }
  });

  if (isLoading) return <div className="flex justify-center p-12"><Spinner size="lg" /></div>;
  if (isError || !c) return <Alert variant="error" title="Failed to load case">Could not load case details.</Alert>;

  const hasRoleForGate = (gateRoles: string[]) => {
    return user?.roles.some(role => gateRoles.includes(role));
  };

  const allPreviousPassed = (gateIndex: number) => {
    if (!c.verificationGates) return false;
    for (let i = 0; i < gateIndex; i++) {
      const gId = GATES[i].id;
      const gateData = c.verificationGates.find((g: any) => g.gate === gId);
      if (!gateData || gateData.status !== 'PASSED') return false;
    }
    return true;
  };

  return (
    <div className="animate-fade-in-up max-w-5xl mx-auto">
      <button 
        onClick={() => navigate('/admin/cases')}
        className="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-900 mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Cases
      </button>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-surface-200 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-surface-900">{c.patientName || 'Unknown Patient'}</h1>
            <Badge variant={
              c.status === 'UNDER_VERIFICATION' ? 'warning' :
              c.status === 'APPROVED' ? 'success' :
              c.status === 'LIVE' ? 'brand' :
              c.status === 'CANCELLED' ? 'error' : 'default'
            }>{c.status.replace(/_/g, ' ')}</Badge>
          </div>
          <p className="text-surface-600 font-mono text-sm">Case ID: {c._id}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-surface-500">Fundraising Target</p>
          <p className="text-2xl font-bold text-brand-700">₹{(c.fundraisingTarget || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Verification Gates Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-surface-900 mb-4">Verification Workflow</h2>
          
          <div className="space-y-4">
            {GATES.map((gateDef, idx) => {
              const gateData = c.verificationGates?.find((g: any) => g.gate === gateDef.id);
              const status = gateData?.status || 'PENDING';
              const canEdit = hasRoleForGate(gateDef.roles);
              const isBlocked = gateDef.id === 'G8_PUBLICATION' && !allPreviousPassed(idx);

              return (
                <div key={gateDef.id} className={`p-5 rounded-xl border ${activeGate === gateDef.id ? 'border-brand-500 ring-1 ring-brand-500' : 'border-surface-200'} bg-white transition-all`}>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="mt-1">
                        {status === 'PASSED' ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> :
                         status === 'FAILED' ? <XCircle className="w-6 h-6 text-red-500" /> :
                         <Clock className="w-6 h-6 text-amber-500" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-surface-900">{gateDef.label}</h3>
                        <p className="text-xs text-surface-500 font-mono mb-2">{gateDef.id}</p>
                        
                        {gateData?.notes && (
                          <div className="bg-surface-50 p-3 rounded-lg border border-surface-100 text-sm text-surface-700 mt-2 mb-2">
                            <span className="font-semibold block mb-1">Reviewer Notes:</span>
                            {gateData.notes}
                          </div>
                        )}
                        
                        {gateData?.reviewerId && (
                          <p className="text-xs text-surface-400">
                            Reviewed by: {(gateData.reviewerId as any)?.name || 'Admin'} on {gateData.completedAt ? new Date(gateData.completedAt).toLocaleString() : 'N/A'}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      {activeGate !== gateDef.id && canEdit && !isBlocked && status !== 'PASSED' && status !== 'FAILED' && (
                        <Button variant="outline" size="sm" onClick={() => {
                          setActiveGate(gateDef.id);
                          setGateStatus(status);
                          setGateNotes(gateData?.notes || '');
                        }}>Review</Button>
                      )}
                      {isBlocked && (
                        <Badge variant="default" className="text-xs flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Blocked by prev gates</Badge>
                      )}
                    </div>
                  </div>

                  {activeGate === gateDef.id && (
                    <div className="mt-6 pt-6 border-t border-surface-100 animate-fade-in-up">
                      <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <Select
                          label="Verification Status"
                          value={gateStatus}
                          onChange={(e) => setGateStatus(e.target.value)}
                          options={[
                            { value: 'PENDING', label: 'Pending' },
                            { value: 'IN_REVIEW', label: 'In Review' },
                            { value: 'NEEDS_MORE_INFORMATION', label: 'Needs More Info' },
                            { value: 'PASSED', label: 'Pass Verification' },
                            { value: 'FAILED', label: 'Fail / Reject' },
                          ]}
                        />
                      </div>
                      <Textarea
                        label="Review Notes (Required for Fail/Needs Info)"
                        value={gateNotes}
                        onChange={(e) => setGateNotes(e.target.value)}
                        rows={3}
                        className="mb-4"
                      />
                      {updateMutation.isError && (
                        <Alert variant="error" className="mb-4">
                          {(updateMutation.error as any)?.response?.data?.message || 'Update failed'}
                        </Alert>
                      )}
                      <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={() => setActiveGate(null)}>Cancel</Button>
                        <Button 
                          onClick={() => updateMutation.mutate({ gateId: gateDef.id, status: gateStatus, notes: gateNotes })}
                          disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending ? 'Saving...' : 'Save Decision'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Case Details Sidebar */}
        <div className="space-y-6">
          <div className="bg-surface-900 text-surface-50 p-6 rounded-2xl">
            <h3 className="font-bold text-white mb-4">Case Snapshot</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-surface-400">Patient Details</p>
                <p className="font-medium text-white">{c.patientName || 'N/A'} ({c.patientAge || 'N/A'} yrs, {c.patientGender || 'N/A'})</p>
                <p className="text-xs text-surface-400">Relation to guardian: {c.patientRelation || 'Self'}</p>
              </div>
              <div>
                <p className="text-surface-400">Diagnosis & Treatment</p>
                <p className="font-medium text-white capitalize">{c.diagnosisCategory?.replace(/_/g, ' ') || 'N/A'}</p>
                <p className="text-xs text-surface-300 mt-1">{c.diagnosisDescription}</p>
                <p className="text-xs text-surface-300 mt-1">Procedure: {c.treatmentPlan?.procedureName || 'N/A'}</p>
                <p className="text-xs text-surface-300">Doctor: {c.treatmentPlan?.treatingDoctorName || 'N/A'} (Reg: {c.treatmentPlan?.treatingDoctorRegistrationNumber || 'N/A'})</p>
              </div>
              <div>
                <p className="text-surface-400">Financial Need</p>
                <p className="font-medium text-white">Target: {c.currency || 'INR'} {(c.fundraisingTarget || 0).toLocaleString()}</p>
                <p className="text-xs text-surface-300">Est Cost: {c.currency || 'INR'} {(c.estimatedCost || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-surface-400">Hospital</p>
                <p className="font-medium text-white">{(c.hospitalId as any)?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-surface-400">Guardian</p>
                <p className="font-medium text-white">{(c.guardianUserId as any)?.name}</p>
                <p className="text-xs text-surface-400">{(c.guardianUserId as any)?.phone || (c.guardianUserId as any)?.email}</p>
              </div>
              <div>
                <p className="text-surface-400">Urgency</p>
                <p className="font-medium text-white uppercase">{c.urgency}</p>
              </div>
            </div>
          </div>
          
          {/* Documents Section */}
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
            <h3 className="font-bold text-surface-900 mb-4">Attached Documents</h3>
            <div className="space-y-3">
              {c.documents && c.documents.length > 0 ? (
                c.documents.map((doc: any) => (
                  <Button 
                    key={doc._id}
                    variant="outline" 
                    className="w-full justify-start text-brand-600 bg-brand-50 border-brand-200 flex items-center justify-between"
                    onClick={() => window.open(`/api/cases/${c._id}/documents/${doc._id}`, '_blank')}
                  >
                    <span className="truncate">📄 {doc.originalFileName || doc.documentType}</span>
                    <span className="text-xs font-mono text-brand-500 uppercase px-2 py-1 bg-brand-100 rounded-md">
                      {doc.documentType}
                    </span>
                  </Button>
                ))
              ) : (
                <p className="text-sm text-surface-500 italic">No documents uploaded.</p>
              )}
            </div>
            <p className="text-xs text-surface-500 mt-4">
              Documents are fetched securely from the private storage vault. Clicking a document will attempt to open it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
