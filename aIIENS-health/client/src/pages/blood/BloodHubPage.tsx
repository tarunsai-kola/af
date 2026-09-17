import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bloodApi } from '@/api/bloodApi';
import {
  Droplet,
  MapPin,
  Navigation,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  HeartHandshake,
  Loader2,
  BadgeCheck,
  Users,
  Flame,
  Star,
} from 'lucide-react';

/* ─── helpers ──────────────────────────────────────────────────────── */

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/* ─── urgency styles ────────────────────────────────────────────────── */
const urgencyConfig: Record<string, { label: string; bg: string; text: string; border: string; glow: string }> = {
  critical: {
    label: 'CRITICAL',
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]',
  },
  high: {
    label: 'URGENT',
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    border: 'border-orange-500/20',
    glow: 'shadow-[0_0_15px_rgba(249,115,22,0.2)]',
  },
  medium: {
    label: 'MEDIUM',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]',
  },
  low: {
    label: 'LOW',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
  },
};

function getUrgency(u: string) {
  return urgencyConfig[u?.toLowerCase()] ?? urgencyConfig.low;
}

/* ─── BloodCard ─────────────────────────────────────────────────────── */
function BloodCard({ req, distKm }: { req: any; distKm?: number }) {
  const urg = getUrgency(req.urgency);
  const fulfilledUnits = req.fulfilledUnits || req.donated || 0;
  const totalUnits = req.units || 1;
  const pintsRemaining = Math.max(0, totalUnits - fulfilledUnits);
  const progressPercent = Math.min(100, (fulfilledUnits / totalUnits) * 100);

  return (
    <Link
      to={`/blood/requests/${req._id}`}
      className="relative block bg-surface-900/40 backdrop-blur-xl rounded-3xl border border-surface-800 hover:border-red-500/30 shadow-lg hover:shadow-[0_0_40px_rgba(239,68,68,0.15)] hover:-translate-y-1 transition-all duration-500 overflow-hidden group p-6"
    >
      {/* Subtle background glow based on urgency */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 rounded-full bg-red-500/10 pointer-events-none" />

      {/* header row */}
      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="flex flex-col gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl ${urg.bg} ${urg.text} border ${urg.border} ${urg.glow} w-fit`}
          >
            {(req.urgency === 'critical' || req.urgency === 'high') && (
              <Flame className="w-3.5 h-3.5 animate-pulse" />
            )}
            {urg.label}
          </span>
          {req.hospitalId && (
            <span className="inline-flex items-center gap-1 text-[10px] font-black tracking-wider uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl w-fit shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <BadgeCheck className="w-3.5 h-3.5" />
              Verified Request
            </span>
          )}
        </div>

        {/* blood group badge */}
        <div className="w-16 h-16 bg-gradient-to-br from-red-500/10 to-red-600/20 shadow-[0_0_15px_rgba(239,68,68,0.2)] rounded-2xl flex items-center justify-center shrink-0 border border-red-500/30 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] transition-all duration-500">
          <span className="text-red-400 font-black text-2xl leading-none drop-shadow-sm">{req.bloodGroup}</span>
        </div>
      </div>

      {/* hospital / requester name */}
      <div className="relative z-10 mb-4">
        <h3 className="font-bold text-white text-xl leading-tight mb-1.5 group-hover:text-red-400 transition-colors line-clamp-1">
          {req.contactName || req.hospitalId?.name || req.location?.hospitalName || 'Individual Request'}
        </h3>
        
        {/* distance + time */}
        <div className="flex items-center gap-3 text-sm text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-slate-500" />
            {timeAgo(req.createdAt)}
          </span>
          {distKm !== undefined && (
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-surface-700" />
              <MapPin className="w-4 h-4 text-red-400/70" />
              {distKm.toFixed(1)} km
            </span>
          )}
        </div>
      </div>

      {/* Progress / Stats section */}
      <div className="bg-surface-950/50 backdrop-blur-sm rounded-2xl p-4 mb-5 border border-surface-800 relative z-10 group-hover:border-red-500/20 transition-colors duration-500">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Pints Required</p>
            <p className="text-2xl font-black text-white leading-none mt-1">
              {pintsRemaining} <span className="text-sm font-semibold text-slate-400">of {totalUnits}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-red-400/80">{Math.round(progressPercent)}% Fulfilled</p>
          </div>
        </div>
        <div className="w-full bg-surface-800 h-2 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-1000 ease-out relative shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="w-full bg-surface-800/80 border border-surface-700 group-hover:bg-red-600 group-hover:border-red-500 text-slate-300 group-hover:text-white font-bold tracking-wide py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 text-sm shadow-md group-hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] relative z-10 overflow-hidden">
        <Droplet className="w-5 h-5 group-hover:animate-bounce" />
        Donate Blood Now
      </div>
    </Link>
  );
}

