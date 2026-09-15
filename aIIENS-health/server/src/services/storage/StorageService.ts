/**
 * StorageService — Abstract interface for object storage.
 *
 * All medical document file operations go through this interface.
 * Implementations: S3StorageService (production), LocalStorageService (development).
 *
 * SECURITY: This service must NEVER generate permanent public URLs.
 * All download URLs must be short-lived and presigned.
 */

export interface StorageObjectMetadata {
  key: string;
  size: number;
  contentType: string;
  lastModified?: Date;
  etag?: string;
}

export interface UploadParams {
  key: string;
  body: Buffer;
  contentType: string;
  metadata?: Record<string, string>;
}

export interface StorageService {
  /**
   * Upload a file to storage.
   * Returns the final storage key.
   */
  upload(params: UploadParams): Promise<string>;

  /**
   * Generate a short-lived presigned download URL.
   * @param key - The storage key.
   * @param expiresInSeconds - URL lifetime. Maximum 900 (15 minutes).
   */
  getSignedDownloadUrl(key: string, expiresInSeconds?: number): Promise<string>;

  /**
   * Delete an object from storage.
   */
  delete(key: string): Promise<void>;

  /**
   * Check whether an object exists at the given key.
   */
  exists(key: string): Promise<boolean>;

  /**
   * Get metadata for a stored object.
   */
  getMetadata(key: string): Promise<StorageObjectMetadata | null>;
}
