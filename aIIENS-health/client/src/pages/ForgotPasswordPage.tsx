import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { authApi } from '@/api/authApi';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setStatus(null);
    try {
      const msg = await authApi.forgotPassword(data.email);
      setStatus({ type: 'success', message: msg });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'An error occurred. Please try again.' });
    }
  };

  return (
    <div className="min-h-[80dvh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center border border-brand-500/20 mb-4 shadow-lg shadow-brand-500/5">
            <KeyRound className="w-8 h-8 text-brand-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Reset Password</h1>
          <p className="text-slate-400 mt-2">Enter your email and we'll send you a reset link</p>
        </div>

        <Card glass className="border-slate-800/60 bg-slate-900/60 shadow-2xl backdrop-blur-xl">
          <CardContent className="p-8">
            {status && status.type === 'error' && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{status.message}</p>
              </div>
            )}
            
            {status && status.type === 'success' && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-300">{status.message}</p>
              </div>
            )}

            {!status || status.type === 'error' ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`w-full bg-slate-950/50 border rounded-lg px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all ${
                      errors.email ? 'border-red-500/50 focus:ring-red-500/50' : 'border-slate-800'
                    }`}
                    placeholder="name@example.com"
                    {...register('email')}
                  />
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
                </div>

                <Button type="submit" className="w-full mt-6 py-6" variant="primary" isLoading={isSubmitting}>
                  Send Reset Link
                </Button>
              </form>
            ) : null}

            <div className="mt-8 text-center text-sm text-slate-400">
              Remember your password?{' '}
              <Link to="/login" className="text-brand-400 font-medium hover:text-brand-300 transition-colors">
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
