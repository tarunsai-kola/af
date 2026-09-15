import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';
import { Heart, CheckCircle2 } from 'lucide-react';

export default function BecomeDonorPage() {
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
            <h2 className="text-2xl font-bold text-surface-900 mb-2">Thank You!</h2>
            <p className="text-surface-600 mb-8">
              You are now registered as a blood donor. You will receive notifications when verified hospitals in your area need emergency blood.
            </p>
            <Button onClick={() => setSubmitted(false)} variant="outline">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <h1 className="text-3xl font-bold text-surface-900 mb-3">Register as a Blood Donor</h1>
          <p className="text-surface-600">
            Join our community of lifesavers. Your information is kept strictly confidential and only used for emergency blood requests.
          </p>
        </div>

        <Card className="shadow-lg border-surface-200">
          <CardContent className="p-8">
            <Alert variant="info" title="Privacy First" className="mb-8">
              Your contact details are never shared publicly. You will only be contacted through our secure system.
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Select 
                  label="Blood Group"
                  required
                  options={[
                    { value: '', label: 'Select Blood Group' },
                    { value: 'A+', label: 'A+' },
                    { value: 'A-', label: 'A-' },
                    { value: 'B+', label: 'B+' },
                    { value: 'B-', label: 'B-' },
                    { value: 'O+', label: 'O+' },
                    { value: 'O-', label: 'O-' },
                    { value: 'AB+', label: 'AB+' },
                    { value: 'AB-', label: 'AB-' },
                  ]}
                />
                
                <Input 
                  label="Date of Birth"
                  type="date"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Select 
                  label="Gender"
                  required
                  options={[
                    { value: '', label: 'Select Gender' },
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                  ]}
                />
                <Input 
                  label="Phone Number"
                  type="tel"
                  placeholder="+91"
                  required
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-surface-100">
                <h3 className="font-medium text-surface-900">Location</h3>
                <Input 
                  label="Address Line 1"
                  placeholder="Street address, neighborhood"
                  required
                />
                <div className="grid md:grid-cols-2 gap-6">
                  <Input 
                    label="City"
                    placeholder="e.g. Hyderabad"
                    required
                  />
                  <Input 
                    label="Pincode"
                    placeholder="e.g. 500034"
                    required
                  />
                </div>
              </div>

              <div className="pt-6">
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white border-none size-lg py-6 text-lg">
                  Register as Donor
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
