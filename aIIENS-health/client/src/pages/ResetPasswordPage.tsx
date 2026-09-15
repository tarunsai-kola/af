import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '@/api/authApi';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [status, setStatus] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!token) {
      setStatus({ type: 'error', message: 'Invalid or missing reset token.' });
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) return;
    setStatus(null);
    try {
      const msg = await authApi.resetPassword({ token, newPassword: data.password });
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
            <Lock className="w-8 h-8 text-brand-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Set New Password</h1>
          <p className="text-slate-400 mt-2">Enter a new secure password for your account</p>
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
                <div>
                  <p className="text-sm text-emerald-300 mb-2">{status.message}</p>
                  <Link to="/login" className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors text-sm underline">
                    Go to Login
                  </Link>
                </div>
              </div>
            )}

            {!status || status.type === 'error' ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300" htmlFor="password">
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    disabled={!token}
                    className={`w-full bg-slate-950/50 border rounded-lg px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all disabled:opacity-50 ${
                      errors.password ? 'border-red-500/50 focus:ring-red-500/50' : 'border-slate-800'
                    }`}
                    placeholder="••••••••"
                    {...register('password')}
                  />
                  {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300" htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    disabled={!token}
                    className={`w-full bg-slate-950/50 border rounded-lg px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all disabled:opacity-50 ${
                      errors.confirmPassword ? 'border-red-500/50 focus:ring-red-500/50' : 'border-slate-800'
                    }`}
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <Button type="submit" className="w-full mt-6 py-6" variant="primary" isLoading={isSubmitting} disabled={!token}>
                  Reset Password
                </Button>
              </form>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
