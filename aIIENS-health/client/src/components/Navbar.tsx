import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { Menu, X, Heart, Activity } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/health-check', label: 'API Status' },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-surface-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            id="navbar-logo"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 shadow-lg shadow-brand-500/40 group-hover:shadow-brand-500/60 transition-shadow">
              <Heart className="h-5 w-5 text-white fill-white" aria-hidden="true" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-tight text-white">AIIENS</span>
              <span className="text-xs font-medium text-brand-400 tracking-widest uppercase">
                Health
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'text-brand-400 bg-brand-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5',
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              id="navbar-login-btn"
              onClick={() => navigate('/login')}
            >
              Sign in
            </Button>
            <Button
              variant="primary"
              size="sm"
              id="navbar-register-btn"
              onClick={() => navigate('/register')}
              leftIcon={<Activity className="h-3.5 w-3.5" />}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
            onClick={() => setIsMenuOpen((o) => !o)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            id="navbar-mobile-toggle"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-surface-950/95 backdrop-blur-xl px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'text-brand-400 bg-brand-500/10'
                      : 'text-slate-400 hover:text-slate-200',
                  )
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                Sign in
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
