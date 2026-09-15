import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { donorApi } from '@/api/donorApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';
import { HeartPulse, CheckCircle2 } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['male', 'female', 'other', 'prefer_not_to_say'];

export default function BecomeDonorPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [bloodGroup, setBloodGroup] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  
  // Contact
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // Eligibility
  const [lastDonationDate, setLastDonationDate] = useState('');
  
  // Consent
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const mutation = useMutation({
    mutationFn: () => donorApi.registerDonor({
      bloodGroup,
      dateOfBirth,
      gender,
      contact: {
        address,
        city,
        state,
        pincode,
        emergencyContactName: emergencyName,
        emergencyContactPhone: emergencyPhone
      },
      eligibility: {
        isEligible: true,
        lastDonationDate: lastDonationDate ? new Date(lastDonationDate) : null,
        disqualifyingConditions: []
      },
      consent: {
        dataProcessingConsented: agreedToTerms,
        consentVersion: '1.0'
      }
    }),
    onSuccess: () => {
      setIsSuccess(true);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) return;
    mutation.mutate();
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-surface-50 pt-24 pb-16 px-4 flex items-center justify-center animate-fade-in">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-surface-200 text-center shadow-lg">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-surface-900 mb-2">Registration Complete!</h2>
          <p className="text-surface-600 mb-8">
            Thank you for registering as a voluntary blood donor. Your profile is now active in the directory.
          </p>
          <Button size="lg" className="w-full" onClick={() => navigate('/blood')}>
            Go to Blood Hub
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 pt-24 pb-16 px-4 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        
        <div className="text-center mb-10">
          <HeartPulse className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-surface-900">Become a Voluntary Donor</h1>
          <p className="text-surface-600 mt-2">Join our network to save lives. It only takes a few minutes.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-surface-200 shadow-sm">
          {mutation.isError && (
            <Alert variant="error" className="mb-6">
              {(mutation.error as any)?.response?.data?.message || 'Failed to register.'}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {step === 1 && (
              <div className="space-y-6 animate-fade-in-up">
                <h3 className="font-bold text-xl border-b border-surface-100 pb-2">Basic Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Select
                    label="Blood Group"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    options={[{ value: '', label: 'Select Group' }, ...BLOOD_GROUPS.map(g => ({ value: g, label: g }))]}
                    required
                  />
                  <Select
                    label="Gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    options={[
                      { value: '', label: 'Select Gender' },
                      ...GENDERS.map(g => ({ value: g, label: g.replace(/_/g, ' ') }))
                    ]}
                    required
                  />
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                  />
                  <Input
                    label="Last Donation Date (Optional)"
                    type="date"
                    value={lastDonationDate}
                    onChange={(e) => setLastDonationDate(e.target.value)}
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button type="button" onClick={() => setStep(2)} disabled={!bloodGroup || !gender || !dateOfBirth}>
                    Next Step
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade-in-up">
                <h3 className="font-bold text-xl border-b border-surface-100 pb-2">Location & Contact</h3>
                <div className="space-y-4">
                  <Input label="Address" value={address} onChange={e => setAddress(e.target.value)} required />
                  <div className="grid md:grid-cols-3 gap-4">
                    <Input label="City" value={city} onChange={e => setCity(e.target.value)} required />
                    <Input label="State" value={state} onChange={e => setState(e.target.value)} required />
                    <Input label="Pincode" value={pincode} onChange={e => setPincode(e.target.value)} required maxLength={6} />
                  </div>
                </div>

                <h3 className="font-bold text-xl border-b border-surface-100 pb-2 mt-8">Emergency Contact (Optional)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Contact Name" value={emergencyName} onChange={e => setEmergencyName(e.target.value)} />
                  <Input label="Contact Phone" type="tel" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} />
                </div>

                <div className="pt-4 flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button type="button" onClick={() => setStep(3)} disabled={!address || !city || !state || !pincode}>
                    Next Step
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fade-in-up">
                <h3 className="font-bold text-xl border-b border-surface-100 pb-2">Consent & Agreement</h3>
                
                <div className="bg-surface-50 p-4 rounded-xl text-sm text-surface-700 space-y-3">
                  <p><strong>Please read carefully:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>I confirm that I am between 18 and 65 years of age.</li>
                    <li>I understand that AIIENS Health is only a discovery platform and does not perform medical eligibility tests.</li>
                    <li>I agree to let patients and hospitals view my City, Pincode, and Phone Number when searching for donors.</li>
                    <li>I will truthfully answer any medical questionnaires provided by the hospital blood bank at the time of donation.</li>
                  </ul>
                </div>

                <label className="flex items-start gap-3 cursor-pointer p-4 border border-surface-200 rounded-xl hover:bg-surface-50">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm font-medium text-surface-900">
                    I agree to the terms above and consent to my data being processed to coordinate blood donations.
                  </span>
                </label>

                <div className="pt-4 flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button type="submit" disabled={!agreedToTerms || mutation.isPending}>
                    {mutation.isPending ? 'Registering...' : 'Register as Donor'}
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
