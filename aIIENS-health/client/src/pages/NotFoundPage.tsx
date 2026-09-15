import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70dvh] flex flex-col items-center justify-center px-4 text-center" id="not-found-page">
      <div className="relative mb-8">
        <div
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="h-40 w-40 rounded-full bg-brand-500/20 blur-2xl" />
        </div>
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white/5 border border-white/10 mx-auto">
          <Compass className="h-12 w-12 text-brand-400" aria-hidden="true" />
        </div>
      </div>

      <h1 className="text-8xl font-extrabold text-brand-500 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
      <p className="text-slate-400 max-w-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Link to="/">
        <Button
          variant="primary"
          size="lg"
          id="not-found-home-btn"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
