import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { MapPin, Clock, Droplet, Search } from 'lucide-react';

const MOCK_REQUESTS = [
  {
    id: '1',
    hospital: 'Apollo Multispeciality Hospital',
    city: 'Hyderabad',
    bloodGroup: 'B+',
    units: 3,
    urgency: 'high',
    requiredBy: '2 Days',
    status: 'open'
  },
  {
    id: '2',
    hospital: 'Government District Hospital',
    city: 'Nagpur',
    bloodGroup: 'O+',
    units: 2,
    urgency: 'critical',
    requiredBy: 'Today',
    status: 'open'
  }
];

export default function BloodRequestsPage() {
  const [filter, setFilter] = useState('All');

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">Urgent Blood Requests</h1>
          <p className="text-surface-600 mt-2">Verified requests from registered hospitals.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select 
            options={[
              { value: 'All', label: 'All Blood Groups' },
              { value: 'A+', label: 'A+' },
              { value: 'B+', label: 'B+' },
              { value: 'O+', label: 'O+' },
              { value: 'AB+', label: 'AB+' },
              { value: 'O-', label: 'O-' },
            ]}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-48"
          />
          <Button variant="outline" className="hidden sm:flex">
            <Search className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {MOCK_REQUESTS.filter(r => filter === 'All' || r.bloodGroup === filter).map(request => (
          <Card key={request.id} className="border-red-100 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl border-2 border-red-200">
                    {request.bloodGroup}
                  </div>
                  <div>
                    <h3 className="font-bold text-surface-900 text-lg">{request.hospital}</h3>
                    <div className="flex items-center text-sm text-surface-500 mt-1">
                      <MapPin className="w-4 h-4 mr-1" /> {request.city}
                    </div>
                  </div>
                </div>
                <div className="px-2 py-1 bg-red-50 text-red-700 text-xs font-bold rounded uppercase">
                  {request.urgency}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-surface-100">
                <div className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-surface-400" />
                  <span className="text-sm font-medium text-surface-700">{request.units} Units Needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-surface-400" />
                  <span className="text-sm font-medium text-surface-700">Required: {request.requiredBy}</span>
                </div>
              </div>
              
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white border-none">
                I Can Donate
              </Button>
            </CardContent>
          </Card>
        ))}
        
        {MOCK_REQUESTS.filter(r => filter === 'All' || r.bloodGroup === filter).length === 0 && (
          <div className="col-span-2 text-center py-12 bg-surface-50 rounded-2xl border border-dashed border-surface-200">
            <p className="text-surface-500">No active requests for this blood group.</p>
          </div>
        )}
      </div>
    </div>
  );
}
