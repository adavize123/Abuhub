async function run() {
  const res = await fetch('http://localhost:5000/api/testimonials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Bad Actor', quote: 'Should not be allowed' }),
  });

  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Body:', text);
}

run().catch((error) => {
  console.error('Test failed:', error);
  process.exit(1);
});
