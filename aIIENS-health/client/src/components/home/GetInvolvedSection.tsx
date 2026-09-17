import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Heart, Droplet, UserPlus, Megaphone, Handshake, Tent } from 'lucide-react';

export function GetInvolvedSection() {
  const actions = [
    { title: "Donate to a Case", desc: "Fund a verified medical treatment.", icon: <Heart className="w-6 h-6 text-brand-600" />, link: "/fundraisers" },
    { title: "Donate Blood", desc: "Respond to live emergency requests.", icon: <Droplet className="w-6 h-6 text-red-600" />, link: "/blood" },
    { title: "Volunteer", desc: "Help verify cases or manage camps on the ground.", icon: <UserPlus className="w-6 h-6 text-emerald-600" />, link: "/volunteer" },
    { title: "Fundraise", desc: "Start a campaign for someone you know.", icon: <Megaphone className="w-6 h-6 text-blue-600" />, link: "/fundraisers/create" },
    { title: "Partner With Us", desc: "Corporate CSR and NGO collaborations.", icon: <Handshake className="w-6 h-6 text-purple-600" />, link: "/partner" },
    { title: "Host a Camp", desc: "Bring a free medical camp to your locality.", icon: <Tent className="w-6 h-6 text-orange-600" />, link: "/camps/host" }
  ];

  return (
    <section className="py-24 bg-surface-50">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-surface-900 mb-6 tracking-tight">
            There Are Many Ways to Help.
          </h2>
          <p className="text-lg text-surface-600 leading-relaxed">
            Whether you have money, time, or resources, you can be part of the solution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {actions.map((action, index) => (
            <Link key={index} to={action.link} className="block group">
              <Card className="h-full border-surface-200 hover:border-brand-300 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                <CardContent className="p-8 flex items-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-surface-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 mb-1 group-hover:text-brand-400 transition-colors">{action.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{action.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
