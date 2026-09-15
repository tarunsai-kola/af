import { createApp } from '../src/app';
import http from 'http';
import mongoose from 'mongoose';
import { env } from '../src/config/env';

async function runLoadTest() {
  console.log('Connecting to database...');
  await mongoose.connect(env.MONGODB_URI);
  
  const app = createApp();
  const server = http.createServer(app);
  
  await new Promise<void>((resolve) => server.listen(5001, resolve));
  console.log('Server running on port 5001 for load testing...');

  const endpoints = [
    '/api/health',
    '/api/impact/summary',
    '/api/camps',
    '/api/blood-requests'
  ];

  console.log('Starting load test (100 concurrent requests per endpoint)...');

  const start = performance.now();
  let successCount = 0;
  let failCount = 0;

  const requests = [];
  
  for (const endpoint of endpoints) {
    for (let i = 0; i < 100; i++) {
      requests.push(
        fetch(`http://localhost:5001${endpoint}`)
          .then(res => {
            if (res.ok) successCount++;
            else failCount++;
          })
          .catch(() => failCount++)
      );
    }
  }

  await Promise.all(requests);
  const duration = performance.now() - start;

  console.log('--- LOAD TEST RESULTS ---');
  console.log(`Total Requests : ${requests.length}`);
  console.log(`Success        : ${successCount}`);
  console.log(`Failed         : ${failCount}`);
  console.log(`Total Time     : ${duration.toFixed(2)} ms`);
  console.log(`Throughput     : ${((requests.length / duration) * 1000).toFixed(2)} req/sec`);
  
  const memoryUsage = process.memoryUsage();
  console.log(`Heap Used      : ${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`);
  console.log(`RSS            : ${Math.round(memoryUsage.rss / 1024 / 1024)} MB`);

  server.close();
  await mongoose.disconnect();
  console.log('Load test completed.');
}

runLoadTest().catch(console.error);
