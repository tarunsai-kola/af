import { HeroSection } from '@/components/home/HeroSection';
import { TrustStripSection } from '@/components/home/TrustStripSection';
import { MainProgramsSection } from '@/components/home/MainProgramsSection';
import { FundraisingFlowSection } from '@/components/home/FundraisingFlowSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { TransparencySection } from '@/components/home/TransparencySection';
import { DonationJourneySection } from '@/components/home/DonationJourneySection';
import { CommunityFundraisingSection } from '@/components/home/CommunityFundraisingSection';
import { BloodDonationSection } from '@/components/home/BloodDonationSection';
import { MedicalCampsSection } from '@/components/home/MedicalCampsSection';
import { ImpactStoriesSection } from '@/components/home/ImpactStoriesSection';
import { MicroContributionsSection } from '@/components/home/MicroContributionsSection';
import { GetInvolvedSection } from '@/components/home/GetInvolvedSection';
import { NetworkSection } from '@/components/home/NetworkSection';
import { AboutGovernanceSection } from '@/components/home/AboutGovernanceSection';

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      <HeroSection />
      <TrustStripSection />
      <MainProgramsSection />
      <FundraisingFlowSection />
      <HowItWorksSection />
      <TransparencySection />
      <DonationJourneySection />
      <CommunityFundraisingSection />
      <BloodDonationSection />
      <MedicalCampsSection />
      <ImpactStoriesSection />
      <MicroContributionsSection />
      <GetInvolvedSection />
      <NetworkSection />
      <AboutGovernanceSection />
    </div>
  );
}
