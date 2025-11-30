# AirDrive - Complete Project Overview

## 📋 Table of Contents

- [Project Introduction](#project-introduction)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Environment Setup](#environment-setup)
- [Installation Guide](#installation-guide)
- [API Documentation](#api-documentation)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Database Design](#database-design)
- [Authentication System](#authentication-system)
- [File Management System](#file-management-system)
- [Deployment Guide](#deployment-guide)
- [Development Workflow](#development-workflow)

---

## 🎯 Project Introduction

**AirDrive** is a full-stack cloud storage application inspired by Google Drive, built with modern web technologies. It provides a seamless file management experience with features like file upload/download, folder organization, file sharing, starred files, and a trash system.

### Project Goals

- Provide secure cloud storage for users
- Enable easy file organization with folders
- Support file sharing with public links
- Offer a modern, responsive user interface
- Implement secure authentication with JWT
- Optimize performance with caching (Redis)
- Scale with cloud storage (ImageKit CDN)

### Target Audience

- Individual users needing personal cloud storage
- Small teams requiring file collaboration
- Developers learning full-stack development
- Anyone seeking a self-hosted storage solution

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │   React Frontend (Vite + React 19)                   │   │
│  │   - Redux Toolkit (State Management)                 │   │
│  │   - Tailwind CSS (Styling)                           │   │
│  │   - Framer Motion (Animations)                       │   │
│  │   - Axios (HTTP Client)                              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS/REST API
┌─────────────────────────────────────────────────────────────┐
│                       API LAYER                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │   Express.js Backend (Node.js)                       │   │
│  │   - RESTful API Endpoints                            │   │
│  │   - JWT Authentication                               │   │
│  │   - Multer (File Upload)                             │   │
│  │   - Error Handling & Validation                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    SERVICES LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   MongoDB    │  │    Redis     │  │  ImageKit    │      │
│  │  (Database)  │  │  (Caching)   │  │ (CDN/Storage)│      │
│  │              │  │              │  │              │      │
│  │ - Users      │  │ - Sessions   │  │ - Files      │      │
│  │ - Files      │  │ - File Lists │  │ - Images     │      │
│  │ - Metadata   │  │ - Profiles   │  │ - Documents  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **User Action** → Frontend (React)
2. **State Update** → Redux Store
3. **API Call** → Axios with JWT Token
4. **Backend Receives** → Express Route Handler
5. **Authentication** → JWT Middleware Verification
6. **Business Logic** → Controller Processing
7. **Cache Check** → Redis (if applicable)
8. **Database Query** → MongoDB
9. **File Operations** → ImageKit (if applicable)
10. **Response** → JSON to Frontend
11. **UI Update** → React Component Re-render

---

## 🛠 Technology Stack

### Frontend Technologies

| Technology       | Version  | Purpose                 |
| ---------------- | -------- | ----------------------- |
| React            | 19.0.0   | UI Framework            |
| Vite             | 6.2.0    | Build Tool & Dev Server |
| Redux Toolkit    | 2.10.1   | State Management        |
| Redux Persist    | 6.0.0    | State Persistence       |
| React Router DOM | 7.9.6    | Client-side Routing     |
| Tailwind CSS     | 3.4.18   | Utility-first CSS       |
| Framer Motion    | 12.23.24 | Animation Library       |
| Axios            | 1.13.2   | HTTP Client             |
| React Hook Form  | 7.66.1   | Form Handling           |
| React Hot Toast  | 2.6.0    | Notifications           |
| Lucide React     | 0.554.0  | Icon Library            |
| TanStack Query   | 5.90.10  | Data Fetching           |
| date-fns         | 4.1.0    | Date Formatting         |

### Backend Technologies

| Technology              | Version | Purpose              |
| ----------------------- | ------- | -------------------- |
| Node.js                 | -       | Runtime Environment  |
| Express.js              | 5.1.0   | Web Framework        |
| MongoDB                 | -       | NoSQL Database       |
| Mongoose                | 8.18.0  | MongoDB ODM          |
| Redis                   | 5.10.0  | Caching Layer        |
| ioredis                 | 5.8.2   | Redis Client         |
| JWT                     | 9.0.2   | Authentication       |
| bcryptjs                | 3.0.2   | Password Hashing     |
| Multer                  | 2.0.2   | File Upload          |
| Passport.js             | 0.7.0   | Authentication       |
| passport-google-oauth20 | 2.0.0   | Google OAuth         |
| ImageKit                | 6.0.0   | Cloud Storage & CDN  |
| dotenv                  | 17.2.1  | Environment Config   |
| cookie-parser           | 1.4.7   | Cookie Handling      |
| CORS                    | 2.8.5   | Cross-Origin Support |

---

## 📁 Project Structure

```
AirDrive/
│
├── backend/                                 # Backend Application
│   ├── server.js                           # Entry point
│   ├── package.json                        # Dependencies
│   ├── .env                                # Environment variables
│   ├── README.md                           # Backend documentation
│   ├── AirDrive_API_Collection.postman_collection.json
│   │
│   └── src/
│       ├── app.js                          # Express app setup
│       │
│       ├── config/
│       │   └── redis.js                    # Redis configuration
│       │
│       ├── controllers/                    # Business logic
│       │   ├── auth.controller.js
│       │   ├── file.controller.js
│       │   └── profile.controller.js
│       │
│       ├── db/
│       │   └── db.js                       # MongoDB connection
│       │
│       ├── middlewares/                    # Express middlewares
│       │   ├── auth.middleware.js
│       │   ├── error.middleware.js
│       │   └── upload.middleware.js
│       │
│       ├── models/                         # Database schemas
│       │   ├── user.model.js
│       │   └── file.model.js
│       │
│       ├── routes/                         # API routes
│       │   ├── auth.route.js
│       │   ├── file.route.js
│       │   └── profile.route.js
│       │
│       ├── services/                       # External services
│       │   ├── redis.service.js
│       │   └── storage.service.js
│       │
│       └── utils/                          # Helper functions
│           ├── auth.util.js
│           ├── file.util.js
│           ├── response.util.js
│           └── validation.util.js
│
├── client/                                 # Frontend Application
│   ├── index.html                         # HTML entry point
│   ├── package.json                       # Dependencies
│   ├── vite.config.js                     # Vite configuration
│   ├── tailwind.config.js                 # Tailwind configuration
│   ├── README.md                          # Frontend documentation
│   │
│   ├── public/                            # Static assets
│   │
│   └── src/
│       ├── main.jsx                       # App entry point
│       ├── App.jsx                        # Root component
│       ├── index.css                      # Global styles
│       │
│       ├── components/                    # Reusable components
│       │   ├── Breadcrumb.jsx
│       │   ├── FileGrid.jsx
│       │   ├── FileList.jsx
│       │   ├── Header.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── Sidebar.jsx
│       │   └── modals/
│       │       ├── CreateFolderModal.jsx
│       │       ├── DeleteModal.jsx
│       │       ├── PreviewModal.jsx
│       │       ├── ShareModal.jsx
│       │       └── UploadModal.jsx
│       │
│       ├── pages/                         # Page components
│       │   ├── Dashboard.jsx
│       │   ├── Login.jsx
│       │   ├── Profile.jsx
│       │   └── Register.jsx
│       │
│       ├── services/                      # API services
│       │   ├── auth.service.js
│       │   ├── file.service.js
│       │   └── profile.service.js
│       │
│       ├── store/                         # Redux store
│       │   ├── store.js
│       │   └── slices/
│       │       ├── authSlice.js
│       │       ├── fileSlice.js
│       │       └── uiSlice.js
│       │
│       ├── config/
│       │   └── axios.config.js            # Axios configuration
│       │
│       └── utils/                         # Utility functions
│           ├── dateUtils.js
│           └── fileUtils.js
│
└── PROJECT_OVERVIEW.md                     # This file
```

---

## ✨ Key Features

### 1. User Authentication & Authorization

- **User Registration** with email validation
- **Secure Login** with JWT tokens
- **Google OAuth 2.0** - Sign in with Google account
- **Access & Refresh Tokens** for session management
- **Protected Routes** requiring authentication
- **Password Hashing** with bcrypt (10 rounds)
- **HTTP-only Cookies** for refresh tokens
- **Auto Token Refresh** on expiration
- **Account Linking** - Connect Google to existing accounts
- **Profile Management** (update info, change password, avatar)

### 2. File Management

- **File Upload**
  - Drag & drop interface
  - Multiple file upload
  - Progress tracking
  - File type validation
  - Size limits (10MB default)
  - ImageKit CDN integration
- **File Download**
  - Direct download from CDN
  - Secure download URLs
  - Browser compatibility
- **File Preview**
  - Image preview
  - PDF viewer
  - Document info display
- **File Organization**
  - Create folders
  - Folder navigation
  - Breadcrumb navigation
  - Move files between folders

### 3. File Operations

- **Star/Unstar Files** - Mark favorites
- **Trash System** - Soft delete with restore
- **Permanent Delete** - Remove files permanently
- **File Sharing** - Generate public share links
- **Search** - Find files by name
- **Filter** - By type (images, videos, documents, audio)
- **Sort** - By name, date, size, type

### 4. User Interface

- **Dark Theme** - Modern dark design
- **Responsive Design** - Mobile, tablet, desktop
- **Grid View** - Thumbnail view with cards
- **List View** - Detailed list with columns
- **Animations** - Smooth transitions with Framer Motion
- **Toast Notifications** - User feedback
- **Loading States** - Skeleton screens
- **Error Handling** - User-friendly messages

### 5. Performance Optimization

- **Redis Caching** - Cache file lists and profiles
- **CDN Delivery** - Fast file serving via ImageKit
- **Code Splitting** - Lazy load components
- **Image Optimization** - Auto-format and resize
- **Debounced Search** - Reduce API calls
- **Pagination** - Load files in chunks

### 6. Security Features

- **JWT Authentication** - Secure token-based auth
- **CORS Protection** - Whitelist origins
- **Input Validation** - Sanitize user input
- **File Type Validation** - Prevent malicious uploads
- **Owner Verification** - Ensure file access rights
- **Secure Cookies** - HttpOnly, SameSite flags
- **Environment Variables** - Hide sensitive data

---

## ⚙️ Environment Setup

### Backend Environment Variables

Create `backend/.env`:

```env
# Database Configuration
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/AirDrive

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

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
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/*,application/pdf,.doc,.docx

# Redis Configuration
REDIS_HOST=your-redis-host.cloud.redislabs.com
REDIS_PORT=19474
REDIS_PASSWORD=your-redis-password
```

### Frontend Environment Variables

Create `client/.env`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000

# App Configuration
VITE_APP_NAME=AirDrive
VITE_APP_VERSION=1.0.0
```

---

## 🚀 Installation Guide

### Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (Local or MongoDB Atlas)
3. **Redis** (Local or Redis Cloud)
4. **ImageKit Account** (for file storage)
5. **Git** (for version control)

### Step-by-Step Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Sujaljaiswal25/AirDrive.01.git
cd AirDrive
```

#### 2. Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
# Copy the environment variables template above

# Start development server
npm run dev
```

Backend will run on: `http://localhost:5000`

#### 3. Setup Frontend

```bash
# Navigate to frontend (from project root)
cd client

# Install dependencies
npm install

# Create .env file
# Copy the environment variables template above

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

#### 4. Verify Installation

- Open browser to `http://localhost:5173`
- Register a new account
- Upload a test file
- Verify file appears in dashboard

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201 Created
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

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "..."
  }
}
```

#### Google OAuth Login

```http
GET /api/auth/google
# Redirects to Google OAuth consent screen

GET /api/auth/google/callback?code=...
# Google redirects here after authorization
# Backend processes and redirects to frontend with token
```

#### Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Refresh Token

```http
POST /api/auth/refresh-token
Cookie: refreshToken=<token>

Response: 200 OK
{
  "success": true,
  "data": {
    "accessToken": "..."
  }
}
```

### File Management Endpoints

#### Upload File

```http
POST /api/files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary>
folderId: "root" or <folder-id>

Response: 201 Created
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "file": {
      "_id": "...",
      "name": "document.pdf",
      "type": "application/pdf",
      "size": 1024000,
      "url": "https://ik.imagekit.io/...",
      "owner": "...",
      "folder": "root",
      "createdAt": "..."
    }
  }
}
```

#### Get User Files

```http
GET /api/files?folder=root&page=1&limit=20&sortBy=createdAt&order=desc
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "files": [...],
    "currentPage": 1,
    "totalPages": 5,
    "totalFiles": 100
  }
}
```

#### Create Folder

```http
POST /api/files/folder
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Documents",
  "folderId": "root"
}

