# ABUHUB Developer Quick Start

## 🚀 Quick Overview

ABUHUB is a complete full-stack platform built with **Next.js 14**, **Express.js**, and **MongoDB** featuring:
- ✅ User authentication with JWT
- ✅ Complete admin dashboard
- ✅ Blog management system
- ✅ Smooth animations & modern UI
- ✅ Role-based access control

---

## 📦 Project Structure

```
Abuhub/
├── frontend/               # Next.js React app
│   ├── app/               # App router pages
│   │   ├── admin/         # Admin dashboard (7 pages)
│   │   ├── login/         # Authentication pages
│   │   └── blog/          # Blog pages
│   ├── components/        # Reusable components
│   ├── context/           # AuthContext for state
│   ├── lib/               # Utilities and hooks
│   └── styles/            # Global CSS
│
├── backend/               # Express.js API
│   ├── src/
│   │   ├── models/        # MongoDB schemas
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Auth middleware
│   │   └── server.js      # Express setup
│   └── .env.example       # Environment template
│
└── Documentation/
    ├── AUTHENTICATION.md   # Auth system docs
    ├── ADMIN_IMPLEMENTATION_SUMMARY.md
    ├── PROJECT_STATUS.md   # Complete overview
    └── ... (more docs)
```

---

## 🔑 Key Files & What They Do

### Frontend Authentication
```
context/AuthContext.js       # Global auth state, useAuth() hook
lib/api/authApi.js          # Centralized API calls
components/ProtectedRoute.js # Route protection wrapper
```

### Frontend Pages
```
app/login/page.js           # Login form
app/signup/page.js          # Registration form
app/dashboard/page.js       # User dashboard (protected)
app/admin/*                 # 7 admin management pages
```

### Backend Authentication
```
models/User.js              # User schema with password hashing
utils/jwtUtils.js          # Token generation/verification
middleware/authMiddleware.js # Route protection
controllers/authController.js # Auth logic
routes/authRoutes.js        # Auth endpoints
```

---

## 🔐 Authentication Quick Guide

### For Frontend Developers

#### Use Authentication in Any Component
```javascript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.name}!</p>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

#### Protect a Route
```javascript
import ProtectedRoute from '@/components/ProtectedRoute';

export default function SecretPage() {
  return (
    <ProtectedRoute>
      <div>Only logged-in users see this</div>
    </ProtectedRoute>
  );
}
```

#### Check Admin Role
```javascript
const { user } = useAuth();
if (user?.role === 'admin') {
  // Show admin features
}
```

### For Backend Developers

#### Protect an Endpoint
```javascript
import { authMiddleware } from '../middleware/authMiddleware.js';

router.post('/api/data', authMiddleware, (req, res) => {
  // req.user contains authenticated user
  res.json({ userId: req.user.id });
});
```

#### Create a User
```javascript
import User from '../models/User.js';

const user = new User({
  email: 'user@example.com',
  password: 'plainPassword123', // Will auto-hash
  name: 'John Doe'
});
await user.save();
```

---

## 🎨 Admin Dashboard Pages

| Page | Route | Features |
|------|-------|----------|
| Dashboard | `/admin` | Overview & quick links |
| Blog | `/admin/blog` | Create/Edit/Delete posts |
| Users | `/admin/users` | Manage users & roles |
| Messages | `/admin/messages` | View contact submissions |
| Services | `/admin/services` | Manage services |
| Analytics | `/admin/analytics` | Statistics & trends |
| Settings | `/admin/settings` | Platform config |

**All admin pages require**: `role === 'admin'`

---

## 📝 Common Tasks

### Add a New Admin Page
1. Create `frontend/app/admin/feature/page.js`
2. Use `useAuth()` to check admin role
3. Wrap in `ProtectedRoute`
4. Follow existing admin page pattern
5. Add link to admin dashboard

### Add Authentication to a Page
1. Import `useAuth` hook
2. Get `user`, `isAuthenticated`, `isLoading` from hook
3. Show loading state
4. Render based on auth state
5. Optional: Use `ProtectedRoute` wrapper

### Create a Protected API Route
1. Import `authMiddleware`
2. Add to router: `router.post('/api/data', authMiddleware, handler)`
3. Access user: `req.user`
4. Return data

### Connect Frontend to Backend
1. Update `authApi.js` with correct API_URL
2. Update backend routes to return correct response format
3. Test API calls in browser console
4. Handle errors with try-catch

---

## 🔗 API Endpoints

### Authentication
```
POST   /api/auth/signup      # Register new user
POST   /api/auth/login       # Login user
POST   /api/auth/logout      # Logout (requires auth)
GET    /api/auth/me          # Get current user (requires auth)
POST   /api/auth/refresh     # Get new access token
```

### Blog (Existing)
```
GET    /api/blog/posts       # Get all posts
GET    /api/blog/posts/:id   # Get single post
POST   /api/blog/posts       # Create post (requires auth)
PUT    /api/blog/posts/:id   # Update post (requires auth)
DELETE /api/blog/posts/:id   # Delete post (requires auth)
```

### Contacts (Existing)
```
POST   /api/contacts         # Submit contact form
GET    /api/contacts         # Get all messages (admin)
```

### Services (Existing)
```
GET    /api/services         # Get all services
POST   /api/services         # Create service (admin)
```

---

## 🎯 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Access Denied" on admin page | Make sure user has `role: 'admin'` |
| Can't login | Check email/password in database |
| Token expired | Frontend auto-refreshes, user stays logged in |
| API not responding | Check `NEXT_PUBLIC_API_URL` is correct |
| Components not updating | Make sure you're using `useAuth()` hook |

---

## 📚 Documentation Map

- **[AUTHENTICATION.md](./AUTHENTICATION.md)** - Complete auth system docs
- **[AUTH_QUICK_REFERENCE.md](./AUTH_QUICK_REFERENCE.md)** - Auth API & examples
- **[ADMIN_IMPLEMENTATION_SUMMARY.md](./ADMIN_IMPLEMENTATION_SUMMARY.md)** - Admin dashboard details
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Overall project status
- **[ANIMATION_ENHANCEMENTS.md](./ANIMATION_ENHANCEMENTS.md)** - Animation system
- **[README.md](./README.md)** - Project overview

---

## 🚀 Getting Started

### Start Development
```bash
# Frontend
cd frontend && npm run dev
# → http://localhost:3000

