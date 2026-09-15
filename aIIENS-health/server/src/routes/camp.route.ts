import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  createCamp,
  updateCamp,
  getPublicCamps,
  getCampDetails,
  registerForCamp
} from '../controllers/camp.controller';

const router = Router();

router.get('/', getPublicCamps);
router.get('/:id', getCampDetails);
router.post('/', requireAuth, createCamp);
router.patch('/:id', requireAuth, updateCamp);
router.post('/:id/register', requireAuth, registerForCamp);

export const campRouter = router;
