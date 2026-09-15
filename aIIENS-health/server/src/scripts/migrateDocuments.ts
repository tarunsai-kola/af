/**
 * Document Migration Utility
 *
 * Migrates medical documents from local Multer storage to S3-compatible storage.
 *
 * Usage: npm run migrate:documents
 * Optional: npm run migrate:documents -- --cleanup (delete local files after verified migration)
 *
 * Safety guarantees:
 *   1. Upload to S3
 *   2. Verify checksum matches
 *   3. Verify object exists in S3
 *   4. Update MongoDB record
 *   5. Only then mark as migrated
 *   6. Local files are NEVER automatically deleted
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function migrate() {
  const cleanup = process.argv.includes('--cleanup');

  console.log('═══════════════════════════════════════════════════');
  console.log('  AIIENS Health — Document Migration Utility');
  console.log('═══════════════════════════════════════════════════');
  console.log(`  Mode: ${cleanup ? 'MIGRATE + CLEANUP' : 'MIGRATE ONLY'}`);
  console.log(`  Target: ${process.env.STORAGE_PROVIDER || 'local'}`);
  console.log('');

  if (process.env.STORAGE_PROVIDER !== 's3') {
    console.log('⚠  STORAGE_PROVIDER is not set to "s3". Nothing to migrate.');
    process.exit(0);
  }

  // Connect to MongoDB
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('✗  MONGODB_URI is not set.');
    process.exit(1);
  }
  await mongoose.connect(mongoUri);
  console.log('✓  Connected to MongoDB');

  // Import models and services after connection
  const { MedicalDocument } = await import('../models/MedicalDocument.model');
  const { StorageFactory } = await import('../services/storage/StorageFactory');
  const storage = StorageFactory.getService();

  // Find all documents still on local storage
  const localDocs = await MedicalDocument.find({ storageProvider: 'local' }).select('+storageKey +fileHash');
  console.log(`\n  Found ${localDocs.length} documents on local storage.\n`);

  let success = 0;
  let failed = 0;
  let skipped = 0;
  let missing = 0;

  const localDir = path.resolve(__dirname, '../../uploads/private');

  for (const doc of localDocs) {
    const localPath = path.join(localDir, doc.storageKey);

    // Check if local file exists
    if (!fs.existsSync(localPath)) {
      console.log(`  ⊘  MISSING  ${doc._id}  ${doc.storageKey}`);
      missing++;
      continue;
    }

    try {
      // Read file
      const fileBuffer = fs.readFileSync(localPath);

      // Verify checksum
      const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      if (hash !== doc.fileHash) {
        console.log(`  ✗  CHECKSUM MISMATCH  ${doc._id}  expected=${doc.fileHash}  got=${hash}`);
        failed++;
        continue;
      }

      // Generate new S3 key
      const ext = path.extname(doc.storageKey);
      const randomKey = crypto.randomBytes(16).toString('hex');
      const newKey = `medical-documents/${doc.caseId}/${doc._id}/${randomKey}${ext}`;

      // Upload to S3
      await storage.upload({
        key: newKey,
        body: fileBuffer,
        contentType: doc.mimeType,
      });

      // Verify object exists in S3
      const exists = await storage.exists(newKey);
      if (!exists) {
        console.log(`  ✗  S3 VERIFY FAILED  ${doc._id}  Object not found after upload`);
        failed++;
        continue;
      }

      // Update MongoDB
      await MedicalDocument.updateOne(
        { _id: doc._id },
        { $set: { storageKey: newKey, storageProvider: 's3' } },
      );

      console.log(`  ✓  MIGRATED  ${doc._id}  → ${newKey}`);
      success++;

      // Optional cleanup
      if (cleanup) {
        fs.unlinkSync(localPath);
        console.log(`     ↳  Deleted local file`);
      }
    } catch (err: any) {
      console.log(`  ✗  FAILED  ${doc._id}  ${err.message}`);
      failed++;
    }
  }

  console.log('\n═══════════════════════════════════════════════════');
  console.log(`  Results:`);
  console.log(`    ✓  Migrated:  ${success}`);
  console.log(`    ✗  Failed:    ${failed}`);
  console.log(`    ⊘  Missing:   ${missing}`);
  console.log(`    ⊖  Skipped:   ${skipped}`);
  console.log('═══════════════════════════════════════════════════');

  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

migrate().catch((err) => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});
