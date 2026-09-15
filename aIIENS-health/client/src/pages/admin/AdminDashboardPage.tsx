import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/adminApi';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { FileText, Clock, CheckCircle2, HeartPulse, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
  const { data: metrics, isLoading, isError } = useQuery({
    queryKey: ['adminMetrics'],
    queryFn: adminApi.getMetrics,
  });

  if (isLoading) {
    return <div className="flex justify-center p-12"><Spinner size="lg" /></div>;
  }

  if (isError || !metrics) {
    return <Alert variant="error" title="Failed to load metrics">Unable to connect to the server.</Alert>;
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">Dashboard Overview</h1>
          <p className="text-surface-600 mt-1">Monitor platform activity and pending verifications.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Metric Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-500">New Documents</p>
              <p className="text-2xl font-bold text-surface-900">{metrics.newCases}</p>
            </div>
          </div>
          <Link to="/admin/cases?status=DOCUMENTS_PENDING" className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
            Review Documents <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-500">In Verification</p>
              <p className="text-2xl font-bold text-surface-900">{metrics.underVerification}</p>
            </div>
          </div>
          <Link to="/admin/cases?status=UNDER_VERIFICATION" className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
            View Cases <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-500">Approved Cases</p>
              <p className="text-2xl font-bold text-surface-900">{metrics.approvedCases}</p>
            </div>
          </div>
          <Link to="/admin/cases?status=APPROVED" className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
            Publish Campaigns <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Metric Card 4 */}
        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-500">Live Campaigns</p>
              <p className="text-2xl font-bold text-surface-900">{metrics.liveCampaigns}</p>
            </div>
          </div>
          <Link to="/admin/campaigns" className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
            Manage Campaigns <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-6 text-center">
        <h3 className="text-lg font-bold text-surface-900 mb-2">Welcome to the Verification Portal</h3>
        <p className="text-surface-600 max-w-2xl mx-auto">
          As a member of the AIIENS Health administration team, you play a critical role in ensuring platform integrity. Please proceed to the Case Verification tab to process pending applications.
        </p>
      </div>
    </div>
  );
}
