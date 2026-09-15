import { Request, Response, NextFunction } from 'express';
import { PatientCase, GateName, GateStatus } from '../models/PatientCase.model';
import { MedicalDocument } from '../models/MedicalDocument.model';

import { Campaign } from '../models/Campaign.model';
import { AppError } from '../utils/AppError';
import { sendSuccess } from '../utils/apiResponse';

const GATE_ROLE_MAP: Record<GateName, string[]> = {
  G1_IDENTITY: ['CASE_OFFICER', 'SUPER_ADMIN'],
  G2_HOSPITAL: ['HOSPITAL_VERIFIER', 'SUPER_ADMIN'],
  G3_CLINICAL: ['MEDICAL_REVIEWER', 'SUPER_ADMIN'],
  G4_FINANCIAL_NEED: ['FINANCE_OFFICER', 'SUPER_ADMIN'],
  G5_CONSENT: ['CASE_OFFICER', 'SUPER_ADMIN'],
  G6_INTEGRITY: ['FRAUD_REVIEWER', 'SUPER_ADMIN'],
  G7_FINANCE: ['FINANCE_OFFICER', 'SUPER_ADMIN'],
  G8_PUBLICATION: ['CAMPAIGN_APPROVER', 'SUPER_ADMIN'],
};

// Helper to check role
const hasRoleForGate = (userRoles: string[], gate: GateName) => {
  const allowedRoles = GATE_ROLE_MAP[gate];
  return userRoles.some(role => allowedRoles.includes(role));
};

import { auditService } from '../services/audit.service';

// Helper for audit
const logAudit = async (req: Request, action: any, details: any) => {
  const userId = (req as any).user?.id || (req as any).user?.userId;
  const roles = (req as any).user?.roles || [(req as any).user?.role];
  await auditService.log({
    actorUserId: userId,
    actorRole: roles[0] || 'SUPER_ADMIN',
    action,
    objectType: 'PatientCase',
    objectId: details.caseId,
    changeSummary: details.note || 'Admin action',
    source: 'admin_panel',
    ipAddress: req.ip || '0.0.0.0',
    userAgent: req.headers['user-agent'] || 'Admin API'
  });
};

