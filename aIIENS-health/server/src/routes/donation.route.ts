import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getDonation } from '../controllers/donation.controller';

const router = Router();

router.get('/:id', requireAuth, getDonation);

export const donationRouter = router;
