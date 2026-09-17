import { FileText, ShieldCheck, Heart, LineChart, ArrowRight } from 'lucide-react';

export function FundraisingFlowSection() {
  const steps = [
    {
      title: "Patient Needs Treatment",
      description: "A patient or hospital submits a critical medical case requiring financial aid.",
      icon: <FileText className="w-8 h-8 text-brand-600" />
    },
    {
      title: "Verification Process",
      description: "Our medical experts verify the hospital, diagnosis, and treatment estimate.",
      icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />
    },
    {
      title: "Community Contributes",
      description: "Donors worldwide contribute securely to the verified campaign.",
      icon: <Heart className="w-8 h-8 text-red-600" />
    },
    {
      title: "Impact Reported",
      description: "Funds are sent directly to the hospital, and donors receive progress updates.",
      icon: <LineChart className="w-8 h-8 text-blue-600" />
    }
  ];

  return (
    <section 
      className="py-24 bg-surface-900 text-white overflow-hidden relative bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url(/images/programs/medical-fundraising.jpg)' }}
    >
      <div className="absolute inset-0 bg-surface-900/80 backdrop-blur-[2px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-900/40 to-transparent pointer-events-none z-0"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            One Case. One Goal. A Community Behind It.
          </h2>
          <p className="text-lg text-surface-300 leading-relaxed">
            We don't just raise money; we build a verified bridge between those who need medical care and those who want to provide it.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-surface-700 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-2xl bg-surface-800 border-2 border-surface-700 flex items-center justify-center mb-6 group-hover:border-brand-500 group-hover:bg-brand-900/30 transition-all duration-300 relative">
                  {step.icon}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden absolute -bottom-10 text-surface-600">
                      <ArrowRight className="w-5 h-5 rotate-90" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-surface-400 text-sm leading-relaxed px-2">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