export const getMetrics = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      newCases,
      underVerification,
      approvedCases,
      liveCampaigns
    ] = await Promise.all([
      PatientCase.countDocuments({ status: 'DOCUMENTS_PENDING' }),
      PatientCase.countDocuments({ status: 'UNDER_VERIFICATION' }),
      PatientCase.countDocuments({ status: 'APPROVED' }),
      Campaign.countDocuments({ status: 'active' }),
    ]);

    sendSuccess(res, {
      statusCode: 200,
      message: 'Metrics retrieved',
      data: {
        newCases,
        underVerification,
        approvedCases,
        liveCampaigns
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCases = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter: any = {};
    if (status) filter.status = status;

    const cases = await PatientCase.find(filter)
      .populate('hospitalId', 'name')
      .populate('guardianUserId', 'name email')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await PatientCase.countDocuments(filter);

    sendSuccess(res, {
      statusCode: 200,
      message: 'Cases retrieved',
      data: cases,
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

export const getCaseDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const patientCase = await PatientCase.findById(id)
      .populate('hospitalId')
      .populate('guardianUserId', 'name email phone')
      .populate('verificationGates.reviewerId', 'name email');

    if (!patientCase) throw new AppError('Case not found', 404);

    const documents = await MedicalDocument.find({ caseId: id }).sort({ uploadedAt: -1 });

    const caseData = patientCase.toObject() as any;
    caseData.documents = documents;

    sendSuccess(res, { statusCode: 200, message: 'Case details retrieved', data: caseData });
  } catch (error) {
    next(error);
  }
};

export const updateVerificationGate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, gateId } = req.params;
    const { status, notes, evidence } = req.body;
    
    const userId = (req as any).user?.id || (req as any).user?.userId;
    const roles = (req as any).user?.roles || [(req as any).user?.role];

    if (!hasRoleForGate(roles, gateId as GateName)) {
      throw new AppError(`You do not have permission to update gate ${gateId}`, 403);
    }

    const patientCase = await PatientCase.findById(id);
    if (!patientCase) throw new AppError('Case not found', 404);

    // If trying to pass G8, verify G1-G7 are passed
    if (gateId === 'G8_PUBLICATION' && status === 'PASSED') {
      const g1to7 = patientCase.verificationGates.filter(g => g.gate !== 'G8_PUBLICATION');
      const allPassed = g1to7.every(g => g.status === 'PASSED');
      if (!allPassed) {
        throw new AppError('Cannot pass G8_PUBLICATION until G1-G7 are marked as PASSED.', 400);
      }
    }

    const gateIndex = patientCase.verificationGates.findIndex(g => g.gate === gateId);
    if (gateIndex === -1) throw new AppError('Invalid gate', 400);

    patientCase.verificationGates[gateIndex].status = status as GateStatus;
    patientCase.verificationGates[gateIndex].reviewerId = userId;
    patientCase.verificationGates[gateIndex].notes = notes;
    patientCase.verificationGates[gateIndex].evidence = evidence;
    
    if (status === 'PASSED' || status === 'FAILED') {
      patientCase.verificationGates[gateIndex].completedAt = new Date();
    }

    // Logic: If G8 is passed, automatically approve the case
    if (gateId === 'G8_PUBLICATION' && status === 'PASSED') {
      patientCase.status = 'APPROVED';
      patientCase.approvedAt = new Date();
      
      // Auto-create Campaign here
      const pName = patientCase.patientName || 'Unknown Patient';
      const diagDesc = patientCase.diagnosisDescription || 'No description provided';
      const longStory = diagDesc.padEnd(100, ' .');
      const paddedSummary = diagDesc.substring(0, 100).padEnd(50, ' .');
      const newCampaign = await Campaign.create({
        caseId: patientCase._id,
        title: pName + ' needs your help',
        slug: 'campaign-' + Date.now() + '-' + Math.random().toString(36).substring(7),
        summary: paddedSummary,
        story: longStory,
        goal: patientCase.fundraisingTarget,
        raisedAmount: 0,
        currency: patientCase.currency,
        status: 'active',
        createdBy: userId,
        publishedAt: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days default
      });
      
      patientCase.status = 'LIVE'; // Or leave as APPROVED and let campaign logic dictate. Let's set LIVE.
      
      await logAudit(req, 'CAMPAIGN_PUBLISHED', { caseId: patientCase._id, campaignId: newCampaign._id, note: 'Campaign automatically created upon G8 pass' });
    }

    // If any gate fails, we can optionally mark the whole case as failed/rejected
    if (status === 'FAILED') {
      patientCase.status = 'CANCELLED';
      patientCase.rejectionReason = `Failed at gate ${gateId}: ${notes}`;
    }

    await patientCase.save();

    await logAudit(req, 'CASE_UPDATED', { 
      caseId: id, 
      gateId, 
      status, 
      note: `Gate ${gateId} updated to ${status}` 
    });

    sendSuccess(res, { statusCode: 200, message: 'Gate updated successfully', data: patientCase });
  } catch (error) {
    next(error);
  }
};

// ─── Blood Requests Verification ──────────────────────────────────────────────

import { BloodRequest } from '../models/BloodRequest.model';
import { BloodRequestStatus } from '../models/constants';

export const updateBloodRequestStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const request = await BloodRequest.findById(id);
    if (!request) {
      throw new AppError('Blood request not found', 404);
    }

    const oldStatus = request.status;
    request.status = status as BloodRequestStatus;
    await request.save();

    await logAudit(req, 'UPDATE_BLOOD_REQUEST_STATUS', {
      caseId: id,
      note: `Changed status from ${oldStatus} to ${status}. ${note || ''}`
    });

    sendSuccess(res, {
      statusCode: 200,
      message: 'Blood request status updated',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};
