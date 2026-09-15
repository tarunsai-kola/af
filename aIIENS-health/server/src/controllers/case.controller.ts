import { Request, Response, NextFunction } from 'express';
import { PatientCase } from '../models/PatientCase.model';
import { MedicalDocument } from '../models/MedicalDocument.model';

import { AppError } from '../utils/AppError';
import { sendSuccess } from '../utils/apiResponse';
import { auditService } from '../services/audit.service';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Helper to log audit events
const logAudit = async (req: Request, action: string, details: any, caseId?: string) => {
  const userId = (req as any).user?.userId || (req as any).user?.id;
  await auditService.log({
    actorUserId: userId,
    action: 'CASE_CREATED' as any, // Or a dynamic mapped action
    objectType: 'PatientCase',
    objectId: caseId || details.caseId,
    changeSummary: details.note || action,
    source: 'api',
    ipAddress: req.ip || '0.0.0.0',
    userAgent: req.headers['user-agent'] || 'API'
  });
};

export const createDraft = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    const newCase = await PatientCase.create({
      guardianUserId: userId,
      status: 'DRAFT',
    });

    await logAudit(req, 'CASE_CREATED', { caseId: newCase._id, note: 'Draft created' }, newCase._id.toString());

    sendSuccess(res, { statusCode: 201, message: 'Draft created successfully', data: { id: newCase._id } });
  } catch (error) {
    next(error);
  }
};

export const getCase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id || (req as any).user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    const patientCase = await PatientCase.findById(id).populate('hospitalId', 'name address');
    if (!patientCase) throw new AppError('Case not found', 404);

    // Verify ownership or admin
    const roles = (req as any).user?.roles || (req as any).user?.role || [];
    const isSuperAdmin = Array.isArray(roles) ? roles.includes('SUPER_ADMIN') : roles === 'SUPER_ADMIN';
    if (patientCase.guardianUserId.toString() !== userId && !isSuperAdmin) {
      throw new AppError('Forbidden', 403);
    }

    sendSuccess(res, { statusCode: 200, message: 'Case details retrieved', data: patientCase });
  } catch (error) {
    next(error);
  }
};

export const getMyCases = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    const cases = await PatientCase.find({ guardianUserId: userId })
      .populate('hospitalId', 'name')
      .sort({ createdAt: -1 });

    sendSuccess(res, { statusCode: 200, message: 'My cases retrieved', data: cases });
  } catch (error) {
    next(error);
  }
};

export const updateCase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id || (req as any).user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    const patientCase = await PatientCase.findById(id);
    if (!patientCase) throw new AppError('Case not found', 404);

    if (patientCase.guardianUserId.toString() !== userId) {
      throw new AppError('Forbidden', 403);
    }

    if (patientCase.status !== 'DRAFT') {
      throw new AppError('Only draft cases can be freely updated', 400);
    }

    const updatableFields = [
      'patientUserId', 'patientName', 'patientAge', 'patientGender', 'patientRelation', 
      'hospitalId', 'diagnosisCategory', 'diagnosisDescription', 
      'treatmentPlan', 'estimatedCost', 'currency', 'costBreakdown', 'fundraisingTarget', 'urgency'
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        (patientCase as any)[field] = req.body[field];
      }
    });

    await patientCase.save();

    await logAudit(req, 'CASE_UPDATED', { caseId: patientCase._id, note: 'Draft updated' }, patientCase._id.toString());

    sendSuccess(res, { statusCode: 200, message: 'Case updated successfully', data: patientCase });
  } catch (error) {
    next(error);
  }
};

export const uploadDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { documentType } = req.body;
    const userId = (req as any).user?.id || (req as any).user?.userId;
    const file = req.file;

    if (!userId) throw new AppError('Unauthorized', 401);
    if (!file) throw new AppError('No file uploaded', 400);
    if (!documentType) {
      if (file.path) fs.unlinkSync(file.path);
      throw new AppError('documentType is required', 400);
    }

    // Server-side extension validation — never trust client MIME alone
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
    if (!allowedExtensions.includes(ext)) {
      if (file.path) fs.unlinkSync(file.path);
      throw new AppError('Invalid file extension. Only PDF, JPG, and PNG are allowed.', 400);
    }

    // Suspicious pattern detection
    const suspiciousPatterns = /\.(exe|sh|bat|cmd|ps1|vbs|js|php|py|rb|pl)$/i;
    if (suspiciousPatterns.test(file.originalname)) {
      if (file.path) fs.unlinkSync(file.path);
      throw new AppError('Suspicious file detected', 400);
    }

    const patientCase = await PatientCase.findById(id);
    if (!patientCase) {
      if (file.path) fs.unlinkSync(file.path);
      throw new AppError('Case not found', 404);
    }

    if (patientCase.guardianUserId.toString() !== userId) {
      if (file.path) fs.unlinkSync(file.path);
      throw new AppError('Forbidden', 403);
    }

    // Read file buffer and compute SHA-256 hash server-side
    const fileBuffer = fs.readFileSync(file.path);
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Generate safe storage key — never use original filename
    const docId = new (require('mongoose').Types.ObjectId)();
    const randomKey = crypto.randomBytes(16).toString('hex');
    const storageKey = `medical-documents/${patientCase._id}/${docId}/${randomKey}${ext}`;

    // Upload via storage abstraction
    const { StorageFactory } = require('../services/storage/StorageFactory');
    const storage = StorageFactory.getService();
    await storage.upload({
      key: storageKey,
      body: fileBuffer,
      contentType: file.mimetype,
      metadata: { caseId: id, documentType, uploadedBy: userId },
    });

    // Clean up local temp file (multer always writes to disk first)
    if (file.path) fs.unlinkSync(file.path);

    const document = await MedicalDocument.create({
      _id: docId,
      caseId: patientCase._id,
      documentType,
      storageKey,
      storageProvider: process.env.STORAGE_PROVIDER || 'local',
      fileHash,
      mimeType: file.mimetype,
      fileSizeBytes: file.size,
      originalFileName: file.originalname,
      accessPolicy: 'case_team',
      uploadedBy: userId,
      issuerName: 'Pending verification',
    });

    await logAudit(req, 'DOCUMENT_UPLOADED', { caseId: id, documentId: document._id, type: documentType }, id);

    sendSuccess(res, { statusCode: 201, message: 'Document uploaded successfully', data: document });
  } catch (error) {
    next(error);
  }
};

export const submitCase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id || (req as any).user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    const patientCase = await PatientCase.findById(id);
    if (!patientCase) throw new AppError('Case not found', 404);

    if (patientCase.guardianUserId.toString() !== userId) {
      throw new AppError('Forbidden', 403);
    }

    if (patientCase.status !== 'DRAFT') {
      throw new AppError('Only drafts can be submitted', 400);
    }

    // Basic validation before submission
    if (!patientCase.hospitalId || !patientCase.diagnosisDescription || !patientCase.fundraisingTarget) {
      throw new AppError('Missing required fields for submission', 400);
    }

    // Verify documents exist
    const documentsCount = await MedicalDocument.countDocuments({ caseId: patientCase._id });
    if (documentsCount === 0) {
      throw new AppError('At least one medical document is required for submission', 400);
    }

    patientCase.status = 'UNDER_VERIFICATION';
    await patientCase.save();

    await logAudit(req, 'CASE_UPDATED', { caseId: id, note: 'Case submitted for verification', newStatus: 'UNDER_VERIFICATION' }, id);

    sendSuccess(res, { statusCode: 200, message: 'Case submitted for verification successfully', data: patientCase });
  } catch (error) {
    next(error);
  }
};
