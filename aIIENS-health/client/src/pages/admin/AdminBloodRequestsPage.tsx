import { useState, useEffect } from 'react';
import { bloodApi } from '@/api/bloodApi';
import { adminApi } from '@/api/adminApi';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Droplet, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';

export default function AdminBloodRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await bloodApi.getBloodRequests({ status: 'all', limit: 100 });
      setRequests(res.data);
    } catch (err) {
      setError('Failed to fetch blood requests');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      setError('');
      setSuccess('');
      await adminApi.updateBloodRequestStatus(id, status);
      setSuccess(`Request marked as ${status}`);
      fetchRequests();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-surface-900">Blood Emergencies Verification</h1>
      </div>

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <div className="grid gap-4">
        {requests.length === 0 ? (
          <div className="text-center py-12 text-surface-500 bg-white rounded-xl border border-surface-200">
            No blood requests found.
          </div>
        ) : (
          requests.map((req) => (
            <Card key={req._id}>
              <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="flex gap-4 items-center min-w-0 flex-1">
                  <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-xl shrink-0">
                    {req.bloodGroup}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-100 text-lg flex flex-wrap items-center gap-2 break-all md:break-words">
                      {req.contactName}
                      <Badge variant={req.status === 'VALIDATING' ? 'warning' : req.status === 'ACTIVE' ? 'success' : 'default'} className="shrink-0">
                        {req.status}
                      </Badge>
                    </h3>
                    <div className="text-sm text-slate-400 flex flex-wrap items-center gap-4 mt-1">
                      <span className="flex items-center gap-1 whitespace-nowrap"><Droplet className="w-4 h-4 shrink-0" /> {req.units} Units Needed</span>
                      <span className="flex items-center gap-1 break-all md:break-words"><MapPin className="w-4 h-4 shrink-0" /> {req.location?.hospital}, {req.location?.city}</span>
                    </div>
                    {req.notes && (
                      <p className="text-sm text-slate-900 mt-2 bg-slate-100 p-2 rounded-md break-all md:break-words">
                        {req.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                  {req.status === 'VALIDATING' && (
                    <>
                      <Button onClick={() => handleUpdateStatus(req._id, 'ACTIVE')} className="flex-1 md:flex-none gap-2 bg-emerald-600 hover:bg-emerald-700">
                        <CheckCircle className="w-4 h-4" /> Approve
                      </Button>
                      <Button onClick={() => handleUpdateStatus(req._id, 'CANCELLED')} variant="outline" className="flex-1 md:flex-none gap-2 text-red-600 hover:text-red-700">
                        <XCircle className="w-4 h-4" /> Reject
                      </Button>
                    </>
                  )}
                  {req.status === 'ACTIVE' && (
                    <Button onClick={() => handleUpdateStatus(req._id, 'CLOSED')} variant="outline" className="flex-1 md:flex-none">
                      Mark Closed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