Response: 201 Created
```

#### Toggle Star

```http
PATCH /api/files/star/:fileId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "File starred",
  "data": {
    "file": { ... }
  }
}
```

#### Move to Trash

```http
PATCH /api/files/trash/:fileId
Authorization: Bearer <token>

Response: 200 OK
```

#### Share File

```http
POST /api/files/share/:fileId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "File shared successfully",
  "data": {
    "shareLink": "https://yourdomain.com/shared/abc123"
  }
}
```

#### Delete File

```http
DELETE /api/files/:fileId
Authorization: Bearer <token>

Response: 200 OK
```

### Profile Endpoints

#### Get Profile

```http
GET /api/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

#### Update Profile

```http
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com"
}

Response: 200 OK
```

#### Change Password

```http
PUT /api/profile/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpass123",
  "newPassword": "newpass123"
}

Response: 200 OK
```

---

## 🎨 Frontend Architecture

### State Management (Redux Toolkit)

#### Auth Slice

```javascript
{
  user: Object | null,
  accessToken: String | null,
  isAuthenticated: Boolean,
  loading: Boolean,
  error: String | null
}
```

#### File Slice

```javascript
{
  files: Array,
  currentFolder: String,
  folderPath: Array,
  viewMode: 'grid' | 'list',
  sortBy: String,
  sortOrder: 'asc' | 'desc',
  searchQuery: String,
  selectedFiles: Array,
  uploadProgress: Object,
  loading: Boolean,
  error: String | null,
  pagination: {
    currentPage: Number,
    totalPages: Number,
    totalFiles: Number,
    limit: Number
  }
}
```

