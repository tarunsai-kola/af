import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { campApi } from '@/api/campApi';
import { Link } from 'react-router-dom';
import { Spinner } from '@/components/ui/Spinner';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { MapPin, Calendar, Users, Stethoscope, Search, ArrowRight } from 'lucide-react';


const SERVICES = ['general_checkup', 'blood_test', 'eye_checkup', 'dental', 'vaccination', 'bp_sugar_screening', 'nutrition_counseling', 'mental_health_screening', 'gynecology', 'pediatric_checkup'];

export default function CampsPage() {
  const [city, setCity] = useState('');
  const [service, setService] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['publicCamps', city, service],
    queryFn: () => campApi.getPublicCamps({ city, service, limit: 20 })
  });

  return (
    <div className="min-h-screen bg-surface-50 pt-24 pb-16 px-4 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-surface-900 flex items-center gap-3">
              <Stethoscope className="w-10 h-10 text-brand-600" /> Free Medical Camps
            </h1>
            <p className="text-surface-600 mt-2 text-lg">Discover and register for upcoming free healthcare camps in your city.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Select
              label=""
              value={service}
              onChange={(e) => setService(e.target.value)}
              options={[{ value: '', label: 'All Services' }, ...SERVICES.map(s => ({ value: s, label: s.replace(/_/g, ' ') }))]}
              className="w-full sm:w-48"
            />
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-surface-400" />
              <input
                type="text"
                placeholder="Filter by city..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <Link 
              to="/camps/host" 
              className="px-6 py-2.5 bg-brand-600 text-white font-bold rounded-xl shadow-sm hover:bg-brand-700 transition-colors text-center shrink-0"
            >
              Host a Camp
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
        ) : isError ? (
          <div className="text-center text-red-500 py-12">Failed to load camps.</div>
        ) : data?.data.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-surface-200">
            <Stethoscope className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-surface-900 mb-2">No upcoming camps found</h3>
            <p className="text-surface-500">Check back later or try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data.map((camp: any) => {
              const isFull = camp.registeredCount >= camp.capacity;
              return (
                <div key={camp._id} className="bg-white rounded-2xl p-6 border border-surface-200 shadow-sm hover:shadow-xl transition-all group relative flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant={camp.status === 'COMPLETED' ? 'outline' : isFull ? 'error' : 'success'}>
                        {camp.status === 'COMPLETED' ? 'COMPLETED' : isFull ? 'FULL' : 'OPEN'}
                      </Badge>
                      <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-md">
                        {camp.services[0]?.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-surface-900 mb-2 group-hover:text-brand-600 transition-colors">
                      {camp.title}
                    </h3>
                    <p className="text-sm text-surface-600 line-clamp-2 mb-6">
                      {camp.description}
                    </p>

                    <ul className="space-y-3 mb-6 text-sm text-surface-700">
                      <li className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                        <span>{new Date(camp.startDate).toLocaleDateString()} • {camp.timings}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{camp.location.venue}, {camp.location.city}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Users className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                        <span>{camp.registeredCount} / {camp.capacity} Registered</span>
                      </li>
                    </ul>
                  </div>

                  <Link 
                    to={`/camps/${camp._id}`}
                    className="flex justify-center items-center gap-2 w-full py-3 bg-surface-50 text-brand-700 font-bold rounded-xl group-hover:bg-brand-50 transition-colors"
                  >
                    View Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
