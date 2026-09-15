import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getMyFamilyMembers,
  createFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
} from '../controllers/familyMember.controller';

const router = Router();

router.use(requireAuth); // All routes require authentication

router.get('/', getMyFamilyMembers);
router.post('/', createFamilyMember);
router.put('/:id', updateFamilyMember);
router.delete('/:id', deleteFamilyMember);

export const familyMemberRouter = router;