#### UI Slice

```javascript
{
  sidebarOpen: Boolean,
  uploadModalOpen: Boolean,
  createFolderModalOpen: Boolean,
  shareModalOpen: Boolean,
  deleteModalOpen: Boolean,
  previewModalOpen: Boolean,
  selectedFile: Object | null,
  theme: 'dark' | 'light'
}
```

### Component Hierarchy

```
App
├── Routes
│   ├── Login (Public)
│   ├── Register (Public)
│   ├── Dashboard (Protected)
│   │   ├── Sidebar
│   │   ├── Header
│   │   ├── Breadcrumb
│   │   ├── FileGrid / FileList
│   │   └── Modals
│   │       ├── UploadModal
│   │       ├── CreateFolderModal
│   │       ├── ShareModal
│   │       ├── DeleteModal
│   │       └── PreviewModal
│   └── Profile (Protected)
```

### Routing

```javascript
/                    → Redirect based on auth
/login              → Login page
/register           → Registration page
/dashboard          → Main dashboard (protected)
/profile            → User profile (protected)
```

---

## 🔧 Backend Architecture

### Middleware Chain

```
Request → CORS → JSON Parser → Cookie Parser → Route Handler
                                                    ↓
                                            Auth Middleware
                                                    ↓
                                              Controller
                                                    ↓
                                         Service/Database
                                                    ↓
                                            Response/Error
```

