# Authentication System Documentation

## Overview

ABUHUB implements a complete JWT (JSON Web Token) based authentication system with secure password hashing, token refresh mechanism, and role-based access control.

## Architecture

### Backend Authentication

#### Files
- `backend/src/models/User.js` - User schema with authentication fields
- `backend/src/utils/jwtUtils.js` - JWT token generation and verification
- `backend/src/middleware/authMiddleware.js` - Route protection middleware
- `backend/src/controllers/authController.js` - Authentication business logic
- `backend/src/routes/authRoutes.js` - Auth endpoints

#### User Schema
```javascript
{
  id: String (UUID),
  email: String (unique, lowercase),
  passwordHash: String (bcrypt hashed),
  name: String,
  role: String enum ['admin', 'user'] (default: 'user'),
  isEmailVerified: Boolean (default: false),
  profile: {
    avatar: String,
    bio: String
  },
  timestamps: Date
}
```

#### Environment Variables
```
JWT_SECRET=your-secret-key-for-signing-tokens
JWT_EXPIRY=7d
REFRESH_TOKEN_EXPIRY=30d
```

### Frontend Authentication

#### Files
- `frontend/context/AuthContext.js` - Global auth state management
- `frontend/lib/api/authApi.js` - Centralized auth API calls
- `frontend/components/ProtectedRoute.js` - Route protection wrapper
- `frontend/app/login/page.js` - Login page
- `frontend/app/signup/page.js` - Signup page
- `frontend/app/dashboard/page.js` - User dashboard
- `frontend/app/profile/page.js` - User profile management
- `frontend/app/admin/page.js` - Admin dashboard
- `frontend/app/admin/blog/page.js` - Admin blog management (protected)

## API Endpoints

### Authentication Routes

#### POST `/api/auth/signup`
Create new user account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "tokens": {
      "accessToken": "jwt-token",
      "refreshToken": "jwt-refresh-token"
    }
  }
}
```

#### POST `/api/auth/login`
Authenticate user and get tokens

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "tokens": {
      "accessToken": "jwt-token",
      "refreshToken": "jwt-refresh-token"
    }
  }
}
```

#### POST `/api/auth/logout`
Invalidate user tokens (requires authentication)

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

#### GET `/api/auth/me`
Get current authenticated user (requires authentication)

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "profile": {}
  }
}
```

#### POST `/api/auth/refresh`
Get new access token using refresh token

**Request:**
```json
{
  "refreshToken": "jwt-refresh-token"
}
```

**Response:**
```json
{
  "data": {
    "accessToken": "new-jwt-token"
  }
}
```

#### POST `/api/auth/confirm-email`
Verify email address (optional email verification flow)

**Request:**
```json
{
  "token": "email-verification-token"
}
```

## Frontend Usage

### Using Authentication Context

```javascript
import { useAuth } from '@/context/AuthContext';

export default function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout, signup } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Link href="/login">Sign In</Link>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protecting Routes

