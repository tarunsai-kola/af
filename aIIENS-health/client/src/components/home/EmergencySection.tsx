import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CheckCircle2, Share2, AlertCircle } from 'lucide-react';

export function EmergencySection() {
  const campaigns = [
    {
      id: "1",
      title: "Child needs urgent cardiac surgery",
      hospital: "Apollo Multispeciality Hospital",
      raised: 640000,
      goal: 1000000,
      image: "/images/medical-fundraising.jpg",
      verified: true
    },
    {
      id: "2",
      title: "Emergency dialysis support for severe kidney failure",
      hospital: "Government District Hospital",
      raised: 45000,
      goal: 120000,
      image: "/images/medical-fundraising.jpg",
      verified: true
    },
    {
      id: "3",
      title: "Support for premature twins in NICU",
      hospital: "Care Hospitals",
      raised: 210000,
      goal: 500000,
      image: "/images/medical-fundraising.jpg",
      verified: true
    }
  ];

  return (
    <section className="py-20 bg-surface-50">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-4">
              <AlertCircle className="w-4 h-4" />
              Urgent Medical Cases
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">
              Someone Needs Help Today
            </h2>
            <p className="text-lg text-surface-600">
              These verified cases require immediate financial assistance to proceed with critical medical treatments.
            </p>
          </div>
          <Link to="/fundraisers">
            <Button variant="outline" className="hidden md:flex">View All Campaigns</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map(campaign => (
            <Card key={campaign.id} className="overflow-hidden hover:shadow-xl transition-shadow border-surface-200 flex flex-col">
              <div className="h-56 bg-surface-200 relative">
                <img 
                  src={campaign.image} 
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-md uppercase tracking-wider shadow-sm">
                  Urgent
                </div>
              </div>
              
              <CardContent className="p-6 flex flex-col flex-grow">
                <p className="text-xs font-semibold text-brand-600 mb-2 uppercase tracking-wider">Medical Fundraiser</p>
                <h3 className="font-bold text-xl text-surface-900 mb-4 line-clamp-2 leading-tight">
                  {campaign.title}
                </h3>
                
                <div className="bg-emerald-50 rounded-lg p-4 mb-6 border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-800 mb-2 uppercase">Verified By AIIENS</p>
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2 text-sm text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> <span>Hospital Identity ({campaign.hospital})</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> <span>Medical Documents</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> <span>Treatment Estimate</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-auto">
                  <ProgressBar progress={campaign.raised} max={campaign.goal} className="mb-3" />
                  <div className="flex justify-between items-center text-sm mb-6">
                    <div>
                      <span className="font-bold text-surface-900 text-lg">₹{(campaign.raised).toLocaleString()}</span>
                      <span className="text-surface-500"> raised</span>
                    </div>
                    <div className="text-surface-500 font-medium">of ₹{(campaign.goal).toLocaleString()}</div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Link to={`/fundraisers/${campaign.id}`} className="flex-1">
                      <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white">Donate Now</Button>
                    </Link>
                    <Button variant="outline" className="shrink-0 w-12 h-12 p-0 flex items-center justify-center">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 md:hidden">
          <Link to="/fundraisers">
            <Button variant="outline" className="w-full">View All Campaigns</Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
