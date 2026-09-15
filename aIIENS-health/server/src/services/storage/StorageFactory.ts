import { StorageService } from './StorageService';
import { S3StorageService } from './S3StorageService';
import { LocalStorageService } from './LocalStorageService';
import { env } from '../../config/env';

let instance: StorageService | null = null;

export class StorageFactory {
  static getService(): StorageService {
    if (instance) return instance;

    if (env.STORAGE_PROVIDER === 's3') {
      const endpoint = process.env.S3_ENDPOINT || undefined;
      const region = process.env.S3_REGION || 'ap-south-1';
      const bucket = process.env.S3_BUCKET || '';
      const accessKeyId = process.env.S3_ACCESS_KEY || '';
      const secretAccessKey = process.env.S3_SECRET_KEY || '';

      if (!bucket || !accessKeyId || !secretAccessKey) {
        throw new Error(
          'S3 storage is configured but S3_BUCKET, S3_ACCESS_KEY, or S3_SECRET_KEY is missing. ' +
          'Set STORAGE_PROVIDER=local for development or provide valid S3 credentials.',
        );
      }

      instance = new S3StorageService({ endpoint, region, bucket, accessKeyId, secretAccessKey });
    } else {
      instance = new LocalStorageService(env.STORAGE_LOCAL_DIR || 'uploads/private');
    }

    return instance;
  }

  /** Reset singleton — used in tests */
  static reset(): void {
    instance = null;
  }
}
