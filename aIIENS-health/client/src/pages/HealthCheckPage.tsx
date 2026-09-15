import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, XCircle, RefreshCw, Server, Clock, Layers, Tag } from 'lucide-react';
import { getHealthStatus, HealthData } from '@/api/healthApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { extractApiError } from '@/services/apiError';
import type { ReactNode } from 'react';

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2.5 text-slate-400">
        <span className="text-slate-500">{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-mono text-slate-200">{value}</span>
    </div>
  );
}

export default function HealthCheckPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['health'],
    queryFn: getHealthStatus,
    refetchInterval: 30_000,
    retry: 1,
  });

  const apiError = isError ? extractApiError(error) : null;
  const health = data?.data as HealthData | undefined;
  const isOnline = data?.success === true && health?.status === 'ok';

  const lastChecked = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString()
    : '—';

  return (
    <div className="min-h-[70dvh] flex items-start justify-center px-4 pt-16 pb-24" id="health-check-page">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/5 border border-white/10 mb-4 mx-auto">
            <Server className="h-8 w-8 text-brand-400" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">API Health Status</h1>
          <p className="text-slate-400 text-sm">
            Live connectivity check with the AIIENS Health backend API.
          </p>
        </div>

        {/* Status Card */}
        <Card glass className="mb-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>AIIENS Health API</CardTitle>
              {isLoading ? (
                <Badge variant="neutral">Checking…</Badge>
              ) : isOnline ? (
                <Badge variant="success" dot>Operational</Badge>
              ) : (
                <Badge variant="danger" dot>Unreachable</Badge>
              )}
            </div>
            <CardDescription>
              {`GET /api/health · Auto-refreshes every 30s`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Loading state */}
            {isLoading && (
              <div className="flex flex-col items-center gap-4 py-8">
                <Spinner size="lg" />
                <p className="text-slate-400 text-sm">Pinging server…</p>
              </div>
            )}

            {/* Success state */}
            {!isLoading && isOnline && health && (
              <div className="space-y-0">
                <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                  <span className="text-green-300 text-sm font-medium">{data?.message}</span>
                </div>
                <InfoRow icon={<Layers className="h-4 w-4" />} label="Status" value={health.status} />
                <InfoRow icon={<Tag className="h-4 w-4" />} label="Version" value={`v${health.version}`} />
                <InfoRow icon={<Server className="h-4 w-4" />} label="Environment" value={health.environment} />
                <InfoRow icon={<Clock className="h-4 w-4" />} label="Server Time" value={new Date(health.timestamp).toLocaleString()} />
                <InfoRow icon={<RefreshCw className="h-4 w-4" />} label="Last Checked" value={lastChecked} />
              </div>
            )}

            {/* Error state */}
            {!isLoading && isError && (
              <div>
                <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <XCircle className="h-5 w-5 text-red-400 shrink-0" />
                  <span className="text-red-300 text-sm font-medium">
                    {apiError?.message ?? 'Could not reach the API'}
                  </span>
                </div>
                <p className="text-slate-500 text-xs">
                  Ensure the Express server is running on port 5000 and MongoDB is connected.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Refresh button */}
        <Button
          variant="outline"
          size="md"
          id="health-check-refresh-btn"
          className="w-full"
          isLoading={isFetching && !isLoading}
          leftIcon={<RefreshCw className="h-4 w-4" />}
          onClick={() => void refetch()}
        >
          Refresh Now
        </Button>
      </div>
    </div>
  );
}
