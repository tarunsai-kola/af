import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { caseApi } from '@/api/caseApi';
import { bloodApi } from '@/api/bloodApi';
import { campApi } from '@/api/campApi';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui/Spinner';
import {
  LayoutDashboard, Droplet, Users, HeartHandshake, PlusCircle,
  AlertCircle, CheckCircle, Clock, XCircle, FileText, Activity,
  MapPin, Calendar, ChevronRight, Flame, BadgeCheck, User,
} from 'lucide-react';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StatusBadge({ status, type }: { status: string; type?: string }) {
  const s = status?.toLowerCase();
  if (s === 'active' || s === 'live' || s === 'approved')
    return <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700"><CheckCircle className="w-3 h-3" /> {status}</span>;
  if (s === 'critical' || s === 'rejected' || s === 'cancelled')
    return <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700"><XCircle className="w-3 h-3" /> {status}</span>;
  if (s === 'high' || s === 'under_verification' || s === 'pending')
    return <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700"><Clock className="w-3 h-3" /> {status}</span>;
  if (s === 'fulfilled')
    return <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700"><BadgeCheck className="w-3 h-3" /> Fulfilled</span>;
  return <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600"><FileText className="w-3 h-3" /> {status?.replace(/_/g, ' ')}</span>;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

type Tab = 'blood' | 'camps' | 'fundraisers';

// ─── Tab Button ───────────────────────────────────────────────────────────────

function TabBtn({ active, onClick, icon, label, count }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; count?: number }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
        active ? 'bg-white shadow text-slate-900 border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
      }`}
    >
      {icon} {label}
      {count !== undefined && (
        <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${active ? 'bg-brand-100 text-brand-700' : 'bg-slate-200 text-slate-600'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

// ─── Blood Requests Tab ───────────────────────────────────────────────────────

function BloodTab() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['myBloodRequests'],
    queryFn: bloodApi.getMyBloodRequests,
  });

  const cancelMutation = useMutation({
    mutationFn: bloodApi.cancelBloodRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myBloodRequests'] }),
  });

  const requests = data?.data ?? [];

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (isError) return <div className="text-red-500 text-center py-10">Failed to load blood requests.</div>;

  if (requests.length === 0) return (
    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
      <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Droplet className="w-8 h-8 text-rose-400" />
      </div>
      <h3 className="font-bold text-slate-800 mb-2">No blood emergencies raised</h3>
      <p className="text-slate-500 text-sm mb-6">Raise a blood emergency and nearby donors will be notified.</p>
      <Link to="/blood/raise" className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white font-bold rounded-xl text-sm hover:bg-rose-700 transition-colors">
        <Flame className="w-4 h-4" /> Raise Emergency
      </Link>
    </div>
  );

  return (
    <div className="space-y-4">
      {requests.map((r: any) => (
        <div key={r._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Blood group badge */}
          <div className="w-14 h-14 bg-rose-100 border-2 border-rose-200 rounded-2xl flex items-center justify-center shrink-0">
            <span className="text-rose-700 font-black text-base">{r.bloodGroup}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-bold text-slate-900">{r.units} Units of {r.bloodGroup}</span>
              <StatusBadge status={r.urgency?.toUpperCase()} />
              <StatusBadge status={r.status} />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{r.location?.city}, {r.location?.state}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{timeAgo(r.createdAt)}</span>
              {r.requiredBy && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />By {new Date(r.requiredBy).toLocaleDateString()}</span>}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <BadgeCheck className="w-3 h-3 text-slate-400" />
              Admin verification pending — you may receive a call to confirm details
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link to={`/blood/requests/${r._id}`} className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 px-3 py-1.5 bg-brand-50 rounded-lg transition-colors">
              View <ChevronRight className="w-3 h-3" />
            </Link>
            {r.status === 'ACTIVE' && (
              <button
                onClick={() => { if (window.confirm('Cancel this blood request?')) cancelMutation.mutate(r._id); }}
                disabled={cancelMutation.isPending}
                className="text-xs font-bold text-red-600 hover:text-red-700 px-3 py-1.5 bg-red-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Camps Tab ────────────────────────────────────────────────────────────────

function CampsTab() {
  // For now shows a placeholder since "my camps" endpoint requires server-side addition
  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
      <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users className="w-8 h-8 text-brand-400" />
      </div>
      <h3 className="font-bold text-slate-800 mb-2">No camps hosted yet</h3>
      <p className="text-slate-500 text-sm mb-6">Host a medical camp in your community and help your neighbours.</p>
      <Link to="/camps/host" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-sm hover:bg-brand-700 transition-colors">
        <PlusCircle className="w-4 h-4" /> Host a Camp
      </Link>
    </div>
  );
}

// ─── Fundraisers Tab ──────────────────────────────────────────────────────────

function FundraisersTab() {
  const navigate = useNavigate();
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['myCases'],
    queryFn: caseApi.getMyCases,
  });

  const cases = response?.data || [];

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (isError) return <div className="text-red-500 text-center py-10">Failed to load fundraisers.</div>;

  if (cases.length === 0) return (
    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <HeartHandshake className="w-8 h-8 text-purple-400" />
      </div>
      <h3 className="font-bold text-slate-800 mb-2">No fundraisers started</h3>
      <p className="text-slate-500 text-sm mb-6">Start a medical fundraiser to get financial support for treatment.</p>
      <button
        onClick={() => navigate('/fundraisers/create')}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white font-bold rounded-xl text-sm hover:bg-purple-700 transition-colors"
      >
        <PlusCircle className="w-4 h-4" /> Start Fundraiser
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      {cases.map((c: any) => (
        <div key={c._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center shrink-0">
            {c.status === 'LIVE' ? <Activity className="w-7 h-7 text-purple-600 animate-pulse" /> : <FileText className="w-7 h-7 text-purple-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-bold text-slate-900">{c.patientName || 'Untitled Application'}</span>
              <StatusBadge status={c.status} />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              {c.diagnosisCategory && <span className="capitalize">{c.diagnosisCategory?.replace(/_/g, ' ')}</span>}
              {c.fundraisingTarget && <span>Target: ₹{c.fundraisingTarget?.toLocaleString()}</span>}
              <span>{timeAgo(c.createdAt)}</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {c.status === 'DRAFT' ? (
              <button onClick={() => navigate(`/fundraisers/create/${c._id}/patient`)} className="text-xs font-bold text-brand-600 px-3 py-1.5 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors">
                Continue Draft
              </button>
            ) : (
              <button onClick={() => navigate(`/fundraisers/create/${c._id}/review`)} className="flex items-center gap-1 text-xs font-bold text-brand-600 px-3 py-1.5 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors">
                View <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function MyDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('blood');

  const { data: bloodData } = useQuery({ queryKey: ['myBloodRequests'], queryFn: bloodApi.getMyBloodRequests });
  const { data: caseData } = useQuery({ queryKey: ['myCases'], queryFn: caseApi.getMyCases });

  const bloodCount = bloodData?.data?.length ?? 0;
  const caseCount = caseData?.data?.length ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 animate-fade-in">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-brand-500" />
              My Dashboard
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Welcome back, <strong>{user?.name}</strong>
              {user?.bloodGroup && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  <Droplet className="w-3 h-3" /> {user.bloodGroup}
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/blood/raise"
              id="btn-raise-emergency"
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition-colors shadow"
            >
              <Flame className="w-4 h-4" /> Raise Emergency
            </Link>
            <button
              onClick={() => navigate('/fundraisers/create')}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> New Fundraiser
            </button>
            <Link
              to="/profile/family"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-colors"
            >
              <User className="w-4 h-4" /> Family Profiles
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl mb-6 overflow-x-auto">
          <TabBtn active={activeTab === 'blood'} onClick={() => setActiveTab('blood')} icon={<Droplet className="w-4 h-4 text-rose-500" />} label="Blood Emergencies" count={bloodCount} />
          <TabBtn active={activeTab === 'camps'} onClick={() => setActiveTab('camps')} icon={<Users className="w-4 h-4 text-brand-500" />} label="Camps Hosted" />
          <TabBtn active={activeTab === 'fundraisers'} onClick={() => setActiveTab('fundraisers')} icon={<HeartHandshake className="w-4 h-4 text-purple-500" />} label="Fundraisers" count={caseCount} />
        </div>

        {/* Tab Content */}
        {activeTab === 'blood' && <BloodTab />}
        {activeTab === 'camps' && <CampsTab />}
        {activeTab === 'fundraisers' && <FundraisersTab />}
      </div>
    </div>
  );
}
