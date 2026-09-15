import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/api/authApi';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserPlus, AlertCircle, Droplet, ChevronRight, ChevronLeft } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Enter a valid phone number').max(15, 'Phone number too long'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

// Reusable dark-mode input
function DarkInput({ id, label, type = 'text', placeholder, error, ...rest }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-300" htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`w-full bg-slate-950/50 border rounded-lg px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all ${
          error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-slate-800'
        }`}
        {...rest}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const goToStep2 = async () => {
    const valid = await trigger(['name', 'email', 'phone', 'dateOfBirth', 'bloodGroup']);
    if (valid) setStep(2);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setErrorMsg(null);
    try {
      await authApi.register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        bloodGroup: data.bloodGroup,
        password: data.password,
      });
      const loginResponse = await authApi.login({ email: data.email, password: data.password });
      login(loginResponse.user, loginResponse.accessToken);
      navigate('/', { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
      setStep(1);
    }
  };

  return (
    <div className="min-h-[80dvh] flex items-center justify-center px-4 py-12" id="register-page">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center border border-brand-500/20 mb-4 shadow-lg shadow-brand-500/5">
            <UserPlus className="w-8 h-8 text-brand-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Create an Account</h1>
          <p className="text-slate-400 mt-2">Join AIIENS Health to make a difference</p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === 1 ? 'bg-brand-500 text-white' : 'bg-brand-500/20 text-brand-400'}`}>1</div>
            <div className="w-8 h-0.5 bg-slate-700" />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === 2 ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-500'}`}>2</div>
          </div>
        </div>

        <Card glass className="border-slate-800/60 bg-slate-900/60 shadow-2xl backdrop-blur-xl">
          <CardContent className="p-8">
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* ── Step 1: Personal Info ── */}
              {step === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">Personal Information</p>

                  <DarkInput id="name" label="Full Name" placeholder="John Doe" error={errors.name?.message} {...register('name')} />
                  <DarkInput id="email" label="Email Address" type="email" placeholder="name@example.com" error={errors.email?.message} {...register('email')} />
                  <DarkInput id="phone" label="Phone Number" type="tel" placeholder="9876543210" error={errors.phone?.message} {...register('phone')} />
                  <DarkInput id="dateOfBirth" label="Date of Birth" type="date" error={errors.dateOfBirth?.message} {...register('dateOfBirth')} />

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5" htmlFor="bloodGroup">
                      <Droplet className="w-4 h-4 text-rose-400" /> Blood Group
                    </label>
                    <select
                      id="bloodGroup"
                      className={`w-full bg-slate-950/50 border rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all ${errors.bloodGroup ? 'border-red-500/50' : 'border-slate-800'}`}
                      {...register('bloodGroup')}
                    >
                      <option value="" className="bg-slate-900">Select Blood Group</option>
                      {BLOOD_GROUPS.map(g => <option key={g} value={g} className="bg-slate-900">{g}</option>)}
                    </select>
                    {errors.bloodGroup && <p className="text-xs text-red-400">{errors.bloodGroup.message}</p>}
                    <p className="text-xs text-slate-500">You'll be registered as a voluntary donor and notified when your blood group is urgently needed nearby.</p>
                  </div>

                  <Button type="button" onClick={goToStep2} className="w-full mt-2 flex items-center gap-2 justify-center py-3">
                    Continue <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* ── Step 2: Password ── */}
              {step === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">Set Your Password</p>

                  <DarkInput id="password" label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
                  <DarkInput id="confirmPassword" label="Confirm Password" type="password" placeholder="••••••••" error={errors.confirmPassword?.message} {...register('confirmPassword')} />

                  <div className="flex gap-3 mt-2">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 flex items-center gap-1 justify-center">
                      <ChevronLeft className="w-4 h-4" /> Back
                    </Button>
                    <Button type="submit" className="flex-1 py-3" variant="primary" isLoading={isSubmitting}>
                      Create Account
                    </Button>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-8 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-400 font-medium hover:text-brand-300 transition-colors">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
