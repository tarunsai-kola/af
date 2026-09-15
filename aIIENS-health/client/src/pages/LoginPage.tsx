import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '@/api/authApi';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LogIn, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to redirect after login
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg(null);
    try {
      const response = await authApi.login(data);
      login(response.user, response.accessToken);
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[80dvh] flex items-center justify-center px-4 py-12" id="login-page">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo/Brand header could go here */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center border border-brand-500/20 mb-4 shadow-lg shadow-brand-500/5">
            <LogIn className="w-8 h-8 text-brand-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Welcome Back</h1>
          <p className="text-slate-400 mt-2">Sign in to your AIIENS Health account</p>
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

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-300" htmlFor="password">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  className={`w-full bg-slate-950/50 border rounded-lg px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all ${
                    errors.password ? 'border-red-500/50 focus:ring-red-500/50' : 'border-slate-800'
                  }`}
                  placeholder="••••••••"
                  {...register('password')}
                />
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full mt-6 py-6" variant="primary" isLoading={isSubmitting}>
                Sign In
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-400 font-medium hover:text-brand-300 transition-colors">
                Create one now
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
