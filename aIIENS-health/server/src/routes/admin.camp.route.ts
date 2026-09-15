import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { getAllCampsAdmin, verifyCampStatus } from '../controllers/admin.camp.controller';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['ADMIN', 'SUPER_ADMIN', 'MEDICAL_REVIEWER']));

router.get('/', getAllCampsAdmin);
router.patch('/:id/verify', verifyCampStatus);

export const adminCampRouter = router;
