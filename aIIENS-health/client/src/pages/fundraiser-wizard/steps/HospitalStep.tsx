import { useOutletContext, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { caseApi, PatientCase } from '@/api/caseApi';
import { Alert } from '@/components/ui/Alert';

const hospitalSchema = z.object({
  hospitalId: z.string().min(1, 'Please select a hospital'),
});

type HospitalFormData = z.infer<typeof hospitalSchema>;

// Hardcoded for now per the plan
const MOCK_HOSPITALS = [
  { value: '64a9c8b7f8e3a2c5b9e0f1a1', label: 'Apollo Multispeciality Hospital, Hyderabad' },
  { value: '64a9c8b7f8e3a2c5b9e0f1a2', label: 'Government District Hospital, Nagpur' },
  { value: '64a9c8b7f8e3a2c5b9e0f1a3', label: 'Care Hospitals, Pune' },
];

export default function HospitalStep() {
  const { draftCase, id } = useOutletContext<{ draftCase: PatientCase; id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<HospitalFormData>({
    resolver: zodResolver(hospitalSchema),
    defaultValues: {
      hospitalId: draftCase.hospitalId || '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: HospitalFormData) => caseApi.updateCase(id, data),
    onSuccess: (updatedCase) => {
      queryClient.setQueryData(['draftCase', id], updatedCase);
      navigate(`/fundraisers/create/${id}/treatment`);
    },
  });

  const onSubmit = (data: HospitalFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-surface-900 border-b border-surface-100 pb-3 mb-6">
        Hospital Information
      </h2>
      
      <p className="text-surface-600 text-sm mb-6">
        AIIENS Health partners with verified hospitals. Funds raised will be settled directly to the chosen hospital's bank account to ensure total transparency and prevent fraud.
      </p>

      {mutation.isError && (
        <Alert variant="error" title="Failed to save">
          {(mutation.error as any)?.response?.data?.message || 'An error occurred'}
        </Alert>
      )}

      <div className="max-w-xl">
        <Select 
          label="Treating Hospital" 
          options={[
            { value: '', label: 'Select Verified Hospital' },
            ...MOCK_HOSPITALS
          ]}
          {...register('hospitalId')}
          error={errors.hospitalId?.message}
        />
      </div>

      <Alert variant="info" title="Don't see your hospital?" className="mt-4 max-w-xl">
        If the hospital is not listed, they may not be a verified partner yet. You can still create a draft, but the hospital will need to undergo verification before funds can be disbursed.
      </Alert>

      <div className="pt-6 flex justify-between">
        <Button type="button" variant="outline" onClick={() => navigate(`/fundraisers/create/${id}/patient`)}>
          Back
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>
    </form>
  );
}
