import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { HeartHandshake, Droplet, Stethoscope, BriefcaseMedical, Users, Network } from 'lucide-react';

export function MainProgramsSection() {
  const programs = [
    {
      title: "Medical Fundraising",
      description: "Verified campaigns for critical medical treatments. We ensure funds go directly to hospitals.",
      icon: <HeartHandshake className="w-8 h-8 text-brand-400" />,
      link: "/fundraisers",
      image: "/images/programs/medical-fundraising.jpg"
    },
    {
      title: "Blood Donation Hub",
      description: "Connecting verified hospital requests with willing donors in real-time.",
      icon: <Droplet className="w-8 h-8 text-red-400" />,
      link: "/blood",
      image: "/images/programs/blood-donation.jpg"
    },
    {
      title: "Free Medical Camps",
      description: "Taking healthcare to communities. Join or host our regular health screening camps.",
      icon: <Stethoscope className="w-8 h-8 text-emerald-400" />,
      link: "/camps",
      image: "/images/programs/medical-camps.jpg"
    },
    {
      title: "Healthcare Assistance",
      description: "Guidance for families navigating complex medical procedures and insurance claims.",
      icon: <BriefcaseMedical className="w-8 h-8 text-blue-400" />,
      link: "/assistance",
      image: "/images/programs/medical-fundraising.jpg"
    },
    {
      title: "Community Impact",
      description: "Small contributions from many people creating massive changes in local healthcare.",
      icon: <Users className="w-8 h-8 text-purple-400" />,
      link: "/impact",
      image: "/images/programs/blood-donation.jpg"
    },
    {
      title: "NGO Network",
      description: "Collaborating with established NGOs to amplify healthcare access across regions.",
      icon: <Network className="w-8 h-8 text-orange-400" />,
      link: "/ngo-network",
      image: "/images/programs/medical-camps.jpg"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-surface-900 mb-6 tracking-tight">
            How AIIENS Creates Impact
          </h2>
          <p className="text-lg text-surface-600 leading-relaxed">
            Our technology-enabled platform ensures transparency, efficiency, and scale in delivering healthcare assistance to those who need it most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {programs.map((program, index) => (
            <Link key={index} to={program.link} className="block group h-full">
              <Card 
                className="h-full border-none shadow-lg overflow-hidden relative group-hover:shadow-xl transition-all duration-500"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${program.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900/95 via-surface-900/80 to-surface-900/40 group-hover:from-surface-900/90 transition-all duration-500" />
                
                <CardContent className="relative p-8 md:p-10 h-full flex flex-col z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md shadow-sm flex items-center justify-center mb-auto group-hover:-translate-y-2 transition-transform duration-500 border border-white/20">
                    {program.icon}
                  </div>
                  <div className="mt-12">
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-brand-300 transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed font-medium">
                      {program.description}
                    </p>
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
