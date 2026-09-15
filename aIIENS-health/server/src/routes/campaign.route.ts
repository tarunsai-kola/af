import { Router } from 'express';
import { getCampaigns, getCampaignDetails } from '../controllers/campaign.controller';

const router = Router();

// Public routes
router.get('/', getCampaigns);
router.get('/:slug', getCampaignDetails);

export const campaignRouter = router;
