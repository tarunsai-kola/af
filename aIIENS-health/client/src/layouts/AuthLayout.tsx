import { Outlet, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 bg-surface-950">
      {/* Background gradient blob */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute top-20 right-1/4 h-64 w-64 rounded-full bg-accent-500/15 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link
            to="/"
            className="flex items-center gap-3 group"
            id="auth-layout-logo"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 shadow-xl shadow-brand-500/40">
              <Heart className="h-6 w-6 text-white fill-white" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">AIIENS</span>
              <span className="text-xs font-medium text-brand-400 tracking-widest uppercase">
                Health
              </span>
            </div>
          </Link>
        </div>

        {/* Page content */}
        <Outlet />
      </div>
    </div>
  );
}
