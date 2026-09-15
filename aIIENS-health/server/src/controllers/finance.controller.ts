import { Request, Response, NextFunction } from 'express';
import { Donation } from '../models/Donation.model';
import { Settlement } from '../models/Settlement.model';
import { PaymentTransaction } from '../models/PaymentTransaction.model';
import { Campaign } from '../models/Campaign.model';
import { AuditEvent } from '../models/AuditEvent.model';
import { AppError } from '../utils/AppError';
import { sendSuccess } from '../utils/apiResponse';

export const getFinanceMetrics = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalDonations,
      todayDonations,
      failedPayments,
      refunds,
      pendingSettlements,
      completedSettlements
    ] = await Promise.all([
      Donation.countDocuments({ status: 'confirmed' }),
      Donation.countDocuments({ status: 'confirmed', createdAt: { $gte: today } }),
      PaymentTransaction.countDocuments({ status: 'failed' }),
      Donation.countDocuments({ status: 'refunded' }),
      Settlement.countDocuments({ status: { $in: ['SETTLEMENT_REQUESTED', 'UNDER_REVIEW', 'APPROVED'] } }),
      Settlement.countDocuments({ status: 'COMPLETED' })
    ]);

    // Pending Reconciliation (Confirmed donations without a reconciled settlement mapping conceptually, 
    // or we can mock this metric as donations needing manual check)
    // For now, we'll return a static/dummy or simple count of 'confirmed' not in a settlement
    const pendingReconciliation = 0; // Simplified for now

    sendSuccess(res, {
      statusCode: 200,
      message: 'Finance metrics retrieved',
      data: {
        totalDonations,
        todayDonations,
        pendingReconciliation,
        failedPayments,
        refunds,
        pendingSettlements,
        completedSettlements
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getDonations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter: any = {};
    if (status) filter.status = status;

    const donations = await Donation.find(filter)
      .populate('campaignId', 'title slug')
      .populate('userId', 'name email')
      .populate('paymentTransactionId', 'provider providerPaymentId')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Donation.countDocuments(filter);

    sendSuccess(res, {
      statusCode: 200,
      message: 'Donations retrieved',
      data: donations,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)) || 0,
        hasNextPage: Number(page) < Math.ceil(total / Number(limit)),
        hasPrevPage: Number(page) > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getSettlements = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter: any = {};
    if (status) filter.status = status;

    const settlements = await Settlement.find(filter)
      .populate('campaignId', 'title')
      .populate('hospitalId', 'name')
      .populate('requestedBy', 'name')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Settlement.countDocuments(filter);

    sendSuccess(res, {
      statusCode: 200,
      message: 'Settlements retrieved',
      data: settlements,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        hasNextPage: Number(page) < Math.ceil(total / Number(limit)),
        hasPrevPage: Number(page) > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettlementStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason, paymentReference, notes } = req.body;
    const userId = (req as any).user.userId;

    const settlement = await Settlement.findById(id);
    if (!settlement) {
      throw new AppError('Settlement not found', 404);
    }

    const oldStatus = settlement.status;
    settlement.status = status;

    if (status === 'APPROVED') {
      settlement.approvedBy = userId as any;
    }
    if (status === 'COMPLETED') {
      settlement.processedAt = new Date();
      if (paymentReference) settlement.paymentReference = paymentReference;
    }
    if (status === 'RECONCILED') {
      settlement.reconciledAt = new Date();
      if (notes) settlement.reconciliationNotes = notes;
    }
    if (rejectionReason) settlement.rejectionReason = rejectionReason;

    await settlement.save();

    await AuditEvent.create({
      userId,
      action: 'update_status',
      entityType: 'Settlement',
      entityId: settlement._id,
      details: { oldStatus, newStatus: status, notes },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    sendSuccess(res, {
      statusCode: 200,
      message: 'Settlement status updated',
      data: settlement
    });
  } catch (error) {
    next(error);
  }
};

export const getReconciliationReport = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // A simplified reconciliation logic:
    // Mismatch highlighting: Campaign raisedAmount vs sum of confirmed Donations
    
    const campaigns = await Campaign.find({ status: { $in: ['active', 'completed'] } }).select('title raisedAmount');
    
    const mismatches = [];
    
    for (const campaign of campaigns) {
      const donations = await Donation.aggregate([
        { $match: { campaignId: campaign._id, status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      
      const donationTotal = donations[0]?.total || 0;
      
      if (donationTotal !== campaign.raisedAmount) {
        mismatches.push({
          campaignId: campaign._id,
          title: campaign.title,
          campaignRaisedAmount: campaign.raisedAmount,
          donationSum: donationTotal,
          difference: campaign.raisedAmount - donationTotal
        });
      }
    }

    sendSuccess(res, {
      statusCode: 200,
      message: 'Reconciliation report generated',
      data: {
        mismatches,
        totalChecked: campaigns.length
      }
    });
  } catch (error) {
    next(error);
  }
};
