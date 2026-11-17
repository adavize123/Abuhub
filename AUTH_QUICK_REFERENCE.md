# Authentication Quick Reference

## Quick Start Guide

### For Frontend Developers

#### 1. Use Authentication in Components
```javascript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

#### 2. Protect Routes
```javascript
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>Protected content</div>
    </ProtectedRoute>
  );
}
```

#### 3. Check Admin Role
```javascript
const { user } = useAuth();

if (user?.role === 'admin') {
  // Show admin features
}
```

#### 4. Use Auth API
```javascript
import { authApi } from '@/lib/api/authApi';

// Signup
const result = await authApi.signup(email, password, firstName, lastName);

// Login
const result = await authApi.login(email, password);

// Logout
await authApi.logout();

// Get current user
const user = await authApi.getCurrentUser();
```

### For Backend Developers

#### 1. Protect Routes
```javascript
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

// Require authentication
router.get('/api/data', authMiddleware, (req, res) => {
  // req.user contains authenticated user
});

// Require admin role
router.post('/api/admin/action', 
  authMiddleware, 
  roleMiddleware('admin'), 
  (req, res) => {
    // Only admins can access
  }
);
```

#### 2. Verify Tokens
```javascript
import { verifyToken } from '../utils/jwtUtils.js';

try {
  const decoded = verifyToken(token);
  console.log(decoded); // { userId, email, role, iat, exp }
} catch (error) {
  console.log('Invalid token');
}
```

#### 3. Generate Tokens
```javascript
import { generateTokens } from '../utils/jwtUtils.js';

const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);
```

#### 4. Create Users
```javascript
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Manual creation
const user = new User({
  email: 'user@example.com',
  password: 'plainPassword123', // Will be hashed by pre-save hook
  name: 'John Doe'
});
await user.save();

// Find by email
const user = await User.findOne({ email: 'user@example.com' });

// Verify password
const isValid = await user.comparePassword('plainPassword123');
```

## Common Tasks

### Add Authentication to Existing Component

```javascript
'use client';

import { useAuth } from '@/context/AuthContext';

export default function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <p>Please login</p>;
  
  return <div>Hello, {user.name}!</div>;
}
```

### Create Protected API Endpoint

```javascript
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/my-data', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    // Use userId to fetch user-specific data
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### Make Authenticated API Request

```javascript
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Make request
const response = await client.get('/protected-endpoint');
```

### Handle Login Form

```javascript
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  
  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" />
      <input {...register('password')} type="password" />
      <button type="submit">Login</button>
    </form>
  );
}
```

## API Reference

### Auth Endpoints

```
POST   /api/auth/signup      # Register new user
POST   /api/auth/login       # User login
POST   /api/auth/logout      # User logout (requires auth)
GET    /api/auth/me          # Get current user (requires auth)
POST   /api/auth/refresh     # Get new access token
POST   /api/auth/confirm-email # Verify email
```

### Request/Response Examples

#### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure123",
    "name": "John Doe"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure123"
  }'
```

#### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Refresh Token
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## Context API Methods

### useAuth Hook

```javascript
const {
  user,              // Current authenticated user object
  isAuthenticated,   // Boolean: is user logged in?
  isLoading,         // Boolean: is auth state loading?
  error,             // Error message if any
  login,             // Function: login(email, password)
  logout,            // Function: logout()
  signup,            // Function: signup(email, password, name)
  refreshToken       // Function: refreshToken()
} = useAuth();
```

## State Management

### Stored in localStorage
```javascript
// Access token
localStorage.getItem('accessToken')

// Tokens object
localStorage.getItem('tokens')
// JSON: { accessToken: '...', refreshToken: '...' }

// User data (if stored)
localStorage.getItem('user')
```

### Stored in Memory (Lost on Refresh)
- `user` - Current user object
- `isAuthenticated` - Auth state
- `isLoading` - Loading state
- `error` - Error messages

### Persistence
- Tokens are stored in localStorage
- User data is fetched from `/api/auth/me` on page load
- Auth state is restored on component mount

## Error Handling

### Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| Invalid email or password | Wrong credentials | Check email/password are correct |
| Email already registered | User exists | Use different email or login |
| Token expired | Token outdated | Token auto-refreshes, user gets re-authenticated |
| Admin access required | User not admin | Contact administrator |
| User not authenticated | Missing token | User must login first |

### Error Codes

- `400` - Bad request (validation error)
- `401` - Unauthorized (invalid token/credentials)
- `403` - Forbidden (insufficient permissions)
- `409` - Conflict (email already exists)
- `500` - Server error

## Environment Variables

### Backend (.env)
```
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=7d
REFRESH_TOKEN_EXPIRY=30d
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Development Tips

### Debug Authentication State
```javascript
import { useAuth } from '@/context/AuthContext';

function DebugAuth() {
  const auth = useAuth();
  
  useEffect(() => {
    console.log('Auth state:', auth);
  }, [auth]);
  
  return <div>Check console</div>;
}
```

### Check Token
```javascript
// In browser console
JSON.parse(localStorage.getItem('tokens'))

// Decode token (install jwt-decode)
import jwtDecode from 'jwt-decode';
jwtDecode(token)
```

### View User Data
```javascript
// In browser console
JSON.parse(localStorage.getItem('user'))
```

### Test Protected Route
```javascript
// Navigate to /admin without logging in
// Should redirect to /login

// Login and try again
// Should show admin content
```

## Best Practices

✅ **Do:**
- Use `useAuth()` hook for auth state
- Use `ProtectedRoute` for protected pages
- Check `isLoading` before rendering
- Handle errors gracefully
- Store sensitive data server-side
- Use httpOnly cookies in production

❌ **Don't:**
- Store sensitive data in localStorage (production)
- Make unencrypted API calls
- Expose JWT_SECRET
- Skip input validation
- Use hardcoded credentials
- Store passwords in code

## Resources

- [Authentication Documentation](./AUTHENTICATION.md)
- [Implementation Summary](./AUTH_IMPLEMENTATION_SUMMARY.md)
- [JWT Docs](https://jwt.io/)
- [bcryptjs Docs](https://www.npmjs.com/package/bcryptjs)
- [React Hook Form](https://react-hook-form.com/)

## Support

For issues:
1. Check AUTHENTICATION.md for detailed documentation
2. Review implementation summary for architecture
3. Check browser console for error messages
4. Verify tokens in localStorage
5. Check backend logs for API errors
