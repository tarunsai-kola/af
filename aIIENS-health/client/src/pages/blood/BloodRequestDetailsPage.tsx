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
    <div className="min-h-screen bg-surface-950 pt-24 pb-16 px-4 animate-fade-in relative overflow-hidden">
      {/* Cinematic Background */}
      <div 
        className="absolute inset-0 z-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage: 'url(/assets/blood_donation_bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-950/80 via-surface-950/95 to-surface-950 z-0" />
      {/* Accent glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[150px] z-0 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link to="/blood/requests" className="inline-flex items-center gap-2 text-red-400 font-bold hover:text-red-300 mb-6 transition-colors hover:-translate-x-1">
          <ArrowLeft className="w-4 h-4" /> Back to Requests
        </Link>

        <div className="bg-surface-900/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-surface-800 overflow-hidden relative">
          {/* Top urgency strip */}
          <div className={`absolute top-0 inset-x-0 h-1.5 ${req.urgency === 'critical' ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]' : req.urgency === 'high' ? 'bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.8)]' : 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]'}`} />
          
          <div className="p-8 md:p-12 relative">
             {/* Glow effect behind blood group */}
            <div className={`absolute top-0 left-0 w-64 h-64 opacity-10 blur-3xl rounded-full pointer-events-none ${req.urgency === 'critical' ? 'bg-red-500' : req.urgency === 'high' ? 'bg-orange-500' : 'bg-emerald-500'}`} />

            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10 border-b border-surface-800 pb-8 relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-red-500/10 to-red-600/20 text-red-400 rounded-3xl flex flex-col items-center justify-center font-black text-4xl border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)] transform rotate-3 relative">
                  {/* Subtle inner glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent rounded-3xl" />
                  {req.bloodGroup}
                </div>
                <div className="mt-2 md:mt-0">
                  <h1 className="text-4xl font-black text-white mb-3 leading-tight tracking-tight drop-shadow-sm">{req.units} Units Required</h1>
                  <Badge className={`px-4 py-1.5 font-bold tracking-wider uppercase text-xs rounded-xl ${req.urgency === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : req.urgency === 'high' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]'} border`}>
                    🔥 {req.urgency} URGENCY
                  </Badge>
                </div>
              </div>
              <div className="text-left md:text-right mt-4 md:mt-0">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Current Status</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  {req.status.replace(/_/g, ' ')}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12 relative z-10">
              {/* Location */}
              <div className="space-y-6">
                <h3 className="font-bold text-xl text-white flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-red-400" /> Location & Timing
                </h3>
                <div className="bg-surface-950/50 rounded-2xl p-6 border border-surface-800 shadow-inner space-y-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl" />
                  <div className="flex gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-surface-800 flex items-center justify-center shrink-0 border border-surface-700">
                      <MapPin className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <strong className="block text-white text-lg">{req.hospitalId?.name || req.location.hospitalName || 'Individual Location'}</strong>
                      <p className="text-slate-400 mt-1">{req.location.city}, {req.location.state} {req.location.pincode}</p>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-surface-800" />
                  
                  <div className="flex gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-surface-800 flex items-center justify-center shrink-0 border border-surface-700">
                      <Clock className="w-5 h-5 text-slate-300" />
                    </div>
                    <div>
                      <strong className="block text-white text-lg">Required By</strong>
                      <p className="text-slate-400 mt-1">{req.requiredBy ? new Date(req.requiredBy).toLocaleString() : 'As soon as possible'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-6">
                <h3 className="font-bold text-xl text-white flex items-center gap-3">
                  <User className="w-5 h-5 text-red-400" /> Contact Details
                </h3>
                <div className="bg-gradient-to-br from-surface-800 to-surface-900 rounded-2xl p-6 shadow-xl border border-surface-700 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 transition-colors duration-500 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full blur-[60px] pointer-events-none" />
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-950 flex items-center justify-center shrink-0 border border-surface-700">
                        <User className="w-6 h-6 text-slate-300" />
                      </div>
                      <span className="text-lg font-bold text-white">{req.contactName || 'Requester'}</span>
                    </div>
                    
                    <a href={`tel:${req.contactPhone}`} className="flex items-center gap-5 bg-surface-950 text-white p-4 rounded-xl hover:bg-red-600 hover:border-red-500 border border-surface-700 transition-all shadow-lg cursor-pointer group/btn">
                      <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20 group-hover/btn:bg-white/20 group-hover/btn:border-transparent transition-colors">
                        <Phone className="w-6 h-6 text-red-400 group-hover/btn:text-white" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-red-400 group-hover/btn:text-red-100 uppercase tracking-widest mb-1">Call Now</span>
                        <span className="text-2xl font-black tracking-tight">{req.contactPhone}</span>
                      </div>
                    </a>
                    
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      Please mention you found this requirement on <strong className="text-white">AIIENS Health</strong> when calling.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {req.notes && (
              <div className="bg-yellow-500/10 rounded-2xl p-6 border border-yellow-500/20 mb-10 relative z-10 shadow-[0_0_20px_rgba(234,179,8,0.05)]">
                <h3 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
                   Additional Notes
                </h3>
                <p className="text-yellow-100 whitespace-pre-wrap">{req.notes}</p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="border-t border-surface-800 pt-8 flex items-start gap-4 text-sm text-slate-400 bg-surface-900/10 relative z-10">
              <div className="w-10 h-10 rounded-full bg-surface-800 flex items-center justify-center shrink-0 border border-surface-700">
                <HeartPulse className="w-5 h-5 text-red-400/50" />
              </div>
              <p className="leading-relaxed pt-1">
                <strong className="text-white">Important:</strong> AIIENS is a discovery platform and does not verify medical eligibility. 
                Please contact the requester directly. The hospital blood bank will perform necessary tests before accepting any donation. 
                <span className="text-red-400 font-semibold block mt-1">Never pay money for blood donation.</span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
