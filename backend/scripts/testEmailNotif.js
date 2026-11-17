// Simple script to POST a testimonial (public submission) to trigger notifications
const fetch = globalThis.fetch || require('node-fetch');

(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Email Test', quote: 'Triggering email notification (test)', role: 'Tester' }),
    });
    const body = await res.json();
    console.log('Status:', res.status, body);
  } catch (err) {
    console.error('Test failed:', err);
  }
})();
