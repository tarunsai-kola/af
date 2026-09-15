import { Request, Response, NextFunction } from 'express';
import { MedicalDocument } from '../models/MedicalDocument.model';
import { PatientCase } from '../models/PatientCase.model';
import { StorageFactory } from '../services/storage/StorageFactory';
import { auditService } from '../services/audit.service';
import { AppError } from '../utils/AppError';
import { sendSuccess } from '../utils/apiResponse';

/**
 * GET /api/documents/:id/download-url
 *
 * Security chain:
 *   1. Authenticate user (requireAuth middleware)
 *   2. Validate ObjectId (validateObjectId middleware)
 *   3. Load document with private fields (+storageKey +storageProvider)
 *   4. Load related PatientCase
 *   5. Check RBAC: user must be case guardian OR an authorized admin role
 *   6. Create audit event (DOCUMENT_ACCESSED)
 *   7. Generate 15-minute presigned URL
 *   8. Return URL to client
 *
 * The presigned URL is the ONLY way to download a medical document.
 * Storage credentials are NEVER exposed to the React client.
 */
export const getDocumentDownloadUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id || (req as any).user?.userId;
    const userRoles: string[] = Array.isArray((req as any).user?.roles)
      ? (req as any).user.roles
      : [(req as any).user?.role].filter(Boolean);

    if (!userId) throw new AppError('Unauthorized', 401);

    // Load document WITH private fields
    const doc = await MedicalDocument.findById(id)
      .select('+storageKey +storageProvider +fileHash');

    if (!doc) throw new AppError('Document not found', 404);

    // Load the parent case to verify access
    const patientCase = await PatientCase.findById(doc.caseId);
    if (!patientCase) throw new AppError('Related case not found', 404);

    // RBAC: Only case guardian or authorized admin roles can access
    const isOwner = patientCase.guardianUserId.toString() === userId;
    const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'CASE_OFFICER', 'MEDICAL_REVIEWER', 'HOSPITAL_VERIFIER'];
    const isAdmin = userRoles.some((r: string) => adminRoles.includes(r));

    if (!isOwner && !isAdmin) {
      console.error('Document access 403:', { isOwner, isAdmin, userId, userRoles, patientCaseGuardian: patientCase.guardianUserId.toString() });
      throw new AppError('You do not have permission to access this document', 403);
    }

    // Audit: Record document access
    await auditService.log({
      actorUserId: userId,
      actorRole: userRoles[0] || 'PUBLIC_USER',
      action: 'DOCUMENT_ACCESSED',
      objectType: 'MedicalDocument',
      objectId: doc._id,
      changeSummary: `Document ${doc.documentType} accessed for case ${doc.caseId}`,
      source: 'web',
      requestId: req.headers['x-request-id'] as string,
    });

    // Generate short-lived presigned URL (15 minutes max)
    const storage = StorageFactory.getService();
    const downloadUrl = await storage.getSignedDownloadUrl(doc.storageKey, 900);

    sendSuccess(res, {
      statusCode: 200,
      message: 'Download URL generated',
      data: {
        url: downloadUrl,
        expiresInSeconds: 900,
        mimeType: doc.mimeType,
        fileName: doc.originalFileName,
      },
    });
  } catch (error) {
    next(error);
  }
};
