import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { campApi } from '@/api/campApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';
import { Stethoscope, CheckCircle2 } from 'lucide-react';

const SERVICES = ['general_checkup', 'blood_test', 'eye_checkup', 'dental', 'vaccination', 'bp_sugar_screening', 'nutrition_counseling', 'mental_health_screening', 'gynecology', 'pediatric_checkup'];

export default function HostCampPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timings, setTimings] = useState('');
  const [capacity, setCapacity] = useState('');
  const [services, setServices] = useState<string[]>([]);

  // Location
  const [venue, setVenue] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Provider
  const [providerName, setProviderName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const toggleService = (svc: string) => {
    setServices(prev => prev.includes(svc) ? prev.filter(s => s !== svc) : [...prev, svc]);
  };

  const mutation = useMutation({
    mutationFn: () => campApi.createCamp({
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      timings,
      capacity: Number(capacity),
      services,
      location: { venue, address, city, state, pincode },
      provider: { name: providerName, registrationNumber: regNo, contactName, contactPhone }
    }),
    onSuccess: () => {
      setIsSuccess(true);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (services.length === 0) {
      alert('Please select at least one service.');
      return;
    }
    mutation.mutate();
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-surface-50 pt-24 pb-16 px-4 flex items-center justify-center animate-fade-in">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-surface-200 text-center shadow-lg">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-surface-900 mb-2">Camp Draft Submitted</h2>
          <p className="text-surface-600 mb-8">
            Thank you for hosting a medical camp! Your draft has been sent to our admins for verification. 
            Once approved, it will be published to the public.
          </p>
          <Button size="lg" className="w-full" onClick={() => navigate('/camps')}>
            Back to Camps
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 pt-24 pb-16 px-4 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <Stethoscope className="w-12 h-12 text-brand-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-surface-900">Host a Medical Camp</h1>
          <p className="text-surface-600 mt-2">Submit your camp details to begin the verification and publication process.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-surface-200 shadow-sm">
          {mutation.isError && (
            <Alert variant="error" className="mb-6">
              {(mutation.error as any)?.response?.data?.message || 'Failed to submit draft.'}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {step === 1 && (
              <div className="space-y-6 animate-fade-in-up">
                <h3 className="font-bold text-xl border-b border-surface-100 pb-2">Basic Details</h3>
                <Input label="Camp Title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Free Eye Checkup Camp" />
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Description</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[100px]"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                  <Input label="End Date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                  <Input label="Timings" value={timings} onChange={e => setTimings(e.target.value)} required placeholder="e.g. 09:00 AM - 05:00 PM" />
                  <Input label="Total Capacity" type="number" value={capacity} onChange={e => setCapacity(e.target.value)} required placeholder="e.g. 500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">Services Provided (Select at least one)</label>
                  <div className="flex flex-wrap gap-2">
                    {SERVICES.map(svc => (
                      <button
                        key={svc}
                        type="button"
                        onClick={() => toggleService(svc)}
                        className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                          services.includes(svc) ? 'bg-brand-600 text-white border-brand-600' : 'bg-surface-50 text-surface-600 border-surface-200 hover:bg-surface-100'
                        }`}
                      >
                        {svc.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="button" onClick={() => setStep(2)} disabled={!title || !description || !startDate || !endDate || !timings || !capacity || services.length === 0}>
                    Next: Location
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade-in-up">
                <h3 className="font-bold text-xl border-b border-surface-100 pb-2">Location</h3>
                <Input label="Venue Name" value={venue} onChange={e => setVenue(e.target.value)} required placeholder="e.g. Community Hall" />
                <Input label="Address" value={address} onChange={e => setAddress(e.target.value)} required />
                <div className="grid md:grid-cols-3 gap-4">
                  <Input label="City" value={city} onChange={e => setCity(e.target.value)} required />
                  <Input label="State" value={state} onChange={e => setState(e.target.value)} required />
                  <Input label="Pincode" value={pincode} onChange={e => setPincode(e.target.value)} required maxLength={6} />
                </div>

                <div className="pt-4 flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button type="button" onClick={() => setStep(3)} disabled={!venue || !address || !city || !state || !pincode}>
                    Next: Provider
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fade-in-up">
                <h3 className="font-bold text-xl border-b border-surface-100 pb-2">Medical Provider details</h3>
                <div className="bg-brand-50 p-4 rounded-xl text-sm text-brand-800 mb-4">
                  Every camp must be verified against a licensed medical provider or hospital.
                </div>
                
                <Input label="Hospital / Provider Name" value={providerName} onChange={e => setProviderName(e.target.value)} required />
                <Input label="Registration/License Number" value={regNo} onChange={e => setRegNo(e.target.value)} required />
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Coordinator Name" value={contactName} onChange={e => setContactName(e.target.value)} required />
                  <Input label="Coordinator Phone" value={contactPhone} onChange={e => setContactPhone(e.target.value)} required />
                </div>

                <div className="pt-4 flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button type="submit" disabled={!providerName || !regNo || !contactName || !contactPhone || mutation.isPending}>
                    {mutation.isPending ? 'Submitting...' : 'Submit Draft for Verification'}
                  </Button>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}
