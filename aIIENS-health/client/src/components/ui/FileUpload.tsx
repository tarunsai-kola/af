import { InputHTMLAttributes, forwardRef } from 'react';
import { UploadCloud } from 'lucide-react';

export interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ label, error, helperText, className = '', containerClassName = '', id, ...props }, ref) => {
    return (
      <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-surface-700">
            {label}
          </label>
        )}
        <label
          htmlFor={id}
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-surface-50 hover:bg-surface-100 transition-colors ${
            error ? 'border-red-500' : 'border-surface-300 hover:border-brand-400'
          } ${className}`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-8 h-8 mb-2 text-surface-400" />
            <p className="text-sm text-surface-600 font-medium">Click to upload or drag and drop</p>
            {helperText && <p className="text-xs text-surface-500 mt-1">{helperText}</p>}
          </div>
          <input id={id} type="file" className="hidden" ref={ref} {...props} />
        </label>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
FileUpload.displayName = 'FileUpload';