# Backend
cd backend && npm run dev
# → http://localhost:5000
```

### Test Authentication
1. Go to http://localhost:3000/signup
2. Create an account
3. Login to dashboard
4. Visit /admin (if admin role)
5. Check localStorage for tokens

### Create Blog Post as Admin
1. Login as admin
2. Go to /admin/blog
3. Click "New Post"
4. Author auto-filled with your name
5. Submit to create

---

## 🔑 Important Constants

### Roles
- `'user'` - Regular user
- `'admin'` - Administrator

### User Fields
- `id` - Unique identifier (UUID)
- `email` - Email address
- `name` - Full name
- `role` - User role
- `isEmailVerified` - Email status
- `profile` - Avatar, bio

### Token Expiry
- Access Token: 7 days
- Refresh Token: 30 days

### API Response Format
```json
{
  "data": {
    "user": { /* user object */ },
    "tokens": { "accessToken": "...", "refreshToken": "..." }
  }
}
```

---

## 🧪 Testing Checklist

- [ ] Can register new user
- [ ] Can login/logout
- [ ] Can access protected pages when logged in
- [ ] Redirected to login when not authenticated
- [ ] Admin pages blocked for non-admin users
- [ ] Blog posts show logged-in user as author
- [ ] User can edit profile
- [ ] Admin can manage users
- [ ] All animations smooth and responsive
- [ ] Works on mobile (375px+)

---

## 💡 Tips for Development

1. **Use Browser DevTools**
   - Check localStorage for tokens
   - Monitor Network tab for API calls
   - Use React DevTools for component state

2. **Check Console for Errors**
   - API errors logged
   - Auth errors explained
   - Helpful messages for debugging

3. **Mock Data Available**
   - Admin pages have mock data for testing
   - Replace with API calls when backend ready

4. **Animations Performance**
   - All animations run at 60 FPS
   - Using Framer Motion for efficiency
   - Check DevTools Performance tab

---

## 🔒 Security Reminders

✅ **Do**:
- Use useAuth() hook for auth checks
- Use ProtectedRoute for protected pages
- Validate input on forms
- Handle errors gracefully
- Keep JWT_SECRET secure

❌ **Don't**:
- Store sensitive data in localStorage (production)
- Hardcode API URLs
- Expose API keys in code
- Skip input validation
- Log sensitive data

---

## 📞 Support

### For Questions About
- **Authentication**: See [AUTH_QUICK_REFERENCE.md](./AUTH_QUICK_REFERENCE.md)
- **Admin Features**: See [ADMIN_IMPLEMENTATION_SUMMARY.md](./ADMIN_IMPLEMENTATION_SUMMARY.md)
- **Animations**: See [ANIMATION_QUICK_REFERENCE.md](./ANIMATION_QUICK_REFERENCE.md)
- **Project Status**: See [PROJECT_STATUS.md](./PROJECT_STATUS.md)

### Files to Check
1. Check existing implementation in similar files
2. Review documentation for your feature area
3. Look at mock data for expected format
4. Check error messages in console

---

## 🎉 You're Ready!

You have access to:
- ✅ Complete authentication system
- ✅ 7 admin management pages
- ✅ Full blog management
- ✅ User profile system
- ✅ Extensive documentation
- ✅ Smooth animations & polished UI

Start building! 🚀

---

**Last Updated**: May 8, 2026
**Version**: 1.0.0
**Platform**: ABUHUB - Digital Solutions
