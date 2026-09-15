import { useOutletContext, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { caseApi, PatientCase } from '@/api/caseApi';
import { Alert } from '@/components/ui/Alert';

const patientSchema = z.object({
  patientName: z.string().min(2, 'Patient name must be at least 2 characters'),
  patientAge: z.coerce.number().min(0, 'Age cannot be negative').max(120, 'Invalid age'),
  patientGender: z.enum(['male', 'female', 'other']),
  patientRelation: z.string().min(2, 'Relationship is required'),
});

type PatientFormData = z.infer<typeof patientSchema>;

export default function PatientStep() {
  const { draftCase, id } = useOutletContext<{ draftCase: PatientCase; id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<any>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      patientName: draftCase.patientName || '',
      patientAge: draftCase.patientAge || undefined,
      patientGender: (draftCase.patientGender as any) || undefined,
      patientRelation: draftCase.patientRelation || '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: PatientFormData) => caseApi.updateCase(id, data),
    onSuccess: (updatedCase) => {
      queryClient.setQueryData(['draftCase', id], updatedCase);
      navigate(`/fundraisers/create/${id}/hospital`);
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-surface-900 border-b border-surface-100 pb-3 mb-6">
        Patient Information
      </h2>

      {mutation.isError && (
        <Alert variant="error" title="Failed to save">
          {(mutation.error as any)?.response?.data?.message || 'An error occurred'}
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Input 
          label="Patient's Full Name" 
          placeholder="Enter patient name" 
          {...register('patientName')}
          error={errors.patientName?.message as string}
        />
        <Input 
          label="Age" 
          type="number" 
          placeholder="e.g. 45" 
          {...register('patientAge')}
          error={errors.patientAge?.message as string}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Select 
          label="Gender" 
          options={[
            { value: '', label: 'Select gender' },
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
          ]}
          {...register('patientGender')}
          error={errors.patientGender?.message as string}
        />
        <Input 
          label="Your Relationship to Patient" 
          placeholder="e.g. Father, Self, Spouse" 
          {...register('patientRelation')}
          error={errors.patientRelation?.message as string}
        />
      </div>

      <div className="pt-6 flex justify-end">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>
    </form>
  );
}
