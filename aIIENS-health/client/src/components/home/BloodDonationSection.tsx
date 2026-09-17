import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Clock, Droplet, AlertTriangle } from 'lucide-react';

export function BloodDonationSection() {
  const requests = [
    { id: 1, type: "O Negative", hospital: "KIMS Hospital", location: "Secunderabad", urgency: "Critical - Required within 2 hours", distance: "4.2 km away" },
    { id: 2, type: "B Positive", hospital: "Apollo Hospital", location: "Jubilee Hills", urgency: "High - Required today", distance: "6.8 km away" },
    { id: 3, type: "A Positive", hospital: "NIMS", location: "Punjagutta", urgency: "Medium - Required tomorrow", distance: "2.1 km away" }
  ];

  return (
    <section className="py-24 bg-white border-b border-surface-100">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-4">
              <Droplet className="w-4 h-4 fill-current" />
              Live Blood Hub
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">
              Someone Near You May Need Your Blood.
            </h2>
            <p className="text-lg text-surface-600">
              Verified emergency blood requests direct from local hospitals. Your immediate action can save a life today.
            </p>
          </div>
          <Link to="/blood">
            <Button variant="outline" className="hidden md:flex">View All Requests</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {requests.map(req => (
            <Card key={req.id} className="border border-surface-200 hover:border-red-200 hover:shadow-lg transition-all overflow-hidden flex flex-col">
              <div className="h-2 bg-red-600 w-full"></div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Blood Type</p>
                    <div className="text-3xl font-bold text-red-500">{req.type}</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center text-red-500">
                    <Droplet className="w-6 h-6 fill-current" />
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-slate-100">{req.hospital}</p>
                      <p className="text-xs text-slate-400">{req.location} • {req.distance}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-slate-400 shrink-0" />
                    <p className="text-sm font-medium text-slate-100">{req.urgency}</p>
                  </div>
                </div>

                <Link to={`/blood/request/${req.id}`} className="mt-auto block">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">I Can Donate</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Medical Disclaimer:</strong> AIIENS Foundation is a coordinating platform, not a blood bank. All blood donations must occur directly at the verified hospital or registered blood center under professional medical supervision. Never donate blood for financial compensation.
          </p>
        </div>
        
        <div className="mt-8 md:hidden">
          <Link to="/blood">
            <Button variant="outline" className="w-full">View All Requests</Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