/* ─── Location banner ───────────────────────────────────────────────── */
function LocationBanner({
  status,
  city,
  onRequest,
}: {
  status: 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported';
  city?: string;
  onRequest: () => void;
}) {
  if (status === 'granted') {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>
          Showing requests near <strong>{city || 'your location'}</strong>
        </span>
      </div>
    );
  }
  if (status === 'denied') {
    return (
      <div className="flex items-center gap-2 text-sm text-orange-700 bg-orange-50 border border-orange-200 px-4 py-2.5 rounded-xl">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        Location access denied. Showing all active requests.
      </div>
    );
  }
  if (status === 'unsupported') {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-400 bg-surface-900 border border-surface-800 px-4 py-2.5 rounded-xl">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        Geolocation not supported. Showing all active requests.
      </div>
    );
  }

  return (
    <button
      id="btn-use-location"
      onClick={onRequest}
      disabled={status === 'requesting'}
      className="flex items-center gap-2 text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl hover:bg-red-500/20 transition-colors disabled:opacity-60 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
    >
      {status === 'requesting' ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        <Navigation className="w-4 h-4 shrink-0" />
      )}
      {status === 'requesting' ? 'Detecting location…' : 'Use my location'}
    </button>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────── */
export default function BloodHubPage() {
  const [geoStatus, setGeoStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported'>('idle');
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [nearbyCity, setNearbyCity] = useState<string>('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['bloodRequests-hub'],
    queryFn: () => bloodApi.getBloodRequests({ status: 'ACTIVE', limit: 50 }),
  });

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const json = await res.json();
      const city =
        json.address?.city ||
        json.address?.town ||
        json.address?.village ||
        json.address?.county ||
        '';
      setNearbyCity(city);
    } catch {
      // ignore
    }
  };

  /* Auto-request location on mount */
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoStatus('unsupported');
      return;
    }
    setGeoStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lon: longitude });
        setGeoStatus('granted');
        reverseGeocode(latitude, longitude);
      },
      () => setGeoStatus('denied'),
      { timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus('unsupported');
      return;
    }
    setGeoStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lon: longitude });
        setGeoStatus('granted');
        reverseGeocode(latitude, longitude);
      },
      () => setGeoStatus('denied'),
      { timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  /* Compute distances and sort */
  const sortedRequests: Array<{ req: any; distKm?: number }> = (data?.data ?? []).map((req: any) => {
    const lat = req.location?.coordinates?.[1] ?? req.location?.lat;
    const lon = req.location?.coordinates?.[0] ?? req.location?.lng;
    const distKm =
      userCoords && lat != null && lon != null
        ? haversineKm(userCoords.lat, userCoords.lon, lat, lon)
        : undefined;
    return { req, distKm };
  });

  if (userCoords) {
    sortedRequests.sort((a, b) => {
      if (a.distKm == null && b.distKm == null) return 0;
      if (a.distKm == null) return 1;
      if (b.distKm == null) return -1;
      return a.distKm - b.distKm;
    });
  } else {
    const urgencyOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    sortedRequests.sort((a, b) => {
      const ua = urgencyOrder[a.req.urgency] ?? 4;
      const ub = urgencyOrder[b.req.urgency] ?? 4;
      if (ua !== ub) return ua - ub;
      return new Date(b.req.createdAt).getTime() - new Date(a.req.createdAt).getTime();
    });
  }

  return (
    <div className="min-h-screen bg-surface-950 pt-24 pb-20 relative overflow-hidden">
      
      {/* Cinematic Background */}
      <div 
        className="absolute inset-0 z-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: 'url(/assets/blood_donation_bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-950/80 via-surface-950/95 to-surface-950 z-0 pointer-events-none" />

      {/* Ambient background glows */}
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* ── Nearby Requests ─────────────────────────── */}
      <section className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              {geoStatus === 'granted' ? '📍 Nearby Requests' : '🩸 Active Blood Requests'}
            </h2>
            <p className="text-slate-400 mt-2 text-lg">
              {isLoading ? 'Loading…' : `${sortedRequests.length} urgent request${sortedRequests.length !== 1 ? 's' : ''} need donors`}
            </p>
          </div>
          <LocationBanner status={geoStatus} city={nearbyCity} onRequest={requestLocation} />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
            <p className="text-slate-500">Loading requests…</p>
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-400 bg-surface-900/50 rounded-2xl border border-surface-800">
            Failed to load blood requests. Please try again later.
          </div>
        ) : sortedRequests.length === 0 ? (
          <div className="text-center py-20 bg-surface-900/50 backdrop-blur-md rounded-3xl border border-surface-800 shadow-xl">
            <Droplet className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No active requests right now</h3>
            <p className="text-slate-400 text-sm">Check back soon — lives depend on timely donations.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {sortedRequests.slice(0, 6).map(({ req, distKm }) => (
              <BloodCard key={req._id} req={req} distKm={distKm} />
            ))}
          </div>
        )}

        {sortedRequests.length > 6 && (
          <div className="text-center mt-12">
            <Link
              to="/blood/requests"
              id="link-view-all-requests"
              className="inline-flex items-center gap-2 px-8 py-4 bg-surface-800 hover:bg-surface-700 text-white font-bold rounded-xl border border-surface-700 hover:border-surface-600 transition-all text-sm shadow-lg"
            >
              View All {sortedRequests.length} Requests
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

      {/* ── Impact Story ────────────────────────────── */}
      <section className="container mx-auto px-4 max-w-4xl pt-16 pb-8 relative z-10">
        <div
          className="rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-8 bg-surface-900/50 backdrop-blur-xl border border-surface-800 shadow-xl"
        >
          <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-4 border-surface-800 bg-brand-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.2)]">
            <Star className="w-10 h-10 text-brand-400" fill="currentColor" />
          </div>
          <div>
            <p className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-3">
              Impact Story
            </p>
            <blockquote className="text-white font-bold text-xl leading-snug mb-3">
              "A simple donation saved my daughter's life." — Sarah M.
            </blockquote>
            <p className="text-slate-400 text-sm">
              Read how your O- donation made a difference last month.
            </p>
          </div>
        </div>
      </section>

      {/* ── Eligibility Checklist ────────────────────── */}
      <section className="container mx-auto px-4 max-w-4xl pb-16 relative z-10">
        <div className="bg-surface-900/40 backdrop-blur-md rounded-3xl border border-surface-800 shadow-xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Eligibility Checklist</h2>
          {[
            'Aged between 18 and 65 years',
            'Weighs at least 50 kg (110 lbs)',
            'Healthy and not on active medication',
            'No recent tattoos or piercings (within 6 months)',
            'No history of hepatitis B or C, HIV',
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 py-4 border-b border-surface-800/50 last:border-0"
            >
              <div className="w-8 h-8 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-slate-300 font-medium">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Disclaimer ──────────────────────────────── */}
      <section className="relative z-10 bg-surface-900/80 border-t border-surface-800 text-slate-400 py-10 px-6 text-center">
        <div className="max-w-3xl mx-auto text-xs leading-relaxed">
          <Droplet className="w-6 h-6 mx-auto mb-3 text-slate-600" />
          <p className="font-bold text-slate-300 mb-2">Platform Disclaimer</p>
          <p>
            AIIENS Health operates strictly as a technology discovery platform to connect voluntary
            donors with patients in need. We do not collect, test, store, or distribute blood. We
            are not a licensed blood centre. All medical eligibility and blood screening MUST be
            conducted by authorized professionals at a licensed hospital or blood bank.
          </p>
        </div>
      </section>
    </div>
  );
}
