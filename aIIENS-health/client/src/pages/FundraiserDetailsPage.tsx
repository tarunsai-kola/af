import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { campaignApi } from '@/api/campaignApi';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DonationModal } from '@/components/campaign/DonationModal';
import { HeartPulse, MapPin, ShieldCheck, Share2, AlertTriangle, Clock, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function FundraiserDetailsPage() {
  const { id: slug } = useParams<{ id: string }>(); // Using 'id' param from router, but it's actually the slug
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  const { data: campaign, isLoading, isError } = useQuery({
    queryKey: ['campaign', slug],
    queryFn: () => campaignApi.getCampaignDetails(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="min-h-screen bg-surface-50 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/fundraisers" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to all fundraisers
          </Link>
          <Alert variant="error" title="Campaign Not Found">
            The campaign you are looking for does not exist, has ended, or is currently under medical review.
          </Alert>
        </div>
      </div>
    );
  }

  const progress = Math.min((campaign.raisedAmount / campaign.goal) * 100, 100);

  return (
    <div className="bg-surface-50 min-h-screen pb-20">
      
      {/* Top Banner */}
      <div className="bg-brand-900 pt-20 pb-32">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link to="/fundraisers" className="inline-flex items-center gap-2 text-brand-200 hover:text-white font-medium mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to fundraisers
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="success" className="bg-emerald-500 text-white border-none shadow-sm flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Medically Verified
            </Badge>
            <Badge variant="brand" className="border-none bg-brand-700 text-brand-100">
              {campaign.caseId.diagnosisCategory.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
            {campaign.title}
          </h1>
          <p className="text-lg md:text-xl text-brand-100 max-w-3xl leading-relaxed">
            {campaign.summary}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 max-w-5xl -mt-20">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column (Story & Details) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Cover Image */}
            <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden aspect-[16/9]">
              {campaign.coverImageKey ? (
                <img 
                  src={`/api/media/${campaign.coverImageKey}`} 
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-surface-100 flex items-center justify-center">
                  <HeartPulse className="w-20 h-20 text-surface-300" />
                </div>
              )}
            </div>

            {/* Quick Info Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-lg">
                  {campaign.caseId.patientName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-surface-500">Patient</p>
                  <p className="font-bold text-surface-900">{campaign.caseId.patientName}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-surface-200 hidden sm:block"></div>
              <div>
                <p className="text-sm text-surface-500">Age & Gender</p>
                <p className="font-medium text-surface-900">{campaign.caseId.patientAge} years, {campaign.caseId.patientGender}</p>
              </div>
              <div className="w-px h-8 bg-surface-200 hidden sm:block"></div>
              {campaign.caseId.hospitalId?.name && (
                <div>
                  <p className="text-sm text-surface-500 flex items-center gap-1"><MapPin className="w-3 h-3"/> Hospital</p>
                  <p className="font-medium text-surface-900">{campaign.caseId.hospitalId.name}</p>
                </div>
              )}
            </div>

            {/* Story */}
            <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-surface-900 mb-6 border-b border-surface-100 pb-4">
                The Story
              </h2>
              <div className="prose prose-brand max-w-none text-surface-700 leading-relaxed whitespace-pre-wrap">
                {campaign.story}
              </div>
              
              <div className="mt-8 pt-6 border-t border-surface-100">
                <h3 className="font-bold text-surface-900 mb-3">Medical Diagnosis</h3>
                <p className="text-surface-700">{campaign.caseId.diagnosisDescription}</p>
              </div>
            </div>

            {/* Cost Breakdown */}
            {campaign.caseId.costBreakdown && campaign.caseId.costBreakdown.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-surface-900 mb-6 border-b border-surface-100 pb-4">
                  Estimated Cost Breakdown
                </h2>
                <div className="space-y-3">
                  {campaign.caseId.costBreakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-surface-50 last:border-0">
                      <span className="text-surface-700">{item.category}</span>
                      <span className="font-medium text-surface-900">₹{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 font-bold text-lg">
                    <span className="text-surface-900">Total Goal</span>
                    <span className="text-brand-700">₹{campaign.goal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Donation Card - Sticky) */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-surface-200 p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-brand-500"></div>
              
              <div className="mb-6">
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold text-surface-900">₹{campaign.raisedAmount.toLocaleString()}</span>
                  <span className="text-surface-500 font-medium mb-1">raised</span>
                </div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-surface-500">Target: ₹{campaign.goal.toLocaleString()}</span>
                  <span className="text-brand-600">{Math.round(progress)}%</span>
                </div>
                <ProgressBar progress={progress} max={100} className="h-3" />
              </div>

              <div className="flex justify-between text-sm text-surface-500 font-medium mb-8">
                <span className="flex items-center gap-1.5"><HeartPulse className="w-4 h-4"/> {campaign.donorCount} Donations</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {campaign.publishedAt ? Math.max(0, Math.floor((Date.now() - new Date(campaign.publishedAt).getTime()) / (1000 * 60 * 60 * 24))) : 0} days active</span>
              </div>

              <Button 
                size="lg" 
                className="w-full text-lg mb-4 h-14 shadow-md hover:shadow-lg transition-shadow"
                onClick={() => setIsDonationModalOpen(true)}
              >
                Donate Now
              </Button>
              
              <Button variant="outline" size="lg" className="w-full text-surface-700 border-surface-200 flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" /> Share this campaign
              </Button>

              <div className="mt-6 pt-6 border-t border-surface-100">
                <div className="flex items-start gap-3 bg-emerald-50 text-emerald-800 p-4 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium leading-relaxed">
                    <strong>AIIENS Guarantee:</strong> 100% of your donation is settled directly to the hospital's verified bank account for the patient's treatment.
                  </p>
                </div>
              </div>
            </div>

            {/* Urgency Alert */}
            {['high', 'critical'].includes(campaign.caseId.urgency) && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex gap-3 text-rose-800 shadow-sm">
                <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 text-rose-600" />
                <div>
                  <h4 className="font-bold mb-1">Urgent Need</h4>
                  <p className="text-sm opacity-90">This patient requires immediate medical intervention. Your timely support can make a life-saving difference.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {campaign && (
        <DonationModal 
          isOpen={isDonationModalOpen} 
          onClose={() => setIsDonationModalOpen(false)} 
          campaignId={campaign._id} 
          campaignTitle={campaign.title} 
        />
      )}
    </div>
  );
}