### Controller Pattern

```javascript
// Example: File Upload Controller
const uploadFile = async (req, res) => {
  try {
    // 1. Validate input
    if (!req.file) return badRequest(res, "No file uploaded");

    // 2. Process business logic
    const uploadResult = await uploadFileToImageKit(buffer, filename);

    // 3. Save to database
    const newFile = await fileModel.create({ ... });

    // 4. Clear cache
    await redisService.deleteCache(`user:${userId}:files`);

    // 5. Return response
    return created(res, { file: newFile }, "File uploaded");
  } catch (err) {
    return error(res, err.message);
  }
};
```

### Service Layer

**Storage Service (ImageKit)**

```javascript
-uploadFileToImageKit(buffer, filename) -
  deleteFileFromImageKit(fileId) -
  generateFileUrl(fileId);
```

**Redis Service (Caching)**

```javascript
-setCache(key, value, expiry) -
  getCache(key) -
  deleteCache(key) -
  clearUserCache(userId);
```

---

## 🗄️ Database Design

### User Schema (MongoDB)

```javascript
{
  _id: ObjectId,
  name: String,              // 2-50 characters
  email: String,             // Unique, lowercase
  password: String,          // Hashed with bcrypt (optional for OAuth users)
  avatar: String,            // Profile picture URL
  role: String,              // 'user' or 'admin'
  authProvider: String,      // 'local' or 'google'
  googleId: String,          // Google account ID (for OAuth users)
  createdAt: Date,
  updatedAt: Date
}

Indexes:
  - email (unique)
  - googleId (unique, sparse)
```

