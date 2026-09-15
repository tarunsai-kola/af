import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getMetrics,
  getCases,
  getCaseDetails,
  updateVerificationGate,
  updateBloodRequestStatus
} from '../controllers/admin.controller';

const router = Router();

// All admin routes require authentication and some RBAC check.
// We'll enforce a baseline that the user must not be just a PUBLIC_USER or DONOR
// (Specific gate permissions are handled in the controller).
router.use(requireAuth);
// TODO: Add a role middleware here if needed, e.g., requireRole(['ADMIN', 'CASE_OFFICER', ...])

router.get('/metrics', getMetrics);
router.get('/cases', getCases);
router.get('/cases/:id', getCaseDetails);
router.post('/cases/:id/verify/:gateId', updateVerificationGate);

router.patch('/blood-requests/:id/status', updateBloodRequestStatus);

export const adminRoutes = router;
