import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { 
  Heart, ShieldCheck, Activity, Users, Droplet, 
  Calendar, ArrowRight, HeartHandshake, CheckCircle2 
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="animate-fade-in pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center pt-24 pb-32">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-surface-950/90 via-surface-900/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-sm font-medium mb-6 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4" />
              Verified Non-Profit Healthcare Platform
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              Connecting Communities to <span className="text-brand-400">Save Lives.</span>
            </h1>
            <p className="text-lg md:text-xl text-surface-200 mb-10 leading-relaxed max-w-2xl">
              AIIENS Health bridges the gap between those in medical need and those who want to help. 100% transparent fundraising, emergency blood requests, and free health camps.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/fundraisers">
                <Button size="lg" variant="primary" className="w-full sm:w-auto px-10 py-7 text-lg rounded-2xl shadow-2xl shadow-brand-500/30 hover:scale-105 transition-transform bg-brand-600 hover:bg-brand-500 text-white font-bold border-none">
                  Donate Now
                </Button>
              </Link>
              <Link to="/fundraisers/create">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-10 py-7 text-lg rounded-2xl bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-md hover:scale-105 transition-transform font-bold">
                  Start a Fundraiser
                </Button>
              </Link>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-16 flex items-center gap-8 text-surface-300">
              <div>
                <p className="text-3xl font-black text-white">₹1.2 Cr+</p>
                <p className="text-sm font-medium tracking-wide uppercase mt-1">Total Raised</p>
              </div>
              <div className="w-px h-12 bg-surface-700"></div>
              <div>
                <p className="text-3xl font-black text-white">5,000+</p>
                <p className="text-sm font-medium tracking-wide uppercase mt-1">Donors Registered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SIX MAJOR MODULES */}
      <section className="container mx-auto px-4 md:px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <ModuleCard 
            title="Blood Hub" 
            desc="Find or request emergency blood across verified hospitals." 
            icon={<Droplet className="w-6 h-6 text-white" />} 
            link="/blood" 
            bgGradient="bg-gradient-to-br from-red-500 via-rose-600 to-red-800" 
          />
          <ModuleCard 
            title="Medical Camps" 
            desc="Discover free upcoming health camps in your community." 
            icon={<Calendar className="w-6 h-6 text-white" />} 
            link="/camps" 
            bgGradient="bg-gradient-to-br from-blue-500 via-brand-600 to-indigo-800" 
          />
          <ModuleCard 
            title="Community Impact" 
            desc="See how your contributions are saving lives transparently." 
            icon={<Activity className="w-6 h-6 text-white" />} 
            link="/impact" 
            bgGradient="bg-gradient-to-br from-purple-500 via-fuchsia-600 to-purple-900" 
          />
          <ModuleCard 
            title="Medical Fundraising" 
            desc="Support verified patients needing urgent surgical care." 
            icon={<Heart className="w-6 h-6 text-white" />} 
            link="/fundraisers" 
            bgGradient="bg-gradient-to-br from-rose-400 via-pink-600 to-rose-800" 
          />
          <ModuleCard 
            title="Become a Donor" 
            desc="Register as a blood donor and get notified in emergencies." 
            icon={<Users className="w-6 h-6 text-white" />} 
            link="/blood/become-donor" 
            bgGradient="bg-gradient-to-br from-cyan-500 via-blue-600 to-blue-900" 
          />
          <ModuleCard 
            title="Start a Fundraiser" 
            desc="Create a campaign for a verified hospital patient." 
            icon={<HeartHandshake className="w-6 h-6 text-white" />} 
            link="/fundraisers/create" 
            bgGradient="bg-gradient-to-br from-emerald-500 via-teal-600 to-green-900" 
          />
        </div>
      </section>

      {/* 3. TRUST & VERIFICATION */}
      <section className="py-20 bg-white mt-12 border-b border-surface-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-6">
                100% Transparency. Zero Fraud.
              </h2>
              <p className="text-lg text-surface-600 mb-8 leading-relaxed">
                Unlike commercial platforms, AIIENS Health requires every campaign to be linked to a verified hospital. Funds are settled directly to the hospital's bank account, never to an individual.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-brand-500 shrink-0" />
                  <span className="text-surface-700">Strict hospital KYC and onboarding</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-brand-500 shrink-0" />
                  <span className="text-surface-700">Direct hospital settlements</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-brand-500 shrink-0" />
                  <span className="text-surface-700">Medical reviewer verification for every case</span>
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-surface-50 border border-surface-100 text-center">
                <p className="text-4xl font-bold text-brand-600 mb-2">50+</p>
                <p className="text-sm text-surface-600 font-medium">Verified Hospitals</p>
              </div>
              <div className="p-6 rounded-2xl bg-surface-50 border border-surface-100 text-center">
                <p className="text-4xl font-bold text-brand-600 mb-2">10k+</p>
                <p className="text-sm text-surface-600 font-medium">Lives Impacted</p>
              </div>
              <div className="p-6 rounded-2xl bg-surface-50 border border-surface-100 text-center">
                <p className="text-4xl font-bold text-brand-600 mb-2">0%</p>
                <p className="text-sm text-surface-600 font-medium">Platform Fee</p>
              </div>
              <div className="p-6 rounded-2xl bg-surface-50 border border-surface-100 text-center">
                <p className="text-4xl font-bold text-brand-600 mb-2">24/7</p>
                <p className="text-sm text-surface-600 font-medium">Fraud Monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED FUNDRAISERS */}
      <section className="py-20 bg-surface-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-surface-900 mb-2">Urgent Fundraisers</h2>
              <p className="text-surface-600">Verified cases needing immediate support.</p>
            </div>
            <Link to="/fundraisers" className="hidden sm:flex items-center gap-1 text-brand-600 font-medium hover:text-brand-700">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mock Fundraiser 1 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow border-surface-200">
              <div className="h-48 bg-surface-200 relative">
                {/* Mock Image Placeholder */}
                <div className="absolute inset-0 bg-slate-300 flex items-center justify-center text-slate-500">
                  Image
                </div>
                <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-md uppercase tracking-wide">
                  Critical
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-surface-900 mb-2 line-clamp-2">
                  Help Rajan Fight Heart Disease
                </h3>
                <p className="text-sm text-surface-600 mb-4 line-clamp-2">
                  Apollo Multispeciality Hospital, Hyderabad
                </p>
                <ProgressBar progress={185000} max={400000} className="mb-4" />
                <div className="flex justify-between items-center text-sm mb-6">
                  <div>
                    <span className="font-bold text-surface-900">₹1,85,000</span>
                    <span className="text-surface-500"> raised</span>
                  </div>
                  <div className="text-surface-500">of ₹4,00,000</div>
                </div>
                <Link to="/fundraisers/1">
                  <Button className="w-full">Donate Now</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Mock Fundraiser 2 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow border-surface-200">
              <div className="h-48 bg-surface-200 relative">
                <div className="absolute inset-0 bg-slate-300 flex items-center justify-center text-slate-500">
                  Image
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-surface-900 mb-2 line-clamp-2">
                  Baby Aanya Needs Eye Surgery
                </h3>
                <p className="text-sm text-surface-600 mb-4 line-clamp-2">
                  Government District Hospital, Nagpur
                </p>
                <ProgressBar progress={72000} max={80000} className="mb-4" colorClass="bg-emerald-500" />
                <div className="flex justify-between items-center text-sm mb-6">
                  <div>
                    <span className="font-bold text-surface-900">₹72,000</span>
                    <span className="text-surface-500"> raised</span>
                  </div>
                  <div className="text-surface-500">of ₹80,000</div>
                </div>
                <Link to="/fundraisers/2">
                  <Button className="w-full">Donate Now</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Mock Fundraiser 3 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow border-surface-200 hidden lg:block">
              <div className="h-48 bg-surface-200 relative">
                <div className="absolute inset-0 bg-slate-300 flex items-center justify-center text-slate-500">
                  Image
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-surface-900 mb-2 line-clamp-2">
                  Support Kidney Transplant for Amit
                </h3>
                <p className="text-sm text-surface-600 mb-4 line-clamp-2">
                  Care Hospitals, Pune
                </p>
                <ProgressBar progress={120000} max={600000} className="mb-4" />
                <div className="flex justify-between items-center text-sm mb-6">
                  <div>
                    <span className="font-bold text-surface-900">₹1,20,000</span>
                    <span className="text-surface-500"> raised</span>
                  </div>
                  <div className="text-surface-500">of ₹6,00,000</div>
                </div>
                <Link to="/fundraisers/3">
                  <Button className="w-full">Donate Now</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. BLOOD EMERGENCY */}
      <section className="py-20 bg-red-600 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-2/3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/50 border border-red-400 text-sm font-medium mb-4">
                <Droplet className="w-4 h-4" />
                Live Blood Requests
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Hospitals Need Blood Urgently.
              </h2>
              <p className="text-red-100 text-lg max-w-xl">
                There are currently 12 active emergency blood requests in your state. Register as a donor to receive alerts.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link to="/blood/requests">
                <Button className="w-full sm:w-auto bg-white text-red-600 hover:bg-red-50 border-none size-lg px-8">
                  View Requests
                </Button>
              </Link>
              <Link to="/blood/become-donor">
                <Button variant="outline" className="w-full sm:w-auto text-white border-red-400 hover:bg-red-500 size-lg px-8">
                  Register as Donor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

function ModuleCard({ title, desc, icon, link, bgGradient }: any) {
  return (
    <Link to={link}>
      <Card className={`h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-none cursor-pointer overflow-hidden group ${bgGradient} text-white relative`}>
        {/* Subtle glass overlay for depth */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
        <CardContent className="p-8 relative z-10 flex flex-col h-full">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300 shadow-lg border border-white/20">
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 group-hover:translate-x-1 transition-transform">{title}</h3>
          <p className="text-white/80 mb-8 flex-grow leading-relaxed group-hover:text-white transition-colors">{desc}</p>
          <div className="flex items-center text-white font-bold text-sm bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-all">
            Explore <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
