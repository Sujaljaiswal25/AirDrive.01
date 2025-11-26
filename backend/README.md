# AirDrive Backend Documentation

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Services & Utilities](#services--utilities)
- [Authentication & Authorization](#authentication--authorization)
- [File Upload & Storage](#file-upload--storage)
- [Caching with Redis](#caching-with-redis)
- [Error Handling](#error-handling)

---

## 🎯 Overview

AirDrive Backend is a RESTful API service that powers a cloud storage platform similar to Google Drive. It handles user authentication, file management, folder organization, sharing, and trash functionality with secure file storage using ImageKit.

### Key Features

- ✅ User Authentication (JWT-based with refresh tokens)
- ✅ File Upload/Download with ImageKit integration
- ✅ Folder Management & Organization
- ✅ File Sharing with public links
- ✅ Starred Files functionality
- ✅ Trash & Restore system
- ✅ Redis caching for performance
- ✅ Search & Filter capabilities
- ✅ Profile management

---

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.1.0
- **Database**: MongoDB (Mongoose ODM)
- **Caching**: Redis (ioredis)
- **File Storage**: ImageKit
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **CORS**: Enabled for cross-origin requests

---

## 📁 Project Structure

```
backend/
├── server.js                    # Entry point
├── package.json                 # Dependencies
├── .env                         # Environment variables
├── src/
│   ├── app.js                   # Express app configuration
│   ├── config/
│   │   └── redis.js             # Redis connection setup
│   ├── controllers/
│   │   ├── auth.controller.js   # Authentication logic
│   │   ├── file.controller.js   # File operations
│   │   └── profile.controller.js # User profile management
│   ├── db/
│   │   └── db.js                # MongoDB connection
│   ├── middlewares/
│   │   ├── auth.middleware.js   # JWT verification
│   │   ├── error.middleware.js  # Global error handler
│   │   └── upload.middleware.js # Multer configuration
│   ├── models/
│   │   ├── user.model.js        # User schema
│   │   └── file.model.js        # File/Folder schema
│   ├── routes/
│   │   ├── auth.route.js        # Auth endpoints
│   │   ├── file.route.js        # File endpoints
│   │   └── profile.route.js     # Profile endpoints
│   ├── services/
│   │   ├── redis.service.js     # Redis operations
│   │   └── storage.service.js   # ImageKit integration
│   └── utils/
│       ├── auth.util.js         # JWT token utilities
│       ├── file.util.js         # File helper functions
│       ├── response.util.js     # Standardized API responses
│       └── validation.util.js   # Validation helpers
```

---

## ⚙️ Environment Setup

Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/AirDrive

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d

# ImageKit Configuration
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Security
COOKIE_SECRET=your-cookie-secret-key
CORS_ORIGIN=http://localhost:5173

# File Upload Limits
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_FILE_TYPES=image/*,application/pdf,.doc,.docx

# Redis Configuration
REDIS_HOST=your-redis-host
REDIS_PORT=19474
REDIS_PASSWORD=your-redis-password
```

---

## 🚀 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Redis (local or cloud)
- ImageKit account

### Steps

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   - Copy `.env.example` to `.env` and fill in your credentials

4. **Start the server**

   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

5. **Server will run on**: `http://localhost:5000`

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint         | Description          | Auth Required |
| ------ | ---------------- | -------------------- | ------------- |
| POST   | `/register`      | Register new user    | ❌            |
| POST   | `/login`         | Login user           | ❌            |
| POST   | `/logout`        | Logout user          | ✅            |
| POST   | `/refresh-token` | Refresh access token | ✅            |

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://...",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### File Routes (`/api/files`)

| Method | Endpoint         | Description        | Auth Required |
| ------ | ---------------- | ------------------ | ------------- |
| POST   | `/upload`        | Upload file        | ✅            |
| GET    | `/`              | Get user files     | ✅            |
| GET    | `/preview/:id`   | Preview file       | ✅            |
| GET    | `/download/:id`  | Download file      | ✅            |
| DELETE | `/:id`           | Delete file        | ✅            |
| POST   | `/folder`        | Create folder      | ✅            |
| POST   | `/share/:id`     | Share file         | ✅            |
| GET    | `/search`        | Search files       | ✅            |
| PATCH  | `/star/:id`      | Toggle star        | ✅            |
| PATCH  | `/trash/:id`     | Move to trash      | ✅            |
| PATCH  | `/restore/:id`   | Restore from trash | ✅            |
| DELETE | `/permanent/:id` | Permanently delete | ✅            |

#### Upload File

```http
POST /api/files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary>
folderId: "root" or <folder-id>
```

#### Get User Files

```http
GET /api/files?folder=root&type=all&page=1&limit=20
Authorization: Bearer <token>
```

**Query Parameters:**

- `folder` (optional): Filter by folder ID (default: "root")
- `type` (optional): Filter by type ("all", "folder", "image", "document", "video", "audio", "other")
- `starred` (optional): Filter starred files (true/false)
- `trashed` (optional): Filter trashed files (true/false)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

#### Create Folder

```http
POST /api/files/folder
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Documents",
  "folderId": "root"
}
```

#### Share File

```http
POST /api/files/share/:fileId
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "File shared successfully",
  "data": {
    "shareLink": "https://yourdomain.com/shared/abc123xyz"
  }
}
```

#### Search Files

```http
GET /api/files/search?q=report&folder=root&type=document
Authorization: Bearer <token>
```

### Profile Routes (`/api/profile`)

| Method | Endpoint    | Description      | Auth Required |
| ------ | ----------- | ---------------- | ------------- |
| GET    | `/`         | Get user profile | ✅            |
| PUT    | `/`         | Update profile   | ✅            |
| PUT    | `/avatar`   | Update avatar    | ✅            |
| PUT    | `/password` | Change password  | ✅            |
| GET    | `/storage`  | Get storage info | ✅            |

---

## 🗃️ Database Models

### User Model

```javascript
{
  name: String,          // User's full name (2-50 chars)
  email: String,         // Unique email (lowercase)
  password: String,      // Hashed password
  avatar: String,        // Profile picture URL
  role: String,          // "user" or "admin"
  createdAt: Date,       // Auto-generated
  updatedAt: Date        // Auto-generated
}
```

### File Model

```javascript
{
  // Basic Info
  name: String,          // File/folder name
  type: String,          // MIME type or "folder"
  size: Number,          // File size in bytes

  // Storage Info
  url: String,           // ImageKit URL
  fileId: String,        // ImageKit file ID

  // Ownership & Organization
  owner: ObjectId,       // Reference to User
  folder: String,        // Parent folder ID ("root" or folder._id)

  // Sharing
  sharedWith: [ObjectId], // Array of user IDs
  shareId: String,       // Unique share ID for public links
  isShared: Boolean,     // Is file publicly shared

  // Status
  isStarred: Boolean,    // Is file starred
  isTrashed: Boolean,    // Is file in trash
  trashedAt: Date,       // When moved to trash

  createdAt: Date,       // Auto-generated
  updatedAt: Date        // Auto-generated
}
```

**Indexes:**

- `owner` - For querying user's files
- `folder` - For folder navigation
- `type` - For filtering by file type
- `isStarred` - For starred files query
- `isTrashed` - For trash queries
- `shareId` - For public sharing
- `fileId` - For ImageKit operations

---

## 🔧 Services & Utilities

### Redis Service (`redis.service.js`)

**Purpose**: Caching layer for improved performance

**Methods:**

- `setCache(key, value, expirySeconds)` - Store data in cache
- `getCache(key)` - Retrieve cached data
- `deleteCache(key)` - Remove from cache
- `clearUserCache(userId)` - Clear user-specific cache

**Usage:**

```javascript
// Cache user files for 5 minutes
await redisService.setCache(`user:${userId}:files`, files, 300);

// Retrieve cached data
const cachedFiles = await redisService.getCache(`user:${userId}:files`);
```

### Storage Service (`storage.service.js`)

**Purpose**: ImageKit integration for file storage

**Methods:**

- `uploadFileToImageKit(buffer, filename)` - Upload file
- `deleteFileFromImageKit(fileId)` - Delete file
- `generateFileUrl(fileId)` - Get file URL

**Features:**

- Automatic file optimization
- CDN delivery
- Secure file URLs
- Thumbnail generation

### Auth Utilities (`auth.util.js`)

**Functions:**

- `generateTokenPair(user)` - Create access & refresh tokens
- `generateAccessToken(user)` - Create access token
- `setRefreshTokenCookie(res, token)` - Set HTTP-only cookie
- `clearRefreshTokenCookie(res)` - Clear cookie
- `sanitizeUser(user)` - Remove sensitive data

**JWT Token Structure:**

```javascript
// Access Token (15 minutes)
{
  _id: user._id,
  email: user.email,
  role: user.role
}

// Refresh Token (7 days)
{
  _id: user._id,
  email: user.email
}
```

### File Utilities (`file.util.js`)

**Functions:**

- `generateFolderId()` - Create unique folder ID
- `generateShareId()` - Create unique share ID
- `resolveFolderValue(folderId)` - Handle folder parameter
- `buildFileFilter(query, userId)` - Build MongoDB query
- `isFolderFileId(fileId)` - Check if ID is folder
- `FILE_TYPE` - File type constants

### Response Utilities (`response.util.js`)

**Standardized API Responses:**

```javascript
success(res, data, message); // 200 OK
created(res, data, message); // 201 Created
badRequest(res, message); // 400 Bad Request
unauthorized(res, message); // 401 Unauthorized
forbidden(res, message); // 403 Forbidden
notFound(res, message); // 404 Not Found
error(res, message); // 500 Internal Server Error
```

**Response Format:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

---

## 🔐 Authentication & Authorization

### JWT Token Flow

1. **Registration/Login**: User receives access token (15 min) and refresh token (7 days)
2. **Access Token**: Sent in `Authorization` header as `Bearer <token>`
3. **Refresh Token**: Stored in HTTP-only cookie
4. **Token Refresh**: When access token expires, use refresh endpoint
5. **Logout**: Clear refresh token cookie

### Protected Routes

All file and profile routes require the `protect` middleware:

```javascript
const { protect } = require("./middlewares/auth.middleware");
router.get("/files", protect, getUserFiles);
```

**Middleware Flow:**

1. Extract token from `Authorization` header
2. Verify token with `JWT_SECRET`
3. Decode payload and attach to `req.user`
4. Proceed to route handler

### Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ HTTP-only cookies for refresh tokens
- ✅ Token expiration handling
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ Owner-only file access verification

---

## 📤 File Upload & Storage

### Upload Process

1. **Client uploads file** → Multer middleware
2. **File validation** → Size & type checks
3. **Upload to ImageKit** → CDN storage
4. **Store metadata** → MongoDB
5. **Cache invalidation** → Clear user cache
6. **Return file data** → Client receives file info

### Multer Configuration

```javascript
// upload.middleware.js
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024, // 10MB
  },
});
```

### ImageKit Integration

**Supported Operations:**

- ✅ File upload with buffer
- ✅ File deletion
- ✅ URL generation
- ✅ Thumbnail creation
- ✅ Format conversion

**Configuration:**

```javascript
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});
```

### File Types Handling

| Type     | Extensions          | MIME Types               |
| -------- | ------------------- | ------------------------ |
| Image    | jpg, png, gif, svg  | image/\*                 |
| Document | pdf, doc, docx, txt | application/pdf, text/\* |
| Video    | mp4, avi, mov       | video/\*                 |
| Audio    | mp3, wav, ogg       | audio/\*                 |
| Folder   | -                   | folder                   |

---

## 💾 Caching with Redis

### Cache Strategy

**Cache Keys:**

- `user:{userId}:files` - User's file list
- `user:{userId}:profile` - User profile data
- `file:{fileId}:metadata` - File metadata
- `folder:{folderId}:contents` - Folder contents

**Cache Expiry:**

- File lists: 5 minutes (300 seconds)
- Profile data: 10 minutes (600 seconds)
- File metadata: 15 minutes (900 seconds)

### Redis Connection

```javascript
// config/redis.js
const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});
```

### Cache Invalidation

**When to clear cache:**

- File upload/delete
- Folder creation
- File move/rename
- Star/unstar
- Trash/restore
- Profile update

**Example:**

```javascript
// After file upload
await redisService.deleteCache(`user:${userId}:files`);
await redisService.deleteCache(`folder:${folderId}:contents`);
```

---

## ⚠️ Error Handling

### Global Error Handler

```javascript
// middlewares/error.middleware.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
```

### Common Error Codes

| Code | Description  | Usage                    |
| ---- | ------------ | ------------------------ |
| 400  | Bad Request  | Invalid input data       |
| 401  | Unauthorized | Missing/invalid token    |
| 403  | Forbidden    | Insufficient permissions |
| 404  | Not Found    | Resource doesn't exist   |
| 500  | Server Error | Unexpected error         |

### Error Handling Best Practices

1. **Try-Catch Blocks**: Wrap async operations
2. **Validation**: Validate input before processing
3. **Specific Messages**: Provide clear error messages
4. **Logging**: Log errors for debugging
5. **User-Friendly**: Don't expose sensitive info

**Example:**

```javascript
try {
  const file = await fileModel.findById(fileId);
  if (!file) {
    return notFound(res, "File not found");
  }
  if (file.owner.toString() !== req.user._id) {
    return forbidden(res, "Not authorized to access this file");
  }
  // Process file...
} catch (err) {
  return error(res, err.message);
}
```

---

## 🧪 Testing

### API Testing with Postman

A Postman collection is available: `AirDrive_API_Collection.postman_collection.json`

**Import and use:**

1. Open Postman
2. Import the collection file
3. Set environment variables (base URL, token)
4. Test all endpoints

### Manual Testing

```bash
# Test Redis connection
node test-redis.js

# Test server
curl http://localhost:5000/api/auth/register -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

---

## 🚀 Deployment

### Prerequisites

- MongoDB Atlas account (or MongoDB server)
- Redis Cloud account (or Redis server)
- ImageKit account
- Node.js hosting (Heroku, AWS, DigitalOcean, etc.)

### Environment Configuration

1. Set all environment variables in hosting platform
2. Update `FRONTEND_URL` to production URL
3. Update `CORS_ORIGIN` to production frontend URL
4. Set `NODE_ENV=production`

### Build & Start

```bash
# Install dependencies
npm install

# Start server
npm start
```

### Health Check

```bash
curl http://your-domain.com/api/auth/login
```

---

## 📝 Development Guidelines

### Code Style

- Use ES6+ syntax
- Async/await for promises
- Descriptive variable names
- Comments for complex logic

### File Naming

- Controllers: `*.controller.js`
- Routes: `*.route.js`
- Models: `*.model.js`
- Services: `*.service.js`
- Utils: `*.util.js`
- Middleware: `*.middleware.js`

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Commit changes
git commit -m "Add: new feature description"

# Push to remote
git push origin feature/new-feature
```

---

## 🔄 API Response Examples

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "file": {
      "_id": "65f3a2b1c8e9d2f1a3b4c5d6",
      "name": "document.pdf",
      "type": "application/pdf",
      "size": 1024000,
      "url": "https://ik.imagekit.io/...",
      "owner": "65f3a2b1c8e9d2f1a3b4c5d5",
      "folder": "root",
      "isStarred": false,
      "createdAt": "2024-03-15T10:30:00.000Z"
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "File not found"
}
```

---




