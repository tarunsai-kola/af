import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  createBloodRequest,
  getBloodRequests,
  getMyBloodRequests,
  getBloodRequestDetails,
  cancelBloodRequest,
} from '../controllers/bloodRequest.controller';

const router = Router();

router.get('/', getBloodRequests);                          // Public feed
router.get('/me', requireAuth, getMyBloodRequests);         // My requests
router.get('/:id', getBloodRequestDetails);                 // Public detail
router.post('/', requireAuth, createBloodRequest);          // Raise emergency
router.patch('/:id/cancel', requireAuth, cancelBloodRequest); // Cancel own request

export const bloodRequestRouter = router;
