# ABUHUB - Digital Solutions Platform

A modern, professional web application combining technology services, business support, and content publishing. Built with Next.js, Express.js, Prisma, and Tailwind CSS.

## 🚀 Features

### Core Features (MVP)

- ✅ Beautiful landing page with hero section and animations
- ✅ Services showcase with interactive cards
- ✅ Contact form with email integration
- ✅ Blog system (Create, Read, Update, Delete)
- ✅ Admin blog management interface
- ✅ Responsive design for all devices
- ✅ Modern UI with glassmorphism effects

### Advanced Features (Phase 2+)

- 🔒 Admin authentication
- 📊 Analytics dashboard
- 🤖 AI chatbot integration
- 💬 Blog comments system
- 📧 Email notifications
- 📱 Mobile app support

## 📋 Tech Stack

### Frontend

- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Notifications**: React Toastify

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: SQLite (local dev), MySQL (production)
- **Image Storage**: Cloudinary
- **File Upload**: Multer
- **Validation**: Express Validator

### Deployment

- **Frontend**: Vercel / Netlify
- **Backend**: Render / Railway
- **Database**: MySQL (production) or SQLite (local development)

## 📁 Project Structure

```text
abuhub/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/          # Database & Cloudinary config
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # Legacy MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Custom middleware
│   │   └── server.js        # Main entry point
│   ├── uploads/             # Temporary file storage
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/                # Next.js App
│   ├── app/                 # App router pages
│   │   ├── page.js          # Home page
│   │   ├── blog/            # Blog routes
│   │   ├── admin/           # Admin routes
│   │   └── layout.js        # Root layout
│   ├── components/          # Reusable components
│   ├── lib/                 # Utilities & API client
│   ├── styles/              # Global CSS
│   ├── public/              # Static assets
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── .env.local
│   └── README.md
│
├── abuhub_technical_implementation.txt  # Design document
└── README.md              # This file
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js 16+ and npm/yarn
- Cloudinary account (optional for local dev)
- GitHub account (optional, for deployment)

### Step 1: Backend Setup

```bash
cd backend

npm install
npx prisma generate
npx prisma migrate dev --name init

cp .env.example .env

npm run dev
```

**Backend will run on**: `http://localhost:5000`

### Step 2: Frontend Setup

```bash
cd ../frontend

npm install
npm run dev
```

**Frontend will run on**: `http://localhost:3000`

### Step 3: Access the Application