### File Schema (MongoDB)

```javascript
{
  _id: ObjectId,
  name: String,              // File/folder name
  type: String,              // MIME type or 'folder'
  size: Number,              // Bytes
  url: String,               // ImageKit URL
  fileId: String,            // ImageKit file ID
  owner: ObjectId,           // Reference to User
  folder: String,            // 'root' or folder._id
  sharedWith: [ObjectId],    // Array of user IDs
  shareId: String,           // Unique share ID
  isShared: Boolean,
  isStarred: Boolean,
  isTrashed: Boolean,
  trashedAt: Date,
  createdAt: Date,
  updatedAt: Date
}

Indexes:
  - owner
  - folder
  - type
  - fileId
  - shareId (sparse, unique)
  - isStarred
  - isTrashed
```

### Redis Cache Structure

```javascript
// Cache Keys
user:{userId}:files          // User's file list (5 min TTL)
user:{userId}:profile        // User profile (10 min TTL)
file:{fileId}:metadata       // File metadata (15 min TTL)
folder:{folderId}:contents   // Folder contents (5 min TTL)
```

---

## 🔐 Authentication System

### JWT Token Structure

**Access Token** (15 minutes expiry)

```javascript
{
  _id: "user-id",
  email: "user@example.com",
  role: "user",
  iat: 1234567890,
  exp: 1234568790
}
```

**Refresh Token** (7 days expiry)

```javascript
{
  _id: "user-id",
  email: "user@example.com",
  iat: 1234567890,
  exp: 1235172690
}
```

### Authentication Flow

1. **User Registration (Email/Password)**

   - Validate input
   - Hash password (bcrypt, 10 rounds)
   - Create user in database with authProvider: 'local'
   - Generate token pair
   - Set refresh token cookie
   - Return user + access token

2. **User Login (Email/Password)**

   - Validate credentials
   - Compare password hash
   - Generate token pair
   - Set refresh token cookie
   - Return user + access token

