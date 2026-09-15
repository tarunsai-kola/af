import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { FileUpload } from '@/components/ui/FileUpload';
import { Alert } from '@/components/ui/Alert';
import { CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function CreateFundraiserPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center animate-fade-in">
        <Card className="max-w-md w-full text-center py-8">
          <CardContent>
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-surface-900 mb-2">Application Submitted</h2>
            <p className="text-surface-600 mb-8">
              Your fundraiser application has been submitted successfully. Our medical review team will verify the details with the hospital within 24-48 hours.
            </p>
            <Button onClick={() => setSubmitted(false)} variant="outline">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-surface-900 mb-3">Start a Medical Fundraiser</h1>
          <p className="text-surface-600">
            Create a campaign to raise funds for medical treatment. All campaigns undergo strict verification.
          </p>
        </div>

        <Alert variant="info" title="100% Transparency Guarantee" className="mb-8 max-w-3xl mx-auto">
          <ul className="list-disc pl-5 space-y-1 mt-2 text-sm text-brand-800">
            <li>Funds are settled directly to the hospital's bank account.</li>
            <li>We charge ZERO platform fees.</li>
            <li>You must provide verified hospital documents and contact details.</li>
          </ul>
        </Alert>

        <Card className="shadow-lg border-surface-200">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <section className="space-y-4">
                <h3 className="font-bold text-lg text-surface-900 border-b border-surface-100 pb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-brand-500" /> Patient & Hospital Details
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Patient Name" required placeholder="Full name of the patient" />
                  <Input label="Patient Age" type="number" required />
                </div>
                <Select 
                  label="Hospital"
                  required
                  options={[
                    { value: '', label: 'Select Verified Hospital' },
                    { value: 'h1', label: 'Apollo Multispeciality Hospital, Hyderabad' },
                    { value: 'h2', label: 'Government District Hospital, Nagpur' },
                    { value: 'h3', label: 'Care Hospitals, Pune' },
                    { value: 'other', label: 'Other (Requires Manual Verification)' },
                  ]}
                />
                <Input label="Hospital Patient ID / UHID" required />
                <Select 
                  label="Illness / Treatment Category"
                  required
                  options={[
                    { value: '', label: 'Select Category' },
                    { value: 'cardiac', label: 'Cardiac' },
                    { value: 'oncology', label: 'Oncology (Cancer)' },
                    { value: 'pediatrics', label: 'Pediatrics' },
                    { value: 'transplant', label: 'Organ Transplant' },
                    { value: 'other', label: 'Other' },
                  ]}
                />
              </section>

              <section className="space-y-4">
                <h3 className="font-bold text-lg text-surface-900 border-b border-surface-100 pb-2 flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-brand-500" /> Campaign Details
                </h3>
                <Input label="Campaign Title" required placeholder="e.g., Help Rajan Fight Heart Disease" />
                <Input label="Fundraising Goal (₹)" type="number" required placeholder="e.g., 500000" />
                <Textarea 
                  label="Patient's Story" 
                  required 
                  placeholder="Explain the medical situation, background, and why you need funds..."
                  rows={6}
                />
              </section>

              <section className="space-y-4">
                <h3 className="font-bold text-lg text-surface-900 border-b border-surface-100 pb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-brand-500" /> Document Verification
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <FileUpload 
                    label="Hospital Estimate Letter" 
                    helperText="PDF or Image (Max 5MB)"
                    required
                  />
                  <FileUpload 
                    label="Patient KYC / Aadhar" 
                    helperText="PDF or Image (Max 5MB)"
                    required
                  />
                </div>
              </section>

              <div className="pt-6">
                <Button type="submit" className="w-full size-lg py-6 text-lg" variant="primary">
                  Submit for Verification
                </Button>
                <p className="text-center text-xs text-surface-500 mt-4">
                  By submitting this form, you agree to our Terms of Service and Medical Fundraising Policy.
                </p>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
