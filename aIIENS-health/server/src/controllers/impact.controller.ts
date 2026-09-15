import { Request, Response, NextFunction } from 'express';
import { BloodRequest } from '../models/BloodRequest.model';
import { MedicalCamp } from '../models/MedicalCamp.model';
import { Campaign } from '../models/Campaign.model';
import { Donation } from '../models/Donation.model';
import { ImpactMetric } from '../models/ImpactMetric.model';
import { sendSuccess } from '../utils/apiResponse';

interface ImpactMetricResponse {
  id: string;
  name: string;
  value: number | string;
  period: string;
  calculationMethod: string;
  source: string;
  lastUpdated: string;
  isDemoData?: boolean;
}

// Simple in-memory cache for live mode
let cachedMetrics: ImpactMetricResponse[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const IMPACT_MODE = process.env.IMPACT_METRICS_MODE || 'live';

export const getImpactSummary = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // ── Precomputed mode ──────────────────────────────────────────────
    if (IMPACT_MODE === 'precomputed') {
      const stored = await ImpactMetric.find({ status: 'current' }).sort({ metricKey: 1 });
      const names: Record<string, string> = {
        'people-helped': 'People Helped',
        'community-contribution': 'Community Contribution',
        'active-fundraisers': 'Active Fundraisers',
        'medical-camps': 'Medical Camps Hosted',
        'blood-supported': 'Blood Units Supported',
      };

      const metrics: ImpactMetricResponse[] = stored.map((m) => ({
        id: m.metricKey,
        name: names[m.metricKey] || m.metricKey,
        value: m.metricKey === 'community-contribution'
          ? `₹${m.value.toLocaleString()}`
          : m.value,
        period: 'All Time',
        calculationMethod: 'Precomputed aggregation',
        source: m.source,
        lastUpdated: m.calculatedAt.toISOString(),
      }));

      sendSuccess(res, { statusCode: 200, message: 'Impact summary (precomputed)', data: metrics });
      return;
    }

    // ── Live mode (existing behavior, cached) ─────────────────────────
    const now = Date.now();
    if (cachedMetrics && now - lastCacheTime < CACHE_TTL_MS) {
      sendSuccess(res, { statusCode: 200, message: 'Impact summary (cached)', data: cachedMetrics });
      return;
    }

    const isDemoMode = process.env.NODE_ENV !== 'production';
    const lastUpdated = new Date().toISOString();

    const bloodAgg = await BloodRequest.aggregate([
      { $match: { status: { $in: ['RESOLVED', 'CLOSED'] } } },
      { $group: { _id: null, totalUnits: { $sum: '$fulfilledUnits' } } },
    ]);
    const bloodUnits = bloodAgg[0]?.totalUnits || 0;

    const campsAgg = await MedicalCamp.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $group: { _id: null, totalCamps: { $sum: 1 }, totalAttended: { $sum: '$attendedCount' } } },
    ]);
    const campsCompleted = campsAgg[0]?.totalCamps || 0;
    const campAttendees = campsAgg[0]?.totalAttended || 0;

    const activeFundraisers = await Campaign.countDocuments({ status: 'LIVE' });

    const donationAgg = await Donation.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, totalRaised: { $sum: '$amount' } } },
    ]);
    const totalContribution = donationAgg[0]?.totalRaised || 0;
    const peopleHelped = bloodUnits + campAttendees;

    const metrics: ImpactMetricResponse[] = [
      {
        id: 'people-helped', name: 'People Helped', value: peopleHelped,
        period: 'All Time', calculationMethod: 'Sum of blood units fulfilled and medical camp check-ins.',
        source: 'MongoDB: blood_requests + medical_camps', lastUpdated, isDemoData: isDemoMode,
      },
      {
        id: 'community-contribution', name: 'Community Contribution',
        value: `₹${totalContribution.toLocaleString()}`, period: 'All Time',
        calculationMethod: 'Sum of all confirmed payment provider transactions.',
        source: 'MongoDB: donations', lastUpdated, isDemoData: isDemoMode,
      },
      {
        id: 'active-fundraisers', name: 'Active Fundraisers', value: activeFundraisers,
        period: 'Current', calculationMethod: 'Count of LIVE campaigns.',
        source: 'MongoDB: campaigns', lastUpdated, isDemoData: isDemoMode,
      },
      {
        id: 'medical-camps', name: 'Medical Camps Hosted', value: campsCompleted,
        period: 'All Time', calculationMethod: 'Count of completed camps.',
        source: 'MongoDB: medical_camps', lastUpdated, isDemoData: isDemoMode,
      },
      {
        id: 'blood-supported', name: 'Blood Units Supported', value: bloodUnits,
        period: 'All Time', calculationMethod: 'Sum of confirmed blood units.',
        source: 'MongoDB: blood_requests', lastUpdated, isDemoData: isDemoMode,
      },
    ];

    cachedMetrics = metrics;
    lastCacheTime = now;

    sendSuccess(res, { statusCode: 200, message: 'Impact summary aggregated successfully', data: metrics });
  } catch (error) {
    next(error);
  }
};

export const getImpactInspection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { metricId } = req.query;
    let inspectionData: any = null;

    if (metricId === 'people-helped') {
      inspectionData = { message: 'Composite metric: blood units + camp attendees.' };
    } else if (metricId === 'community-contribution') {
      const topDonations = await Donation.find({ status: 'confirmed' })
        .sort({ amount: -1 }).limit(10).select('amount createdAt isAnonymous');
      inspectionData = { sample: topDonations, note: 'Top 10 confirmed donations.' };
    } else if (metricId === 'active-fundraisers') {
      const active = await Campaign.find({ status: 'LIVE' }).select('title targetAmount raisedAmount');
      inspectionData = { sample: active, note: 'All LIVE campaigns.' };
    } else if (metricId === 'medical-camps') {
      const camps = await MedicalCamp.find({ status: 'COMPLETED' }).select('title location.city attendedCount');
      inspectionData = { sample: camps, note: 'All completed camps.' };
    } else if (metricId === 'blood-supported') {
      const requests = await BloodRequest.find({ status: { $in: ['RESOLVED', 'CLOSED'] } })
        .select('bloodGroup fulfilledUnits location.city');
      inspectionData = { sample: requests, note: 'All resolved/closed blood requests.' };
    } else {
      inspectionData = { message: 'Select a valid metric ID.' };
    }

    sendSuccess(res, { statusCode: 200, message: 'Inspection data retrieved', data: inspectionData });
  } catch (error) {
    next(error);
  }
};
