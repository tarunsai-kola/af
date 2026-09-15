interface ProgressBarProps {
  progress: number;
  max?: number;
  label?: string;
  className?: string;
  colorClass?: string;
}

export function ProgressBar({ 
  progress, 
  max = 100, 
  label, 
  className = '', 
  colorClass = 'bg-brand-500' 
}: ProgressBarProps) {
  // Ensure percentage is between 0 and 100
  const percentage = Math.min(Math.max((progress / max) * 100, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-surface-700">{label}</span>
          <span className="text-sm font-semibold text-surface-900">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-surface-200 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full ${colorClass} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
