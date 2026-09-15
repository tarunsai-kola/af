import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { paymentApi } from '@/api/paymentApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Alert } from '@/components/ui/Alert';
import { X, HeartPulse, CheckCircle2 } from 'lucide-react';

interface DonationModalProps {
  campaignId: string;
  campaignTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = [1, 10, 100, 500, 1000];

export function DonationModal({ campaignId, campaignTitle, isOpen, onClose }: DonationModalProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [amount, setAmount] = useState<number>(500);
  const [isCustom, setIsCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorMessage, setDonorMessage] = useState('');
  
  // Verification states for Mock Flow
  const [isVerifying, setIsVerifying] = useState(false);
  const [mockSuccess, setMockSuccess] = useState(false);
  const [donationId, setDonationId] = useState('');

  const createOrderMutation = useMutation({
    mutationFn: (amt: number) => paymentApi.createOrder(campaignId, amt, 'INR'),
    onSuccess: (data) => {
      // In a real Razorpay flow, we would load the Razorpay SDK script here
      // and call new window.Razorpay(options).open()
      
      // For this demo, we simulate an instant mock success
      setIsVerifying(true);
      verifyMutation.mutate({
        razorpay_order_id: data.orderId,
        razorpay_payment_id: `mock_pay_${Date.now()}`,
        razorpay_signature: 'mock_signature'
      });
    }
  });

  const verifyMutation = useMutation({
    mutationFn: (payload: any) => paymentApi.verifyPayment(
      payload.razorpay_order_id,
      payload.razorpay_payment_id,
      payload.razorpay_signature,
      campaignId,
      isAnonymous,
      donorMessage
    ),
    onSuccess: (data) => {
      setMockSuccess(true);
      setDonationId(data.donationId);
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
    },
    onSettled: () => {
      setIsVerifying(false);
    }
  });

  const handleDonate = () => {
    const finalAmount = isCustom ? Number(customAmount) : amount;
    if (!finalAmount || finalAmount < 1) {
      alert('Minimum donation is ₹1');
      return;
    }
    
    // We send amount in rupees, backend converts if needed (our mock doesn't strictly need paisa unless configured)
    createOrderMutation.mutate(finalAmount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-surface-100">
          <h2 className="text-xl font-bold text-surface-900 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-brand-500" /> Secure Donation
          </h2>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {mockSuccess ? (
            <div className="text-center py-8 animate-fade-in-up">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-surface-900 mb-2">Thank You!</h3>
              <p className="text-surface-600 mb-6">
                Your donation of ₹{isCustom ? customAmount : amount} to "{campaignTitle}" was successful.
              </p>
              <Button onClick={() => {
                onClose();
                // Optionally navigate to a receipt page here
                // navigate(`/donations/receipt/${donationId}`);
              }} className="w-full">
                Close
              </Button>
            </div>
          ) : (
            <>
              <p className="text-surface-600 text-sm mb-4">
                You are donating to: <strong>{campaignTitle}</strong>
              </p>

              {createOrderMutation.isError && (
                <Alert variant="error" className="mb-4">
                  {(createOrderMutation.error as any)?.response?.data?.message || 'Error initializing payment'}
                </Alert>
              )}

              {verifyMutation.isError && (
                <Alert variant="error" className="mb-4">
                  Payment verification failed. Please try again.
                </Alert>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-surface-700 mb-3">Select Amount (₹)</label>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {PRESET_AMOUNTS.map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => { setAmount(preset); setIsCustom(false); }}
                      className={`py-3 rounded-xl border font-bold transition-all ${
                        !isCustom && amount === preset 
                          ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500' 
                          : 'bg-white border-surface-200 text-surface-700 hover:border-brand-300'
                      }`}
                    >
                      ₹{preset}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsCustom(true)}
                    className={`py-3 rounded-xl border font-bold transition-all ${
                      isCustom 
                        ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500' 
                        : 'bg-white border-surface-200 text-surface-700 hover:border-brand-300'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {isCustom && (
                  <div className="animate-fade-in-up">
                    <Input 
                      label="Custom Amount (₹)" 
                      type="number" 
                      min="1"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <Textarea 
                  label="Leave a message (Optional)"
                  placeholder="Words of support..."
                  value={donorMessage}
                  onChange={(e) => setDonorMessage(e.target.value)}
                  rows={2}
                />

                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500" 
                  />
                  <span className="text-sm text-surface-700">Make my donation anonymous</span>
                </label>
              </div>

              <Button 
                size="lg" 
                className="w-full h-12 text-lg font-bold shadow-md"
                onClick={handleDonate}
                disabled={createOrderMutation.isPending || isVerifying || (isCustom && !customAmount)}
              >
                {createOrderMutation.isPending || isVerifying ? 'Processing...' : `Donate ₹${isCustom ? customAmount || '0' : amount}`}
              </Button>
              <p className="text-center text-xs text-surface-500 mt-4 flex justify-center items-center gap-1">
                🔒 Secured by MockPaymentProvider
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
