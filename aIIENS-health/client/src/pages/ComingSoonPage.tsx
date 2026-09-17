import { Clock, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function ComingSoonPage() {
  const location = useLocation();
  
  // Format the path to look like a title (e.g., "/ngo-network" -> "Ngo Network")
  const pageName = location.pathname
    .split('/')
    .filter(Boolean)
    .pop()
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || 'This Page';

  return (
    <div className="min-h-[80dvh] flex flex-col items-center justify-center p-4 bg-surface-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 text-center animate-fade-in-up max-w-md w-full">
        <div className="w-24 h-24 mx-auto bg-brand-500/10 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-brand-500/10 border border-brand-500/20">
          <Clock className="w-10 h-10 text-brand-500" />
        </div>
        
        <h1 className="text-4xl font-black text-surface-900 mb-4 tracking-tight">Coming Soon</h1>
        <p className="text-lg text-surface-600 mb-8 leading-relaxed">
          We are working hard to bring you the <strong className="text-brand-600">{pageName}</strong> features. Stay tuned for updates!
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-900 text-white font-medium hover:bg-surface-800 transition-colors shadow-lg shadow-surface-900/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
