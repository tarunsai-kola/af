import { useOutletContext, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Plus, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { caseApi, PatientCase } from '@/api/caseApi';
import { Alert } from '@/components/ui/Alert';

const URGENCY_LEVELS = ['low', 'medium', 'high', 'critical'];

const financialSchema = z.object({
  estimatedCost: z.coerce.number().min(1000, 'Minimum estimated cost is ₹1,000'),
  fundraisingTarget: z.coerce.number().min(1000, 'Minimum target is ₹1,000'),
  urgency: z.enum(['low', 'medium', 'high', 'critical']),
  costBreakdown: z.array(
    z.object({
      category: z.string().min(2, 'Category required'),
      amount: z.coerce.number().min(1, 'Amount required'),
      currency: z.string().default('INR'),
    })
  ).min(1, 'At least one cost breakdown item is required'),
});

type FinancialFormData = z.infer<typeof financialSchema>;

export default function FinancialStep() {
  const { draftCase, id } = useOutletContext<{ draftCase: PatientCase; id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, control, formState: { errors } } = useForm<any>({
    resolver: zodResolver(financialSchema),
    defaultValues: {
      estimatedCost: draftCase.estimatedCost || undefined,
      fundraisingTarget: draftCase.fundraisingTarget || undefined,
      urgency: (draftCase.urgency as any) || 'medium',
      costBreakdown: draftCase.costBreakdown?.length ? draftCase.costBreakdown : [{ category: 'Surgery', amount: 0, currency: 'INR' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'costBreakdown',
  });

  const mutation = useMutation({
    mutationFn: (data: FinancialFormData) => caseApi.updateCase(id, data),
    onSuccess: (updatedCase) => {
      queryClient.setQueryData(['draftCase', id], updatedCase);
      navigate(`/fundraisers/create/${id}/documents`);
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-surface-900 border-b border-surface-100 pb-3 mb-6">
        Financial Need & Breakdown
      </h2>

      {mutation.isError && (
        <Alert variant="error" title="Failed to save">
          {(mutation.error as any)?.response?.data?.message || 'An error occurred'}
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
        <Input 
          label="Total Estimated Cost (₹)" 
          type="number" 
          placeholder="e.g. 500000" 
          {...register('estimatedCost')}
          error={errors.estimatedCost?.message as string}
        />
        <Input 
          label="Fundraising Target (₹)" 
          type="number" 
          placeholder="e.g. 500000" 
          {...register('fundraisingTarget')}
          error={errors.fundraisingTarget?.message as string}
        />
      </div>

      <div className="max-w-md">
        <Select 
          label="Urgency Level" 
          options={[
            { value: 'low', label: 'Low (Within 6 months)' },
            { value: 'medium', label: 'Medium (Within 2 months)' },
            { value: 'high', label: 'High (Within weeks)' },
            { value: 'critical', label: 'Critical (Immediate)' },
          ]}
          {...register('urgency')}
          error={errors.urgency?.message as string}
        />
      </div>

      <div className="pt-4 border-t border-surface-100 max-w-2xl">
        <h3 className="text-sm font-semibold text-surface-700 mb-2">Cost Breakdown</h3>
        <p className="text-xs text-surface-500 mb-4">
          Provide an itemized breakdown of the estimated costs (e.g. Surgery, ICU charges, Medicines).
        </p>

        {errors.costBreakdown?.root?.message && (
          <p className="text-sm text-red-500 mb-4">{errors.costBreakdown.root.message as string}</p>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-start">
              <div className="flex-1">
                <Input 
                  placeholder="Category (e.g. Medicines)" 
                  {...register(`costBreakdown.${index}.category`)}
                  error={(errors.costBreakdown as any)?.[index]?.category?.message as string}
                />
              </div>
              <div className="w-1/3">
                <Input 
                  type="number" 
                  placeholder="Amount (₹)" 
                  {...register(`costBreakdown.${index}.amount`)}
                  error={(errors.costBreakdown as any)?.[index]?.amount?.message as string}
                />
              </div>
              <Button 
                type="button" 
                variant="outline" 
                className="mt-1 shrink-0 p-2 text-red-500 border-red-200 hover:bg-red-50"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="mt-4"
          onClick={() => append({ category: '', amount: 0, currency: 'INR' })}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </Button>
      </div>

      <div className="pt-6 flex justify-between">
        <Button type="button" variant="outline" onClick={() => navigate(`/fundraisers/create/${id}/treatment`)}>
          Back
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>
    </form>
  );
}
