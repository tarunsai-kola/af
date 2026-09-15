import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Calendar, MapPin, Clock, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CampDetailsPage() {
  const { id } = useParams();

  // Mock data for the specific camp
  const camp = {
    id: id,
    title: 'Free Health Camp — Hyderabad',
    description: 'A free community health camp offering general checkups, blood tests, BP/sugar screening, and eye checkups. Open to all residents of Banjara Hills and surrounding areas.',
    hospital: 'Apollo Multispeciality Hospital',
    providerName: 'Aarogya Foundation',
    date: 'Oct 15, 2026',
    time: '09:00 AM – 04:00 PM',
    location: 'Community Hall, 5th Road, Banjara Hills, Hyderabad, Telangana 500034',
    services: ['General Checkup', 'Blood Test', 'BP/Sugar Screening', 'Eye Checkup'],
    registered: 67,
    capacity: 200,
    status: 'Upcoming'
  };

  return (
    <div className="animate-fade-in pb-20">
      <div className="bg-surface-50 border-b border-surface-200 pt-12 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <Link to="/camps" className="text-sm font-medium text-brand-600 hover:text-brand-700 mb-6 inline-block">
            ← Back to All Camps
          </Link>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider mb-4">
              {camp.status}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-surface-900 mb-4 leading-tight">
              {camp.title}
            </h1>
            <p className="text-lg text-surface-600 mb-8 max-w-2xl leading-relaxed">
              {camp.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2 font-medium text-surface-900 bg-white px-4 py-2 rounded-xl shadow-sm border border-surface-200">
                <ShieldCheck className="w-5 h-5 text-brand-500" />
                Verified Hospital: {camp.hospital}
              </div>
              <div className="flex items-center gap-2 font-medium text-surface-700">
                <span>Organized by:</span>
                <span className="text-surface-900">{camp.providerName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-surface-900 mb-6">Services Offered</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {camp.services.map((service, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-surface-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-medium text-surface-900">{service}</span>
                  </div>
                ))}
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-surface-900 mb-6">About This Camp</h2>
              <div className="prose prose-surface max-w-none text-surface-700">
                <p>
                  Early detection and routine checkups are vital for maintaining good health. This free medical camp is organized to provide essential healthcare services to the community at zero cost. 
                </p>
                <p>
                  Our team of specialist doctors and nurses from {camp.hospital} will be present to conduct thorough examinations, provide necessary medications, and advise on further treatments if required. Please bring any past medical records if you have them.
                </p>
              </div>
            </section>
          </div>

          <div>
            <Card className="sticky top-28 border-brand-100 shadow-xl shadow-brand-500/5">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl text-surface-900 mb-6">Camp Details</h3>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <p className="text-sm text-surface-500 font-medium">Date</p>
                      <p className="font-medium text-surface-900">{camp.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <p className="text-sm text-surface-500 font-medium">Timing</p>
                      <p className="font-medium text-surface-900">{camp.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <p className="text-sm text-surface-500 font-medium">Location</p>
                      <p className="font-medium text-surface-900 leading-tight">{camp.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <p className="text-sm text-surface-500 font-medium">Availability</p>
                      <p className="font-medium text-surface-900">{camp.capacity - camp.registered} spots left</p>
                    </div>
                  </div>
                </div>

                {camp.status === 'Upcoming' ? (
                  <Button className="w-full py-6 text-lg" variant="primary">
                    Register for Camp
                  </Button>
                ) : (
                  <Alert variant="info">This camp has already concluded.</Alert>
                )}
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}
