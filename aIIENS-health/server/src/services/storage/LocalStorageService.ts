import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { StorageService, UploadParams, StorageObjectMetadata } from './StorageService';

/**
 * LocalStorageService — Development-only fallback.
 *
 * Wraps local disk storage behind the same StorageService interface.
 * In development, "presigned URLs" are simply local file paths served
 * through the Express static middleware or a dedicated download route.
 *
 * WARNING: This must NEVER be used in production for medical documents.
 */
export class LocalStorageService implements StorageService {
  private baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = path.resolve(baseDir);
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async upload(params: UploadParams): Promise<string> {
    const dir = path.dirname(path.join(this.baseDir, params.key));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const fullPath = path.join(this.baseDir, params.key);
    fs.writeFileSync(fullPath, params.body);
    return params.key;
  }

  async getSignedDownloadUrl(key: string, _expiresInSeconds = 900): Promise<string> {
    // In local dev, return a token-based internal URL
    // The actual file serving is handled by the document download endpoint
    const token = crypto.randomBytes(16).toString('hex');
    return `/api/documents/local-download/${token}?key=${encodeURIComponent(key)}`;
  }

  async delete(key: string): Promise<void> {
    const fullPath = path.join(this.baseDir, key);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  async exists(key: string): Promise<boolean> {
    return fs.existsSync(path.join(this.baseDir, key));
  }

  async getMetadata(key: string): Promise<StorageObjectMetadata | null> {
    const fullPath = path.join(this.baseDir, key);
    if (!fs.existsSync(fullPath)) return null;

    const stats = fs.statSync(fullPath);
    return {
      key,
      size: stats.size,
      contentType: 'application/octet-stream',
      lastModified: stats.mtime,
    };
  }

  /** Direct file read for local dev download endpoint */
  getFilePath(key: string): string {
    return path.join(this.baseDir, key);
  }
}
