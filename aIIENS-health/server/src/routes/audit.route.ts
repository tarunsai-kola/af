import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { getAuditLogs } from '../controllers/audit.controller';

const router = Router();

router.use(requireAuth);
// Only highly privileged roles can view audit logs
router.use(requireRole(['SUPER_ADMIN', 'ADMIN', 'FINANCE_OFFICER']));

router.get('/', getAuditLogs);

export const auditRouter = router;
