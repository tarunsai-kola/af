import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { getImpactSummary, getImpactInspection } from '../controllers/impact.controller';

const router = Router();

// Public route (cached)
router.get('/summary', getImpactSummary);

// Admin route (live DB inspection)
router.get('/inspect', requireAuth, requireRole(['ADMIN', 'SUPER_ADMIN', 'FINANCE_OFFICER']), getImpactInspection);

export const impactRouter = router;