3. **Google OAuth Flow**

   - User clicks "Sign in with Google"
   - Redirect to Google OAuth consent screen
   - User authorizes application
   - Google redirects back with authorization code
   - Backend exchanges code for user profile
   - Check if user exists by googleId or email
   - Create new user or link existing account
   - Generate token pair
   - Redirect to frontend with access token
   - Frontend stores token and fetches profile

4. **Protected Request**

   - Extract token from Authorization header
   - Verify token with JWT_SECRET
   - Attach user to request object
   - Proceed to route handler

5. **Token Refresh**

   - Extract refresh token from cookie
   - Verify with JWT_REFRESH_SECRET
   - Generate new access token
   - Return new access token

6. **Logout**
   - Clear refresh token cookie
   - Client removes access token
   - Optionally blacklist token (Redis)

---

## 📚 Additional Documentation

### Google OAuth Setup

For detailed instructions on setting up Google OAuth, see:

- **[GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)** - Complete setup guide
- **[QUICK_START_OAUTH.md](./QUICK_START_OAUTH.md)** - Quick reference
- **[OAUTH_IMPLEMENTATION.md](./OAUTH_IMPLEMENTATION.md)** - Implementation details

---

## 📁 File Management System

### File Upload Process

```
1. User selects file(s) → Frontend
2. FormData creation → Axios request
3. Multer middleware → Parse multipart data
4. File validation → Size & type check
5. Upload to ImageKit → Get fileId & URL
6. Save metadata → MongoDB
7. Clear cache → Redis
8. Return file data → Frontend
9. Update Redux state → UI refresh
```

### File Storage Strategy

**Small Files** (< 10MB)

- Direct upload to ImageKit
- CDN delivery
- Automatic optimization

**Large Files** (Future Enhancement)

- Chunked upload
- Resume capability
- Progress tracking

### File Type Handling

| Category  | Types                     | Storage                 |
| --------- | ------------------------- | ----------------------- |
| Images    | jpg, png, gif, svg, webp  | ImageKit (optimized)    |
| Documents | pdf, doc, docx, txt, xlsx | ImageKit (original)     |
| Videos    | mp4, avi, mov, mkv        | ImageKit (original)     |
| Audio     | mp3, wav, ogg, m4a        | ImageKit (original)     |
| Folders   | N/A                       | Metadata only (MongoDB) |

---

## 🚀 Deployment Guide

### Backend Deployment

#### Option 1: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create airdrive-api

# Set environment variables
heroku config:set MONGO_URI=...
heroku config:set JWT_SECRET=...
# ... (set all env vars)

# Deploy
git push heroku main

# Verify
heroku logs --tail
```

#### Option 2: DigitalOcean / AWS / GCP

```bash
# SSH into server
ssh user@server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/Sujaljaiswal25/AirDrive.01.git
cd AirDrive/backend

# Install dependencies
npm install

# Setup environment
nano .env
# (paste your environment variables)

# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name airdrive-api

# Setup auto-restart
pm2 startup
pm2 save

# Setup Nginx reverse proxy
sudo nano /etc/nginx/sites-available/airdrive
# (configure reverse proxy)
sudo ln -s /etc/nginx/sites-available/airdrive /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Frontend Deployment

#### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Navigate to client folder
cd client

# Deploy
vercel

# Production deployment
vercel --prod
```

#### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

#### Option 3: Static Hosting (S3, GitHub Pages)

```bash
# Build
npm run build

# Upload dist/ folder to hosting provider
aws s3 sync dist/ s3://your-bucket-name --acl public-read
```

### Environment Configuration for Production

**Backend**

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
```

**Frontend**

```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

---

## 💻 Development Workflow

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add: new feature description"

# Push to remote
git push origin feature/new-feature

# Create Pull Request on GitHub
# After review, merge to main
```

### Code Standards

**Backend**

- Use async/await for promises
- Implement try-catch error handling
- Return standardized responses (success, created, error, etc.)
- Add comments for complex logic
- Validate input data
- Use meaningful variable names

**Frontend**

