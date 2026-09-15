import { Router } from 'express';
import healthRouter from './health.route';
import authRoutes from './auth.route';
import { caseRoutes } from './case.route';
import { adminRoutes } from './admin.route';

const apiRouter = Router();

// ── Auth ───────────────────────────────────────────────────────────────────────
apiRouter.use('/auth', authRoutes);

// ── Health ─────────────────────────────────────────────────────────────────────
apiRouter.use('/health', healthRouter);

// ── Cases ──────────────────────────────────────────────────────────────────────
apiRouter.use('/cases', caseRoutes);

// ── Admin ──────────────────────────────────────────────────────────────────────
apiRouter.use('/admin', adminRoutes);

import { financeRoutes } from './finance.route';
apiRouter.use('/admin/finance', financeRoutes);

// ── Campaigns ──────────────────────────────────────────────────────────────────
import { campaignRouter } from './campaign.route';
apiRouter.use('/campaigns', campaignRouter);

// ── Future module routes (uncomment as modules are built) ──────────────────────
// apiRouter.use('/users', authenticate, userRouter);

import { campRouter } from './camp.route';
import { adminCampRouter } from './admin.camp.route';
apiRouter.use('/camps', campRouter);
apiRouter.use('/admin/camps', adminCampRouter);

import { auditRouter } from './audit.route';
apiRouter.use('/admin/audit', auditRouter);

import { donorRouter } from './donor.route';
import { bloodRequestRouter } from './bloodRequest.route';
import { impactRouter } from './impact.route';
apiRouter.use('/donors', donorRouter);
apiRouter.use('/blood-requests', bloodRequestRouter);
apiRouter.use('/impact', impactRouter);

import { paymentRouter } from './payment.route';
import { donationRouter } from './donation.route';
apiRouter.use('/payments', paymentRouter);
apiRouter.use('/donations', donationRouter);

import { documentRouter } from './document.route';
apiRouter.use('/documents', documentRouter);

import { familyMemberRouter } from './familyMember.route';
apiRouter.use('/family-members', familyMemberRouter);

export default apiRouter;