```javascript
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminPanel() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

### Admin Role Check

```javascript
export default function AdminPage() {
  const { user, isLoading } = useAuth();

  if (user?.role !== 'admin') {
    return <div>Access Denied</div>;
  }

  return <AdminContent />;
}
```

### Login API Usage

```javascript
const result = await authApi.login(email, password);
// Returns: { user, tokens }
```

### Signup API Usage

```javascript
const result = await authApi.signup(email, password, firstName, lastName);
// Returns: { user, tokens }
```

## Security Features

### Password Security
- Passwords are hashed using bcryptjs with salt factor 10
- Raw passwords are never stored in the database
- Password field is excluded from API responses

### Token Management
- **Access Token**: Short-lived (7 days by default) for API requests
- **Refresh Token**: Long-lived (30 days by default) for getting new access tokens
- Tokens are stored in localStorage on the frontend
- Authorization header uses Bearer scheme: `Authorization: Bearer <token>`

### Middleware Protection
- `authMiddleware`: Required authentication check
- `optionalAuth`: Optional authentication (doesn't fail if no token)
- `roleMiddleware`: Role-based access control (admin only)

### Token Verification
- Tokens are cryptographically signed with JWT_SECRET
- Tampering is detected and rejected
- Expired tokens are automatically refreshed on the frontend

## Authentication Flow

### User Registration
1. User fills signup form with email, password, and name
2. Frontend validates input client-side
3. POST to `/api/auth/signup` with credentials
4. Backend hashes password with bcryptjs
5. Creates User record in MongoDB
6. Returns tokens and user data
7. Frontend stores tokens in localStorage
8. AuthContext updates with user data
9. User is redirected to dashboard

### User Login
1. User fills login form with email and password
2. Frontend validates input client-side
3. POST to `/api/auth/login` with credentials
4. Backend verifies email and password
5. If valid, generates JWT tokens
6. Returns tokens and user data
7. Frontend stores tokens in localStorage
8. AuthContext updates with user data
9. User is redirected to dashboard

### Access Protection
1. User tries to access protected route
2. ProtectedRoute component checks useAuth()
3. If not authenticated, redirects to `/login`
4. If authenticated, renders component
5. Admin routes additionally check `user.role === 'admin'`

### Token Refresh
1. User makes API request with access token
2. If token is expired (401), frontend catches error
3. Calls `/api/auth/refresh` with refresh token
4. Backend validates refresh token and issues new access token
5. Frontend updates localStorage with new token
6. Original request is retried with new token

## Frontend Pages

### `/login`
- Email and password form
- Client-side validation using React Hook Form
- API error handling and display
- Loading state during submission
- Link to signup page
- Redirect to dashboard on success

### `/signup`
- Name (first and last), email, password, and confirm password form
- Password strength indicator
- Terms and conditions checkbox
- Email validation
- Loading state during submission
- Link to login page
- Redirect to dashboard on success

### `/dashboard`
- Protected route (requires authentication)
- Displays user name and statistics
- Quick action buttons for creating blog posts
- View messages link
- Admin-only section with admin controls

### `/profile`
- Protected route (requires authentication)
- Edit profile information (name, bio)
- Email display (read-only)
- View account role
- Change password section
- Danger zone (account deletion)

### `/admin`
- Protected route (requires admin role)
- Admin dashboard with management cards
- Quick access to blog, users, services, messages
- Platform overview with statistics
- Role-based access check

### `/admin/blog`
- Protected route (requires admin role)
- Create, read, update, delete blog posts
- Rich form with title, content, category, tags
- Featured image upload with preview
- Post list with filtering and sorting

## Token Storage

Tokens are stored in browser's localStorage:

```javascript
// Access token
localStorage.getItem('accessToken')

// Tokens object
JSON.parse(localStorage.getItem('tokens'))
// Returns: { accessToken: '...', refreshToken: '...' }
```

**Note**: In production, consider using httpOnly cookies for improved security.

## Error Handling

### Common Error Responses

**Invalid Credentials (401)**
```json
{
  "message": "Invalid email or password"
}
```

**User Already Exists (400)**
```json
{
  "message": "Email already registered"
}
```

**Token Expired (401)**
```json
{
  "message": "Token expired"
}
```

**Access Denied (403)**
```json
{
  "message": "Admin access required"
}
```

## Configuration

### Backend Configuration (`backend/.env`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/abuhub
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRY=7d
REFRESH_TOKEN_EXPIRY=30d
NODE_ENV=development
```

### Frontend Configuration (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Best Practices

1. **Always validate input** on both frontend and backend
2. **Use HTTPS in production** for secure token transmission
3. **Keep JWT_SECRET secure** and never expose in version control
4. **Use httpOnly cookies** for token storage in production (instead of localStorage)
5. **Implement CSRF protection** when using cookies
6. **Log authentication events** for security auditing
7. **Implement rate limiting** on auth endpoints to prevent brute force
8. **Use refresh tokens** to minimize access token exposure
9. **Clear tokens on logout** to invalidate sessions
10. **Implement two-factor authentication** for enhanced security

## Future Enhancements

- [ ] Email verification on signup
- [ ] Password reset functionality
- [ ] OAuth integration (Google, GitHub)
- [ ] Two-factor authentication (2FA)
- [ ] Session management
- [ ] Account recovery options
- [ ] Login history tracking
- [ ] IP-based security checks
- [ ] Rate limiting on auth endpoints
- [ ] SAML integration for enterprise

## Troubleshooting

### "Token expired" Error
- Frontend automatically attempts token refresh
- If refresh fails, user is logged out
- User must login again

### "Invalid email or password"
- Check credentials are correct
- Email is case-insensitive but must exist
- Ensure password has no extra spaces

### "User already exists"
- Email is already registered
- Use a different email or login instead

### Cannot access admin pages
- User must have `role: 'admin'`
- Contact administrator to upgrade account

## Support

For authentication issues, check:
1. Backend logs for error messages
2. Frontend console for API errors
3. Network tab for failed requests
4. localStorage for token presence
5. User role in database
