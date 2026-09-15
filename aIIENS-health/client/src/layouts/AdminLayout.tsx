import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, LayoutDashboard, FileText, HeartPulse, ShieldCheck, Activity, Users, LogOut, DollarSign, ArrowRightLeft, FileSpreadsheet, Stethoscope, BarChart4, Droplet } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Basic check: Ensure user is not just a standard role
  const isAuthorized = user?.roles.some(role => 
    role !== 'PUBLIC_USER' && role !== 'DONOR' && role !== 'PATIENT_GUARDIAN'
  );

  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-surface-900 mb-2">Access Denied</h2>
        <p className="text-surface-600 mb-6">
          You do not have the required permissions to access the Admin Dashboard.
        </p>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  const NAV_LINKS = [
    { to: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard, exact: true },
    { to: '/admin/cases', label: 'Case Verification', icon: FileText },
    { to: '/admin/blood-requests', label: 'Blood Emergencies', icon: Droplet },
    { to: '/admin/campaigns', label: 'Live Campaigns', icon: HeartPulse },
    { to: '/admin/camps', label: 'Camps Verification', icon: Stethoscope },
    { to: '/admin/hospitals', label: 'Hospital Directory', icon: Activity },
    { to: '/admin/fraud', label: 'Fraud & Security', icon: ShieldCheck },
    { to: '/admin/impact', label: 'Impact Data Audit', icon: BarChart4 },
    { to: '/admin/audit', label: 'System Audit Logs', icon: FileSpreadsheet },
    { to: '/admin/users', label: 'User Management', icon: Users },
  ];

  const FINANCE_LINKS = [
    { to: '/admin/finance', label: 'Finance Dashboard', icon: DollarSign, exact: true },
    { to: '/admin/finance/donations', label: 'Donation Ledger', icon: FileText },
    { to: '/admin/finance/settlements', label: 'Settlements', icon: ArrowRightLeft },
    { to: '/admin/finance/reconciliation', label: 'Reconciliation', icon: FileSpreadsheet },
  ];

  const hasFinanceAccess = user?.roles.some(role => ['FINANCE_OFFICER', 'SUPER_ADMIN'].includes(role));

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col md:flex-row pt-16">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-surface-900 text-surface-100 flex flex-col">
        <div className="p-6 border-b border-surface-800">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-brand-500" />
            Admin Portal
          </h2>
          <p className="text-xs text-surface-400 mt-1">Logged in as {user?.name}</p>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_LINKS.map(link => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-brand-600 text-white' 
                      : 'text-surface-300 hover:bg-surface-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            );
          })}

          {hasFinanceAccess && (
            <>
              <div className="px-4 py-3 mt-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                Finance & Accounts
              </div>
              {FINANCE_LINKS.map(link => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.exact}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-brand-600 text-white' 
                          : 'text-surface-300 hover:bg-surface-800 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </NavLink>
                );
              })}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-surface-800">
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-sm font-medium text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface-50 p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
