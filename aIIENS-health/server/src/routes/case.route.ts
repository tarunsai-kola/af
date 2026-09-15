import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateObjectId } from '../middleware/validateObjectId';
import {
  createDraft,
  getCase,
  updateCase,
  uploadDocument,
  submitCase,
  getMyCases
} from '../controllers/case.controller';
import { upload } from '../utils/upload';

const router = Router();

// All case creation routes require authentication
router.use(requireAuth);

router.post('/', requireAuth, createDraft);
router.get('/', requireAuth, getMyCases);
router.get('/:id', validateObjectId('id'), requireAuth, getCase);
router.patch('/:id', validateObjectId('id'), requireAuth, updateCase);

// Handle single file upload with field name 'document'
router.post('/:id/documents', validateObjectId('id'), requireAuth, upload.single('document'), uploadDocument);

router.post('/:id/submit', validateObjectId('id'), requireAuth, submitCase);

export const caseRoutes = router;
