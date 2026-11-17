# ABUHUB Frontend

Modern Next.js application for ABUHUB platform featuring landing page, blog, and admin management.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Frontend runs on `http://localhost:3000`

## 📋 Environment Variables

`.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📁 Directory Structure

```
frontend/
├── app/                      # Next.js App Router
│   ├── page.js              # Home page
│   ├── layout.js            # Root layout
│   ├── blog/
│   │   ├── page.js          # Blog listing
│   │   └── [id]/
│   │       └── page.js      # Single post
│   └── admin/
│       └── blog/
│           └── page.js      # Admin management
├── components/              # Reusable components
│   ├── Navigation.js        # Header with menu
│   ├── HeroSection.js       # Landing hero
│   ├── ServicesSection.js   # Services showcase
│   ├── ContactSection.js    # Contact form
│   ├── Footer.js            # Footer
│   └── Layout.js            # Main layout wrapper
├── lib/                     # Utilities
│   └── api/
│       └── client.js        # Axios API client
├── styles/                  # CSS
│   └── globals.css          # Global styles
├── public/                  # Static assets
│   └── images/              # Image files
├── next.config.js           # Next.js config
├── tailwind.config.js       # Tailwind config
└── postcss.config.js        # PostCSS config
```

## 🎨 Components

### Navigation
Sticky header with logo and navigation links.

**Props:** None (uses scroll position internally)

### HeroSection
Main landing page hero with animations and CTA buttons.

**Features:**
- Animated background gradients
- Stats counter
- Scroll indicator
- Call-to-action buttons

### ServicesSection
Displays available services with dynamic fetching.

**Features:**
- Fetches from API
- Fallback default services
- Interactive cards with hover effects
- Service filtering

### ContactSection
Contact form with validation and submission.

**Features:**
- Form validation with React Hook Form
- Service selection dropdown
- Success animation
- Alternative contact methods

### Footer
Application footer with links and social media.

## 📖 Pages

### Home (`/`)
Landing page with:
- Hero section
- Services showcase
- Contact form
- Testimonials

### Blog (`/blog`)
Blog listing page with:
- Post filtering by category
- Sorting options
- Pagination
- Read more links

### Blog Post (`/blog/[id]`)
Single blog post page with:
- Featured image
- Full content
- Author info
- Read time estimate
- Related posts

### Admin Blog (`/admin/blog`)
Blog management interface with:
- Create new posts
- Edit existing posts
- Delete posts
- Image upload preview
- Category and tag management

## 🛠️ API Client

Located in `lib/api/client.js`:

```javascript
// Import and use API functions
import {
  fetchBlogPosts,
  fetchBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  submitContactForm,
  fetchServices,
} from '@/lib/api/client';

// Example: Get all blog posts
const posts = await fetchBlogPosts({
  category: 'Web Development',
  sort: 'desc',
  limit: 10,
});
```

## 🎨 Styling

### Tailwind CSS Classes

**Colors:**
- `gradient-text`: Gradient text effect
- `glassmorphism`: Glass effect background
- `card-hover`: Card hover animation
- `btn-primary`: Primary button
- `btn-secondary`: Secondary button

**Responsive:** Mobile-first design with `md:` and `lg:` breakpoints

**Animations:** Smooth transitions and Framer Motion effects

### Global CSS

Global styles in `styles/globals.css`:
- Base element styles
- Component classes
- Animation keyframes
- Scrollbar styling

## 🔄 State Management

Using React hooks:
- `useState`: Component state
- `useEffect`: Side effects (data fetching)
- `useForm`: Form state (React Hook Form)

## 📱 Responsive Design

Mobile-first approach:
- Base styles for mobile
- `md:` breakpoint (768px) for tablets
- `lg:` breakpoint (1024px) for desktops

## 🔒 Security

- Environment variables for sensitive data
- Input validation in forms
- XSS prevention with React
- CSRF tokens in forms (to implement)

## 🚀 Performance

- Code splitting with Next.js
- Image optimization
- Lazy loading
- CSS minification with Tailwind

## 📝 Customization

### Change Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: { /* Your colors */ },
  accent: {
    cyan: '#your-color',
    purple: '#your-color',
  },
}
```

### Add New Page

1. Create file in `app/your-page/page.js`
2. Export default component
3. Add to navigation

### Modify Hero Section

Edit `components/HeroSection.js`:
- Change headline and tagline
- Update CTA buttons
- Modify animations
- Add more stats

### Update Services

Services are fetched from API with fallbacks in `components/ServicesSection.js`

### Customize Contact Form

Edit `components/ContactSection.js`:
- Add/remove form fields
- Change validation rules
- Update service options
- Modify success message

## 🐛 Debugging

### Browser DevTools
- Check Network tab for API calls
- Use Console for errors
- Inspect Elements for styling

### Next.js Debug
- Check terminal output
- Use `console.log()` strategically
- Enable Next.js debug mode: `DEBUG=* npm run dev`

### API Issues
- Verify `NEXT_PUBLIC_API_URL`
- Check backend is running
- Use Postman to test endpoints

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Deploy automatically on push
vercel deploy

# Or connect GitHub repo through Vercel Dashboard
```

### Netlify

```bash
# Build
npm run build

# Deploy using Netlify CLI
netlify deploy --prod --dir=.next
```

### Custom Server

```bash
# Build
npm run build

# Start
npm start
```

## 📦 Dependencies

- **next**: React framework
- **react**: UI library
- **framer-motion**: Animations
- **axios**: HTTP client
- **react-hook-form**: Form management
- **react-toastify**: Notifications
- **tailwindcss**: Styling

## 🎯 Next Steps

- [ ] Add authentication
- [ ] Implement comments system
- [ ] Add newsletter subscription
- [ ] Create portfolio section
- [ ] Implement search
- [ ] Add dark/light mode toggle
- [ ] Create user profiles

## 💡 Best Practices

1. **Use components**: Keep components small and reusable
2. **Error handling**: Always handle API errors gracefully
3. **Loading states**: Show loading indicators during async operations
4. **Validation**: Validate user input before submission
5. **SEO**: Use metadata for each page
6. **Performance**: Optimize images and code splitting

## 🔧 Troubleshooting

**Page not found:** Check `app/` directory structure
**API not working:** Verify backend running and `NEXT_PUBLIC_API_URL`
**Styles not applied:** Check Tailwind config and CSS imports
**Images not loading:** Verify image paths and Cloudinary config

---

**Frontend Version**: 1.0.0
**Framework**: Next.js 14
**Status**: Production Ready
