# AirDrive Frontend Documentation

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Installation](#installation)
- [Features](#features)
- [State Management](#state-management)
- [Routing](#routing)
- [Components](#components)
- [Services](#services)
- [Styling](#styling)
- [API Integration](#api-integration)
- [Authentication Flow](#authentication-flow)
- [File Management](#file-management)
- [Deployment](#deployment)

---

## 🎯 Overview

AirDrive Frontend is a modern, responsive React application that provides a Google Drive-like interface for cloud storage. Built with React 19, Redux Toolkit, and Tailwind CSS, it offers a seamless file management experience with dark mode support, animations, and real-time updates.

### Key Features

- ✅ Modern UI with dark theme
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Drag & drop file upload
- ✅ Grid and List view modes
- ✅ Folder navigation with breadcrumbs
- ✅ File preview & download
- ✅ Search and filter functionality
- ✅ Starred files management
- ✅ Trash & restore system
- ✅ File sharing with public links
- ✅ Profile management
- ✅ Smooth animations with Framer Motion
- ✅ Toast notifications
- ✅ Protected routes
- ✅ State persistence

---

## 🛠 Tech Stack

### Core Technologies

- **React**: v19.0.0 (Latest)
- **Vite**: v6.2.0 (Build tool)
- **React Router DOM**: v7.9.6 (Routing)
- **Redux Toolkit**: v2.10.1 (State management)
- **Redux Persist**: v6.0.0 (Persist state)

### UI & Styling

- **Tailwind CSS**: v3.4.18 (Utility-first CSS)
- **Framer Motion**: v12.23.24 (Animations)
- **Lucide React**: v0.554.0 (Icons)
- **React Hot Toast**: v2.6.0 (Notifications)

### Data Fetching & Forms

- **Axios**: v1.13.2 (HTTP client)
- **TanStack React Query**: v5.90.10 (Data fetching)
- **React Hook Form**: v7.66.1 (Form handling)

### Utilities

- **date-fns**: v4.1.0 (Date formatting)

---

## 📁 Project Structure

```
client/
├── index.html                   # HTML entry point
├── package.json                 # Dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── eslint.config.js            # ESLint configuration
├── public/                      # Static assets
├── src/
│   ├── main.jsx                 # Application entry point
│   ├── App.jsx                  # Root component with routes
│   ├── index.css                # Global styles
│   │
│   ├── components/              # Reusable components
│   │   ├── Breadcrumb.jsx       # Navigation breadcrumbs
│   │   ├── FileGrid.jsx         # Grid view for files
│   │   ├── FileList.jsx         # List view for files
│   │   ├── Header.jsx           # Top navigation bar
│   │   ├── ProtectedRoute.jsx   # Route authentication wrapper
│   │   ├── Sidebar.jsx          # Sidebar navigation
│   │   └── modals/              # Modal components
│   │       ├── CreateFolderModal.jsx
│   │       ├── DeleteModal.jsx
│   │       ├── PreviewModal.jsx
│   │       ├── ShareModal.jsx
│   │       └── UploadModal.jsx
│   │
│   ├── pages/                   # Page components
│   │   ├── Dashboard.jsx        # Main dashboard
│   │   ├── Login.jsx            # Login page
│   │   ├── Profile.jsx          # User profile
│   │   └── Register.jsx         # Registration page
│   │
│   ├── services/                # API services
│   │   ├── auth.service.js      # Authentication APIs
│   │   ├── file.service.js      # File management APIs
│   │   └── profile.service.js   # Profile APIs
│   │
│   ├── store/                   # Redux store
│   │   ├── store.js             # Store configuration
│   │   └── slices/              # Redux slices
│   │       ├── authSlice.js     # Auth state
│   │       ├── fileSlice.js     # File state
│   │       └── uiSlice.js       # UI state
│   │
│   ├── config/                  # Configuration files
│   │   └── axios.config.js      # Axios instance & interceptors
│   │
│   └── utils/                   # Utility functions
│       ├── dateUtils.js         # Date formatting
│       └── fileUtils.js         # File helpers
```

---

## ⚙️ Environment Setup

Create a `.env` file in the client directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000

# App Configuration
VITE_APP_NAME=AirDrive
VITE_APP_VERSION=1.0.0
```

---

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running

### Steps

1. **Navigate to client directory**

   ```bash
   cd client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   - Create `.env` file with API base URL

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Application will run on**: `http://localhost:5173`

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## ✨ Features

### 1. **Authentication**

- User registration with validation
- Secure login with JWT tokens
- Auto token refresh
- Persistent sessions
- Protected routes

### 2. **File Management**

- Upload files (drag & drop + click)
- Download files
- Delete files (move to trash)
- Permanently delete files
- Restore from trash
- File preview (images, PDFs)
- Star/unstar files

### 3. **Folder Management**

- Create folders
- Navigate folder hierarchy
- Breadcrumb navigation
- Folder-based file organization

### 4. **File Sharing**

- Generate public share links
- Copy link to clipboard
- Share via social media

### 5. **Search & Filter**

- Real-time search
- Filter by type (images, videos, documents, etc.)
- Filter by category (starred, trash, folders)
- Sort by name, date, size, type

### 6. **Views**

- Grid view with thumbnails
- List view with details
- Toggle between views

### 7. **Profile Management**

- View profile information
- Update name and email
- Change password
- Update profile picture
- Storage usage statistics

### 8. **UI/UX**

- Dark theme design
- Responsive layout
- Smooth animations
- Loading states
- Error handling
- Toast notifications
- Modal dialogs

---

## 🗃️ State Management

### Redux Store Structure

```javascript
{
  auth: {
    user: Object,          // Current user data
    accessToken: String,   // JWT access token
    isAuthenticated: Boolean,
    loading: Boolean,
    error: String
  },
  files: {
    files: Array,          // Current files list
    currentFolder: String, // Current folder ID
    folderPath: Array,     // Breadcrumb path
    viewMode: String,      // 'grid' or 'list'
    sortBy: String,        // Sort field
    sortOrder: String,     // 'asc' or 'desc'
    searchQuery: String,   // Search text
    selectedFiles: Array,  // Selected file IDs
    uploadProgress: Object,
    loading: Boolean,
    error: String,
    pagination: {
      currentPage: Number,
      totalPages: Number,
      totalFiles: Number,
      limit: Number
    }
  },
  ui: {
    sidebarOpen: Boolean,  // Sidebar visibility
    uploadModalOpen: Boolean,
    createFolderModalOpen: Boolean,
    shareModalOpen: Boolean,
    deleteModalOpen: Boolean,
    previewModalOpen: Boolean,
    selectedFile: Object,  // File for modal actions
    theme: String          // 'dark' or 'light'
  }
}
```

### Auth Slice (`authSlice.js`)

**Actions:**

- `loginStart()` - Set loading state
- `loginSuccess(payload)` - Store user & token
- `loginFailure(error)` - Set error
- `logout()` - Clear auth state
- `updateUser(data)` - Update user info
- `clearError()` - Clear error state

**Usage:**

```javascript
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "./store/slices/authSlice";

// Login
dispatch(loginSuccess({ user, accessToken }));

// Logout
dispatch(logout());
```

### File Slice (`fileSlice.js`)

**Actions:**

- `setFiles(files)` - Set files list
- `addFile(file)` - Add new file
- `updateFile(file)` - Update existing file
- `removeFile(fileId)` - Remove file
- `setCurrentFolder(folderId)` - Change folder
- `setViewMode(mode)` - Toggle view mode
- `setSortBy(field)` - Set sort field
- `setSearchQuery(query)` - Set search text
- `setPagination(data)` - Update pagination
- `toggleFileSelection(fileId)` - Select/deselect file
- `clearSelection()` - Clear all selections

### UI Slice (`uiSlice.js`)

**Actions:**

- `toggleSidebar()` - Show/hide sidebar
- `openUploadModal()` - Show upload modal
- `openCreateFolderModal()` - Show create folder modal
- `openShareModal(file)` - Show share modal
- `openDeleteModal(file)` - Show delete modal
- `openPreviewModal(file)` - Show preview modal
- `closeAllModals()` - Close all modals

### Redux Persist

Auth state is persisted to `localStorage`:

```javascript
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist auth
};
```

---

## 🧭 Routing

### Route Structure

```javascript
/                    → Redirect based on auth
/login              → Login page (public)
/register           → Register page (public)
/dashboard          → Main dashboard (protected)
/profile            → User profile (protected)
```

### Protected Routes

```javascript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

**ProtectedRoute Component:**

- Checks authentication status
- Redirects to `/login` if not authenticated
- Shows loading state during verification

### Navigation

```javascript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
navigate("/dashboard");
```

---

## 🧩 Components

### Core Components

#### **Header** (`Header.jsx`)

Top navigation bar with:

- Sidebar toggle
- Search bar
- View mode toggle (grid/list)
- Sort options
- Upload & create folder buttons
- Refresh button

**Props:**

- `onRefresh` - Function to refresh files

#### **Sidebar** (`Sidebar.jsx`)

Navigation sidebar with:

- User profile section
- Main navigation (All Files, Folders, Starred, Trash)
- Category filters (Images, Videos, Documents, Audio)
- Profile link
- Logout button

**Features:**

- Active state highlighting
- Responsive (collapsible on mobile)
- Smooth animations

#### **Breadcrumb** (`Breadcrumb.jsx`)

Navigation breadcrumbs showing:

- Current folder path
- Clickable navigation
- Home icon

#### **FileGrid** (`FileGrid.jsx`)

Grid view for files showing:

- File thumbnails
- File names
- File size
- Last modified date
- Context menu (3-dot menu)
- Hover effects

**Props:**

- `files` - Array of files
- `onFileClick` - Click handler
- `onContextMenu` - Right-click handler

#### **FileList** (`FileList.jsx`)

List view for files showing:

- File icon
- File details (name, size, date)
- Actions menu
- Sortable columns

### Modal Components

All modals use **Framer Motion** for animations and **React Portals** for rendering.

#### **UploadModal** (`UploadModal.jsx`)

File upload interface with:

- Drag & drop zone
- File browser
- Upload progress bars
- Multiple file support
- File validation

**Features:**

```javascript
// Supported file types
const acceptedTypes = {
  "image/*": [".jpg", ".jpeg", ".png", ".gif", ".svg"],
  "application/pdf": [".pdf"],
  "application/msword": [".doc", ".docx"],
  "video/*": [".mp4", ".avi", ".mov"],
  "audio/*": [".mp3", ".wav", ".ogg"],
};

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;
```

#### **CreateFolderModal** (`CreateFolderModal.jsx`)

Folder creation dialog with:

- Folder name input
- Validation
- Parent folder selection

#### **ShareModal** (`ShareModal.jsx`)

File sharing interface with:

- Public link generation
- Copy to clipboard
- Social media sharing options

#### **DeleteModal** (`DeleteModal.jsx`)

Confirmation dialog for:

- Move to trash
- Permanent delete
- Warning messages

#### **PreviewModal** (`PreviewModal.jsx`)

File preview with:

- Image preview
- PDF viewer
- Document info
- Download & share options

### Shared Component Props

**Common Modal Props:**

```javascript
{
  isOpen: Boolean,     // Modal visibility
  onClose: Function,   // Close handler
  file: Object,        // File data (if applicable)
}
```

---

## 🔌 Services

### Auth Service (`auth.service.js`)

```javascript
import { authAPI } from "./services/auth.service";

// Register
await authAPI.register({ name, email, password });

// Login
await authAPI.login({ email, password });

// Logout
await authAPI.logout();

// Refresh token
await authAPI.refreshToken();
```

### File Service (`file.service.js`)

```javascript
import { fileAPI } from "./services/file.service";

// Get user files
await fileAPI.getUserFiles({ page, limit, folder, sortBy, order });

// Upload file
await fileAPI.uploadFile(formData);

// Download file
await fileAPI.downloadFile(fileId);

// Delete file
await fileAPI.deleteFile(fileId);

// Create folder
await fileAPI.createFolder({ name, folderId });

// Share file
await fileAPI.shareFile(fileId);

// Search files
await fileAPI.searchFiles(query);

// Toggle star
await fileAPI.toggleStar(fileId);

// Move to trash
await fileAPI.moveToTrash(fileId);

// Restore from trash
await fileAPI.restoreFromTrash(fileId);

// Permanent delete
await fileAPI.permanentDelete(fileId);
```

### Profile Service (`profile.service.js`)

```javascript
import { profileAPI } from "./services/profile.service";

// Get profile
await profileAPI.getProfile();

// Update profile
await profileAPI.updateProfile({ name, email });

// Change password
await profileAPI.changePassword({ currentPassword, newPassword });

// Update avatar
await profileAPI.updateAvatar(formData);

// Get storage info
await profileAPI.getStorageInfo();
```

---

## 🎨 Styling

### Tailwind Configuration

**Custom Theme:**

```javascript
colors: {
  dark: {
    bg: '#000000',           // Main background
    card: '#0D0D0D',         // Card background
    hover: '#1A1A1A',        // Hover state
    border: '#253900',       // Borders
    text: {
      primary: '#EEEEEE',    // Primary text
      secondary: '#B8B8B8',  // Secondary text
      muted: '#888888',      // Muted text
    },
  },
  accent: {
    primary: '#08CB00',      // Primary accent (green)
    secondary: '#253900',    // Secondary accent
    success: '#08CB00',      // Success state
    warning: '#f59e0b',      // Warning state
    error: '#ef4444',        // Error state
  },
}
```

**Font Family:**

```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
}
```

**Custom Shadows:**

```javascript
boxShadow: {
  'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
  'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
  'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
}
```

### Global Styles (`index.css`)

```css
/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #0d0d0d;
}

::-webkit-scrollbar-thumb {
  background: #253900;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #08cb00;
}
```

### Responsive Design

**Breakpoints:**

```javascript
// Tailwind default breakpoints
sm: '640px',   // Mobile landscape
md: '768px',   // Tablet
lg: '1024px',  // Desktop
xl: '1280px',  // Large desktop
2xl: '1536px', // Extra large
```

**Usage:**

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Responsive grid */}
</div>
```

---

## 🔗 API Integration

### Axios Configuration

**Base Setup:**

```javascript
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // For cookies
  headers: {
    "Content-Type": "application/json",
  },
});
```

### Request Interceptor

Automatically adds access token to requests:

```javascript
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor

Handles token refresh automatically:

```javascript
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const { accessToken } = await refreshToken();
      // Retry original request
      return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

### Error Handling

```javascript
try {
  const response = await fileAPI.uploadFile(formData);
  toast.success("File uploaded successfully");
} catch (error) {
  const message = error.response?.data?.message || "Upload failed";
  toast.error(message);
}
```

---

## 🔐 Authentication Flow

### 1. Registration Flow

```javascript
// User fills registration form
const handleRegister = async (data) => {
  try {
    dispatch(loginStart());
    const response = await authAPI.register(data);
    dispatch(loginSuccess(response.data));
    navigate("/dashboard");
    toast.success("Registration successful");
  } catch (error) {
    dispatch(loginFailure(error.message));
    toast.error("Registration failed");
  }
};
```

### 2. Login Flow

```javascript
// User enters credentials
const handleLogin = async (credentials) => {
  try {
    dispatch(loginStart());
    const response = await authAPI.login(credentials);

    // Store access token
    localStorage.setItem("accessToken", response.data.accessToken);

    // Update Redux state
    dispatch(loginSuccess(response.data));

    navigate("/dashboard");
    toast.success("Login successful");
  } catch (error) {
    dispatch(loginFailure(error.message));
    toast.error("Invalid credentials");
  }
};
```

### 3. Token Refresh Flow

```javascript
// Automatic token refresh on 401
if (error.response?.status === 401) {
  const response = await axios.post("/api/auth/refresh-token");
  const { accessToken } = response.data;

  localStorage.setItem("accessToken", accessToken);

  // Retry failed request
  originalRequest.headers.Authorization = `Bearer ${accessToken}`;
  return axiosInstance(originalRequest);
}
```

### 4. Logout Flow

```javascript
const handleLogout = async () => {
  try {
    await authAPI.logout();
    dispatch(logout());
    localStorage.removeItem("accessToken");
    navigate("/login");
    toast.success("Logged out successfully");
  } catch (error) {
    toast.error("Logout failed");
  }
};
```

### 5. Protected Route Check

```javascript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
```

---

## 📁 File Management

### Upload Process

```javascript
const handleUpload = async (files) => {
  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", currentFolder);

    try {
      // Upload with progress tracking
      const response = await fileAPI.uploadFile(formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          dispatch(setUploadProgress({ fileId: file.name, progress }));
        },
      });

      // Add to files list
      dispatch(addFile(response.data.file));
      toast.success(`${file.name} uploaded`);
    } catch (error) {
      toast.error(`Failed to upload ${file.name}`);
    }
  }
};
```

### Download Process

```javascript
const handleDownload = async (file) => {
  try {
    const response = await fileAPI.downloadFile(file._id, {
      responseType: "blob",
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", file.name);
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("Download started");
  } catch (error) {
    toast.error("Download failed");
  }
};
```

### Delete Process

```javascript
const handleDelete = async (fileId) => {
  try {
    await fileAPI.deleteFile(fileId);
    dispatch(removeFile(fileId));
    toast.success("File deleted");
  } catch (error) {
    toast.error("Failed to delete file");
  }
};
```

### Star/Unstar

```javascript
const handleToggleStar = async (fileId) => {
  try {
    const response = await fileAPI.toggleStar(fileId);
    dispatch(updateFile(response.data.file));
    toast.success(
      response.data.file.isStarred ? "Added to starred" : "Removed from starred"
    );
  } catch (error) {
    toast.error("Failed to update file");
  }
};
```

### Folder Navigation

```javascript
const navigateToFolder = (folder) => {
  dispatch(setCurrentFolder(folder._id));
  dispatch(setFolderPath([...folderPath, folder.name]));
};

const navigateBack = () => {
  const newPath = [...folderPath];
  newPath.pop();
  dispatch(setFolderPath(newPath));
  dispatch(setCurrentFolder(newPath[newPath.length - 1]));
};
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Output: `dist/` directory

### Environment Variables

Set production API URL:

```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Deployment Platforms

#### **Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### **Netlify**

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

#### **Static Hosting**

Upload `dist/` folder to any static hosting:

- AWS S3 + CloudFront
- Google Cloud Storage
- GitHub Pages
- Cloudflare Pages

### Build Optimization

**Vite automatically:**

- Minifies JavaScript
- Optimizes CSS
- Code splitting
- Tree shaking
- Asset optimization

**Manual optimizations:**

```javascript
// Lazy load routes
const Dashboard = lazy(() => import("./pages/Dashboard"));

// Code splitting
<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>;
```

---

## 📊 Performance Optimization

### 1. **Code Splitting**

```javascript
// Lazy load components
const FileGrid = lazy(() => import("./components/FileGrid"));
```

### 2. **Memoization**

```javascript
import { memo, useMemo, useCallback } from "react";

// Memoize component
const FileCard = memo(({ file }) => {
  // Component logic
});

// Memoize calculations
const sortedFiles = useMemo(() => {
  return files.sort((a, b) => a.name.localeCompare(b.name));
}, [files]);

// Memoize callbacks
const handleClick = useCallback(() => {
  // Handler logic
}, [dependency]);
```

### 3. **Image Optimization**

```javascript
// Use ImageKit transformations
const thumbnailUrl = `${file.url}?tr=w-200,h-200,fo-auto`;
```

### 4. **Debouncing**

```javascript
// Search with debounce
useEffect(() => {
  const timeoutId = setTimeout(() => {
    performSearch(searchQuery);
  }, 500);

  return () => clearTimeout(timeoutId);
}, [searchQuery]);
```

### 5. **Virtual Scrolling**

For large file lists, consider implementing virtual scrolling with libraries like `react-window` or `react-virtualized`.

---

## 🧪 Testing

### Setup Testing

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

### Unit Tests

```javascript
import { render, screen } from "@testing-library/react";
import FileCard from "./FileCard";

test("renders file name", () => {
  const file = { name: "document.pdf", size: 1024 };
  render(<FileCard file={file} />);
  expect(screen.getByText("document.pdf")).toBeInTheDocument();
});
```

### Integration Tests

```javascript
test("file upload flow", async () => {
  const { getByLabelText } = render(<UploadModal />);
  const fileInput = getByLabelText("Choose files");

  // Simulate file selection
  fireEvent.change(fileInput, { target: { files: [file] } });

  // Assert upload started
  await waitFor(() => {
    expect(screen.getByText("Uploading...")).toBeInTheDocument();
  });
});
```

---

## 🐛 Debugging

### Redux DevTools

Install Redux DevTools Extension for browser:

- View state changes
- Time-travel debugging
- Action replay

### React DevTools

Install React DevTools Extension:

- Component inspection
- Props & state viewing
- Performance profiling

### Console Logging

```javascript
// Debug API calls
axiosInstance.interceptors.request.use((request) => {
  console.log("Request:", request);
  return request;
});

// Debug state changes
const fileSlice = createSlice({
  name: "files",
  reducers: {
    setFiles: (state, action) => {
      console.log("Setting files:", action.payload);
      state.files = action.payload;
    },
  },
});
```

---

## 📝 Best Practices

### 1. **Component Structure**

- Keep components small and focused
- Use composition over inheritance
- Extract reusable logic to custom hooks

### 2. **State Management**

- Keep state close to where it's used
- Use Redux for global state only
- Normalize complex nested data

### 3. **Performance**

- Memoize expensive calculations
- Use `React.memo` for pure components
- Implement virtualization for long lists

### 4. **Code Quality**

- Use TypeScript for type safety (future enhancement)
- Follow ESLint rules
- Write meaningful comments

### 5. **Accessibility**

- Add ARIA labels
- Support keyboard navigation
- Ensure color contrast

---

## 🔄 Future Enhancements

- [ ] TypeScript migration
- [ ] Unit test coverage
- [ ] E2E tests with Cypress
- [ ] PWA support (offline mode)
- [ ] Real-time collaboration
- [ ] File versioning
- [ ] Advanced file sharing permissions
- [ ] Bulk operations
- [ ] File compression
- [ ] Cloud sync status indicators

---

## 📞 Support & Resources

### Documentation

- [React Documentation](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)

### Common Issues

**Issue: CORS errors**

```javascript
// Ensure backend CORS is configured
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
```

**Issue: Token expired**

```javascript
// Check token refresh logic in axios interceptor
// Verify refresh token cookie is being sent
```

**Issue: Build fails**

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

---

## 📄 License

This project is part of the AirDrive application.

---

**Last Updated**: November 2025
**Version**: 1.0.0
