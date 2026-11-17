const fetch = globalThis.fetch || require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

async function run() {
  try {
    console.log('=== E2E Tests Start ===');

    // 1. Signup new user
    const ts = Date.now();
    const userEmail = `e2e.user+${ts}@example.com`;
    console.log('Signing up user:', userEmail);
    let res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, password: 'UserP@ss1', firstName: 'E2E', lastName: 'User' }),
    });
    let body = await res.json();
    console.log('Signup:', res.status, body.message || body);

    // 2. Login user
    res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, password: 'UserP@ss1' }),
    });
    body = await res.json();
    console.log('User login:', res.status, body.success ? 'ok' : body.message);
    const userAccess = body.data.tokens.accessToken;
    const userRefresh = body.data.tokens.refreshToken;

    // 3. Refresh token
    res = await fetch(`${API_BASE}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: userRefresh }),
    });
    body = await res.json();
    console.log('Token refresh:', res.status, body.success ? 'ok' : body.message);

    // 4. Get profile
    res = await fetch(`${API_BASE}/auth/profile`, { headers: { Authorization: `Bearer ${userAccess}` } });
    body = await res.json();
    console.log('Get profile:', res.status, body.success ? 'ok' : body.message);

    // 5. Update profile
    res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userAccess}` },
      body: JSON.stringify({ firstName: 'E2EUpdated' }),
    });
    body = await res.json();
    console.log('Update profile:', res.status, body.success ? 'ok' : body.message);

    // 6. Attempt to create testimonial as regular user (should be 403 or 401)
    res = await fetch(`${API_BASE}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userAccess}` },
      body: JSON.stringify({ name: 'User Tester', quote: 'This should be forbidden' }),
    });
    body = await res.json();
    console.log('User create testimonial expected fail:', res.status, body.message || body);

    // 7. Login as admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPass = process.env.ADMIN_PASSWORD || 'Admin@1234';
    res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password: adminPass }),
    });
    body = await res.json();
    console.log('Admin login:', res.status, body.success ? 'ok' : body.message);
    const adminAccess = body.data.tokens.accessToken;

    // 8. Create testimonial as admin
    res = await fetch(`${API_BASE}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminAccess}` },
      body: JSON.stringify({ name: 'E2E Admin', role: 'Admin', quote: 'Created by e2e admin', isPublished: true }),
    });
    body = await res.json();
    console.log('Admin create testimonial:', res.status, body.success ? 'ok' : body.message, body.data?.id);
    const createdId = body.data?.id;

    // 9. Get public testimonials
    res = await fetch(`${API_BASE}/testimonials`);
    body = await res.json();
    console.log('Public testimonials count:', Array.isArray(body.data) ? body.data.length : 'err');

    // 10. Delete created testimonial as admin
    if (createdId) {
      res = await fetch(`${API_BASE}/testimonials/${createdId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${adminAccess}` } });
      body = await res.json();
      console.log('Admin delete testimonial:', res.status, body.success ? 'ok' : body.message);
    }

    console.log('=== E2E Tests Completed ===');
  } catch (err) {
    console.error('E2E failed:', err);
    process.exit(1);
  }
}

run();
