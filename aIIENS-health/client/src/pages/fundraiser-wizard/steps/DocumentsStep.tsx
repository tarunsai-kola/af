import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { Alert } from '@/components/ui/Alert';
import { useMutation } from '@tanstack/react-query';
import { caseApi, PatientCase } from '@/api/caseApi';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function DocumentsStep() {
  const { id } = useOutletContext<{ draftCase: PatientCase; id: string }>();
  const navigate = useNavigate();
  
  // We'll manage multiple document types
  const [estimateFile, setEstimateFile] = useState<File | null>(null);
  const [kycFile, setKycFile] = useState<File | null>(null);
  
  const [uploadedEstimate, setUploadedEstimate] = useState(false);
  const [uploadedKyc, setUploadedKyc] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: ({ file, type }: { file: File, type: string }) => caseApi.uploadDocument(id, file, type),
    onSuccess: (_, variables) => {
      if (variables.type === 'cost_estimate') setUploadedEstimate(true);
      if (variables.type === 'id_proof') setUploadedKyc(true);
      setUploadError(null);
    },
    onError: (error: any) => {
      setUploadError(error?.response?.data?.message || 'Failed to upload document.');
    }
  });

  const handleUpload = (file: File | null, type: string) => {
    if (!file) return;
    uploadMutation.mutate({ file, type });
  };

  const isReady = uploadedEstimate && uploadedKyc;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-surface-900 border-b border-surface-100 pb-3 mb-6">
        Medical & KYC Documents
      </h2>
      
      <Alert variant="info" title="Private & Secure">
        <div className="flex items-start gap-2 mt-2 text-sm">
          <ShieldCheck className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
          <p>
            Your documents are securely encrypted and stored in private vaults. They are strictly used for verification by our medical team and will <strong>never</strong> be made public on the platform.
          </p>
        </div>
      </Alert>

      {uploadError && (
        <Alert variant="error" title="Upload Failed">
          {uploadError}
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-8 pt-4">
        
        {/* Hospital Estimate */}
        <div className="bg-surface-50 p-6 rounded-xl border border-surface-200">
          <h3 className="font-bold text-surface-900 mb-2">Hospital Estimate Letter</h3>
          <p className="text-xs text-surface-500 mb-4">
            Must be on official hospital letterhead with the doctor's signature and stamp.
          </p>
          
          {uploadedEstimate ? (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium text-sm">Document Uploaded Successfully</span>
            </div>
          ) : (
            <div className="space-y-3">
              <FileUpload 
                label="" 
                helperText="PDF, JPG, PNG (Max 5MB)"
                onChange={(e) => setEstimateFile(e.target.files?.[0] || null)}
              />
              <Button 
                type="button" 
                onClick={() => handleUpload(estimateFile, 'cost_estimate')}
                disabled={!estimateFile || uploadMutation.isPending}
                className="w-full"
              >
                Upload Estimate
              </Button>
            </div>
          )}
        </div>

        {/* Patient KYC */}
        <div className="bg-surface-50 p-6 rounded-xl border border-surface-200">
          <h3 className="font-bold text-surface-900 mb-2">Patient ID Proof</h3>
          <p className="text-xs text-surface-500 mb-4">
            Aadhar Card, PAN Card, or Voter ID of the patient.
          </p>
          
          {uploadedKyc ? (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium text-sm">Document Uploaded Successfully</span>
            </div>
          ) : (
            <div className="space-y-3">
              <FileUpload 
                label="" 
                helperText="PDF, JPG, PNG (Max 5MB)"
                onChange={(e) => setKycFile(e.target.files?.[0] || null)}
              />
              <Button 
                type="button" 
                onClick={() => handleUpload(kycFile, 'id_proof')}
                disabled={!kycFile || uploadMutation.isPending}
                className="w-full"
              >
                Upload ID Proof
              </Button>
            </div>
          )}
        </div>

      </div>

      <div className="pt-6 flex justify-between">
        <Button type="button" variant="outline" onClick={() => navigate(`/fundraisers/create/${id}/financial`)}>
          Back
        </Button>
        <Button 
          type="button" 
          disabled={!isReady} 
          onClick={() => navigate(`/fundraisers/create/${id}/consent`)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
