import { useOutletContext, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { caseApi, PatientCase } from '@/api/caseApi';
import { Alert } from '@/components/ui/Alert';

const DIAGNOSIS_CATEGORIES = [
  'cardiac', 'oncology', 'orthopedic', 'neurology', 'pediatrics',
  'ophthalmology', 'nephrology', 'general_surgery', 'maternity',
  'mental_health', 'other'
];

const treatmentSchema = z.object({
  diagnosisCategory: z.enum(DIAGNOSIS_CATEGORIES as [string, ...string[]]),
  diagnosisDescription: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Too long'),
  treatmentPlan: z.object({
    procedureName: z.string().min(2, 'Procedure name is required'),
    description: z.string().min(10, 'Treatment description is required'),
    treatingDoctorName: z.string().optional(),
  })
});

type TreatmentFormData = z.infer<typeof treatmentSchema>;

export default function TreatmentStep() {
  const { draftCase, id } = useOutletContext<{ draftCase: PatientCase; id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<TreatmentFormData>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      diagnosisCategory: (draftCase.diagnosisCategory as any) || '',
      diagnosisDescription: draftCase.diagnosisDescription || '',
      treatmentPlan: {
        procedureName: draftCase.treatmentPlan?.procedureName || '',
        description: draftCase.treatmentPlan?.description || '',
        treatingDoctorName: draftCase.treatmentPlan?.treatingDoctorName || '',
      }
    },
  });

  const mutation = useMutation({
    mutationFn: (data: TreatmentFormData) => caseApi.updateCase(id, data),
    onSuccess: (updatedCase) => {
      queryClient.setQueryData(['draftCase', id], updatedCase);
      navigate(`/fundraisers/create/${id}/financial`);
    },
  });

  const onSubmit = (data: TreatmentFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-surface-900 border-b border-surface-100 pb-3 mb-6">
        Medical Diagnosis & Treatment
      </h2>

      {mutation.isError && (
        <Alert variant="error" title="Failed to save">
          {(mutation.error as any)?.response?.data?.message || 'An error occurred'}
        </Alert>
      )}

      <div className="space-y-4 max-w-2xl">
        <Select 
          label="Diagnosis Category" 
          options={[
            { value: '', label: 'Select Category' },
            ...DIAGNOSIS_CATEGORIES.map(cat => ({ 
              value: cat, 
              label: cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ') 
            }))
          ]}
          {...register('diagnosisCategory')}
          error={errors.diagnosisCategory?.message as string}
        />
        
        <Textarea
          label="Detailed Diagnosis & Story"
          placeholder="Explain the patient's condition, how it was diagnosed, and the emotional/financial impact on the family..."
          rows={5}
          {...register('diagnosisDescription')}
          error={errors.diagnosisDescription?.message}
        />
        
        <div className="pt-4 border-t border-surface-100">
          <h3 className="text-sm font-semibold text-surface-700 mb-4">Proposed Treatment</h3>
          
          <div className="space-y-4">
            <Input
              label="Procedure / Treatment Name"
              placeholder="e.g. Open Heart Bypass Surgery"
              {...register('treatmentPlan.procedureName')}
              error={errors.treatmentPlan?.procedureName?.message}
            />
            
            <Textarea
              label="Treatment Description"
              placeholder="Describe what the treatment involves..."
              rows={3}
              {...register('treatmentPlan.description')}
              error={errors.treatmentPlan?.description?.message}
            />

            <Input
              label="Treating Doctor's Name (Optional)"
              placeholder="e.g. Dr. Ramesh Sharma"
              {...register('treatmentPlan.treatingDoctorName')}
            />
          </div>
        </div>
      </div>

      <div className="pt-6 flex justify-between">
        <Button type="button" variant="outline" onClick={() => navigate(`/fundraisers/create/${id}/hospital`)}>
          Back
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>
    </form>
  );
}
