import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Droplet, HeartHandshake, AlertCircle } from 'lucide-react';

export default function BloodHubPage() {
  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Droplet className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-surface-900 mb-4">AIIENS Blood Hub</h1>
        <p className="text-lg text-surface-600">
          Connecting verified hospital blood requests directly with local donors. 
          No middlemen, no delays. Pure life-saving connections.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow border-surface-200">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-surface-900 mb-4">Live Blood Requests</h2>
            <p className="text-surface-600 mb-8">
              View urgent blood requirements posted by verified hospitals in your area. 
              Help save a life today.
            </p>
            <Link to="/blood/requests">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white border-none size-lg">
                View Urgent Requests
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-surface-200">
          <CardContent className="p-8 text-center">
            <HeartHandshake className="w-12 h-12 text-brand-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-surface-900 mb-4">Become a Donor</h2>
            <p className="text-surface-600 mb-8">
              Register to be a blood donor. You will receive notifications when a hospital near you needs your blood group urgently.
            </p>
            <Link to="/blood/become-donor">
              <Button className="w-full" size="lg">
                Register Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
