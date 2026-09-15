const autocannon = require('autocannon');

async function run() {
  const url = process.env.TARGET_URL || 'http://127.0.0.1:5000';
  
  console.log(`Starting load test against ${url}...`);

  const instance = autocannon({
    url,
    connections: 10,
    duration: 10,
    requests: [
      { method: 'GET', path: '/api/campaigns' },
      { method: 'GET', path: '/api/impact/summary' },
      { method: 'GET', path: '/api/blood-requests' },
      { method: 'GET', path: '/api/camps' }
    ]
  }, (err, result) => {
    if (err) {
      console.error('Error running load test:', err);
    }
  });

  autocannon.track(instance, { renderProgressBar: false });

  instance.on('done', (result) => {
    console.log('\n================ LOAD TEST RESULTS ================');
    console.log(`Target: ${url}`);
    console.log(`Connections: ${result.connections}, Duration: ${result.duration}s`);
    console.log('---------------------------------------------------');
    console.log('Latency (ms):');
    console.log(`  p50: ${result.latency.p50}`);
    console.log(`  p95: ${result.latency.p95}`);
    console.log(`  p99: ${result.latency.p99}`);
    console.log(`  Max: ${result.latency.max}`);
    console.log('---------------------------------------------------');
    console.log(`Total Requests: ${result.requests.total}`);
    console.log(`Requests/sec: ${result.requests.average}`);
    console.log(`Errors: ${result.errors}`);
    console.log(`Timeouts: ${result.timeouts}`);
    console.log(`Non-2xx Responses: ${result.non2xx}`);
    console.log('===================================================');
  });
}

run();
