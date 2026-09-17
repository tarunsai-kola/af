import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Menu, X, Heart, User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  isDarkBackground?: boolean;
}

export function Navbar({ isDarkBackground = false }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [workDropdownOpen, setWorkDropdownOpen] = useState(false);
  const [involvedDropdownOpen, setInvolvedDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = !isScrolled;
  const useLightText = isTransparent && isDarkBackground;
  const textColor = useLightText ? 'text-white' : 'text-surface-900';
  const mutedTextColor = useLightText ? 'text-slate-300' : 'text-surface-600';

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setWorkDropdownOpen(false);
    setInvolvedDropdownOpen(false);
  }, [location.pathname]);

  const ourWorkLinks = [
    { name: 'Medical Fundraising', href: '/fundraisers' },
    { name: 'Blood Donation', href: '/blood' },
    { name: 'Medical Camps', href: '/camps' },
    { name: 'Healthcare Assistance', href: '/assistance' },
    { name: 'Community Impact', href: '/impact' },
    { name: 'NGO Network', href: '/ngo-network' },
  ];

  const getInvolvedLinks = [
    { name: 'Donate', href: '/fundraisers' },
    { name: 'Become a Donor', href: '/blood/become-donor' },
    { name: 'Volunteer', href: '/volunteer' },
    { name: 'Partner With Us', href: '/partner' },
    { name: 'Host a Camp', href: '/camps/host' },
    { name: 'Start a Fundraiser', href: '/fundraisers/create' },
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
            <span className={`text-xl font-bold tracking-tight ${textColor}`}>
              AIIENS <span className="text-brand-600">Foundation</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className={`text-sm font-medium transition-colors hover:text-brand-600 ${location.pathname === '/' ? 'text-brand-600' : mutedTextColor}`}>Home</Link>
            
            {/* Our Work Dropdown */}
            <div className="relative group">
              <button 
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-brand-600 ${ourWorkLinks.some(l => location.pathname.startsWith(l.href)) ? 'text-brand-600' : mutedTextColor}`}
                onMouseEnter={() => { setWorkDropdownOpen(true); setInvolvedDropdownOpen(false); }}
                onClick={() => setWorkDropdownOpen(!workDropdownOpen)}
              >
                Our Work <ChevronDown className="w-4 h-4" />
              </button>
              {workDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-surface-100 py-2 animate-fade-in-up"
                  onMouseLeave={() => setWorkDropdownOpen(false)}
                >
                  {ourWorkLinks.map((link) => (
                    <Link key={link.name} to={link.href} className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 hover:text-brand-600">
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/fundraisers" className={`text-sm font-medium transition-colors hover:text-brand-600 ${location.pathname === '/fundraisers' ? 'text-brand-600' : mutedTextColor}`}>Campaigns</Link>
            <Link to="/impact" className={`text-sm font-medium transition-colors hover:text-brand-600 ${location.pathname === '/impact' ? 'text-brand-600' : mutedTextColor}`}>Impact</Link>
            <Link to="/about" className={`text-sm font-medium transition-colors hover:text-brand-600 ${location.pathname === '/about' ? 'text-brand-600' : mutedTextColor}`}>About Us</Link>
            
            {/* Get Involved Dropdown */}
            <div className="relative group">
              <button 
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-brand-600 ${mutedTextColor}`}
                onMouseEnter={() => { setInvolvedDropdownOpen(true); setWorkDropdownOpen(false); }}
                onClick={() => setInvolvedDropdownOpen(!involvedDropdownOpen)}
              >
                Get Involved <ChevronDown className="w-4 h-4" />
              </button>
              {involvedDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-surface-100 py-2 animate-fade-in-up"
                  onMouseLeave={() => setInvolvedDropdownOpen(false)}
                >
                  {getInvolvedLinks.map((link) => (
                    <Link key={link.name} to={link.href} className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 hover:text-brand-600">
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/transparency" className={`text-sm font-medium transition-colors hover:text-brand-600 ${location.pathname === '/transparency' ? 'text-brand-600' : mutedTextColor}`}>Transparency</Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-colors ${
                    useLightText 
                      ? 'border-white/20 bg-white/10 hover:bg-white/20' 
                      : 'border-surface-200 bg-white hover:bg-surface-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className={`text-sm font-medium max-w-[100px] truncate ${useLightText ? 'text-slate-100' : 'text-surface-700'}`}>{user?.name}</span>
                  <ChevronDown className={`w-4 h-4 ${useLightText ? 'text-slate-300' : 'text-surface-400'}`} />
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
              <Link to="/login" className={`text-sm font-medium hover:text-brand-600 transition-colors ${mutedTextColor}`}>
                Sign In
              </Link>
            )}
            <Link to="/fundraisers">
              <Button variant="primary" className="shadow-md shadow-brand-500/20 px-6">
                Donate
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className={`lg:hidden p-2 ${mutedTextColor}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-surface-100 shadow-xl animate-fade-in max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="flex flex-col px-4 py-4 space-y-2">
            <Link to="/" className="text-base font-medium px-4 py-3 rounded-xl transition-colors text-surface-700 hover:bg-surface-50">Home</Link>
            
            <div className="px-4 py-2 font-semibold text-surface-900 border-t border-surface-100 mt-2 pt-4">Our Work</div>
            {ourWorkLinks.map((link) => (
              <Link key={link.name} to={link.href} className="text-sm font-medium px-6 py-2 rounded-xl transition-colors text-surface-600 hover:bg-surface-50">
                {link.name}
              </Link>
            ))}

            <Link to="/fundraisers" className="text-base font-medium px-4 py-3 rounded-xl transition-colors text-surface-700 hover:bg-surface-50">Campaigns</Link>
            <Link to="/impact" className="text-base font-medium px-4 py-3 rounded-xl transition-colors text-surface-700 hover:bg-surface-50">Impact</Link>
            <Link to="/about" className="text-base font-medium px-4 py-3 rounded-xl transition-colors text-surface-700 hover:bg-surface-50">About Us</Link>
            <Link to="/transparency" className="text-base font-medium px-4 py-3 rounded-xl transition-colors text-surface-700 hover:bg-surface-50">Transparency</Link>

            <div className="px-4 py-2 font-semibold text-surface-900 border-t border-surface-100 mt-2 pt-4">Get Involved</div>
            {getInvolvedLinks.map((link) => (
              <Link key={link.name} to={link.href} className="text-sm font-medium px-6 py-2 rounded-xl transition-colors text-surface-600 hover:bg-surface-50">
                {link.name}
              </Link>
            ))}
            
            <hr className="border-surface-100 my-4" />
            
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
                <Link to="/fundraisers">
                  <Button variant="primary" className="w-full shadow-md shadow-brand-500/20">Donate</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
