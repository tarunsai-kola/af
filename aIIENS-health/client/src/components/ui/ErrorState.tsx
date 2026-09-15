import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ 
  title = 'Something went wrong', 
  message = 'We encountered an error loading this data. Please try again.', 
  onRetry, 
  className = '' 
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-red-100 bg-red-50/50 ${className}`}>
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-red-900 mb-2">{title}</h3>
      <p className="text-red-700 max-w-sm mb-6 text-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="bg-white hover:bg-red-50 text-red-700 border-red-200">
          Try Again
        </Button>
      )}
    </div>
  );
}
