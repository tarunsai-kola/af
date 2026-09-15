import { Link } from 'react-router-dom';
import { PublicCampaign } from '@/api/campaignApi';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MapPin, ShieldCheck, Clock, HeartHandshake, Share2 } from 'lucide-react';

interface CampaignCardProps {
  campaign: PublicCampaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = Math.min((campaign.raisedAmount / campaign.goal) * 100, 100);
  
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'brand';
      default: return 'default';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'Critical Need';
      case 'high': return 'High Urgency';
      case 'medium': return 'Medium Urgency';
      default: return 'Standard';
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-surface-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full animate-fade-in-up">
      {/* Image Area */}
      <div className="relative aspect-[4/3] bg-surface-100 overflow-hidden">
        {campaign.coverImageKey ? (
          <img 
            src={`/api/media/${campaign.coverImageKey}`} 
            alt={campaign.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-surface-400 bg-surface-100">
            <HeartHandshake className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-sm font-medium">Medical Fundraiser</span>
          </div>
        )}
        
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <Badge variant="success" className="bg-emerald-500 text-white border-none shadow-sm flex items-center gap-1 backdrop-blur-md">
            <ShieldCheck className="w-3 h-3" /> Verified
          </Badge>
          <Badge variant={getUrgencyColor(campaign.caseId.urgency)} className="shadow-sm backdrop-blur-md border-none">
            {getUrgencyText(campaign.caseId.urgency)}
          </Badge>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Category & Location */}
        <div className="flex items-center justify-between text-xs font-medium text-surface-500 mb-2">
          <span className="uppercase tracking-wider text-brand-600">
            {campaign.caseId.diagnosisCategory.replace('_', ' ')}
          </span>
          {campaign.caseId.hospitalId?.name && (
            <span className="flex items-center gap-1 truncate max-w-[50%]">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{campaign.caseId.hospitalId.name}</span>
            </span>
          )}
        </div>

        <Link to={`/fundraisers/${campaign.slug}`} className="block group-hover:text-brand-600 transition-colors">
          <h3 className="font-bold text-lg text-surface-900 leading-tight mb-2 line-clamp-2">
            {campaign.title}
          </h3>
        </Link>
        
        <p className="text-sm text-surface-600 line-clamp-2 mb-4 flex-1">
          {campaign.summary}
        </p>

        {/* Safe Patient Identifier */}
        <div className="bg-surface-50 rounded-lg p-3 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm shrink-0">
            {campaign.caseId.patientName.charAt(0)}
          </div>
          <div className="text-sm">
            <p className="font-medium text-surface-900 leading-tight">For {campaign.caseId.patientName}</p>
            <p className="text-xs text-surface-500">{campaign.caseId.patientAge} yrs • {campaign.caseId.patientGender}</p>
          </div>
        </div>

        {/* Progress Area */}
        <div className="mt-auto">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-2xl font-bold text-surface-900 leading-none">
                ₹{campaign.raisedAmount.toLocaleString()}
              </p>
              <p className="text-xs text-surface-500 font-medium mt-1">raised of ₹{campaign.goal.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-brand-600">{Math.round(progress)}%</p>
            </div>
          </div>
          <ProgressBar progress={progress} max={100} className="h-2 mb-2" />
          <div className="flex justify-between items-center text-xs text-surface-500 font-medium">
            <span className="flex items-center gap-1">
              <HeartHandshake className="w-3 h-3" /> {campaign.donorCount} Supporters
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> 
              {campaign.publishedAt ? Math.max(0, Math.floor((Date.now() - new Date(campaign.publishedAt).getTime()) / (1000 * 60 * 60 * 24))) : 0} days ago
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-4 gap-2 mt-5">
          <Button 
            className="col-span-3 w-full"
            onClick={() => window.location.href = `/fundraisers/${campaign.slug}`}
          >
            Donate Now
          </Button>
          <Button variant="outline" className="col-span-1 px-0 w-full flex items-center justify-center text-surface-500 hover:text-brand-600 border-surface-200">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

      </div>
    </div>
  );
}
