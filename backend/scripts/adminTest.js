const fetch = globalThis.fetch || require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

async function run() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@1234';

    // Login
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const login = await loginRes.json();
    if (!login.success) {
      console.error('Login failed:', login.message || JSON.stringify(login));
      process.exit(1);
    }
    const token = login.data.tokens.accessToken;
    console.log('Logged in as admin, token length:', token.length);

    // Create testimonial
    const createRes = await fetch(`${API_BASE}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: 'Admin Seed', role: 'Admin', quote: 'Admin-created testimonial', isPublished: true }),
    });

    const created = await createRes.json();
    console.log('Create status:', createRes.status, created);
  } catch (err) {
    console.error('Admin test failed:', err);
    process.exit(1);
  }
}

run();
