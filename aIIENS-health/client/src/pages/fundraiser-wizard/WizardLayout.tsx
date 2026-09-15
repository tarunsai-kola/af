import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { caseApi } from '@/api/caseApi';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';

const STEPS = [
  { path: 'patient', label: 'Patient Info' },
  { path: 'hospital', label: 'Hospital Info' },
  { path: 'treatment', label: 'Treatment' },
  { path: 'financial', label: 'Financial Need' },
  { path: 'documents', label: 'Documents' },
  { path: 'consent', label: 'Consent' },
  { path: 'review', label: 'Review' },
];

export default function WizardLayout() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine current step index
  const currentStepIndex = STEPS.findIndex(s => location.pathname.includes(s.path));
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  // Create Draft Mutation
  const createDraftMutation = useMutation({
    mutationFn: caseApi.createDraft,
    onSuccess: (data) => {
      navigate(`/fundraisers/create/${data.id}/patient`, { replace: true });
    }
  });

  // If no ID is provided, create a new draft
  useEffect(() => {
    if (!id && !createDraftMutation.isPending && !createDraftMutation.isSuccess) {
      createDraftMutation.mutate();
    }
  }, [id, createDraftMutation]);

  // Fetch Draft Data
  const { data: draftCase, isLoading, isError, error } = useQuery({
    queryKey: ['draftCase', id],
    queryFn: () => caseApi.getCase(id!),
    enabled: !!id,
  });

  if (!id || createDraftMutation.isPending) {
    return (
      <div className="min-h-[60dvh] flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-surface-500">Initializing your application...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[60dvh] flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-surface-500">Loading draft...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="error" title="Failed to load draft">
          {(error as any)?.response?.data?.message || 'Please try again later.'}
        </Alert>
      </div>
    );
  }

  // If status is not DRAFT, redirect away
  if (draftCase?.status !== 'DRAFT') {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="warning" title="Application Already Submitted">
          This fundraiser application is currently in {draftCase?.status} status and cannot be edited here.
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-surface-900 mb-2">
          Create Medical Fundraiser
        </h1>
        <p className="text-surface-600 mb-6">
          Step {currentStepIndex + 1} of {STEPS.length}: {STEPS[currentStepIndex]?.label}
        </p>
        <ProgressBar progress={progress} max={100} className="h-2" />
        <div className="flex justify-between text-xs text-surface-500 mt-2 font-medium hidden sm:flex">
          {STEPS.map((step, idx) => (
            <span key={step.path} className={idx <= currentStepIndex ? 'text-brand-600' : ''}>
              {step.label}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 md:p-8">
        {/* Pass draft data down to outlet */}
        <Outlet context={{ draftCase, id }} />
      </div>
    </div>
  );
}