- **Home**: [http://localhost:3000](http://localhost:3000) (or [http://localhost:3001](http://localhost:3001) if port 3000 is in use)
- **Blog**: [http://localhost:3000/blog](http://localhost:3000/blog)
- **Admin Blog**: [http://localhost:3000/admin/blog](http://localhost:3000/admin/blog) (admin only)
- **Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard) (logged-in users)
- **API Base**: [http://localhost:5000/api](http://localhost:5000/api)

## ⚡ Quick Start (One Command)

### Terminal 1 - Backend

```bash
cd backend && npm run dev
```

### Terminal 2 - Frontend

```bash
cd frontend && npm run dev
```

### Test User

- Email: `devuser@example.com`
- Password: `password123`

## 🚀 Getting Started with Content

### Add Your First Blog Post

1. Go to [http://localhost:3000/admin/blog](http://localhost:3000/admin/blog)
2. Click "New Post"
3. Fill in the form:
   - Title
   - Content (supports markdown)
   - Category
   - Featured image
   - Tags
4. Click "Publish Post"
5. View it at [http://localhost:3000/blog](http://localhost:3000/blog)

### Manage Services

Services can be managed via the admin dashboard or API:

```bash
curl -X POST http://localhost:5000/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "Web Development",
    "description": "Build modern web applications",
    "shortDescription": "Web apps with latest tech",
    "icon": "🌐",
    "pricing": "Custom Quote"
  }'
```

## 📚 API Endpoints

### Blog Posts

- `GET /api/blog` - Get all posts
- `GET /api/blog/:id` - Get single post
- `POST /api/blog` - Create post (multipart/form-data)
- `PUT /api/blog/:id` - Update post
- `DELETE /api/blog/:id` - Delete post
- `GET /api/blog/stats` - Get blog statistics

### Contact

- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all messages (admin)
- `PATCH /api/contact/:id/replied` - Mark as replied

### Services

- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

## 🎨 Customization

### Colors & Theme

Edit `frontend/tailwind.config.js`:

```javascript
colors: {
  primary: { /* Your primary colors */ },
  secondary: { /* Your secondary colors */ },
  accent: {
    cyan: '#00f0ff',
    purple: '#8a2be2',
  },
}
```

### Services

Edit the default services in `frontend/components/ServicesSection.js`:

```javascript
const defaultServices = [
  {
    serviceName: 'Your Service',
    shortDescription: 'Description',
    icon: '🎯',
    pricing: 'Contact us',
  },
];
```

### Contact Information

## 🐳 Docker (local production-like stack)

We provide a Docker Compose configuration to run the full stack (frontend, backend, databases) locally in a production-like setup.

1. Create environment files from the examples and fill in production values (do NOT commit secrets):

```bash
cp backend/.env.example backend/.env
cp frontend/.env.production.example frontend/.env.production
```

2. Build and start the stack (from project root):

```bash
docker compose build
docker compose up -d
```

3. Verify containers are running:

```bash
docker compose ps
docker compose logs --tail 80 frontend backend
```

4. Stop the stack:

```bash
docker compose down --volumes
```

Notes:
- The Dockerfiles for `frontend` and `backend` are included in the repository.
- If Docker is not installed on your machine, install Docker Desktop (Windows/macOS) or Docker Engine (Linux) before running the commands above.
- Keep `.env` files out of version control. Use the provided `.env.production.example` and `backend/.env.example` as templates.


Update contact details in `frontend/components/ContactSection.js`.

### Navigation Links

Edit `frontend/components/Navigation.js`.

## 🎯 Common Tasks

### Add a Blog Post

1. Log in or create an account
2. Go to `/admin/blog`
3. Click "New Post"
4. Fill the form and publish
5. View at `/blog`

### Add a Service

1. Use `POST /api/services` with service details
2. Or use the admin dashboard (coming soon)

### Make a User Admin

1. Access the database directly
2. Update user `role` field to `ADMIN`
3. Or implement an admin promotion endpoint

### Reset Database

```bash
cd backend
rm dev.db
npx prisma migrate dev --name init
```

## 🐛 Troubleshooting

### Backend won't start

- For Prisma errors: run `npx prisma generate` and `npx prisma migrate dev`
- Ensure port 5000 is not in use
- Check Node.js version (`node --version`)
- If Prisma client lock error occurs, stop the backend and regenerate with `npx prisma generate`

### Frontend won't connect to API

- Verify backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Clear browser cache

### Image uploads not working

- Verify Cloudinary credentials in backend `.env`
- Check file size (max 5MB)
- Ensure file format is supported (JPEG, PNG, GIF, WebP)

### Database (SQLite local dev)

- Database file: `backend/dev.db` (auto-created by Prisma)
- To reset: delete `dev.db` and run `npx prisma migrate dev --name init`
- To use MySQL for production: update `DATABASE_URL` in `.env` to a MySQL connection string

### SQLite issues

- Database file should be at `backend/dev.db`
- If missing: run `npx prisma migrate dev --name init`
- To view data: use SQLite Browser or Prisma Studio (`npx prisma studio`)

### MySQL connection errors (production)

- Verify connection string format
- Check firewall/network rules
- Ensure database user has CREATE/ALTER permissions
- Test connection with `mysql -u user -p -h host`

## 📦 Building for Production

### Step 1: Switch Database to MySQL

Update `backend/.env`:

```env
DATABASE_URL="mysql://user:password@host:3306/abuhub"
```

Run migrations:

```bash
cd backend
npx prisma migrate deploy
```

### Step 2: Build Backend

```bash
cd backend
npm start
```

### Step 3: Build Frontend

```bash
cd frontend
npm run build
npm start
```

### Deployment Options

**Frontend (choose one):**

- Vercel (native Next.js support)
- Netlify (connect GitHub repo)
- AWS Amplify

**Backend (choose one):**

- Render.com
- Railway.app
- AWS EC2
- DigitalOcean

**Database:**

- PlanetScale (MySQL)
- AWS RDS
- DigitalOcean Managed Databases
- MongoDB Atlas (if switching back)

**Storage:**

- Cloudinary (configured)
- AWS S3

### Environment Variables for Production

```env
# Backend
DATABASE_URL="mysql://..."
JWT_SECRET=strong-secret-key
REFRESH_TOKEN_SECRET=another-strong-key
NODE_ENV=production
PORT=5000

# Optional: Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

```env
# Frontend
NEXT_PUBLIC_API_URL=https://your-backend.com
NODE_ENV=production
```

## 🔐 Security Notes

- Never commit `.env` files
- Use strong database passwords
- Enable HTTPS in production
- Implement rate limiting on the API
- Add authentication for admin features
- Sanitize user inputs on the backend

## 📝 Next Steps & Enhancements

### Phase 2 Features

- [ ] Admin authentication with JWT
- [ ] User registration and profiles
- [ ] Blog comments system
- [ ] Email notifications
- [ ] Search functionality
- [ ] Analytics dashboard

### Phase 3 Features

- [ ] AI chatbot support
- [ ] Advanced blog filtering
- [ ] Social media integration
- [ ] Newsletter subscription
- [ ] Portfolio section
- [ ] Business tools

## 💡 Tips for Success

1. **Start with content**: add blog posts and services early
2. **Test thoroughly**: check all forms and API endpoints
3. **Optimize images**: compress before uploading
4. **Monitor analytics**: track visitor engagement
5. **Gather feedback**: ask users for improvements
6. **Stay updated**: keep dependencies current

## 📞 Support

- Check the technical implementation document
- Review code comments for detailed explanations
- Debug using browser DevTools and server logs
- Test API endpoints using Postman or cURL

## 📄 License

MIT License - Feel free to use for personal or commercial projects

## 🎉 Happy Building!

Your ABUHUB platform is ready to grow. Start by adding content, then gradually implement advanced features as your needs evolve.

---

**Created**: May 2026
**Version**: 1.0.0
**Status**: Production Ready (MVP)
