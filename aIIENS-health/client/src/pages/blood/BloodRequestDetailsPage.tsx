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
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <Link to="/blood/requests" className="inline-flex items-center gap-2 text-rose-600 font-bold hover:text-rose-700 mb-6 transition-colors hover:-translate-x-1">
          <ArrowLeft className="w-4 h-4" /> Back to Requests
        </Link>

        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden relative">
          <div className={`absolute top-0 inset-x-0 h-3 ${req.urgency === 'critical' ? 'bg-red-600' : req.urgency === 'high' ? 'bg-orange-500' : 'bg-emerald-500'}`} />
          
          <div className="p-8 md:p-12 relative">
             {/* Glow effect */}
            <div className={`absolute -top-20 -right-20 w-64 h-64 opacity-20 blur-3xl rounded-full pointer-events-none ${req.urgency === 'critical' ? 'bg-red-500' : req.urgency === 'high' ? 'bg-orange-500' : 'bg-emerald-500'}`} />

            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10 border-b border-slate-100 pb-8 relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-rose-200 text-rose-700 rounded-3xl flex flex-col items-center justify-center font-black text-4xl border border-rose-300/50 shadow-lg shadow-rose-200/50 transform rotate-3">
                  {req.bloodGroup}
                </div>
                <div className="mt-2 md:mt-0">
                  <h1 className="text-4xl font-black text-slate-900 mb-2 leading-tight tracking-tight">{req.units} Units Required</h1>
                  <Badge className={`px-3 py-1 font-bold tracking-wider uppercase text-xs ${req.urgency === 'critical' ? 'bg-red-100 text-red-700 border-red-200' : req.urgency === 'high' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'} border shadow-sm`}>
                    🔥 {req.urgency} URGENCY
                  </Badge>
                </div>
              </div>
              <div className="text-left md:text-right mt-4 md:mt-0">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Current Status</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-sm shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {req.status.replace(/_/g, ' ')}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10 relative z-10">
              {/* Location */}
              <div className="space-y-6">
                <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-rose-500" /> Location & Timing
                </h3>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                      <MapPin className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                      <strong className="block text-slate-900 text-lg">{req.hospitalId?.name || req.location.hospitalName || 'Individual Location'}</strong>
                      <p className="text-slate-500 mt-1">{req.location.city}, {req.location.state} {req.location.pincode}</p>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-slate-200" />
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                      <Clock className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                      <strong className="block text-slate-900 text-lg">Required By</strong>
                      <p className="text-slate-500 mt-1">{req.requiredBy ? new Date(req.requiredBy).toLocaleString() : 'As soon as possible'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-6">
                <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-rose-500" /> Contact Details
                </h3>
                <div className="bg-gradient-to-br from-rose-600 to-rose-700 rounded-2xl p-6 shadow-xl shadow-rose-600/20 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                  
                  <div className="relative z-10 space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-md">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-lg font-bold">{req.contactName || 'Requester'}</span>
                    </div>
                    
                    <a href={`tel:${req.contactPhone}`} className="flex items-center gap-4 bg-white text-rose-700 p-4 rounded-xl hover:scale-[1.02] transition-transform shadow-lg cursor-pointer group">
                      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-rose-400 uppercase tracking-widest mb-1">Call Now</span>
                        <span className="text-2xl font-black">{req.contactPhone}</span>
                      </div>
                    </a>
                    
                    <p className="text-xs text-rose-100/80 leading-relaxed font-medium">
                      Please mention you found this requirement on <strong className="text-white">AIIENS Health</strong> when calling.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {req.notes && (
              <div className="bg-yellow-50/50 rounded-2xl p-6 border border-yellow-200/50 mb-10 relative z-10">
                <h3 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                   Additional Notes
                </h3>
                <p className="text-yellow-800/80 whitespace-pre-wrap">{req.notes}</p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="border-t border-slate-100 pt-8 flex items-start gap-4 text-sm text-slate-500 bg-white relative z-10">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <HeartPulse className="w-5 h-5 text-slate-400" />
              </div>
              <p className="leading-relaxed pt-1">
                <strong className="text-slate-700">Important:</strong> AIIENS is a discovery platform and does not verify medical eligibility. 
                Please contact the requester directly. The hospital blood bank will perform necessary tests before accepting any donation. 
                <span className="text-rose-600 font-semibold block mt-1">Never pay money for blood donation.</span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
