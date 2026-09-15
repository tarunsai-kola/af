import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  registerDonor,
  getMyDonorProfile,
  updateAvailability,
  searchDonors
} from '../controllers/donor.controller';

const router = Router();

router.get('/search', searchDonors); // Public discovery endpoint (coordination only)
router.post('/', requireAuth, registerDonor);
router.get('/me', requireAuth, getMyDonorProfile);
router.patch('/availability', requireAuth, updateAvailability);

export const donorRouter = router;
