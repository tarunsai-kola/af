import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { PatientCase } from '@/api/caseApi';
import { ShieldCheck, CheckSquare, Square } from 'lucide-react';

export default function ConsentStep() {
  const { id } = useOutletContext<{ draftCase: PatientCase; id: string }>();
  const navigate = useNavigate();
  
  const [agreed1, setAgreed1] = useState(false);
  const [agreed2, setAgreed2] = useState(false);
  const [agreed3, setAgreed3] = useState(false);

  const isReady = agreed1 && agreed2 && agreed3;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-surface-900 border-b border-surface-100 pb-3 mb-6">
        Declarations & Consent
      </h2>
      
      <div className="bg-brand-50 p-6 rounded-xl border border-brand-100 mb-8">
        <h3 className="font-bold text-brand-900 flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-brand-600" /> Medical Verification Process
        </h3>
        <p className="text-sm text-brand-800">
          Before your fundraiser is published, our medical team will contact the treating hospital directly to verify the patient's admission, diagnosis, and the estimated cost. Any discrepancy or forged documents will result in an immediate ban and potential legal action.
        </p>
      </div>

      <div className="space-y-4">
        
        <div 
          className="flex items-start gap-4 p-4 rounded-lg border border-surface-200 cursor-pointer hover:bg-surface-50 transition-colors"
          onClick={() => setAgreed1(!agreed1)}
        >
          <div className="mt-0.5 text-brand-600 shrink-0">
            {agreed1 ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6 text-surface-400" />}
          </div>
          <div>
            <p className="font-medium text-surface-900">Truthfulness Declaration</p>
            <p className="text-sm text-surface-600">I declare that all information and documents provided are genuine, true, and accurate to the best of my knowledge.</p>
          </div>
        </div>

        <div 
          className="flex items-start gap-4 p-4 rounded-lg border border-surface-200 cursor-pointer hover:bg-surface-50 transition-colors"
          onClick={() => setAgreed2(!agreed2)}
        >
          <div className="mt-0.5 text-brand-600 shrink-0">
            {agreed2 ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6 text-surface-400" />}
          </div>
          <div>
            <p className="font-medium text-surface-900">Hospital Settlement Consent</p>
            <p className="text-sm text-surface-600">I understand and agree that 100% of the funds raised will be transferred directly to the verified bank account of the treating hospital, and never to my personal account.</p>
          </div>
        </div>

        <div 
          className="flex items-start gap-4 p-4 rounded-lg border border-surface-200 cursor-pointer hover:bg-surface-50 transition-colors"
          onClick={() => setAgreed3(!agreed3)}
        >
          <div className="mt-0.5 text-brand-600 shrink-0">
            {agreed3 ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6 text-surface-400" />}
          </div>
          <div>
            <p className="font-medium text-surface-900">Platform Policies</p>
            <p className="text-sm text-surface-600">I have read and agree to AIIENS Health's Terms of Service and Privacy Policy.</p>
          </div>
        </div>

      </div>

      <div className="pt-6 flex justify-between">
        <Button type="button" variant="outline" onClick={() => navigate(`/fundraisers/create/${id}/documents`)}>
          Back
        </Button>
        <Button 
          type="button" 
          disabled={!isReady} 
          onClick={() => navigate(`/fundraisers/create/${id}/review`)}
        >
          Continue to Final Review
        </Button>
      </div>
    </div>
  );
}
