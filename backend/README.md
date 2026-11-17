# ABUHUB Backend API

Express.js server for ABUHUB platform featuring blog management, contact forms, and service listings.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your credentials

# Start development server
npm run dev

# Start production server
npm start
```

Server runs on `http://localhost:5000`

## 📋 Environment Variables

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/abuhub

# Server Configuration
PORT=5000
NODE_ENV=development

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## 📚 API Endpoints

### Blog Posts

#### GET /api/blog
Get all blog posts with filtering and pagination.

**Query Parameters:**
- `status`: 'published' or 'draft' (default: 'published')
- `category`: Filter by category
- `sort`: 'asc' or 'desc' (default: 'desc')
- `page`: Page number (default: 1)
- `limit`: Posts per page (default: 10)

**Example:**
```bash
GET http://localhost:5000/api/blog?category=Web%20Development&sort=asc&limit=5
```

**Response:**
```json
{
  "success": true,
  "message": "Posts fetched successfully",
  "data": [
    {
      "id": "uuid",
      "title": "Getting Started with React",
      "slug": "getting-started-with-react",
      "content": "...",
      "imageUrl": "https://...",
      "category": "Web Development",
      "status": "published",
      "author": "John Doe",
      "readCount": 42,
      "createdAt": "2024-05-08T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 10,
    "pages": 2,
    "currentPage": 1,
    "limit": 5
  }
}
```

#### GET /api/blog/:id
Get single post by ID or slug.

```bash
GET http://localhost:5000/api/blog/getting-started-with-react
```

#### POST /api/blog
Create new blog post.

**Content-Type:** multipart/form-data

**Fields:**
- `title` (required): Post title
- `content` (required): Post content
- `category` (optional): Service category
- `tags` (optional): Comma-separated tags
- `author` (optional): Author name
- `excerpt` (optional): Short description
- `image` (optional): Featured image file

**Example:**
```bash
curl -X POST http://localhost:5000/api/blog \
  -F "title=My First Post" \
  -F "content=This is my first post" \
  -F "category=Web Development" \
  -F "tags=react,javascript" \
  -F "image=@image.jpg"
```

#### PUT /api/blog/:id
Update existing blog post.

**Content-Type:** multipart/form-data

Same fields as POST endpoint.

#### DELETE /api/blog/:id
Delete blog post.

```bash
DELETE http://localhost:5000/api/blog/post-id
```

#### GET /api/blog/stats
Get blog statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPosts": 25,
    "totalViews": 1203,
    "categories": [
      { "_id": "Web Development", "count": 10 },
      { "_id": "App Development", "count": 8 }
    ]
  }
}
```

### Contact Messages

#### POST /api/contact
Submit contact form.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "serviceInterested": "Web Development",
  "message": "I need a website for my business"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you! Your message has been received...",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "isRead": false,
    "isReplied": false,
    "createdAt": "2024-05-08T10:00:00Z"
  }
}
```

#### GET /api/contact
Get all contact messages (admin).

**Query Parameters:**
- `isRead`: 'true', 'false', or 'all' (default: 'all')
- `page`: Page number
- `limit`: Messages per page

#### PATCH /api/contact/:id/replied
Mark contact message as replied.

### Services

#### GET /api/services
Get all services.

**Query Parameters:**
- `isActive`: 'true' or 'false' (default: 'true')

#### POST /api/services
Create new service (admin).

**Content-Type:** multipart/form-data

**Fields:**
- `serviceName` (required): Service name
- `description` (required): Service description
- `shortDescription` (optional): Short description
- `icon` (optional): Icon/emoji
- `pricing` (optional): Pricing info
- `image` (optional): Service image

#### PUT /api/services/:id
Update service.

#### DELETE /api/services/:id
Delete service.

## 🗄️ Data Models

### BlogPost
```javascript
{
  id: UUID,
  title: String,
  slug: String,
  content: String,
  imageUrl: String,
  imagePublicId: String,
  category: Enum,
  status: 'draft' | 'published',
  author: String,
  excerpt: String,
  tags: [String],
  readCount: Number,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Contact
```javascript
{
  id: UUID,
  name: String,
  email: String,
  phone: String,
  serviceInterested: String,
  message: String,
  isRead: Boolean,
  isReplied: Boolean,
  createdAt: DateTime
}
```

### Service
```javascript
{
  id: UUID,
  serviceName: String,
  description: String,
  shortDescription: String,
  imageUrl: String,
  icon: String,
  pricing: String,
  isActive: Boolean,
  displayOrder: Number,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

## 🔑 Categories

Available post categories:
- Web Development
- App Development
- Data Analysis
- AI Training
- Business Support
- UI/UX Design
- Digital Marketing
- Others

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **cloudinary**: Image storage
- **multer**: File upload handling
- **cors**: Cross-origin support
- **dotenv**: Environment variables
- **uuid**: Unique IDs
- **express-validator**: Input validation

## 🐛 Error Handling

All errors return consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 🔒 Security

- CORS configured for frontend origin
- Input validation on all endpoints
- File type validation for uploads
- MongoDB injection prevention
- Rate limiting (recommended for production)

## 🚀 Deployment

### Using Render

1. Push code to GitHub
2. Connect GitHub repo to Render
3. Set environment variables
4. Deploy

### Using Railway

1. Import project from GitHub
2. Configure environment variables
3. Deploy

## 📝 Development Tips

- Use Postman to test endpoints
- Check logs for detailed errors
- Validate file sizes and types
- Monitor MongoDB Atlas usage
- Test error scenarios

## 🎯 Next Steps

- Add authentication
- Implement email notifications
- Add search functionality
- Create analytics dashboard
- Set up automated backups

---

**API Version**: 1.0.0
**Status**: Production Ready
