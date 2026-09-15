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
const urgencyConfig: Record<string, { label: string; bg: string; text: string; border: string; bar: string }> = {
  critical: {
    label: 'CRITICAL',
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    bar: 'bg-red-600',
  },
  high: {
    label: 'URGENT',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-200',
    bar: 'bg-orange-500',
  },
  medium: {
    label: 'MEDIUM',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    bar: 'bg-blue-500',
  },
  low: {
    label: 'LOW',
    bg: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-200',
    bar: 'bg-green-500',
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
      className="relative block bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden group p-6"
    >
      {/* Subtle background glow based on urgency */}
      <div className={`absolute top-0 right-0 w-32 h-32 opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40 rounded-full ${urg.bar}`} />

      {/* header row */}
      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="flex flex-col gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl ${urg.bg} ${urg.text} border ${urg.border} shadow-sm w-fit`}
          >
            {(req.urgency === 'critical' || req.urgency === 'high') && (
              <Flame className="w-3.5 h-3.5 animate-pulse" />
            )}
            {urg.label}
          </span>
          {req.hospitalId && (
            <span className="inline-flex items-center gap-1 text-[10px] font-black tracking-wider uppercase text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl w-fit">
              <BadgeCheck className="w-3.5 h-3.5" />
              Verified Request
            </span>
          )}
        </div>

        {/* blood group badge */}
        <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-rose-200 shadow-sm shadow-rose-200/50 rounded-2xl flex items-center justify-center shrink-0 border border-rose-300/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
          <span className="text-rose-700 font-black text-2xl leading-none drop-shadow-sm">{req.bloodGroup}</span>
        </div>
      </div>

      {/* hospital / requester name */}
      <div className="relative z-10 mb-4">
        <h3 className="font-black text-slate-900 text-xl leading-tight mb-1.5 group-hover:text-rose-600 transition-colors line-clamp-1">
          {req.contactName || req.hospitalId?.name || req.location?.hospitalName || 'Individual Request'}
        </h3>
        
        {/* distance + time */}
        <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-slate-400" />
            {timeAgo(req.createdAt)}
          </span>
          {distKm !== undefined && (
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <MapPin className="w-4 h-4 text-rose-400" />
              {distKm.toFixed(1)} km
            </span>
          )}
        </div>
      </div>

      {/* Progress / Stats section */}
      <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-4 mb-5 border border-slate-100 relative z-10 group-hover:bg-rose-50/50 transition-colors duration-500">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide group-hover:text-rose-600/70 transition-colors">Pints Required</p>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">
              {pintsRemaining} <span className="text-sm font-semibold text-slate-500">of {totalUnits}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-500">{Math.round(progressPercent)}% Fulfilled</p>
          </div>
        </div>
        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full transition-all duration-1000 ease-out relative" 
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="w-full bg-slate-900 group-hover:bg-rose-600 text-white font-black tracking-wide py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 text-sm shadow-md group-hover:shadow-rose-500/30 relative z-10 overflow-hidden">
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
      <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-xl">
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
      className="flex items-center gap-2 text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-4 py-2.5 rounded-xl hover:bg-rose-100 transition-colors disabled:opacity-60 cursor-pointer"
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
    <div className="min-h-screen bg-slate-50 animate-fade-in">

      {/* ── Hero ────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-16 px-6"
        style={{ background: 'linear-gradient(135deg, #be123c 0%, #e11d48 50%, #f43f5e 100%)' }}
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Droplet className="w-9 h-9 text-white" fill="currentColor" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            AIIENS Blood Hub
          </h1>
          <p className="text-rose-100 text-lg max-w-2xl mx-auto mb-8">
            Real-time blood donation matching — find urgent requests near you and save a life today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/blood/raise"
              id="link-raise-emergency"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-rose-700 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
            >
              <AlertTriangle className="w-5 h-5" />
              🚨 Raise Blood Emergency
            </Link>
            <Link
              to="/blood/donors"
              id="link-find-donors"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-rose-800/50 text-white font-bold rounded-xl border border-white/20 hover:bg-rose-800/70 transition-all text-sm"
            >
              <Users className="w-5 h-5" />
              Find Donors
            </Link>
          </div>
        </div>
      </section>

      {/* ── Nearby Requests ─────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {geoStatus === 'granted' ? '📍 Nearby Requests' : '🩸 Active Blood Requests'}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
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
          <div className="text-center py-12 text-red-500 font-medium">
            Failed to load blood requests. Please try again later.
          </div>
        ) : sortedRequests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <Droplet className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No active requests right now</h3>
            <p className="text-slate-500 text-sm">Check back soon — lives depend on timely donations.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {sortedRequests.slice(0, 6).map(({ req, distKm }) => (
              <BloodCard key={req._id} req={req} distKm={distKm} />
            ))}
          </div>
        )}

        {sortedRequests.length > 6 && (
          <div className="text-center mt-8">
            <Link
              to="/blood/requests"
              id="link-view-all-requests"
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors text-sm shadow"
            >
              View All {sortedRequests.length} Requests
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

      {/* ── Impact Story ────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-8">
        <div
          className="rounded-2xl p-7 flex flex-col sm:flex-row items-center gap-6"
          style={{ background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)' }}
        >
          <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-lg bg-green-200 flex items-center justify-center">
            <Star className="w-10 h-10 text-green-600" fill="currentColor" />
          </div>
          <div>
            <p className="text-green-800 text-xs font-bold uppercase tracking-widest mb-2">
              Impact Story
            </p>
            <blockquote className="text-green-900 font-black text-lg leading-snug mb-2">
              "A simple donation saved my daughter's life." — Sarah M.
            </blockquote>
            <p className="text-green-800 text-sm">
              Read how your O-donation made a difference last month.
            </p>
          </div>
        </div>
      </section>

      {/* ── Eligibility Checklist ────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
          <h2 className="text-lg font-black text-slate-900 mb-5">Eligibility Checklist</h2>
          {[
            'Aged between 18 and 65 years',
            'Weighs at least 50 kg (110 lbs)',
            'Healthy and not on active medication',
            'No recent tattoos or piercings (within 6 months)',
            'No history of hepatitis B or C, HIV',
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0"
            >
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-slate-700 text-sm font-medium">{item}</span>
            </div>
          ))}

          <div className="mt-6">
            <Link
              to="/blood/become-donor"
              id="link-register-donor"
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors text-sm w-full justify-center"
            >
              <Droplet className="w-4 h-4" />
              Register as Donor
            </Link>
          </div>
        </div>
      </section>

      {/* ── Disclaimer ──────────────────────────────── */}
      <section className="bg-slate-900 text-slate-400 py-10 px-6 text-center">
        <div className="max-w-3xl mx-auto text-xs leading-relaxed">
          <Droplet className="w-6 h-6 mx-auto mb-3 text-slate-600" />
          <p className="font-bold text-slate-300 mb-1">Platform Disclaimer</p>
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
