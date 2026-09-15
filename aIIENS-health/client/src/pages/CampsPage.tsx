import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react';

const MOCK_CAMPS = [
  {
    id: '1',
    title: 'Free Health Camp — Hyderabad',
    hospital: 'Apollo Multispeciality Hospital',
    date: 'Oct 15, 2026',
    time: '09:00 AM – 04:00 PM',
    location: 'Community Hall, Banjara Hills, Hyderabad',
    services: ['General Checkup', 'Blood Test', 'Eye Checkup'],
    registered: 67,
    capacity: 200,
    status: 'Upcoming'
  },
  {
    id: '2',
    title: 'Child Vaccination Drive — Nagpur',
    hospital: 'Government District Hospital',
    date: 'Sep 10, 2026',
    time: '08:00 AM – 02:00 PM',
    location: 'Municipal School Ground, Nagpur',
    services: ['Vaccination', 'Pediatric Checkup'],
    registered: 143,
    capacity: 150,
    status: 'Completed'
  }
];

export default function CampsPage() {
  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-sm font-medium text-brand-700 mb-4">
            <Calendar className="w-4 h-4" />
            Free Medical Camps
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">
            Community Health Camps
          </h1>
          <p className="text-lg text-surface-600">
            AIIENS Health partners with verified hospitals and NGOs to organize free medical camps in communities that need them most.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CAMPS.map(camp => (
          <Card key={camp.id} className="hover:shadow-lg transition-shadow border-surface-200 overflow-hidden flex flex-col">
            <div className={`h-2 ${camp.status === 'Upcoming' ? 'bg-brand-500' : 'bg-surface-300'}`}></div>
            <CardContent className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <div className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                  camp.status === 'Upcoming' ? 'bg-brand-50 text-brand-700' : 'bg-surface-100 text-surface-600'
                }`}>
                  {camp.status}
                </div>
              </div>
              
              <h3 className="font-bold text-xl text-surface-900 mb-2 line-clamp-2">
                {camp.title}
              </h3>
              <p className="text-sm text-surface-600 mb-6 font-medium">
                By {camp.hospital}
              </p>

              <div className="space-y-3 mb-8 flex-grow">
                <div className="flex items-start gap-3 text-sm text-surface-700">
                  <Calendar className="w-5 h-5 text-brand-500 shrink-0" />
                  <div>
                    <span className="font-medium">{camp.date}</span>
                    <span className="block text-surface-500">{camp.time}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm text-surface-700">
                  <MapPin className="w-5 h-5 text-brand-500 shrink-0" />
                  <span className="line-clamp-2">{camp.location}</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-surface-700">
                  <Users className="w-5 h-5 text-brand-500 shrink-0" />
                  <span>{camp.registered} / {camp.capacity} Registered</span>
                </div>
              </div>

              <Link to={`/camps/${camp.id}`} className="mt-auto">
                <Button className="w-full" variant={camp.status === 'Upcoming' ? 'primary' : 'outline'}>
                  {camp.status === 'Upcoming' ? 'Register Now' : 'View Details'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
