import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { createOrder, verifyPayment, webhook } from '../controllers/payment.controller';

const router = Router();

router.post('/create', requireAuth, createOrder);
router.post('/verify', requireAuth, verifyPayment);
router.post('/webhook', webhook);

export const paymentRouter = router;
