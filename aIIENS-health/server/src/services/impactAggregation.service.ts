import { BloodRequest } from '../models/BloodRequest.model';
import { MedicalCamp } from '../models/MedicalCamp.model';
import { Campaign } from '../models/Campaign.model';
import { Donation } from '../models/Donation.model';
import { ImpactMetric } from '../models/ImpactMetric.model';
import { logger } from '../config/logger';

/**
 * Impact Aggregation Service
 *
 * Runs the full aggregation pipeline and writes results to the ImpactMetric collection.
 * Can be invoked manually, by a scheduled job, or at server startup.
 */
export async function calculateImpactMetrics(): Promise<void> {
  const now = new Date();
  const periodStart = new Date(0); // All-time
  const periodEnd = now;

  try {
    // 1. Blood Requests
    const bloodAgg = await BloodRequest.aggregate([
      { $match: { status: { $in: ['RESOLVED', 'CLOSED'] } } },
      { $group: { _id: null, totalUnits: { $sum: '$fulfilledUnits' } } },
    ]);
    const bloodUnits = bloodAgg[0]?.totalUnits || 0;

    // 2. Camps
    const campsAgg = await MedicalCamp.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $group: { _id: null, totalCamps: { $sum: 1 }, totalAttended: { $sum: '$attendedCount' } } },
    ]);
    const campsCompleted = campsAgg[0]?.totalCamps || 0;
    const campAttendees = campsAgg[0]?.totalAttended || 0;

    // 3. Active Fundraisers
    const activeFundraisers = await Campaign.countDocuments({ status: 'LIVE' });

    // 4. Community Contribution
    const donationAgg = await Donation.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, totalRaised: { $sum: '$amount' } } },
    ]);
    const totalContribution = donationAgg[0]?.totalRaised || 0;

    // 5. People Helped
    const peopleHelped = bloodUnits + campAttendees;

    // Upsert all metrics
    const metrics = [
      { metricKey: 'people-helped', value: peopleHelped, source: 'blood_requests + medical_camps' },
      { metricKey: 'community-contribution', value: totalContribution, source: 'donations' },
      { metricKey: 'active-fundraisers', value: activeFundraisers, source: 'campaigns' },
      { metricKey: 'medical-camps', value: campsCompleted, source: 'medical_camps' },
      { metricKey: 'blood-supported', value: bloodUnits, source: 'blood_requests' },
    ];

    for (const m of metrics) {
      await ImpactMetric.findOneAndUpdate(
        { metricKey: m.metricKey },
        {
          $set: {
            value: m.value,
            periodStart,
            periodEnd,
            calculatedAt: now,
            calculationVersion: 1,
            source: m.source,
            status: 'current',
          },
        },
        { upsert: true },
      );
    }

    logger.info('Impact metrics recalculated successfully');
  } catch (err) {
    logger.error({ err }, 'Failed to calculate impact metrics');
    throw err;
  }
}
