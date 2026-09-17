import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export function ImpactStoriesSection() {
  const stories = [
    {
      id: 1,
      name: "Rohan's Heart Surgery",
      timeline: [
        { status: "Campaign Created", date: "Jan 12", completed: true },
        { status: "100% Funded", date: "Jan 28", completed: true },
        { status: "Surgery Completed", date: "Feb 05", completed: true },
        { status: "Recovering at Home", date: "Feb 18", completed: true }
      ],
      image: "/images/impact-story.jpg",
      quote: "Thanks to 412 donors, Rohan received his surgery at Apollo Hospital. He is now back in school."
    },
    {
      id: 2,
      name: "Emergency Accident Care",
      timeline: [
        { status: "Campaign Created", date: "Mar 02", completed: true },
        { status: "Goal Reached", date: "Mar 05", completed: true },
        { status: "Discharged", date: "Mar 20", completed: true },
        { status: "Physiotherapy", date: "Ongoing", completed: false }
      ],
      image: "/images/impact-story.jpg",
      quote: "Community support covered the ICU bills completely, allowing the family to focus purely on recovery."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-surface-900 mb-6 tracking-tight">
            Impact, Told by the People It Reaches
          </h2>
          <p className="text-lg text-surface-600 leading-relaxed">
            We track every campaign from the first donation to the final medical update, ensuring your contribution creates verifiable, lasting change.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {stories.map(story => (
            <Card key={story.id} className="overflow-hidden border-surface-200">
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-2/5 h-48 md:h-auto relative bg-surface-200">
                  <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                </div>
                <CardContent className="md:w-3/5 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xl text-slate-100 mb-3">{story.name}</h3>
                    <p className="text-slate-300 text-sm italic mb-6">"{story.quote}"</p>
                    
                    <div className="space-y-3 mb-6 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-slate-700">
                      {story.timeline.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-4 relative z-10">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step.completed ? 'bg-emerald-900/30 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                            {step.completed ? <CheckCircle2 className="w-4 h-4 fill-current" /> : <div className="w-2 h-2 rounded-full bg-current"></div>}
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${step.completed ? 'text-slate-100' : 'text-slate-400'}`}>{step.status}</p>
                            <p className="text-xs text-slate-400">{step.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/impact">
            <Button variant="outline" size="lg">View All Transparency Reports</Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
