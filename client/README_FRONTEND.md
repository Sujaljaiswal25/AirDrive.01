# AirDrive Frontend

Modern cloud storage web application built with React, Redux, and Tailwind CSS.

## Features

- 🔐 **Authentication**: Secure login/register with JWT tokens
- 📁 **File Management**: Upload, download, preview, delete files
- 📂 **Folder Organization**: Create folders and organize files
- 🔍 **Search & Filter**: Search files by name, filter by type
- 🎨 **Modern UI**: Beautiful, responsive design with animations
- 🔄 **Real-time Updates**: Instant file operations feedback
- 📤 **File Sharing**: Generate shareable links
- 👤 **User Profile**: Manage account settings and avatar

## Tech Stack

- **React 19** - UI framework
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000
```

3. Start development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── modals/       # Modal components
│   ├── FileGrid.jsx
│   ├── FileList.jsx
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   └── ProtectedRoute.jsx
├── pages/            # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   └── Profile.jsx
├── store/            # Redux store
│   ├── slices/
│   │   ├── authSlice.js
│   │   ├── fileSlice.js
│   │   └── uiSlice.js
│   └── store.js
├── services/         # API services
│   ├── auth.service.js
│   ├── file.service.js
│   └── profile.service.js
├── config/           # Configuration
│   └── axios.config.js
├── utils/            # Utility functions
│   ├── fileUtils.js
│   └── dateUtils.js
├── App.jsx
└── main.jsx
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:5000)

## Features Implementation

### Authentication

- JWT-based authentication
- Auto token refresh
- Protected routes
- Persistent login state

### File Operations

- Drag & drop upload
- Multiple file upload
- File preview (images, videos, PDFs)
- Download files
- Delete files
- Share files with public links

### UI/UX

- Grid and list view modes
- Sort by name, date, size, type
- Search functionality
- Responsive design
- Smooth animations
- Loading states
- Error handling
- Toast notifications

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
