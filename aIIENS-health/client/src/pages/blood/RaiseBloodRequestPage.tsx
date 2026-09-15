import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bloodApi } from '@/api/bloodApi';
import { useAuth } from '@/context/AuthContext';
import {
  Droplet, MapPin, AlertTriangle, Phone, User, FileText,
  Clock, CheckCircle2, ChevronRight, ChevronLeft, Loader2
} from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const URGENCY_OPTIONS = [
  { value: 'critical', label: '🔴 Critical', desc: 'Life-threatening — needed within hours', color: 'border-red-500 bg-red-500/10 text-red-600' },
  { value: 'high', label: '🟠 High', desc: 'Urgent — needed within 24 hours', color: 'border-orange-500 bg-orange-500/10 text-orange-600' },
  { value: 'medium', label: '🟡 Medium', desc: 'Needed within 2–3 days', color: 'border-yellow-500 bg-yellow-500/10 text-yellow-600' },
  { value: 'low', label: '🟢 Low', desc: 'Needed within a week', color: 'border-green-500 bg-green-500/10 text-green-600' },
];

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-semibold text-slate-700 mb-1.5">{children}</label>;
}
function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-red-500 mt-1">{msg}</p> : null;
}
function Field({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`space-y-0 ${className}`}>{children}</div>;
}

