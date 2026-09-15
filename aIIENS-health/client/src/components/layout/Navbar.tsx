import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Menu, X, Heart, User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Blood Hub', href: '/blood' },
    { name: 'Medical Camps', href: '/camps' },
    { name: 'Fundraisers', href: '/fundraisers' },
    { name: 'Impact', href: '/impact' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-surface-100' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 transition-transform group-hover:scale-105">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-surface-900">
              AIIENS <span className="text-brand-600">Health</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-brand-600 ${
                  location.pathname.startsWith(link.href) ? 'text-brand-600' : 'text-surface-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-surface-200 bg-white hover:bg-surface-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-surface-700 max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown className="w-4 h-4 text-surface-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-surface-100 py-1 animate-fade-in-up origin-top-right">
                    <div className="px-4 py-2 border-b border-surface-50">
                      <p className="text-sm font-medium text-surface-900 truncate">{user?.name}</p>
                      <p className="text-xs text-surface-500 truncate">{user?.email}</p>
                    </div>
                    {/* Dashboard links based on role */}
                    {(user?.roles?.includes('SUPER_ADMIN') || user?.roles?.includes('FINANCE_ADMIN') || user?.roles?.includes('HOSPITAL_VERIFIER') || user?.roles?.includes('MEDICAL_REVIEWER') || user?.roles?.includes('CASE_OFFICER') || user?.roles?.includes('FINANCE_OFFICER') || user?.roles?.includes('FRAUD_REVIEWER') || user?.roles?.includes('CAMPAIGN_APPROVER')) && (
                      <Link 
                        to={user?.roles?.includes('FINANCE_ADMIN') && !user?.roles?.includes('SUPER_ADMIN') ? "/admin/finance" : "/admin"}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    {(user?.roles?.includes('PUBLIC_USER') || user?.roles?.includes('PATIENT_GUARDIAN')) && (
                      <Link 
                        to="/dashboard"
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        My Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-2xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors">
                  Sign In
                </Link>
                <Link to="/fundraisers/create">
                  <Button variant="primary" className="shadow-md shadow-brand-500/20 px-6">
                    Start a Fundraiser
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-surface-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-surface-100 shadow-xl animate-fade-in">
          <div className="flex flex-col px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href}
                className={`text-base font-medium px-4 py-3 rounded-xl transition-colors ${
                  location.pathname.startsWith(link.href) ? 'bg-brand-50 text-brand-700' : 'text-surface-700 hover:bg-surface-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <hr className="border-surface-100" />
            
            {isAuthenticated ? (
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900">{user?.name}</p>
                    <p className="text-xs text-surface-500">{user?.email}</p>
                  </div>
                </div>
                {(user?.roles?.includes('SUPER_ADMIN') || user?.roles?.includes('FINANCE_ADMIN') || user?.roles?.includes('HOSPITAL_VERIFIER') || user?.roles?.includes('MEDICAL_REVIEWER') || user?.roles?.includes('CASE_OFFICER') || user?.roles?.includes('FINANCE_OFFICER') || user?.roles?.includes('FRAUD_REVIEWER') || user?.roles?.includes('CAMPAIGN_APPROVER')) && (
                  <Link 
                    to={user?.roles?.includes('FINANCE_ADMIN') && !user?.roles?.includes('SUPER_ADMIN') ? "/admin/finance" : "/admin"}
                    className="flex items-center gap-2 px-4 py-3 text-brand-600 hover:bg-brand-50 rounded-xl transition-colors font-medium"
                  >
                    <User className="w-5 h-5" />
                    Admin Dashboard
                  </Link>
                )}
                {(user?.roles?.includes('PUBLIC_USER') || user?.roles?.includes('PATIENT_GUARDIAN')) && (
                  <Link 
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-3 text-surface-700 hover:bg-surface-50 rounded-xl transition-colors font-medium"
                  >
                    <LayoutDashboard className="w-5 h-5 text-brand-600" />
                    My Dashboard
                  </Link>
                )}
                <button 
                  onClick={() => logout()}
                  className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <Link to="/login">
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link to="/fundraisers/create">
                  <Button variant="primary" className="w-full shadow-md shadow-brand-500/20">Start a Fundraiser</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
