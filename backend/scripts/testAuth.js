const fetch = globalThis.fetch || require('node-fetch');

(async () => {
  try {
    const ts = Date.now();
    const email = `testuser+${ts}@example.com`;
    const signupRes = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'P@ssw0rd123', firstName: 'Test', lastName: 'User' }),
    });
    const signup = await signupRes.json();
    console.log('Signup:', signup.success, signup.message);

    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'P@ssw0rd123' }),
    });
    const login = await loginRes.json();
    console.log('Login:', login.success ? 'ok' : 'failed');
    if (login.success) console.log('Access token length:', (login.data.tokens.accessToken || '').length);
  } catch (err) {
    console.error('Auth test failed:', err);
  }
})();
