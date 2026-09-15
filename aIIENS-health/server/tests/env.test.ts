import { execSync } from 'child_process';
import path from 'path';

describe('Environment Validation', () => {
  const serverScript = path.resolve(__dirname, '../src/server.ts');
  const runCmd = `npx tsx ${serverScript}`;

  it('should fail to start in production without S3 credentials', () => {
    try {
      execSync(runCmd, {
        env: {
          ...process.env,
          NODE_ENV: 'production',
          STORAGE_PROVIDER: 'local',
          MONGODB_URI: 'mongodb://localhost:27017/test',
          JWT_SECRET: 'testsecret12345678901234567890123',
          JWT_REFRESH_SECRET: 'testsecret12345678901234567890123',
        },
        stdio: 'pipe',
      });
      throw new Error('Server should have crashed');
    } catch (error: any) {
      const stderr = error.stderr ? error.stderr.toString() : error.message;
      expect(stderr).toContain('STORAGE_PROVIDER must be s3 in production');
      // Ensure secrets are not logged in output
      expect(stderr).not.toContain('testsecret12345678901234567890123');
    }
  });

  it('should fail if JWT_SECRET is missing', () => {
    try {
      execSync(runCmd, {
        env: {
          ...process.env,
          NODE_ENV: 'development',
          MONGODB_URI: 'mongodb://localhost:27017/test',
          JWT_SECRET: '', // Missing
          JWT_REFRESH_SECRET: 'testsecret12345678901234567890123',
        },
        stdio: 'pipe',
      });
      throw new Error('Server should have crashed');
    } catch (error: any) {
      const stderr = error.stderr ? error.stderr.toString() : error.message;
      expect(stderr).toContain('JWT_SECRET');
    }
  });
});