export default function RaiseBloodRequestPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || '');
  const [units, setUnits] = useState('1');
  const [urgency, setUrgency] = useState('high');
  const [requiredBy, setRequiredBy] = useState('');

  // Location
  const [hospitalName, setHospitalName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Contact
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');

  const mutation = useMutation({
    mutationFn: () => bloodApi.createBloodRequest({
      bloodGroup,
      units: Number(units),
      urgency,
      requiredBy: requiredBy || undefined,
      location: {
        hospitalName: hospitalName || undefined,
        city,
        state,
        pincode,
      },
      contactName,
      contactPhone,
      notes: notes || undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bloodRequests-hub'] });
      queryClient.invalidateQueries({ queryKey: ['myBloodRequests'] });
      setIsSuccess(true);
    },
  });

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!bloodGroup) e.bloodGroup = 'Select a blood group';
    if (!units || Number(units) < 1) e.units = 'At least 1 unit required';
    if (Number(units) > 20) e.units = 'Max 20 units at once';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!city.trim()) e.city = 'City is required';
    if (!state.trim()) e.state = 'State is required';
    if (!/^\d{6}$/.test(pincode)) e.pincode = 'Enter a valid 6-digit pincode';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e: Record<string, string> = {};
    if (!contactName.trim()) e.contactName = 'Contact name is required';
    if (!contactPhone.trim()) e.contactPhone = 'Contact phone is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
    if (step === 3 && validateStep3()) mutation.mutate();
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 flex items-center justify-center animate-fade-in">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 border border-slate-200 text-center shadow-xl">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3">Emergency Raised!</h2>
          <p className="text-slate-600 mb-3">
            Your blood emergency has been posted. Nearby donors in <strong>{city}</strong> will be notified.
          </p>
          <p className="text-xs text-slate-400 mb-8">
            An admin will verify and may call you to confirm details. Keep your phone reachable.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              View in Dashboard
            </button>
            <button
              onClick={() => navigate('/blood')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors"
            >
              Back to Blood Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { n: 1, label: 'Blood Info' },
    { n: 2, label: 'Location' },
    { n: 3, label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-9 h-9 text-rose-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Raise Blood Emergency</h1>
          <p className="text-slate-500 mt-2 text-sm">Fill in details and nearby donors will be notified instantly.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                step === s.n ? 'bg-rose-600 text-white' :
                step > s.n ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
              }`}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center bg-white/20 text-xs">
                  {step > s.n ? '✓' : s.n}
                </span>
                {s.label}
              </div>
              {i < steps.length - 1 && <div className="w-6 h-0.5 bg-slate-200" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          {mutation.isError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              {(mutation.error as any)?.response?.data?.message || 'Failed to submit. Please try again.'}
            </div>
          )}

          {/* ── Step 1: Blood Details ── */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="font-black text-slate-900 text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
                <Droplet className="w-5 h-5 text-rose-500" /> Blood Requirements
              </h3>

              {/* Urgency picker */}
              <Field>
                <Label>Urgency Level</Label>
                <div className="grid grid-cols-2 gap-3">
                  {URGENCY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setUrgency(opt.value)}
                      className={`border-2 rounded-xl p-3 text-left transition-all ${urgency === opt.value ? opt.color + ' border-current' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                    >
                      <p className="font-bold text-sm">{opt.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label>Blood Group Needed</Label>
                  <select
                    id="bloodGroup"
                    value={bloodGroup}
                    onChange={e => setBloodGroup(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/40 bg-white"
                  >
                    <option value="">Select group</option>
                    {BLOOD_GROUPS.map(g => <option key={g}>{g}</option>)}
                  </select>
                  <FieldError msg={errors.bloodGroup} />
                </Field>

                <Field>
                  <Label>Units Required</Label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={units}
                    onChange={e => setUnits(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                  />
                  <FieldError msg={errors.units} />
                </Field>
              </div>

              <Field>
                <Label>Required By (Date & Time — optional)</Label>
                <input
                  type="datetime-local"
                  value={requiredBy}
                  onChange={e => setRequiredBy(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                />
              </Field>
            </div>
          )}

          {/* ── Step 2: Location ── */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="font-black text-slate-900 text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-500" /> Location Details
              </h3>

              <Field>
                <Label>Hospital / Facility Name (optional)</Label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={e => setHospitalName(e.target.value)}
                  placeholder="e.g. Apollo Hospital"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label>City *</Label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Hyderabad"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                  />
                  <FieldError msg={errors.city} />
                </Field>
                <Field>
                  <Label>State *</Label>
                  <input
                    type="text"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    placeholder="e.g. Telangana"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                  />
                  <FieldError msg={errors.state} />
                </Field>
              </div>

              <Field>
                <Label>Pincode *</Label>
                <input
                  type="text"
                  value={pincode}
                  onChange={e => setPincode(e.target.value)}
                  placeholder="500001"
                  maxLength={6}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                />
                <FieldError msg={errors.pincode} />
              </Field>
            </div>
          )}

          {/* ── Step 3: Contact ── */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="font-black text-slate-900 text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
                <Phone className="w-5 h-5 text-rose-500" /> Contact Information
              </h3>

              <Field>
                <Label>Contact Name *</Label>
                <input
                  type="text"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  placeholder="Who donors should call"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                />
                <FieldError msg={errors.contactName} />
              </Field>

              <Field>
                <Label>Contact Phone *</Label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  placeholder="Active mobile number"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                />
                <FieldError msg={errors.contactPhone} />
              </Field>

              <Field>
                <Label>Additional Notes (optional)</Label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Any extra information donors should know…"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/40 resize-none"
                />
              </Field>

              {/* Summary */}
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm space-y-1.5">
                <p className="font-bold text-rose-800 mb-2">Request Summary</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-rose-700">
                  <span className="text-rose-500">Blood Group:</span> <span className="font-semibold">{bloodGroup}</span>
                  <span className="text-rose-500">Units:</span> <span className="font-semibold">{units}</span>
                  <span className="text-rose-500">Urgency:</span> <span className="font-semibold capitalize">{urgency}</span>
                  <span className="text-rose-500">Location:</span> <span className="font-semibold">{city}, {state}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(s => (s - 1) as 1 | 2)}
                className="flex-1 flex items-center gap-1 justify-center px-6 py-3 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button
              type="button"
              onClick={next}
              disabled={mutation.isPending}
              id={`btn-step-${step}`}
              className="flex-1 flex items-center gap-2 justify-center px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors disabled:opacity-60"
            >
              {mutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
              ) : step === 3 ? (
                <><AlertTriangle className="w-4 h-4" /> Raise Emergency</>
              ) : (
                <>Next <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
