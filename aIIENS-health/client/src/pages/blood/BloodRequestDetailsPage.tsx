import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bloodApi } from '@/api/bloodApi';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { MapPin, Clock, Droplet, User, Phone, ArrowLeft, HeartPulse } from 'lucide-react';

export default function BloodRequestDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['bloodRequest', id],
    queryFn: () => bloodApi.getBloodRequestDetails(id!),
    enabled: !!id
  });

  if (isLoading) return <div className="min-h-screen pt-24 pb-16 flex justify-center"><Spinner size="lg" /></div>;
  if (isError || !data) return <div className="min-h-screen pt-24 pb-16 px-4"><Alert variant="error">Request not found.</Alert></div>;

  const req = data;

  return (
    <div className="min-h-screen bg-surface-50 pt-24 pb-16 px-4 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <Link to="/blood/requests" className="inline-flex items-center gap-2 text-brand-600 font-medium hover:text-brand-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Requests
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-surface-200 overflow-hidden relative">
          <div className={`absolute top-0 inset-x-0 h-2 ${req.urgency === 'critical' ? 'bg-red-600' : req.urgency === 'high' ? 'bg-orange-500' : 'bg-brand-500'}`} />
          
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8 border-b border-surface-100 pb-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex flex-col items-center justify-center font-black text-3xl border border-rose-200 shadow-inner">
                  {req.bloodGroup}
                  <span className="text-xs font-medium text-rose-500 mt-1 uppercase tracking-wider block">Group</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-surface-900 mb-2">{req.units} Units Required</h1>
                  <Badge variant={req.urgency === 'critical' ? 'error' : req.urgency === 'high' ? 'warning' : 'brand'}>
                    {req.urgency.toUpperCase()} URGENCY
                  </Badge>
                </div>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-surface-500 mb-1">Status</p>
                <Badge variant="outline" className="text-brand-700 border-brand-200 bg-brand-50">{req.status.replace(/_/g, ' ')}</Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-lg mb-4 text-surface-900 border-b border-surface-100 pb-2">Location & Timing</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-surface-700">
                    <MapPin className="w-5 h-5 text-brand-500 shrink-0" />
                    <div>
                      <strong className="block text-surface-900">{req.hospitalId?.name || req.location.hospitalName || 'Individual Location'}</strong>
                      {req.location.city}, {req.location.state} {req.location.pincode}
                    </div>
                  </li>
                  <li className="flex gap-3 text-surface-700">
                    <Clock className="w-5 h-5 text-brand-500 shrink-0" />
                    <div>
                      <strong className="block text-surface-900">Required By</strong>
                      {req.requiredBy ? new Date(req.requiredBy).toLocaleString() : 'As soon as possible'}
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4 text-surface-900 border-b border-surface-100 pb-2">Contact Details</h3>
                <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5">
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-surface-800 font-medium">
                      <User className="w-5 h-5 text-brand-600" />
                      {req.contactName}
                    </li>
                    <li className="flex items-center gap-3 text-brand-700 font-bold text-lg">
                      <Phone className="w-5 h-5" />
                      {req.contactPhone}
                    </li>
                  </ul>
                  <p className="text-xs text-brand-600/70 mt-4 leading-relaxed">
                    Please mention you found this requirement on AIIENS Health when calling.
                  </p>
                </div>
              </div>
            </div>

            {req.notes && (
              <div className="bg-surface-50 rounded-2xl p-6 border border-surface-200 mb-8">
                <h3 className="font-bold text-surface-900 mb-2">Additional Notes</h3>
                <p className="text-surface-700 whitespace-pre-wrap">{req.notes}</p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="border-t border-surface-100 pt-8 flex items-start gap-4 text-sm text-surface-500 bg-white">
              <HeartPulse className="w-6 h-6 shrink-0 text-surface-400" />
              <p>
                <strong>Important:</strong> AIIENS is a discovery platform and does not verify medical eligibility. 
                Please contact the requester directly. The hospital blood bank will perform necessary tests before accepting any donation. 
                Never pay money for blood donation.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
