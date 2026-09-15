import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campApi } from '@/api/campApi';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/context/AuthContext';
import { MapPin, Calendar, Users, Stethoscope, ArrowLeft, HeartPulse, Hospital, Clock } from 'lucide-react';

export default function CampDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [showRegistration, setShowRegistration] = useState(false);
  const [regName, setRegName] = useState(user?.name || '');
  const [regAge, setRegAge] = useState('');
  const [regGender, setRegGender] = useState('');
  const [regPhone, setRegPhone] = useState('');

  const { data: camp, isLoading, isError } = useQuery({
    queryKey: ['camp', id],
    queryFn: () => campApi.getCampDetails(id!),
    enabled: !!id
  });

  const registerMutation = useMutation({
    mutationFn: () => campApi.registerForCamp(id!, {
      registrantName: regName,
      registrantAge: Number(regAge),
      registrantGender: regGender,
      contactPhone: regPhone,
      servicesRequested: camp.services
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['camp', id] });
      setShowRegistration(false);
      alert('Successfully registered for the camp!');
    }
  });

  if (isLoading) return <div className="min-h-screen pt-24 pb-16 flex justify-center"><Spinner size="lg" /></div>;
  if (isError || !camp) return <div className="min-h-screen pt-24 pb-16 px-4"><Alert variant="error">Camp not found.</Alert></div>;

  const isFull = camp.registeredCount >= camp.capacity;
  const isOpen = camp.status === 'REGISTRATION_OPEN';

  return (
    <div className="min-h-screen bg-surface-50 pt-24 pb-16 px-4 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <Link to="/camps" className="inline-flex items-center gap-2 text-brand-600 font-medium hover:text-brand-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Camps
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-surface-200 overflow-hidden relative">
          
          <div className="p-8 md:p-12 border-b border-surface-100">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 mb-6">
              <div>
                <Badge variant="brand" className="mb-4">FREE MEDICAL CAMP</Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4 leading-tight">{camp.title}</h1>
                <p className="text-surface-600 text-lg max-w-3xl leading-relaxed">{camp.description}</p>
              </div>
              <div className="bg-surface-50 rounded-2xl p-5 border border-surface-200 text-center min-w-[200px]">
                <p className="text-sm text-surface-500 font-bold uppercase tracking-wider mb-1">Available Spots</p>
                <p className={`text-4xl font-black ${isFull ? 'text-red-500' : 'text-emerald-600'}`}>
                  {Math.max(0, camp.capacity - camp.registeredCount)}
                </p>
                <p className="text-xs text-surface-400 mt-2">Total Capacity: {camp.capacity}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {camp.services.map((svc: string) => (
                <span key={svc} className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-sm font-medium border border-brand-100">
                  {svc.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12 border-r border-surface-100">
              <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-surface-900">
                <Calendar className="w-5 h-5 text-brand-500" /> Date & Time
              </h3>
              <div className="space-y-4 text-surface-700">
                <div>
                  <p className="text-sm text-surface-500">Date</p>
                  <p className="font-bold text-lg">{new Date(camp.startDate).toLocaleDateString()} - {new Date(camp.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-surface-500">Timings</p>
                  <p className="font-bold">{camp.timings}</p>
                </div>
              </div>

              <h3 className="font-bold text-xl mb-6 mt-10 flex items-center gap-2 text-surface-900">
                <MapPin className="w-5 h-5 text-brand-500" /> Location
              </h3>
              <div className="space-y-2 text-surface-700">
                <p className="font-bold text-lg">{camp.location.venue}</p>
                <p>{camp.location.address}</p>
                <p>{camp.location.city}, {camp.location.state} - {camp.location.pincode}</p>
              </div>
            </div>

            <div className="p-8 md:p-12 bg-surface-50 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-surface-900">
                  <Hospital className="w-5 h-5 text-brand-500" /> Medical Provider
                </h3>
                <div className="bg-white rounded-2xl p-5 border border-surface-200 shadow-sm mb-8">
                  <p className="font-bold text-lg text-surface-900 mb-1">{camp.provider.name}</p>
                  <p className="text-sm text-surface-600 mb-4">Registration No: {camp.provider.registrationNumber || 'N/A'}</p>
                  
                  <p className="text-sm text-surface-500">Coordinator</p>
                  <p className="font-medium text-surface-800">{camp.provider.contactName}</p>
                </div>
              </div>

              <div>
                {!user ? (
                  <div className="bg-white p-6 rounded-2xl border border-surface-200 text-center">
                    <p className="text-surface-600 mb-4">Please log in to register for this camp.</p>
                    <Link to="/login">
                      <Button className="w-full">Log In to Register</Button>
                    </Link>
                  </div>
                ) : !isOpen ? (
                   <Alert variant="warning" className="text-center">Registration is not currently open for this camp.</Alert>
                ) : isFull ? (
                  <Alert variant="error" className="text-center">Camp has reached maximum capacity.</Alert>
                ) : showRegistration ? (
                  <div className="bg-white p-6 rounded-2xl border border-brand-200 shadow-md">
                    <h4 className="font-bold mb-4">Patient Details</h4>
                    <form onSubmit={(e) => { e.preventDefault(); registerMutation.mutate(); }} className="space-y-4">
                      <Input label="Patient Name" value={regName} onChange={e => setRegName(e.target.value)} required />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Age" type="number" value={regAge} onChange={e => setRegAge(e.target.value)} required />
                        <Select label="Gender" value={regGender} onChange={e => setRegGender(e.target.value)} options={[{value:'', label:'Select'}, {value:'male', label:'Male'}, {value:'female', label:'Female'}, {value:'other', label:'Other'}]} required />
                      </div>
                      <Input label="Phone" value={regPhone} onChange={e => setRegPhone(e.target.value)} required />
                      
                      {registerMutation.isError && <Alert variant="error">{(registerMutation.error as any)?.response?.data?.message || 'Registration failed'}</Alert>}
                      
                      <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setShowRegistration(false)}>Cancel</Button>
                        <Button type="submit" className="flex-1" disabled={registerMutation.isPending}>
                          {registerMutation.isPending ? 'Confirming...' : 'Confirm'}
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <Button size="lg" className="w-full text-lg h-14" onClick={() => setShowRegistration(true)}>
                    Register Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
