import { CreditCard, Landmark, ClipboardCheck, HeartHandshake } from 'lucide-react';

export function DonationJourneySection() {
  const steps = [
    {
      title: "1. You Donate",
      desc: "Secure payment processing via our verified payment gateway.",
      icon: <CreditCard className="w-8 h-8 text-brand-600" />
    },
    {
      title: "2. Escrow Account",
      desc: "Funds are held securely in a dedicated campaign account.",
      icon: <Landmark className="w-8 h-8 text-brand-600" />
    },
    {
      title: "3. Medical Verification",
      desc: "Hospital raises invoice for the completed or required treatment.",
      icon: <ClipboardCheck className="w-8 h-8 text-brand-600" />
    },
    {
      title: "4. Direct Settlement",
      desc: "Funds are transferred directly to the hospital's registered bank account.",
      icon: <HeartHandshake className="w-8 h-8 text-brand-600" />
    }
  ];

  return (
    <section 
      className="py-20 border-y border-surface-100 relative bg-cover bg-center bg-fixed text-white"
      style={{ backgroundImage: 'url(/images/programs/blood-donation.jpg)' }}
    >
      <div className="absolute inset-0 bg-surface-900/85 backdrop-blur-[2px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            The Journey of Your Donation
          </h2>
          <p className="text-lg text-slate-300">
            What happens after you click donate? We ensure a foolproof path from your account directly to the medical institution.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-brand-900/50 -translate-y-1/2 rounded-full"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
