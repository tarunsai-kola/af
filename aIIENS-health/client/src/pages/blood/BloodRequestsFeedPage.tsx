import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bloodApi } from '@/api/bloodApi';
import { Link } from 'react-router-dom';
import { Spinner } from '@/components/ui/Spinner';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Droplet, MapPin, Clock, Search, ArrowRight } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BloodRequestsFeedPage() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [city, setCity] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['bloodRequests', bloodGroup, city],
    queryFn: () => bloodApi.getBloodRequests({ bloodGroup, city, status: 'ACTIVE', limit: 20 })
  });

  return (
    <div className="min-h-screen bg-surface-50 pt-24 pb-16 px-4 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-surface-900 flex items-center gap-2">
              <Droplet className="w-8 h-8 text-rose-500" /> Active Blood Requests
            </h1>
            <p className="text-surface-600 mt-2">Urgent requirements from patients and hospitals in our network.</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <Select
              label=""
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              options={[{ value: '', label: 'All Groups' }, ...BLOOD_GROUPS.map(g => ({ value: g, label: g }))]}
              className="w-32"
            />
            <div className="relative flex-1 md:w-48">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-surface-400" />
              <input
                type="text"
                placeholder="Filter by city..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
        ) : isError ? (
          <div className="text-center text-red-500 py-12">Failed to load requests.</div>
        ) : data?.data.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-surface-200">
            <Droplet className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-surface-900 mb-2">No active requests found</h3>
            <p className="text-surface-500">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {data?.data.map((req: any) => (
              <div key={req._id} className="bg-white rounded-2xl p-6 border border-surface-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1.5 h-full ${req.urgency === 'critical' ? 'bg-red-600' : req.urgency === 'high' ? 'bg-orange-500' : 'bg-brand-500'}`} />
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-black text-xl border border-rose-200 shadow-inner">
                      {req.bloodGroup}
                    </div>
                    <div>
                      <h3 className="font-bold text-surface-900">{req.units} Units Needed</h3>
                      <p className="text-sm text-surface-500">{req.hospitalId?.name || 'Individual Request'}</p>
                    </div>
                  </div>
                  <Badge variant={req.urgency === 'critical' ? 'error' : req.urgency === 'high' ? 'warning' : 'brand'}>
                    {req.urgency.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-surface-600">
                    <MapPin className="w-4 h-4 text-surface-400" />
                    {req.location.city}, {req.location.state}
                  </div>
                  {req.requiredBy && (
                    <div className="flex items-center gap-2 text-sm text-surface-600">
                      <Clock className="w-4 h-4 text-surface-400" />
                      Needed by: {new Date(req.requiredBy).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="border-t border-surface-100 pt-4 flex justify-between items-center">
                  <span className="text-xs text-surface-400">Posted {new Date(req.createdAt).toLocaleDateString()}</span>
                  <Link 
                    to={`/blood/requests/${req._id}`} 
                    className="flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    View Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