- Use functional components with hooks
- Implement PropTypes or TypeScript (future)
- Keep components small and focused
- Use custom hooks for reusable logic
- Follow Tailwind utility patterns
- Memoize expensive calculations

### Testing Strategy

**Backend Testing**

```bash
# Unit tests for controllers
npm test controllers

# Integration tests for API endpoints
npm test integration

# Load testing
npm test load
```

**Frontend Testing**

```bash
# Component tests
npm test

# E2E tests with Cypress
npm run cypress:open
```

### Performance Monitoring

**Backend**

- Monitor API response times
- Track Redis cache hit/miss ratio
- Monitor MongoDB query performance
- Use PM2 monitoring dashboard

**Frontend**

- Use Lighthouse for audits
- Monitor bundle size
- Track Core Web Vitals
- Use React DevTools Profiler

---

## 📊 Project Statistics

### Backend

- **API Endpoints**: 20+
- **Controllers**: 3 (Auth, File, Profile)
- **Models**: 2 (User, File)
- **Middlewares**: 3 (Auth, Upload, Error)
- **Services**: 2 (Redis, Storage)
- **Utilities**: 4 (Auth, File, Response, Validation)

### Frontend

- **Components**: 15+
- **Pages**: 4 (Dashboard, Login, Register, Profile)
- **Redux Slices**: 3 (Auth, File, UI)
- **Services**: 3 (Auth, File, Profile)
- **Modals**: 5 (Upload, CreateFolder, Share, Delete, Preview)

### Supported Operations

- User registration & authentication
- File upload/download (10MB limit)
- Folder creation & navigation
- File starring
- Trash & restore
- File sharing
- Search & filter
- Multiple view modes
- Profile management

---

## 🔮 Future Enhancements

### Phase 1 (Short Term)

- [ ] TypeScript migration
- [ ] Unit test coverage (80%+)
- [ ] E2E testing with Cypress
- [ ] File versioning
- [ ] Bulk file operations
- [ ] Advanced search (by content, tags)

### Phase 2 (Medium Term)

- [ ] Real-time collaboration
- [ ] File comments & annotations
- [ ] Advanced sharing permissions
- [ ] Activity logs
- [ ] Storage analytics dashboard
- [ ] Mobile app (React Native)

### Phase 3 (Long Term)

- [ ] AI-powered file organization
- [ ] OCR for document search
- [ ] Video transcoding
- [ ] File encryption at rest
- [ ] Multi-user workspaces
- [ ] Integration with third-party services

---

## 🐛 Known Issues & Limitations

### Current Limitations

1. **File Size**: Limited to 10MB per file (configurable)
2. **Concurrent Uploads**: No limit enforcement (can cause performance issues)
3. **Folder Depth**: No limit on nesting (potential UI issues)
4. **Search**: Basic string matching only (no full-text search)
5. **Sharing**: Public links only (no private sharing yet)
6. **Mobile**: Functional but not fully optimized

### Known Bugs

- None currently reported

---

## 📞 Support & Contributing

### Getting Help

- Check existing documentation
- Review Postman collection for API examples
- Check GitHub issues
- Contact: [GitHub Profile](https://github.com/Sujaljaiswal25)

### Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Wait for code review

### Code of Conduct

- Be respectful
- Write clean code
- Document changes
- Test thoroughly
- Follow existing patterns

---

## 📄 License

This project is part of the AirDrive application portfolio.

---

## 👨‍💻 Author

**Sujal Jaiswal**

- GitHub: [@Sujaljaiswal25](https://github.com/Sujaljaiswal25)
- Repository: [AirDrive.01](https://github.com/Sujaljaiswal25/AirDrive.01)

---

## 🙏 Acknowledgments

- React & Vite teams for excellent tooling
- Redux Toolkit for simplified state management
- Tailwind CSS for utility-first styling
- ImageKit for cloud storage solution
- MongoDB & Redis for database solutions
- Open source community for inspiration

---

**Last Updated**: November 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
