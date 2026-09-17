import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, MapPin, Stethoscope, Users } from 'lucide-react';

export function MedicalCampsSection() {
  const camps = [
    {
      id: 1,
      title: "Comprehensive Eye Checkup Camp",
      date: "Oct 15, 2026",
      time: "09:00 AM - 04:00 PM",
      location: "Community Hall, Malkajgiri",
      services: ["Eye Screening", "Free Spectacles", "Cataract Referrals"],
      image: "/images/medical-camp.jpg"
    },
    {
      id: 2,
      title: "Pediatric Health & Nutrition Drive",
      date: "Oct 18, 2026",
      time: "10:00 AM - 02:00 PM",
      location: "Govt School, Bolarum",
      services: ["General Checkup", "Vaccination Info", "Nutrition Kits"],
      image: "/images/medical-camp.jpg"
    }
  ];

  return (
    <section className="py-24 bg-surface-50 border-b border-surface-100">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          
          <div className="lg:w-1/3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-6">
              <Stethoscope className="w-4 h-4" />
              Community Health
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-6 leading-tight">
              Healthcare Should Reach People Where They Are.
            </h2>
            <p className="text-lg text-surface-600 mb-8 leading-relaxed">
              We organize free, verified medical camps in underserved areas in collaboration with top healthcare professionals and local NGOs.
            </p>
            <div className="space-y-4">
              <Link to="/camps">
                <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Find a Camp Near You</Button>
              </Link>
              <Link to="/camps/host">
                <Button size="lg" variant="outline" className="w-full border-brand-600 text-brand-600 hover:bg-brand-50 hover:text-brand-700">Partner to Host a Camp</Button>
              </Link>
            </div>
          </div>

          <div className="lg:w-2/3 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {camps.map(camp => (
                <Card key={camp.id} className="overflow-hidden hover:shadow-xl transition-shadow border-surface-200 flex flex-col">
                  <div className="h-48 bg-surface-200 relative">
                    <img 
                      src={camp.image} 
                      alt={camp.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur text-surface-900 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      {camp.date}
                    </div>
                  </div>
                  
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <h3 className="font-bold text-xl text-slate-100 mb-4 line-clamp-2">
                      {camp.title}
                    </h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                        <div>
                          <p className="text-sm text-slate-100">{camp.location}</p>
                          <p className="text-xs text-slate-400">{camp.time}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-slate-400 shrink-0" />
                        <div className="flex flex-wrap gap-2">
                          {camp.services.map((service, idx) => (
                            <span key={idx} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>


                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
