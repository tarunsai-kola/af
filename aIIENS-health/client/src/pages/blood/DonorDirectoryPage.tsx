import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { donorApi } from '@/api/donorApi';
import { Spinner } from '@/components/ui/Spinner';
import { Select } from '@/components/ui/Select';
import { Search, MapPin, HeartPulse, Droplet } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function DonorDirectoryPage() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['donors', bloodGroup, pincode, city],
    queryFn: () => donorApi.searchDonors({ bloodGroup, pincode, city, limit: 30 })
  });

  return (
    <div className="min-h-screen bg-surface-50 pt-24 pb-16 px-4 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <HeartPulse className="w-12 h-12 text-brand-500 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">Voluntary Donor Directory</h1>
          <p className="text-surface-600 text-lg">
            Search our network of registered voluntary donors. Filter by blood group and location to find available donors near you.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-surface-200 p-4 mb-10 flex flex-col md:flex-row gap-4">
          <div className="md:w-1/4">
            <Select
              label=""
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              options={[{ value: '', label: 'All Blood Groups' }, ...BLOOD_GROUPS.map(g => ({ value: g, label: g }))]}
            />
          </div>
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-3 text-surface-400" />
            <input
              type="text"
              placeholder="Filter by City..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-surface-50"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="relative md:w-1/4">
            <MapPin className="w-5 h-5 absolute left-4 top-3 text-surface-400" />
            <input
              type="text"
              placeholder="Pincode"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-surface-50"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
        ) : isError ? (
          <div className="text-center text-red-500 py-12">Failed to load directory.</div>
        ) : data?.data.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-surface-200">
            <Droplet className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-surface-900 mb-2">No donors found</h3>
            <p className="text-surface-500">Try broadening your search criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data.map((donor: any) => (
              <div key={donor._id} className="bg-white rounded-2xl p-6 border border-surface-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center font-black text-2xl border border-rose-100">
                        {donor.bloodGroup}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-surface-900">{donor.userId?.name}</h3>
                        <Badge variant="success" className="mt-1">{donor.availability.toUpperCase()}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-surface-600">
                      <MapPin className="w-4 h-4 text-surface-400" />
                      {donor.contact.city} - {donor.contact.pincode}
                    </div>
                  </div>
                </div>
                
                <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 text-center">
                  <p className="text-xs text-brand-600 font-bold mb-1 uppercase tracking-wider">Contact Number</p>
                  <p className="text-lg font-black text-brand-800">{donor.userId?.phone || donor.contact?.emergencyContactPhone || 'Not Provided'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
