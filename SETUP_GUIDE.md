/**
 * ABUHUB Project Setup Guide
 * 
 * This document provides step-by-step instructions for setting up
 * and running the ABUHUB platform locally and in production.
 */

# ABUHUB - Complete Setup Guide

## Table of Contents
1. Prerequisites
2. Local Development Setup
3. Configuration
4. Running the Application
5. First Steps with Content
6. Deployment
7. Troubleshooting

---

## Prerequisites

Before you begin, ensure you have installed:

- **Node.js 16+** - Download from https://nodejs.org/
- **Git** - For version control
- **MongoDB Atlas Account** - Free tier at https://www.mongodb.com/cloud/atlas
- **Cloudinary Account** - For image storage at https://cloudinary.com/
- **Code Editor** - VS Code recommended

### Verify Installation
```bash
node --version
npm --version
git --version
```

---

## Local Development Setup

### Step 1: Clone/Initialize Project
```bash
cd "c:\Users\Abdallah PC\OneDrive\Documents\Projects\Abuhub"
git init
git add .
git commit -m "Initial commit: ABUHUB platform"
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Edit .env with your credentials
# Use a text editor to update:
# - MONGODB_URI
# - CLOUDINARY_CLOUD_NAME
# - CLOUDINARY_API_KEY
# - CLOUDINARY_API_SECRET
```

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# .env.local already created with:
# NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Configuration

### MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster (M0 free tier)
4. Create a database user:
   - Username: `abuhub_user`
   - Password: (generate secure password)
5. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/abuhub`
6. Whitelist your IP address
7. Add to backend `.env`:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/abuhub
```

### Cloudinary Setup

1. Sign up at https://cloudinary.com/
2. Go to Dashboard
3. Copy these values to backend `.env`:
   - Cloud Name: `CLOUDINARY_CLOUD_NAME`
   - API Key: `CLOUDINARY_API_KEY`
   - API Secret: `CLOUDINARY_API_SECRET`

### Test Configuration

```bash
# Test backend
curl http://localhost:5000/health

# Test frontend
# Open browser: http://localhost:3000
```

---

## Running the Application

### Terminal 1: Backend Server

```bash
cd backend
npm run dev
```

Expected output:
```
✓ MongoDB Connected: cluster0-xyz...
✓ ABUHUB API Server running on port 5000
```

### Terminal 2: Frontend Server

```bash
cd frontend
npm run dev
```

Expected output:
```
▲ Next.js 14.0.0
- Local:        http://localhost:3000
- Environments: .env.local
```

### Access Application

- **Home Page**: http://localhost:3000
- **Blog**: http://localhost:3000/blog
- **Admin Blog**: http://localhost:3000/admin/blog
- **API Docs**: http://localhost:5000/api

---

## First Steps with Content

### Add Your First Blog Post

1. Open http://localhost:3000/admin/blog
2. Click "+ New Post"
3. Fill in:
   ```
   Title: "Welcome to ABUHUB"
   Content: "This is our first blog post"
   Category: "Web Development"
   Tags: "ABUHUB, launch, web"
   Author: "Your Name"
   ```
4. Upload an image (optional)
5. Click "Publish Post"
6. View at http://localhost:3000/blog

### Create Services via API

```bash
# Web Development Service
curl -X POST http://localhost:5000/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "Web Development",
    "description": "Modern web applications",
    "shortDescription": "Build beautiful web apps",
    "icon": "🌐",
    "pricing": "Contact for pricing"
  }'
```

### Test Contact Form

1. Open http://localhost:3000
2. Scroll to "Get In Touch" section
3. Fill form with:
   ```
   Name: Test User
   Email: test@example.com
   Message: This is a test message
   ```
4. Submit
5. Check backend: Contact saved to MongoDB

---

## Deployment

### Deploy Backend to Render

1. Push code to GitHub
2. Go to https://render.com
3. New → Web Service
4. Connect GitHub repo
5. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables (from .env)
6. Deploy

### Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Import project
3. Set `NEXT_PUBLIC_API_URL` to your Render backend URL
4. Deploy automatically

### Update Frontend Config

After backend deployed, update `frontend/.env.production`:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

---

## Common Tasks

### Add New Service

Option 1: Via API
```bash
curl -X POST http://localhost:5000/api/services \
  -F "serviceName=Your Service" \
  -F "description=Description" \
  -F "image=@image.jpg"
```

Option 2: Via Admin (implement admin panel)

### Export Database

```bash
# Using mongoexport
mongoexport --uri "mongodb+srv://user:password@cluster..." \
  --collection posts --out posts.json
```

### Backup Database

```bash
# Using mongodump
mongodump --uri "mongodb+srv://user:password@cluster..." \
  --out ./backup
```

---

## Troubleshooting

### Backend Won't Start

**Error**: `Cannot connect to MongoDB`
- Check MONGODB_URI in .env
- Verify IP whitelist in MongoDB Atlas
- Test connection: `npm run dev`

**Error**: `Port 5000 already in use`
- Kill process: `npx kill-port 5000`
- Or change PORT in .env

### Frontend Won't Load

**Error**: `Failed to fetch from API`
- Check backend running on 5000
- Verify NEXT_PUBLIC_API_URL
- Clear browser cache

**Error**: `Images not loading`
- Check Cloudinary credentials
- Verify image URLs in browser console

### Form Submission Fails

**Error**: `CORS error`
- Check FRONTEND_URL in backend .env
- Verify cors middleware enabled

**Error**: `File too large`
- Max file size: 5MB
- Compress images before upload

### Database Issues

**Error**: `Collections not created`
- Models auto-create in MongoDB
- Check MongoDB Atlas connection

**Error**: `Duplicate key error`
- Clear collection or change unique field value

---

## Performance Optimization

### Frontend
- Enable image optimization in Next.js
- Use code splitting
- Implement lazy loading

### Backend
- Add database indexes
- Implement caching with Redis
- Use CDN for images (Cloudinary)

### Database
- Create indexes on frequently queried fields
- Regular backups
- Monitor Atlas usage

---

## Security Checklist

- [ ] Never commit .env files
- [ ] Use strong database passwords
- [ ] Enable HTTPS in production
- [ ] Implement rate limiting
- [ ] Sanitize all user inputs
- [ ] Add CSRF tokens
- [ ] Use environment variables
- [ ] Regular security audits

---

## Next Steps

1. ✅ Local development running
2. ✅ First blog post created
3. ✅ Services configured
4. 🔄 **Deploy to production**
5. 🔄 Set up monitoring
6. 🔄 Add authentication
7. 🔄 Implement comments
8. 🔄 Add newsletter

---

## Support Resources

- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`
- Main Documentation: `README.md`
- Technical Spec: `abuhub_technical_implementation.txt`

---

**Setup Guide Version**: 1.0.0
**Last Updated**: May 2026
**Status**: Complete ✓
