import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateObjectId } from '../middleware/validateObjectId';
import { getDocumentDownloadUrl } from '../controllers/document.controller';

const router = Router();

router.use(requireAuth);

// GET /api/documents/:id/download-url
// Generates a short-lived presigned URL after authorization checks
router.get('/:id/download-url', validateObjectId('id'), getDocumentDownloadUrl);

export const documentRouter = router;
