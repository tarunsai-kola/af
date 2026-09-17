import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Search, Eye, HandCoins, Activity, UploadCloud, FileSearch, Target, Building } from 'lucide-react';

export function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState<'donor' | 'applicant'>('donor');

  const donorSteps = [
    { title: "Discover", description: "Find verified cases needing urgent help.", icon: <Search className="w-6 h-6 text-brand-400" />, image: "/images/programs/medical-fundraising.jpg" },
    { title: "Understand", description: "Read authenticated medical documents.", icon: <Eye className="w-6 h-6 text-brand-400" />, image: "/images/programs/medical-camps.jpg" },
    { title: "Contribute", description: "Donate securely via multiple options.", icon: <HandCoins className="w-6 h-6 text-brand-400" />, image: "/images/programs/blood-donation.jpg" },
    { title: "Track", description: "Get updates on the patient's recovery.", icon: <Activity className="w-6 h-6 text-brand-400" />, image: "/images/programs/medical-fundraising.jpg" }
  ];

  const applicantSteps = [
    { title: "Submit Case", description: "Upload medical and identity documents.", icon: <UploadCloud className="w-6 h-6 text-emerald-400" />, image: "/images/programs/medical-fundraising.jpg" },
    { title: "Verification", description: "Our team verifies with the hospital.", icon: <FileSearch className="w-6 h-6 text-emerald-400" />, image: "/images/programs/medical-camps.jpg" },
    { title: "Goal Setup", description: "A transparent fundraiser is created.", icon: <Target className="w-6 h-6 text-emerald-400" />, image: "/images/programs/blood-donation.jpg" },
    { title: "Funds Settled", description: "Amount is paid directly to the hospital.", icon: <Building className="w-6 h-6 text-emerald-400" />, image: "/images/programs/medical-fundraising.jpg" }
  ];

  const currentSteps = activeTab === 'donor' ? donorSteps : applicantSteps;
  const activeColor = activeTab === 'donor' ? 'bg-brand-600 text-white' : 'bg-emerald-600 text-white';

  return (
    <section className="py-24 bg-surface-50">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-surface-900 mb-6 tracking-tight">
            How It Works
          </h2>
          <p className="text-lg text-surface-600 leading-relaxed mb-8">
            A transparent, efficient process designed to maximize impact and maintain complete trust.
          </p>

          <div className="inline-flex p-1 bg-surface-200 rounded-xl overflow-hidden">
            <button 
              onClick={() => setActiveTab('donor')}
              className={`px-8 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${activeTab === 'donor' ? 'bg-white text-brand-600 shadow-sm' : 'text-surface-600 hover:text-surface-900'}`}
            >
              For Donors
            </button>
            <button 
              onClick={() => setActiveTab('applicant')}
              className={`px-8 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${activeTab === 'applicant' ? 'bg-white text-emerald-600 shadow-sm' : 'text-surface-600 hover:text-surface-900'}`}
            >
              For Applicants
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentSteps.map((step, index) => (
              <Card key={index} className="border-none shadow-lg overflow-hidden relative group hover:-translate-y-1 transition-all duration-500">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${step.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900/95 via-surface-900/80 to-surface-900/40 group-hover:from-surface-900/90 transition-all duration-500" />
                
                <CardContent className="relative p-8 text-center flex flex-col items-center z-10">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 bg-white/10 backdrop-blur-md shadow-sm border border-white/20 group-hover:-translate-y-2 transition-transform duration-500`}>
                    {step.icon}
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${activeColor}`}>
                      {index + 1}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-brand-300 transition-colors">{step.title}</h3>
                  </div>
                  <p className="text-slate-300 text-sm font-medium">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
