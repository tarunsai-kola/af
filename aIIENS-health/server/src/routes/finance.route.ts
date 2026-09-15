import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import {
  getFinanceMetrics,
  getDonations,
  getSettlements,
  updateSettlementStatus,
  getReconciliationReport
} from '../controllers/finance.controller';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['FINANCE_OFFICER', 'SUPER_ADMIN', 'ADMIN']));

router.get('/metrics', getFinanceMetrics);
router.get('/donations', getDonations);
router.get('/settlements', getSettlements);
router.post('/settlements/:id/update-status', updateSettlementStatus);
router.get('/reconciliation', getReconciliationReport);

export const financeRoutes = router;
