import { useOutletContext, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { PatientCase, caseApi } from '@/api/caseApi';
import { Alert } from '@/components/ui/Alert';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Hospital, Stethoscope, IndianRupee } from 'lucide-react';

export default function ReviewStep() {
  const { draftCase, id } = useOutletContext<{ draftCase: PatientCase; id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: () => caseApi.submitCase(id),
    onSuccess: () => {
      // Invalidate queries so lists update
      queryClient.invalidateQueries({ queryKey: ['draftCase'] });
    }
  });

  if (submitMutation.isSuccess) {
    return (
      <div className="text-center py-12 animate-fade-in-up">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-surface-900 mb-4">Application Submitted!</h2>
        <p className="text-lg text-surface-600 max-w-lg mx-auto mb-8">
          Your fundraiser has been successfully submitted for verification. Our medical review team will contact the hospital within 24-48 hours.
        </p>
        <Button onClick={() => navigate('/fundraisers')} size="lg">
          Return to Fundraisers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold text-surface-900 mb-2">
          Final Review
        </h2>
        <p className="text-surface-600">
          Please review the details of your fundraiser before submitting.
        </p>
      </div>

      {submitMutation.isError && (
        <Alert variant="error" title="Submission Failed">
          {(submitMutation.error as any)?.response?.data?.message || 'An error occurred. Please check that all steps are complete.'}
        </Alert>
      )}

      <div className="space-y-6">
        
        {/* Patient Block */}
        <div className="bg-surface-50 p-5 rounded-xl border border-surface-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-surface-900">Patient Details</h3>
            <Button variant="outline" size="sm" onClick={() => navigate(`/fundraisers/create/${id}/patient`)}>Edit</Button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-surface-500">Name</p>
              <p className="font-medium text-surface-900">{draftCase.patientName || 'Missing'}</p>
            </div>
            <div>
              <p className="text-surface-500">Age / Gender</p>
              <p className="font-medium text-surface-900">{draftCase.patientAge} / {draftCase.patientGender}</p>
            </div>
          </div>
        </div>

        {/* Medical Block */}
        <div className="bg-surface-50 p-5 rounded-xl border border-surface-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-surface-900 flex items-center gap-2"><Stethoscope className="w-4 h-4"/> Medical & Hospital</h3>
            <Button variant="outline" size="sm" onClick={() => navigate(`/fundraisers/create/${id}/treatment`)}>Edit</Button>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-surface-500">Hospital</p>
              <p className="font-medium text-surface-900">{draftCase.hospitalId ? 'Selected (ID shown in DB)' : 'Missing'}</p>
            </div>
            <div>
              <p className="text-surface-500">Diagnosis</p>
              <p className="font-medium text-surface-900">{draftCase.diagnosisCategory} - {draftCase.treatmentPlan?.procedureName}</p>
            </div>
          </div>
        </div>

        {/* Financial Block */}
        <div className="bg-surface-50 p-5 rounded-xl border border-surface-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-surface-900 flex items-center gap-2"><IndianRupee className="w-4 h-4"/> Financial Need</h3>
            <Button variant="outline" size="sm" onClick={() => navigate(`/fundraisers/create/${id}/financial`)}>Edit</Button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-surface-500">Total Estimate</p>
              <p className="font-bold text-surface-900 text-lg">₹{(draftCase.estimatedCost || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-surface-500">Fundraising Target</p>
              <p className="font-bold text-brand-700 text-lg">₹{(draftCase.fundraisingTarget || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

      </div>

      <div className="pt-6 flex justify-between border-t border-surface-100">
        <Button type="button" variant="outline" onClick={() => navigate(`/fundraisers/create/${id}/consent`)} disabled={submitMutation.isPending}>
          Back
        </Button>
        <Button 
          type="button" 
          onClick={() => submitMutation.mutate()}
          disabled={submitMutation.isPending}
          className="min-w-[200px]"
        >
          {submitMutation.isPending ? 'Submitting...' : 'Submit for Verification'}
        </Button>
      </div>
    </div>
  );
}
